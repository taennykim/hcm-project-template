from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


PayslipStatus = Literal["draft", "issued", "canceled"]


class PayslipBase(BaseModel):
    tenant_id: str
    company_id: str
    payroll_run_id: str
    employee_id: str
    year_month: str
    status: PayslipStatus
    issued_at: datetime | None = None
    base_pay: int = Field(ge=0)
    overtime_pay: int = Field(ge=0)
    allowance_total: int = Field(ge=0)
    deduction_total: int = Field(ge=0)
    gross_pay: int = Field(ge=0)
    net_pay: int = Field(ge=0)


class PayslipGenerateRequest(BaseModel):
    tenant_id: str
    company_id: str
    year_month: str
    status: PayslipStatus = "draft"


class Payslip(PayslipBase):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class PayslipListResponse(BaseModel):
    items: list[Payslip]


class PayslipRepositoryRecord(PayslipBase):
    model_config = ConfigDict(validate_assignment=True)

    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None
