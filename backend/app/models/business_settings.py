import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BusinessSetting(Base):
    """Key-value store for shop-wide configuration."""

    __tablename__ = "business_settings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(String(300), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


# Default keys used throughout the app
SETTING_SLOT_DURATION = "slot_duration_minutes"       # int: 60
SETTING_ADVANCE_DAYS = "advance_booking_days"         # int: 30
SETTING_CANCEL_HOURS = "cancellation_hours_before"    # int: 2
SETTING_WHATSAPP = "whatsapp_number"                  # str: +595981000000
SETTING_TIMEZONE = "shop_timezone"                    # str: America/Asuncion
