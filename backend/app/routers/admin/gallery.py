"""Admin: manage gallery images via Cloudinary."""
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.gallery import GalleryImage
from app.models.user import User
from app.schemas.gallery import GalleryImageRead, GalleryImageUpdate
from app.services.cloudinary_service import delete_image, upload_image

router = APIRouter(prefix="/gallery", tags=["admin-gallery"])


@router.get("", response_model=list[GalleryImageRead])
async def list_images(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(select(GalleryImage).order_by(GalleryImage.display_order))
    return result.scalars().all()


@router.post("", response_model=GalleryImageRead, status_code=status.HTTP_201_CREATED)
async def upload_gallery_image(
    file: UploadFile,
    title: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    contents = await file.read()
    uploaded = await upload_image(contents, folder="gallery")
    img = GalleryImage(
        cloudinary_public_id=uploaded["public_id"],
        image_url=uploaded["secure_url"],
        title=title,
    )
    db.add(img)
    await db.flush()
    await db.refresh(img)
    return img


@router.patch("/{image_id}", response_model=GalleryImageRead)
async def update_image(
    image_id: uuid.UUID,
    data: GalleryImageUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(GalleryImage).where(GalleryImage.id == image_id))
    img = result.scalar_one_or_none()
    if not img:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(img, field, value)
    await db.flush()
    await db.refresh(img)
    return img


@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_image(
    image_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(GalleryImage).where(GalleryImage.id == image_id))
    img = result.scalar_one_or_none()
    if not img:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    await delete_image(img.cloudinary_public_id)
    await db.delete(img)


@router.get("/public", response_model=list[GalleryImageRead], include_in_schema=False)
async def public_gallery(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GalleryImage)
        .where(GalleryImage.is_active == True)
        .order_by(GalleryImage.display_order)
    )
    return result.scalars().all()
