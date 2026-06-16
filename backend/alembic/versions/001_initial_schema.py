"""Initial schema

Revision ID: 001
Revises:
Create Date: 2026-06-16
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── users ──────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(150), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("is_superadmin", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # ── barbers ────────────────────────────────────────────────────────────────
    op.create_table(
        "barbers",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column("bio", sa.String(500), nullable=True),
        sa.Column("profile_image_url", sa.String(500), nullable=True),
        sa.Column("cloudinary_public_id", sa.String(200), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_barbers_slug", "barbers", ["slug"], unique=True)

    # ── barber_schedules ───────────────────────────────────────────────────────
    op.create_table(
        "barber_schedules",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("barber_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("weekday", sa.Integer(), nullable=False),
        sa.Column("is_working", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("start_time", sa.Time(), nullable=False, server_default="09:00:00"),
        sa.Column("end_time", sa.Time(), nullable=False, server_default="19:00:00"),
        sa.Column("break_start", sa.Time(), nullable=True),
        sa.Column("break_end", sa.Time(), nullable=True),
        sa.ForeignKeyConstraint(["barber_id"], ["barbers.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_barber_schedules_barber_id", "barber_schedules", ["barber_id"])

    # ── services ───────────────────────────────────────────────────────────────
    op.create_table(
        "services",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False, server_default="60"),
        sa.Column("image_url", sa.String(500), nullable=True),
        sa.Column("cloudinary_public_id", sa.String(200), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.PrimaryKeyConstraint("id"),
    )

    # ── appointments ───────────────────────────────────────────────────────────
    op.execute("CREATE TYPE appointmentstatus AS ENUM ('pending','confirmed','cancelled','completed','no_show')")
    op.create_table(
        "appointments",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("barber_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("service_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("client_name", sa.String(150), nullable=False),
        sa.Column("client_phone", sa.String(30), nullable=False),
        sa.Column("client_email", sa.String(255), nullable=True),
        sa.Column("start_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM("pending", "confirmed", "cancelled", "completed", "no_show", name="appointmentstatus", create_type=False),
            nullable=False,
            server_default="confirmed",
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cancelled_by", sa.String(10), nullable=True),
        sa.Column("cancellation_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.ForeignKeyConstraint(["barber_id"], ["barbers.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["service_id"], ["services.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_appointments_barber_id", "appointments", ["barber_id"])
    op.create_index("ix_appointments_service_id", "appointments", ["service_id"])
    op.create_index("ix_appointments_start_datetime", "appointments", ["start_datetime"])
    op.create_index("ix_appointments_status", "appointments", ["status"])

    # ── blocked_slots ──────────────────────────────────────────────────────────
    op.create_table(
        "blocked_slots",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("barber_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("start_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("created_by_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.ForeignKeyConstraint(["barber_id"], ["barbers.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["created_by_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_blocked_slots_barber_id", "blocked_slots", ["barber_id"])
    op.create_index("ix_blocked_slots_start_datetime", "blocked_slots", ["start_datetime"])

    # ── gallery_images ─────────────────────────────────────────────────────────
    op.create_table(
        "gallery_images",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("cloudinary_public_id", sa.String(200), nullable=False),
        sa.Column("image_url", sa.String(500), nullable=False),
        sa.Column("title", sa.String(150), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("cloudinary_public_id"),
    )

    # ── business_settings ─────────────────────────────────────────────────────
    op.create_table(
        "business_settings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("key", sa.String(100), nullable=False),
        sa.Column("value", sa.Text(), nullable=False),
        sa.Column("description", sa.String(300), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_business_settings_key", "business_settings", ["key"], unique=True)

    # ── seed default settings ─────────────────────────────────────────────────
    op.execute("""
        INSERT INTO business_settings (id, key, value, description) VALUES
        (gen_random_uuid(), 'slot_duration_minutes',  '60',                  'Duration in minutes of each booking slot'),
        (gen_random_uuid(), 'advance_booking_days',   '30',                  'How many days ahead clients can book'),
        (gen_random_uuid(), 'cancellation_hours_before', '2',                'Minimum hours before appointment to cancel'),
        (gen_random_uuid(), 'whatsapp_number',         '+595981000000',       'Shop WhatsApp number'),
        (gen_random_uuid(), 'shop_timezone',           'America/Asuncion',    'IANA timezone of the shop')
    """)


def downgrade() -> None:
    op.drop_table("business_settings")
    op.drop_table("gallery_images")
    op.drop_table("blocked_slots")
    op.drop_table("appointments")
    op.execute("DROP TYPE IF EXISTS appointmentstatus")
    op.drop_table("services")
    op.drop_table("barber_schedules")
    op.drop_table("barbers")
    op.drop_table("users")
