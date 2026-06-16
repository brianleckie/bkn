import uuid
from datetime import datetime

from pydantic import BaseModel


class GalleryImageUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class GalleryImageRead(BaseModel):
    id: uuid.UUID
    cloudinary_public_id: str
    image_url: str
    title: str | None
    description: str | None
    display_order: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
