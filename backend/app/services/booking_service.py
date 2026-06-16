"""
Core booking logic: create, cancel, and update appointments.
"""
import uuid
from datetime import datetime, timedelta, timezone

import pytz
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment, AppointmentStatus
from app.models.barber import Barber
from app.models.business_settings import SETTING_CANCEL_HOURS, BusinessSetting
from app.models.service import Service
from app.schemas.appointment import AppointmentCreate
from app.services.availability_service import is_slot_available


async def _get_setting(db: AsyncSession, key: str, default: str) -> str:
    result = await db.execute(select(BusinessSetting).where(BusinessSetting.key == key))
    row = result.scalar_one_or_none()
    return row.value if row else default


async def create_appointment(db: AsyncSession, data: AppointmentCreate) -> Appointment:
    # Load service to compute end time
    svc_result = await db.execute(select(Service).where(Service.id == data.service_id, Service.is_active == True))
    service = svc_result.scalar_one_or_none()
    if not service:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    # Load barber
    barber_result = await db.execute(select(Barber).where(Barber.id == data.barber_id, Barber.is_active == True))
    if not barber_result.scalar_one_or_none():
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barber not found")

    start_utc = data.start_datetime.astimezone(timezone.utc)
    end_utc = start_utc + timedelta(minutes=service.duration_minutes)

    # Minimum advance check
    cancel_hours = int(await _get_setting(db, SETTING_CANCEL_HOURS, "2"))
    if start_utc < datetime.now(timezone.utc) + timedelta(hours=cancel_hours):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Appointment must be at least {cancel_hours} hours in the future",
        )

    # Availability check (race-condition safe within a transaction)
    if not await is_slot_available(db, data.barber_id, start_utc, end_utc):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The selected slot is no longer available",
        )

    appt = Appointment(
        barber_id=data.barber_id,
        service_id=data.service_id,
        client_name=data.client_name,
        client_phone=data.client_phone,
        client_email=data.client_email,
        start_datetime=start_utc,
        end_datetime=end_utc,
        status=AppointmentStatus.confirmed,
        notes=data.notes,
    )
    db.add(appt)
    await db.flush()  # get ID without committing
    return appt


async def cancel_appointment(
    db: AsyncSession,
    appointment_id: uuid.UUID,
    cancelled_by: str,  # 'client' | 'admin'
    reason: str | None = None,
    is_admin: bool = False,
) -> Appointment:
    from fastapi import HTTPException, status

    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    if appt.status in (AppointmentStatus.cancelled, AppointmentStatus.completed):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Appointment already closed")

    if not is_admin:
        cancel_hours = int(await _get_setting(db, SETTING_CANCEL_HOURS, "2"))
        deadline = appt.start_datetime - timedelta(hours=cancel_hours)
        if datetime.now(timezone.utc) > deadline:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Cancellations require at least {cancel_hours} hours notice",
            )

    appt.status = AppointmentStatus.cancelled
    appt.cancelled_at = datetime.now(timezone.utc)
    appt.cancelled_by = cancelled_by
    appt.cancellation_reason = reason
    await db.flush()
    return appt
