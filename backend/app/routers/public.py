"""Public-facing endpoints (no authentication required)."""
import uuid
from datetime import date as date_type

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.barber import Barber
from app.models.gallery import GalleryImage
from app.models.service import Service
from app.schemas.appointment import AppointmentCreate, AppointmentRead, AvailableSlot
from app.schemas.barber import BarberRead
from app.schemas.gallery import GalleryImageRead
from app.schemas.service import ServiceRead
from app.services.availability_service import get_available_slots
from app.services.booking_service import cancel_appointment, create_appointment

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/services", response_model=list[ServiceRead])
async def list_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Service).where(Service.is_active == True).order_by(Service.display_order)
    )
    return result.scalars().all()


@router.get("/barbers", response_model=list[BarberRead])
async def list_barbers(db: AsyncSession = Depends(get_db)):
    from sqlalchemy.orm import selectinload

    result = await db.execute(
        select(Barber)
        .where(Barber.is_active == True)
        .options(selectinload(Barber.schedules))
        .order_by(Barber.display_order)
    )
    return result.scalars().all()


@router.get("/availability", response_model=list[AvailableSlot])
async def get_availability(
    barber_id: uuid.UUID,
    date: str,  # YYYY-MM-DD
    db: AsyncSession = Depends(get_db),
):
    try:
        local_date = date_type.fromisoformat(date)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="date must be YYYY-MM-DD")

    return await get_available_slots(db, barber_id, local_date)


@router.post("/appointments", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
async def book_appointment(data: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    appt = await create_appointment(db, data)
    return appt


@router.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_my_appointment(
    appointment_id: uuid.UUID,
    reason: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    await cancel_appointment(db, appointment_id, cancelled_by="client", reason=reason, is_admin=False)
