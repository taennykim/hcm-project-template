from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


MonthlyAttendanceSummaryStatus = Literal[
    "draft",
    "summarized",
    "reviewing",
    "confirmed",
    "error",
]


class MonthlyAttendanceSummaryBase(BaseModel):
    tenant_id: str
    company_id: str
    employee_id: str
    year_month: str
    total_work_minutes: int = Field(ge=0)
    overtime_minutes: int = Field(ge=0)
    late_minutes: int = Field(ge=0)
    late_count: int = Field(ge=0)
    absent_count: int = Field(ge=0)
    leave_count: int = Field(ge=0)
    workday_count: int = Field(ge=0)
    status: MonthlyAttendanceSummaryStatus


class MonthlyAttendanceSummaryGenerateRequest(BaseModel):
    tenant_id: str
    company_id: str
    year_month: str
    status: MonthlyAttendanceSummaryStatus = "summarized"


class MonthlyAttendanceSummary(MonthlyAttendanceSummaryBase):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class MonthlyAttendanceSummaryListResponse(BaseModel):
    items: list[MonthlyAttendanceSummary]


class MonthlyAttendanceSummaryRepositoryRecord(MonthlyAttendanceSummaryBase):
    model_config = ConfigDict(validate_assignment=True)

    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None
