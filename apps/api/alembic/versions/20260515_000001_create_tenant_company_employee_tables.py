"""create tenant company employee tables

Revision ID: 20260515_000001
Revises:
Create Date: 2026-05-15
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260515_000001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "tenants",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "companies",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("tenant_id", sa.String(length=100), sa.ForeignKey("tenants.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("business_registration_number", sa.String(length=64), nullable=True),
        sa.Column("representative_name", sa.String(length=255), nullable=True),
        sa.Column("policy_config", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_companies_tenant_id", "companies", ["tenant_id"])

    op.create_table(
        "employees",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("tenant_id", sa.String(length=100), nullable=False),
        sa.Column("company_id", sa.String(length=100), sa.ForeignKey("companies.id"), nullable=False),
        sa.Column("employee_no", sa.String(length=64), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=64), nullable=True),
        sa.Column("department", sa.String(length=255), nullable=True),
        sa.Column("position", sa.String(length=255), nullable=True),
        sa.Column("employment_type", sa.String(length=32), nullable=False),
        sa.Column("hire_date", sa.Date(), nullable=False),
        sa.Column("resignation_date", sa.Date(), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("company_id", "employee_no", name="uq_employees_company_employee_no"),
    )
    op.create_index("ix_employees_tenant_id", "employees", ["tenant_id"])
    op.create_index("ix_employees_company_id", "employees", ["company_id"])


def downgrade() -> None:
    op.drop_index("ix_employees_company_id", table_name="employees")
    op.drop_index("ix_employees_tenant_id", table_name="employees")
    op.drop_table("employees")
    op.drop_index("ix_companies_tenant_id", table_name="companies")
    op.drop_table("companies")
    op.drop_table("tenants")
