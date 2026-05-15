from __future__ import annotations

from sqlalchemy import select

from app.db.models import EmployeeModel
from app.db.session import SessionLocal
from app.domains.employee.schemas import (
    EmployeeCreate,
    EmployeeRepositoryRecord,
    EmployeeStatusUpdate,
    EmployeeUpdate,
)


class EmployeeRepository:
    def list_employees(self) -> list[EmployeeRepositoryRecord]:
        with SessionLocal() as session:
            employees = session.scalars(
                select(EmployeeModel)
                .where(EmployeeModel.deleted_at.is_(None))
                .order_by(EmployeeModel.employee_no, EmployeeModel.id)
            ).all()
            return [self._to_record(employee) for employee in employees]

    def create_employee(self, payload: EmployeeCreate) -> EmployeeRepositoryRecord:
        with SessionLocal.begin() as session:
            employee = EmployeeModel(
                id=payload.id,
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
            )
            session.add(employee)
            session.flush()
            session.refresh(employee)
            return self._to_record(employee)

    def get_employee(self, employee_id: str) -> EmployeeRepositoryRecord | None:
        with SessionLocal() as session:
            employee = session.scalar(
                select(EmployeeModel).where(
                    EmployeeModel.id == employee_id, EmployeeModel.deleted_at.is_(None)
                )
            )
            return None if employee is None else self._to_record(employee)

    def update_employee(
        self, employee_id: str, payload: EmployeeUpdate
    ) -> EmployeeRepositoryRecord | None:
        with SessionLocal.begin() as session:
            employee = session.scalar(
                select(EmployeeModel).where(
                    EmployeeModel.id == employee_id, EmployeeModel.deleted_at.is_(None)
                )
            )
            if employee is None:
                return None
            for field_name, value in payload.model_dump(exclude_unset=True).items():
                setattr(employee, field_name, value)
            session.add(employee)
            session.flush()
            session.refresh(employee)
            return self._to_record(employee)

    def update_employee_status(
        self, employee_id: str, payload: EmployeeStatusUpdate
    ) -> EmployeeRepositoryRecord | None:
        with SessionLocal.begin() as session:
            employee = session.scalar(
                select(EmployeeModel).where(
                    EmployeeModel.id == employee_id, EmployeeModel.deleted_at.is_(None)
                )
            )
            if employee is None:
                return None
            employee.status = payload.status
            if payload.resignation_date is not None:
                employee.resignation_date = payload.resignation_date
            session.add(employee)
            session.flush()
            session.refresh(employee)
            return self._to_record(employee)

    def employee_no_exists(
        self, company_id: str, employee_no: str, exclude_employee_id: str | None = None
    ) -> bool:
        with SessionLocal() as session:
            query = select(EmployeeModel).where(
                EmployeeModel.company_id == company_id,
                EmployeeModel.employee_no == employee_no,
                EmployeeModel.deleted_at.is_(None),
            )
            if exclude_employee_id is not None:
                query = query.where(EmployeeModel.id != exclude_employee_id)
            return session.scalar(query) is not None

    @staticmethod
    def _to_record(employee: EmployeeModel) -> EmployeeRepositoryRecord:
        return EmployeeRepositoryRecord(
            id=employee.id,
            tenant_id=employee.tenant_id,
            company_id=employee.company_id,
            employee_no=employee.employee_no,
            name=employee.name,
            email=employee.email,
            phone=employee.phone,
            department=employee.department,
            position=employee.position,
            employment_type=employee.employment_type,
            hire_date=employee.hire_date,
            resignation_date=employee.resignation_date,
            status=employee.status,
            created_at=employee.created_at,
            updated_at=employee.updated_at,
            deleted_at=employee.deleted_at,
        )


employee_repository = EmployeeRepository()
