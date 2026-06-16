from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, public
from app.routers.admin import appointments, barbers, blocked_slots, gallery, services
from app.routers.admin import settings as admin_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="BKN Barbershop API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN] if settings.FRONTEND_ORIGIN != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

# Public routes
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(public.router, prefix=API_PREFIX)

# Admin routes (all require JWT)
ADMIN_PREFIX = f"{API_PREFIX}/admin"
app.include_router(appointments.router, prefix=ADMIN_PREFIX)
app.include_router(barbers.router, prefix=ADMIN_PREFIX)
app.include_router(services.router, prefix=ADMIN_PREFIX)
app.include_router(blocked_slots.router, prefix=ADMIN_PREFIX)
app.include_router(gallery.router, prefix=ADMIN_PREFIX)
app.include_router(admin_settings.router, prefix=ADMIN_PREFIX)


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "BKN Barbershop API"}
