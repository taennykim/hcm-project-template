from __future__ import annotations

from datetime import date

from sqlalchemy import select

from app.db.models import CompanyModel, EmployeeModel, TenantModel
from app.db.session import SessionLocal


def seed_dev_data() -> None:
    with SessionLocal.begin() as session:
        tenant = session.get(TenantModel, "dev-tenant")
        if tenant is None:
            tenant = TenantModel(id="dev-tenant", name="Dev Tenant")
            session.add(tenant)

        company = session.get(CompanyModel, "dev-company")
        if company is None:
            company = CompanyModel(
                id="dev-company",
                tenant_id="dev-tenant",
                name="데모회사",
                business_registration_number=None,
                representative_name=None,
                policy_config={
                    "attendance": {
                        "work_start_time": "09:00",
                        "work_end_time": "18:00",
                        "lunch_minutes": 60,
                        "late_grace_minutes": 10,
                        "rounding_minutes": 10,
                    },
                    "payroll": {"pay_day": 25, "round_unit": 10, "include_overtime": False},
                    "leave": {"annual_leave_enabled": True, "half_day_enabled": True},
                },
            )
            session.add(company)

        seed_employees = [
            {
                "id": "dev-employee-001",
                "tenant_id": "dev-tenant",
                "company_id": "dev-company",
                "employee_no": "E001",
                "name": "김관리",
                "email": "manager.kim@example.com",
                "phone": "010-1234-5678",
                "department": "인사팀",
                "position": "매니저",
                "employment_type": "full_time",
                "hire_date": date(2026, 1, 1),
                "resignation_date": None,
                "status": "active",
            },
            {
                "id": "dev-employee-002",
                "tenant_id": "dev-tenant",
                "company_id": "dev-company",
                "employee_no": "E002",
                "name": "이운영",
                "email": "ops.lee@example.com",
                "phone": "010-2345-6789",
                "department": "운영팀",
                "position": "스태프",
                "employment_type": "full_time",
                "hire_date": date(2026, 2, 10),
                "resignation_date": None,
                "status": "active",
            },
        ]

        for payload in seed_employees:
            employee = session.get(EmployeeModel, payload["id"])
            if employee is None:
                existing_no = session.scalar(
                    select(EmployeeModel).where(
                        EmployeeModel.company_id == payload["company_id"],
                        EmployeeModel.employee_no == payload["employee_no"],
                    )
                )
                if existing_no is None:
                    session.add(EmployeeModel(**payload))


def main() -> None:
    seed_dev_data()
    print("Development seed applied.")


if __name__ == "__main__":
    main()
