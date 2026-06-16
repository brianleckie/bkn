"""Admin: manage blocked slots (vacations, breaks, maintenance)."""
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.blocked_slot import BlockedSlot
from app.models.user import User
from app.schemas.blocked_slot import BlockedSlotCreate, BlockedSlotRead

router = APIRouter(prefix="/blocked-slots", tags=["admin-blocked-slots"])


@router.get("", response_model=list[BlockedSlotRead])
async def list_blocked_slots(
    barber_id: uuid.UUID | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    q = select(BlockedSlot).order_by(BlockedSlot.start_datetime)
    if barber_id:
        q = q.where(BlockedSlot.barber_id == barber_id)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=BlockedSlotRead, status_code=status.HTTP_201_CREATED)
async def create_blocked_slot(
    data: BlockedSlotCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    slot = BlockedSlot(**data.model_dump(), created_by_id=current_user.id)
    db.add(slot)
    await db.flush()
    await db.refresh(slot)
    return slot


@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blocked_slot(
    slot_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(BlockedSlot).where(BlockedSlot.id == slot_id))
    slot = result.scalar_one_or_none()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blocked slot not found")
    await db.delete(slot)
