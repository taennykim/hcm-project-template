from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.db.base import Base

PolicyConfigType = JSONB().with_variant(JSON(), "sqlite")


class TenantModel(Base):
    __tablename__ = "tenants"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    companies: Mapped[list["CompanyModel"]] = relationship(back_populates="tenant")


class CompanyModel(Base):
    __tablename__ = "companies"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(
        String(100), ForeignKey("tenants.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    business_registration_number: Mapped[str | None] = mapped_column(String(64))
    representative_name: Mapped[str | None] = mapped_column(String(255))
    policy_config: Mapped[dict] = mapped_column(PolicyConfigType, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    tenant: Mapped[TenantModel] = relationship(back_populates="companies")
    employees: Mapped[list["EmployeeModel"]] = relationship(back_populates="company")


class EmployeeModel(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    company_id: Mapped[str] = mapped_column(
        String(100), ForeignKey("companies.id"), nullable=False, index=True
    )
    employee_no: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(64))
    department: Mapped[str | None] = mapped_column(String(255))
    position: Mapped[str | None] = mapped_column(String(255))
    employment_type: Mapped[str] = mapped_column(String(32), nullable=False)
    hire_date: Mapped[date] = mapped_column(Date, nullable=False)
    resignation_date: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    company: Mapped[CompanyModel] = relationship(back_populates="employees")
