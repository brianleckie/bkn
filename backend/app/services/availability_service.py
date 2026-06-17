"""
Availability engine.

All external datetimes are UTC-aware. Internally we convert to the shop
timezone to reason about calendar days and working hours, then convert back.
"""
import uuid
from datetime import date, datetime, timedelta, timezone

from zoneinfo import ZoneInfo
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment, AppointmentStatus
from app.models.barber import Barber, BarberSchedule
from app.models.blocked_slot import BlockedSlot
from app.models.business_settings import (
    SETTING_ADVANCE_DAYS,
    SETTING_CANCEL_HOURS,
    SETTING_SLOT_DURATION,
    BusinessSetting,
)
from app.schemas.appointment import AvailableSlot


async def _get_setting(db: AsyncSession, key: str, default: str) -> str:
    result = await db.execute(select(BusinessSetting).where(BusinessSetting.key == key))
    row = result.scalar_one_or_none()
    return row.value if row else default


async def get_available_slots(
    db: AsyncSession,
    barber_id: uuid.UUID,
    local_date: date,
) -> list[AvailableSlot]:
    """Return list of available UTC slots for barber on local_date."""
    tz_str = await _get_setting(db, "shop_timezone", "America/Asuncion")
    slot_minutes = int(await _get_setting(db, SETTING_SLOT_DURATION, "60"))
    cancel_hours = int(await _get_setting(db, SETTING_CANCEL_HOURS, "2"))
    advance_days = int(await _get_setting(db, SETTING_ADVANCE_DAYS, "30"))

    shop_tz = ZoneInfo(tz_str)
    now_local = datetime.now(shop_tz)
    today_local = now_local.date()

    if local_date < today_local:
        return []
    if (local_date - today_local).days > advance_days:
        return []

    weekday = local_date.weekday()  # 0=Mon

    # Barber schedule for this weekday
    result = await db.execute(
        select(BarberSchedule).where(
            BarberSchedule.barber_id == barber_id,
            BarberSchedule.weekday == weekday,
        )
    )
    schedule = result.scalar_one_or_none()
    if not schedule or not schedule.is_working:
        return []

    # Build naive local datetimes for the working window
    day_start = datetime.combine(local_date, schedule.start_time).replace(tzinfo=shop_tz)
    day_end = datetime.combine(local_date, schedule.end_time).replace(tzinfo=shop_tz)

    # Generate all slots within the working window
    slots: list[tuple[datetime, datetime]] = []
    cursor = day_start
    slot_delta = timedelta(minutes=slot_minutes)
    while cursor + slot_delta <= day_end:
        slot_end = cursor + slot_delta
        # Skip break period
        if schedule.break_start and schedule.break_end:
            break_s = datetime.combine(local_date, schedule.break_start).replace(tzinfo=shop_tz)
            break_e = datetime.combine(local_date, schedule.break_end).replace(tzinfo=shop_tz)
            if cursor < break_e and slot_end > break_s:
                cursor += slot_delta
                continue
        slots.append((cursor, slot_end))
        cursor += slot_delta

    if not slots:
        return []

    window_start_utc = slots[0][0].astimezone(timezone.utc)
    window_end_utc = slots[-1][1].astimezone(timezone.utc)

    # Fetch existing confirmed/pending appointments in the window
    appt_result = await db.execute(
        select(Appointment).where(
            Appointment.barber_id == barber_id,
            Appointment.status.in_([AppointmentStatus.pending, AppointmentStatus.confirmed]),
            Appointment.start_datetime < window_end_utc,
            Appointment.end_datetime > window_start_utc,
        )
    )
    booked = appt_result.scalars().all()

    # Fetch blocked slots overlapping the window (barber-specific or shop-wide)
    blocked_result = await db.execute(
        select(BlockedSlot).where(
            or_(BlockedSlot.barber_id == barber_id, BlockedSlot.barber_id.is_(None)),
            BlockedSlot.start_datetime < window_end_utc,
            BlockedSlot.end_datetime > window_start_utc,
        )
    )
    blocks = blocked_result.scalars().all()

    min_start = now_local + timedelta(hours=cancel_hours)

    available: list[AvailableSlot] = []
    for slot_local_start, slot_local_end in slots:
        # Must be at least cancel_hours in the future
        if slot_local_start < min_start:
            continue
        slot_utc_start = slot_local_start.astimezone(timezone.utc)
        slot_utc_end = slot_local_end.astimezone(timezone.utc)

        # Check overlap with existing appointments
        overlaps_appt = any(
            a.start_datetime < slot_utc_end and a.end_datetime > slot_utc_start
            for a in booked
        )
        if overlaps_appt:
            continue

        # Check overlap with blocked slots
        overlaps_block = any(
            b.start_datetime < slot_utc_end and b.end_datetime > slot_utc_start
            for b in blocks
        )
        if overlaps_block:
            continue

        available.append(AvailableSlot(start_datetime=slot_utc_start, end_datetime=slot_utc_end))

    return available


async def is_slot_available(
    db: AsyncSession,
    barber_id: uuid.UUID,
    start_utc: datetime,
    end_utc: datetime,
    exclude_appointment_id: uuid.UUID | None = None,
) -> bool:
    """Check if a specific UTC slot is free for the barber."""
    appt_q = select(Appointment).where(
        Appointment.barber_id == barber_id,
        Appointment.status.in_([AppointmentStatus.pending, AppointmentStatus.confirmed]),
        Appointment.start_datetime < end_utc,
        Appointment.end_datetime > start_utc,
    )
    if exclude_appointment_id:
        appt_q = appt_q.where(Appointment.id != exclude_appointment_id)

    appt_result = await db.execute(appt_q)
    if appt_result.scalars().first():
        return False

    blocked_result = await db.execute(
        select(BlockedSlot).where(
            or_(BlockedSlot.barber_id == barber_id, BlockedSlot.barber_id.is_(None)),
            BlockedSlot.start_datetime < end_utc,
            BlockedSlot.end_datetime > start_utc,
        )
    )
    if blocked_result.scalars().first():
        return False

    return True
