import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"
    no_show = "no_show"


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    barber_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("barbers.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    service_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("services.id", ondelete="RESTRICT"), nullable=False, index=True
    )

    # Client info (no account required)
    client_name: Mapped[str] = mapped_column(String(150), nullable=False)
    client_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    client_email: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Stored in UTC; the API layer converts to/from shop timezone
    start_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    end_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(AppointmentStatus, name="appointmentstatus"),
        nullable=False,
        default=AppointmentStatus.pending,
        index=True,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_by: Mapped[str | None] = mapped_column(String(10), nullable=True)  # 'client' | 'admin'
    cancellation_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    barber: Mapped["Barber"] = relationship("Barber", back_populates="appointments")  # noqa: F821
    service: Mapped["Service"] = relationship("Service", back_populates="appointments")  # noqa: F821
