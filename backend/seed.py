"""
Seed script: creates the first admin user and the two BKN barbers
with their default working schedules (Mon–Sat, 9–19, break 12–14).

Run: python seed.py
"""
import asyncio
import sys

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.core.security import hash_password
from app.models.barber import Barber, BarberSchedule
from app.models.service import Service
from app.models.user import User

engine = create_async_engine(settings.DATABASE_URL, echo=False)
Session = async_sessionmaker(engine, expire_on_commit=False)


async def seed():
    async with Session() as db:
        # ── Admin user ────────────────────────────────────────────────────────
        existing = await db.execute(select(User).where(User.email == settings.FIRST_ADMIN_EMAIL))
        if not existing.scalar_one_or_none():
            admin = User(
                email=settings.FIRST_ADMIN_EMAIL,
                hashed_password=hash_password(settings.FIRST_ADMIN_PASSWORD),
                full_name="BKN Admin",
                is_superadmin=True,
            )
            db.add(admin)
            print(f"[+] Admin user created: {settings.FIRST_ADMIN_EMAIL}")
        else:
            print("[=] Admin user already exists")

        # ── Barbers ───────────────────────────────────────────────────────────
        barber_data = [
            {"name": "Barbero 1", "slug": "barbero-1", "display_order": 0},
            {"name": "Barbero 2", "slug": "barbero-2", "display_order": 1},
        ]
        from datetime import time

        for bd in barber_data:
            result = await db.execute(select(Barber).where(Barber.slug == bd["slug"]))
            if not result.scalar_one_or_none():
                barber = Barber(**bd)
                db.add(barber)
                await db.flush()
                # Mon–Sat working, Sun off, break 12–14
                for weekday in range(6):  # 0=Mon … 5=Sat
                    db.add(BarberSchedule(
                        barber_id=barber.id,
                        weekday=weekday,
                        is_working=True,
                        start_time=time(9, 0),
                        end_time=time(19, 0),
                        break_start=time(12, 0),
                        break_end=time(14, 0),
                    ))
                db.add(BarberSchedule(barber_id=barber.id, weekday=6, is_working=False,
                                      start_time=time(9, 0), end_time=time(19, 0)))
                print(f"[+] Barber created: {bd['name']}")
            else:
                print(f"[=] Barber already exists: {bd['slug']}")

        # ── Services ──────────────────────────────────────────────────────────
        services_data = [
            {"name": "Corte Clásico",        "description": "Fade, degradé o corte personalizado.", "price": 25, "duration_minutes": 60, "display_order": 0},
            {"name": "Barba Clásica",         "description": "Afeitado con navaja tradicional.",     "price": 15, "duration_minutes": 60, "display_order": 1},
            {"name": "Combo Premium",         "description": "Corte + Barba + Peinado.",             "price": 35, "duration_minutes": 60, "display_order": 2},
            {"name": "Diseño Personalizado",  "description": "Consulta + diseño + corte.",           "price": 40, "duration_minutes": 60, "display_order": 3},
        ]
        for sd in services_data:
            result = await db.execute(select(Service).where(Service.name == sd["name"]))
            if not result.scalar_one_or_none():
                db.add(Service(**sd))
                print(f"[+] Service created: {sd['name']}")
            else:
                print(f"[=] Service already exists: {sd['name']}")

        await db.commit()
        print("\nSeed complete.")

asyncio.run(seed())
