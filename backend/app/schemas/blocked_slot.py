import uuid
from datetime import datetime

from pydantic import BaseModel, model_validator


class BlockedSlotCreate(BaseModel):
    barber_id: uuid.UUID | None = None  # None = whole shop
    start_datetime: datetime
    end_datetime: datetime
    reason: str | None = None

    @model_validator(mode="after")
    def end_after_start(self) -> "BlockedSlotCreate":
        if self.end_datetime <= self.start_datetime:
            raise ValueError("end_datetime must be after start_datetime")
        return self


class BlockedSlotRead(BaseModel):
    id: uuid.UUID
    barber_id: uuid.UUID | None
    start_datetime: datetime
    end_datetime: datetime
    reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
