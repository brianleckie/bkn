import cloudinary
import cloudinary.uploader

from app.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


async def upload_image(file_bytes: bytes, folder: str, public_id: str | None = None) -> dict:
    """Upload image bytes to Cloudinary. Returns {public_id, secure_url}."""
    kwargs: dict = {"folder": f"bkn/{folder}", "resource_type": "image"}
    if public_id:
        kwargs["public_id"] = public_id
    result = cloudinary.uploader.upload(file_bytes, **kwargs)
    return {"public_id": result["public_id"], "secure_url": result["secure_url"]}


async def delete_image(public_id: str) -> None:
    cloudinary.uploader.destroy(public_id, resource_type="image")
