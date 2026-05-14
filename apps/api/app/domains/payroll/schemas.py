from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


PayrollRunStatus = Literal[
    "draft",
    "calculated",
    "reviewed",
    "confirmed",
    "closed",
    "error",
]


class PayrollRunBase(BaseModel):
    tenant_id: str
    company_id: str
    year_month: str
    status: PayrollRunStatus
    total_employees: int = Field(ge=0)
    total_gross_pay: int = Field(ge=0)
    total_deductions: int = Field(ge=0)
    total_net_pay: int = Field(ge=0)
    executed_at: datetime | None = None


class PayrollRunGenerateRequest(BaseModel):
    tenant_id: str
    company_id: str
    year_month: str
    status: PayrollRunStatus = "calculated"


class PayrollRun(PayrollRunBase):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class PayrollRunListResponse(BaseModel):
    items: list[PayrollRun]


class PayrollRunRepositoryRecord(PayrollRunBase):
    model_config = ConfigDict(validate_assignment=True)

    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class PayrollItemBase(BaseModel):
    tenant_id: str
    company_id: str
    payroll_run_id: str
    employee_id: str
    year_month: str
    base_pay: int = Field(ge=0)
    overtime_pay: int = Field(ge=0)
    allowance_total: int = Field(ge=0)
    deduction_total: int = Field(ge=0)
    gross_pay: int = Field(ge=0)
    net_pay: int = Field(ge=0)


class PayrollItem(PayrollItemBase):
    id: str
    created_at: datetime
    updated_at: datetime


class PayrollItemListResponse(BaseModel):
    items: list[PayrollItem]


class PayrollItemRepositoryRecord(PayrollItemBase):
    model_config = ConfigDict(validate_assignment=True)

    id: str
    created_at: datetime
    updated_at: datetime
