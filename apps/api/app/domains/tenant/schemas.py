from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AttendancePolicyConfig(BaseModel):
    work_start_time: str = "09:00"
    work_end_time: str = "18:00"
    lunch_minutes: int = 60


class PayrollPolicyConfig(BaseModel):
    pay_day: int = 25
    round_unit: int = 10


class CompanyPolicyConfig(BaseModel):
    attendance: AttendancePolicyConfig = Field(
        default_factory=AttendancePolicyConfig
    )
    payroll: PayrollPolicyConfig = Field(default_factory=PayrollPolicyConfig)


class CompanyBase(BaseModel):
    tenant_id: str
    name: str
    business_registration_number: str | None = None
    representative_name: str | None = None
    policy_config: CompanyPolicyConfig


class CompanyCreate(CompanyBase):
    id: str | None = None


class CompanyPolicyUpdate(BaseModel):
    policy_config: CompanyPolicyConfig


class Company(CompanyBase):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class CompanyListResponse(BaseModel):
    items: list[Company]


class CompanyPolicyResponse(BaseModel):
    company_id: str
    tenant_id: str
    policy_config: CompanyPolicyConfig


class CompanyRepositoryRecord(BaseModel):
    id: str
    tenant_id: str
    name: str
    business_registration_number: str | None = None
    representative_name: str | None = None
    policy_config: dict[str, Any]
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None
