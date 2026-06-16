"""Admin: CRUD for services."""
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.service import Service
from app.models.user import User
from app.schemas.service import ServiceCreate, ServiceRead, ServiceUpdate
from app.services.cloudinary_service import delete_image, upload_image

router = APIRouter(prefix="/services", tags=["admin-services"])


@router.get("", response_model=list[ServiceRead])
async def list_services(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(select(Service).order_by(Service.display_order))
    return result.scalars().all()


@router.post("", response_model=ServiceRead, status_code=status.HTTP_201_CREATED)
async def create_service(data: ServiceCreate, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    svc = Service(**data.model_dump())
    db.add(svc)
    await db.flush()
    await db.refresh(svc)
    return svc


@router.get("/{service_id}", response_model=ServiceRead)
async def get_service(service_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(select(Service).where(Service.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return svc


@router.patch("/{service_id}", response_model=ServiceRead)
async def update_service(
    service_id: uuid.UUID,
    data: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Service).where(Service.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(svc, field, value)
    await db.flush()
    await db.refresh(svc)
    return svc


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(service_id: uuid.UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(select(Service).where(Service.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    await db.delete(svc)


@router.post("/{service_id}/image", response_model=ServiceRead)
async def upload_service_image(
    service_id: uuid.UUID,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Service).where(Service.id == service_id))
    svc = result.scalar_one_or_none()
    if not svc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    if svc.cloudinary_public_id:
        await delete_image(svc.cloudinary_public_id)

    contents = await file.read()
    uploaded = await upload_image(contents, folder="services", public_id=f"service_{service_id}")
    svc.image_url = uploaded["secure_url"]
    svc.cloudinary_public_id = uploaded["public_id"]
    await db.flush()
    await db.refresh(svc)
    return svc
