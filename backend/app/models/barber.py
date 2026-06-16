import uuid
from datetime import datetime, time, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Barber(Base):
    __tablename__ = "barbers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    bio: Mapped[str | None] = mapped_column(String(500), nullable=True)
    profile_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    cloudinary_public_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    schedules: Mapped[list["BarberSchedule"]] = relationship(
        "BarberSchedule", back_populates="barber", cascade="all, delete-orphan"
    )
    appointments: Mapped[list["Appointment"]] = relationship(  # noqa: F821
        "Appointment", back_populates="barber"
    )
    blocked_slots: Mapped[list["BlockedSlot"]] = relationship(  # noqa: F821
        "BlockedSlot", back_populates="barber"
    )


class BarberSchedule(Base):
    """Working hours per barber per weekday (0=Monday … 6=Sunday)."""

    __tablename__ = "barber_schedules"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    barber_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("barbers.id", ondelete="CASCADE"), nullable=False, index=True
    )
    weekday: Mapped[int] = mapped_column(Integer, nullable=False)  # 0=Mon … 6=Sun
    is_working: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False, default=time(9, 0))
    end_time: Mapped[time] = mapped_column(Time, nullable=False, default=time(19, 0))
    break_start: Mapped[time | None] = mapped_column(Time, nullable=True)
    break_end: Mapped[time | None] = mapped_column(Time, nullable=True)

    barber: Mapped["Barber"] = relationship("Barber", back_populates="schedules")
