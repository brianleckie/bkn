import uuid
from datetime import datetime

from pydantic import BaseModel, field_validator

from app.models.appointment import AppointmentStatus


class AppointmentCreate(BaseModel):
    barber_id: uuid.UUID
    service_id: uuid.UUID
    client_name: str
    client_phone: str
    client_email: str | None = None
    start_datetime: datetime  # ISO 8601, must be timezone-aware
    notes: str | None = None

    @field_validator("client_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("client_name cannot be empty")
        return v

    @field_validator("client_phone")
    @classmethod
    def phone_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("client_phone cannot be empty")
        return v


class AppointmentUpdate(BaseModel):
    status: AppointmentStatus | None = None
    notes: str | None = None
    cancellation_reason: str | None = None


class AppointmentCancelClient(BaseModel):
    cancellation_reason: str | None = None


class AppointmentRead(BaseModel):
    id: uuid.UUID
    barber_id: uuid.UUID
    service_id: uuid.UUID
    client_name: str
    client_phone: str
    client_email: str | None
    start_datetime: datetime
    end_datetime: datetime
    status: AppointmentStatus
    notes: str | None
    cancelled_at: datetime | None
    cancelled_by: str | None
    cancellation_reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class AppointmentReadWithDetails(AppointmentRead):
    barber_name: str | None = None
    service_name: str | None = None
    service_price: float | None = None


class AvailabilityQuery(BaseModel):
    barber_id: uuid.UUID
    date: str  # YYYY-MM-DD in shop local time


class AvailableSlot(BaseModel):
    start_datetime: datetime
    end_datetime: datetime
