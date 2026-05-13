from __future__ import annotations

from datetime import date, datetime, timezone

from fastapi import HTTPException, status

from app.domains.employee.schemas import (
    Employee,
    EmployeeCreate,
    EmployeeRepositoryRecord,
    EmployeeStatusUpdate,
    EmployeeUpdate,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


class EmployeeService:
    def __init__(self) -> None:
        timestamp = _now()
        self._employees: dict[str, EmployeeRepositoryRecord] = {
            "dev-employee-001": EmployeeRepositoryRecord(
                id="dev-employee-001",
                tenant_id="dev-tenant",
                company_id="dev-company",
                employee_no="E001",
                name="김관리",
                email="manager.kim@example.com",
                phone="010-1234-5678",
                department="인사팀",
                position="매니저",
                employment_type="full_time",
                hire_date=date(2026, 1, 1),
                resignation_date=None,
                status="active",
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
            "dev-employee-002": EmployeeRepositoryRecord(
                id="dev-employee-002",
                tenant_id="dev-tenant",
                company_id="dev-company",
                employee_no="E002",
                name="이운영",
                email="ops.lee@example.com",
                phone="010-2345-6789",
                department="운영팀",
                position="스태프",
                employment_type="full_time",
                hire_date=date(2026, 2, 10),
                resignation_date=None,
                status="active",
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
        }

    def list_employees(self) -> list[Employee]:
        return [self._to_employee(record) for record in self._employees.values()]

    def create_employee(self, payload: EmployeeCreate) -> Employee:
        employee_id = payload.id or f"employee-{len(self._employees) + 1}"
        if employee_id in self._employees:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee '{employee_id}' already exists.",
            )

        if payload.company_id != "dev-company" or payload.tenant_id != "dev-tenant":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This bootstrap supports only dev-tenant/dev-company.",
            )
        if self._employee_no_exists(payload.employee_no):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee number '{payload.employee_no}' already exists.",
            )

        timestamp = _now()
        record = EmployeeRepositoryRecord(
            id=employee_id,
            tenant_id=payload.tenant_id,
            company_id=payload.company_id,
            employee_no=payload.employee_no,
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            department=payload.department,
            position=payload.position,
            employment_type=payload.employment_type,
            hire_date=payload.hire_date,
            resignation_date=payload.resignation_date,
            status=payload.status,
            created_at=timestamp,
            updated_at=timestamp,
            deleted_at=None,
        )
        self._employees[employee_id] = record
        return self._to_employee(record)

    def get_employee(self, employee_id: str) -> Employee:
        return self._to_employee(self._get_record(employee_id))

    def update_employee(
        self, employee_id: str, payload: EmployeeUpdate
    ) -> Employee:
        record = self._get_record(employee_id)
        if (
            payload.employee_no is not None
            and payload.employee_no != record.employee_no
            and self._employee_no_exists(payload.employee_no)
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee number '{payload.employee_no}' already exists.",
            )
        for field_name, value in payload.model_dump(exclude_unset=True).items():
            setattr(record, field_name, value)
        record.updated_at = _now()
        self._employees[employee_id] = record
        return self._to_employee(record)

    def update_employee_status(
        self, employee_id: str, payload: EmployeeStatusUpdate
    ) -> Employee:
        record = self._get_record(employee_id)
        record.status = payload.status
        if payload.resignation_date is not None:
            record.resignation_date = payload.resignation_date
        record.updated_at = _now()
        self._employees[employee_id] = record
        return self._to_employee(record)

    def _get_record(self, employee_id: str) -> EmployeeRepositoryRecord:
        record = self._employees.get(employee_id)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee '{employee_id}' not found.",
            )
        return record

    def _employee_no_exists(self, employee_no: str) -> bool:
        return any(
            record.employee_no == employee_no for record in self._employees.values()
        )

    @staticmethod
    def _to_employee(record: EmployeeRepositoryRecord) -> Employee:
        return Employee.model_validate(record.model_dump())


employee_service = EmployeeService()
