"""Admin: CRUD for barbers and their schedules."""
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.barber import Barber, BarberSchedule
from app.models.user import User
from app.schemas.barber import BarberCreate, BarberRead, BarberScheduleCreate, BarberScheduleRead, BarberUpdate
from app.services.cloudinary_service import delete_image, upload_image

router = APIRouter(prefix="/barbers", tags=["admin-barbers"])


@router.get("", response_model=list[BarberRead])
async def list_barbers(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(
        select(Barber).options(selectinload(Barber.schedules)).order_by(Barber.display_order)
    )
    return result.scalars().all()


@router.post("", response_model=BarberRead, status_code=status.HTTP_201_CREATED)
async def create_barber(data: BarberCreate, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    barber = Barber(**data.model_dump())
    db.add(barber)
    await db.flush()
    await db.refresh(barber)
    return barber


@router.get("/{barber_id}", response_model=BarberRead)
async def get_barber(barber_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(
        select(Barber).options(selectinload(Barber.schedules)).where(Barber.id == barber_id)
    )
    barber = result.scalar_one_or_none()
    if not barber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barber not found")
    return barber


@router.patch("/{barber_id}", response_model=BarberRead)
async def update_barber(
    barber_id: uuid.UUID,
    data: BarberUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Barber).where(Barber.id == barber_id))
    barber = result.scalar_one_or_none()
    if not barber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barber not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(barber, field, value)
    await db.flush()
    await db.refresh(barber)
    return barber


@router.delete("/{barber_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_barber(barber_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(select(Barber).where(Barber.id == barber_id))
    barber = result.scalar_one_or_none()
    if not barber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barber not found")
    await db.delete(barber)


@router.post("/{barber_id}/image", response_model=BarberRead)
async def upload_barber_image(
    barber_id: uuid.UUID,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Barber).where(Barber.id == barber_id))
    barber = result.scalar_one_or_none()
    if not barber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barber not found")

    if barber.cloudinary_public_id:
        await delete_image(barber.cloudinary_public_id)

    contents = await file.read()
    uploaded = await upload_image(contents, folder="barbers", public_id=f"barber_{barber_id}")
    barber.profile_image_url = uploaded["secure_url"]
    barber.cloudinary_public_id = uploaded["public_id"]
    await db.flush()
    await db.refresh(barber)
    return barber


# ── Schedules ──────────────────────────────────────────────────────────────────

@router.get("/{barber_id}/schedules", response_model=list[BarberScheduleRead])
async def get_schedules(barber_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(
        select(BarberSchedule).where(BarberSchedule.barber_id == barber_id).order_by(BarberSchedule.weekday)
    )
    return result.scalars().all()


@router.put("/{barber_id}/schedules", response_model=list[BarberScheduleRead])
async def upsert_schedules(
    barber_id: uuid.UUID,
    schedules: list[BarberScheduleCreate],
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Replace all schedules for a barber (full upsert)."""
    result = await db.execute(select(Barber).where(Barber.id == barber_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barber not found")

    existing_result = await db.execute(select(BarberSchedule).where(BarberSchedule.barber_id == barber_id))
    for row in existing_result.scalars().all():
        await db.delete(row)
    await db.flush()

    new_rows = [BarberSchedule(barber_id=barber_id, **s.model_dump()) for s in schedules]
    db.add_all(new_rows)
    await db.flush()
    return new_rows
