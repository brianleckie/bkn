import uuid
from decimal import Decimal

from pydantic import BaseModel, field_validator


class ServiceBase(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    duration_minutes: int = 60
    display_order: int = 0

    @field_validator("duration_minutes")
    @classmethod
    def positive_duration(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("duration_minutes must be positive")
        return v

    @field_validator("price")
    @classmethod
    def positive_price(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("price cannot be negative")
        return v


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    duration_minutes: int | None = None
    display_order: int | None = None
    is_active: bool | None = None


class ServiceRead(ServiceBase):
    id: uuid.UUID
    is_active: bool
    image_url: str | None

    model_config = {"from_attributes": True}
