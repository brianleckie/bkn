"""Admin: manage all appointments."""
import uuid
from datetime import date as date_type
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.user import User
from app.schemas.appointment import AppointmentReadWithDetails, AppointmentUpdate
from app.services.booking_service import cancel_appointment

router = APIRouter(prefix="/appointments", tags=["admin-appointments"])


@router.get("", response_model=list[AppointmentReadWithDetails])
async def list_appointments(
    date_from: date_type | None = Query(None),
    date_to: date_type | None = Query(None),
    barber_id: uuid.UUID | None = Query(None),
    status_filter: AppointmentStatus | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    from sqlalchemy.orm import selectinload

    q = select(Appointment).options(
        selectinload(Appointment.barber),
        selectinload(Appointment.service),
    )
    if date_from:
        q = q.where(Appointment.start_datetime >= datetime(date_from.year, date_from.month, date_from.day, tzinfo=timezone.utc))
    if date_to:
        from datetime import timedelta
        day_after = date_to + timedelta(days=1)
        q = q.where(Appointment.start_datetime < datetime(day_after.year, day_after.month, day_after.day, tzinfo=timezone.utc))
    if barber_id:
        q = q.where(Appointment.barber_id == barber_id)
    if status_filter:
        q = q.where(Appointment.status == status_filter)

    q = q.order_by(Appointment.start_datetime)
    result = await db.execute(q)
    rows = result.scalars().all()

    return [
        AppointmentReadWithDetails(
            **{c: getattr(a, c) for c in AppointmentReadWithDetails.model_fields if hasattr(a, c)},
            barber_name=a.barber.name if a.barber else None,
            service_name=a.service.name if a.service else None,
            service_price=float(a.service.price) if a.service else None,
        )
        for a in rows
    ]


@router.get("/{appointment_id}", response_model=AppointmentReadWithDetails)
async def get_appointment(
    appointment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    from sqlalchemy.orm import selectinload

    result = await db.execute(
        select(Appointment)
        .options(selectinload(Appointment.barber), selectinload(Appointment.service))
        .where(Appointment.id == appointment_id)
    )
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    return AppointmentReadWithDetails(
        **{c: getattr(appt, c) for c in AppointmentReadWithDetails.model_fields if hasattr(appt, c)},
        barber_name=appt.barber.name if appt.barber else None,
        service_name=appt.service.name if appt.service else None,
        service_price=float(appt.service.price) if appt.service else None,
    )


@router.patch("/{appointment_id}", response_model=AppointmentReadWithDetails)
async def update_appointment(
    appointment_id: uuid.UUID,
    data: AppointmentUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appt, field, value)

    if data.status == AppointmentStatus.cancelled and not appt.cancelled_at:
        appt.cancelled_at = datetime.now(timezone.utc)
        appt.cancelled_by = "admin"

    await db.flush()
    await db.refresh(appt)
    return AppointmentReadWithDetails(
        **{c: getattr(appt, c) for c in AppointmentReadWithDetails.model_fields if hasattr(appt, c)},
    )


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_cancel_appointment(
    appointment_id: uuid.UUID,
    reason: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    await cancel_appointment(db, appointment_id, cancelled_by="admin", reason=reason, is_admin=True)
