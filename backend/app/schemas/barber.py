import uuid
from datetime import time

from pydantic import BaseModel, field_validator


class BarberScheduleBase(BaseModel):
    weekday: int  # 0=Mon … 6=Sun
    is_working: bool = True
    start_time: time = time(9, 0)
    end_time: time = time(19, 0)
    break_start: time | None = None
    break_end: time | None = None

    @field_validator("weekday")
    @classmethod
    def weekday_range(cls, v: int) -> int:
        if v not in range(7):
            raise ValueError("weekday must be 0–6")
        return v


class BarberScheduleCreate(BarberScheduleBase):
    pass


class BarberScheduleRead(BarberScheduleBase):
    id: uuid.UUID
    barber_id: uuid.UUID

    model_config = {"from_attributes": True}


class BarberBase(BaseModel):
    name: str
    slug: str
    bio: str | None = None
    display_order: int = 0


class BarberCreate(BarberBase):
    pass


class BarberUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    bio: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class BarberRead(BarberBase):
    id: uuid.UUID
    is_active: bool
    profile_image_url: str | None
    schedules: list[BarberScheduleRead] = []

    model_config = {"from_attributes": True}
