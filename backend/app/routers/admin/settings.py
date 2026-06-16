"""Admin: business settings CRUD."""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.business_settings import BusinessSetting
from app.models.user import User
from app.schemas.business_settings import SettingRead, SettingUpsert

router = APIRouter(prefix="/settings", tags=["admin-settings"])


@router.get("", response_model=list[SettingRead])
async def list_settings(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_admin)):
    result = await db.execute(select(BusinessSetting).order_by(BusinessSetting.key))
    return result.scalars().all()


@router.put("", response_model=list[SettingRead])
async def upsert_settings(
    settings: list[SettingUpsert],
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    for s in settings:
        stmt = (
            insert(BusinessSetting)
            .values(key=s.key, value=s.value, description=s.description)
            .on_conflict_do_update(
                index_elements=["key"],
                set_={"value": s.value, "description": s.description},
            )
        )
        await db.execute(stmt)
    await db.flush()

    result = await db.execute(select(BusinessSetting).order_by(BusinessSetting.key))
    return result.scalars().all()
