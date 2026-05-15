from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.domains.employee.repository import employee_repository
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
    def list_employees(self) -> list[Employee]:
        return [self._to_employee(record) for record in employee_repository.list_employees()]

    def create_employee(self, payload: EmployeeCreate) -> Employee:
        employee_id = payload.id or f"employee-{int(datetime.now(timezone.utc).timestamp())}"
        if employee_repository.get_employee(employee_id) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee '{employee_id}' already exists.",
            )

        if payload.company_id != "dev-company" or payload.tenant_id != "dev-tenant":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This bootstrap supports only dev-tenant/dev-company.",
            )
        if employee_repository.employee_no_exists(payload.company_id, payload.employee_no):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee number '{payload.employee_no}' already exists.",
            )

        payload.id = employee_id
        record = employee_repository.create_employee(payload)
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
            and employee_repository.employee_no_exists(
                record.company_id, payload.employee_no, exclude_employee_id=employee_id
            )
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee number '{payload.employee_no}' already exists.",
            )
        record = employee_repository.update_employee(employee_id, payload)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee '{employee_id}' not found.",
            )
        return self._to_employee(record)

    def update_employee_status(
        self, employee_id: str, payload: EmployeeStatusUpdate
    ) -> Employee:
        record = employee_repository.update_employee_status(employee_id, payload)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee '{employee_id}' not found.",
            )
        return self._to_employee(record)

    def _get_record(self, employee_id: str) -> EmployeeRepositoryRecord:
        record = employee_repository.get_employee(employee_id)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee '{employee_id}' not found.",
            )
        return record

    @staticmethod
    def _to_employee(record: EmployeeRepositoryRecord) -> Employee:
        return Employee.model_validate(record.model_dump())


employee_service = EmployeeService()
