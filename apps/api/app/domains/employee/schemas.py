from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


EmployeeStatus = Literal["active", "on_leave", "inactive", "upcoming"]
EmploymentType = Literal["full_time", "contract", "part_time"]


class EmployeeBase(BaseModel):
    tenant_id: str
    company_id: str
    employee_no: str
    name: str
    email: str | None = None
    phone: str | None = None
    department: str | None = None
    position: str | None = None
    employment_type: EmploymentType
    hire_date: date
    resignation_date: date | None = None
    status: EmployeeStatus


class EmployeeCreate(EmployeeBase):
    id: str | None = None


class EmployeeUpdate(BaseModel):
    employee_no: str | None = None
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    department: str | None = None
    position: str | None = None
    employment_type: EmploymentType | None = None
    hire_date: date | None = None
    resignation_date: date | None = None
    status: EmployeeStatus | None = None


class EmployeeStatusUpdate(BaseModel):
    status: EmployeeStatus
    resignation_date: date | None = None


class Employee(EmployeeBase):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class EmployeeListResponse(BaseModel):
    items: list[Employee]


class EmployeeRepositoryRecord(EmployeeBase):
    model_config = ConfigDict(validate_assignment=True)

    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None
