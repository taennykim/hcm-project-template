from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


AttendanceStatus = Literal[
    "not_entered",
    "present",
    "late",
    "absent",
    "leave",
    "early_leave",
]
AttendanceType = Literal[
    "workday",
    "holiday",
    "paid_leave",
    "unpaid_leave",
    "business_trip",
]


class AttendanceRecordBase(BaseModel):
    tenant_id: str
    company_id: str
    employee_id: str
    work_date: date
    clock_in_at: datetime | None = None
    clock_out_at: datetime | None = None
    attendance_type: AttendanceType
    status: AttendanceStatus
    work_minutes: int = Field(ge=0)
    overtime_minutes: int = Field(ge=0)
    late_minutes: int = Field(ge=0)
    note: str | None = None


class AttendanceRecordCreate(AttendanceRecordBase):
    id: str | None = None


class AttendanceRecordUpdate(BaseModel):
    clock_in_at: datetime | None = None
    clock_out_at: datetime | None = None
    attendance_type: AttendanceType | None = None
    status: AttendanceStatus | None = None
    work_minutes: int | None = Field(default=None, ge=0)
    overtime_minutes: int | None = Field(default=None, ge=0)
    late_minutes: int | None = Field(default=None, ge=0)
    note: str | None = None


class AttendanceRecord(AttendanceRecordBase):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class AttendanceRecordListResponse(BaseModel):
    items: list[AttendanceRecord]


class AttendanceRecordRepositoryRecord(AttendanceRecordBase):
    model_config = ConfigDict(validate_assignment=True)

    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None
