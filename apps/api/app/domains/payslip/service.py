from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.domains.employee.service import employee_service
from app.domains.payroll.schemas import PayrollItem
from app.domains.payroll.service import payroll_service
from app.domains.payslip.schemas import (
    Payslip,
    PayslipGenerateRequest,
    PayslipRepositoryRecord,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


class PayslipService:
    def __init__(self) -> None:
        timestamp = _now()
        self._payslips: dict[str, PayslipRepositoryRecord] = {
            "payslip-001": PayslipRepositoryRecord(
                id="payslip-001",
                tenant_id="dev-tenant",
                company_id="dev-company",
                payroll_run_id="payroll-run-001",
                employee_id="dev-employee-001",
                year_month="2026-04",
                status="issued",
                issued_at=timestamp,
                base_pay=3_000_000,
                overtime_pay=1_800_000,
                allowance_total=0,
                deduction_total=0,
                gross_pay=4_800_000,
                net_pay=4_800_000,
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
            "payslip-002": PayslipRepositoryRecord(
                id="payslip-002",
                tenant_id="dev-tenant",
                company_id="dev-company",
                payroll_run_id="payroll-run-001",
                employee_id="dev-employee-002",
                year_month="2026-04",
                status="issued",
                issued_at=timestamp,
                base_pay=2_800_000,
                overtime_pay=600_000,
                allowance_total=0,
                deduction_total=0,
                gross_pay=3_400_000,
                net_pay=3_400_000,
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
        }

    def list_payslips(self, year_month: str | None = None) -> list[Payslip]:
        payslips = list(self._payslips.values())
        if year_month is not None:
            payslips = [item for item in payslips if item.year_month == year_month]
        payslips.sort(key=lambda item: (item.year_month, item.employee_id, item.id))
        return [self._to_payslip(item) for item in payslips]

    def get_payslip(self, payslip_id: str) -> Payslip:
        return self._to_payslip(self._get_payslip_record(payslip_id))

    def list_payslips_by_payroll_run(self, payroll_run_id: str) -> list[Payslip]:
        payroll_service.get_payroll_run(payroll_run_id)
        payslips = [
            item for item in self._payslips.values() if item.payroll_run_id == payroll_run_id
        ]
        payslips.sort(key=lambda item: (item.employee_id, item.id))
        return [self._to_payslip(item) for item in payslips]

    def list_payslips_by_employee(self, employee_id: str) -> list[Payslip]:
        self._ensure_employee_exists(employee_id)
        payslips = [
            item for item in self._payslips.values() if item.employee_id == employee_id
        ]
        payslips.sort(key=lambda item: (item.year_month, item.payroll_run_id, item.id))
        return [self._to_payslip(item) for item in payslips]

    def generate_payslips(self, payload: PayslipGenerateRequest) -> list[Payslip]:
        if payload.tenant_id != "dev-tenant" or payload.company_id != "dev-company":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This bootstrap supports only dev-tenant/dev-company.",
            )

        payroll_runs = payroll_service.list_payroll_runs(year_month=payload.year_month)
        matched_runs = [
            payroll_run
            for payroll_run in payroll_runs
            if payroll_run.tenant_id == payload.tenant_id
            and payroll_run.company_id == payload.company_id
        ]
        if not matched_runs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No payroll runs found for '{payload.year_month}'.",
            )

        created: list[Payslip] = []
        for payroll_run in matched_runs:
            for payroll_item in payroll_service.list_payroll_items(payroll_run.id):
                self._ensure_unique_payroll_run_employee(
                    payroll_item.payroll_run_id, payroll_item.employee_id
                )
                created.append(self._create_from_payroll_item(payroll_item, payload.status))
        return created

    def _create_from_payroll_item(
        self, payroll_item: PayrollItem, status_value: str
    ) -> Payslip:
        timestamp = _now()
        payslip_id = f"payslip-{len(self._payslips) + 1:03d}"
        record = PayslipRepositoryRecord(
            id=payslip_id,
            tenant_id=payroll_item.tenant_id,
            company_id=payroll_item.company_id,
            payroll_run_id=payroll_item.payroll_run_id,
            employee_id=payroll_item.employee_id,
            year_month=payroll_item.year_month,
            status=status_value,
            issued_at=timestamp if status_value == "issued" else None,
            base_pay=payroll_item.base_pay,
            overtime_pay=payroll_item.overtime_pay,
            allowance_total=payroll_item.allowance_total,
            deduction_total=payroll_item.deduction_total,
            gross_pay=payroll_item.gross_pay,
            net_pay=payroll_item.net_pay,
            created_at=timestamp,
            updated_at=timestamp,
            deleted_at=None,
        )
        self._payslips[payslip_id] = record
        return self._to_payslip(record)

    def _get_payslip_record(self, payslip_id: str) -> PayslipRepositoryRecord:
        payslip = self._payslips.get(payslip_id)
        if payslip is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Payslip '{payslip_id}' not found.",
            )
        return payslip

    def _ensure_unique_payroll_run_employee(
        self, payroll_run_id: str, employee_id: str
    ) -> None:
        for payslip in self._payslips.values():
            if payslip.payroll_run_id == payroll_run_id and payslip.employee_id == employee_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Payslip for payroll run '{payroll_run_id}' and employee "
                        f"'{employee_id}' already exists."
                    ),
                )

    @staticmethod
    def _to_payslip(record: PayslipRepositoryRecord) -> Payslip:
        return Payslip.model_validate(record.model_dump())

    @staticmethod
    def _ensure_employee_exists(employee_id: str) -> None:
        employee_service.get_employee(employee_id)


payslip_service = PayslipService()
