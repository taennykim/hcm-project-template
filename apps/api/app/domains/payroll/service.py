from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.domains.employee.service import employee_service
from app.domains.monthly_attendance.service import monthly_attendance_service
from app.domains.payroll.schemas import (
    PayrollItem,
    PayrollItemRepositoryRecord,
    PayrollRun,
    PayrollRunGenerateRequest,
    PayrollRunRepositoryRecord,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


class PayrollService:
    def __init__(self) -> None:
        timestamp = _now()
        self._base_pay_by_employee = {
            "dev-employee-001": 3_000_000,
            "dev-employee-002": 2_800_000,
        }
        self._payroll_runs: dict[str, PayrollRunRepositoryRecord] = {
            "payroll-run-001": PayrollRunRepositoryRecord(
                id="payroll-run-001",
                tenant_id="dev-tenant",
                company_id="dev-company",
                year_month="2026-04",
                status="reviewed",
                total_employees=2,
                total_gross_pay=8_200_000,
                total_deductions=0,
                total_net_pay=8_200_000,
                executed_at=timestamp,
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            )
        }
        self._payroll_items: dict[str, PayrollItemRepositoryRecord] = {
            "payroll-item-001": PayrollItemRepositoryRecord(
                id="payroll-item-001",
                tenant_id="dev-tenant",
                company_id="dev-company",
                payroll_run_id="payroll-run-001",
                employee_id="dev-employee-001",
                year_month="2026-04",
                base_pay=3_000_000,
                overtime_pay=1_800_000,
                allowance_total=0,
                deduction_total=0,
                gross_pay=4_800_000,
                net_pay=4_800_000,
                created_at=timestamp,
                updated_at=timestamp,
            ),
            "payroll-item-002": PayrollItemRepositoryRecord(
                id="payroll-item-002",
                tenant_id="dev-tenant",
                company_id="dev-company",
                payroll_run_id="payroll-run-001",
                employee_id="dev-employee-002",
                year_month="2026-04",
                base_pay=2_800_000,
                overtime_pay=600_000,
                allowance_total=0,
                deduction_total=0,
                gross_pay=3_400_000,
                net_pay=3_400_000,
                created_at=timestamp,
                updated_at=timestamp,
            ),
        }

    def list_payroll_runs(self, year_month: str | None = None) -> list[PayrollRun]:
        runs = list(self._payroll_runs.values())
        if year_month is not None:
            runs = [run for run in runs if run.year_month == year_month]
        runs.sort(key=lambda run: (run.year_month, run.id))
        return [self._to_payroll_run(run) for run in runs]

    def get_payroll_run(self, payroll_run_id: str) -> PayrollRun:
        return self._to_payroll_run(self._get_payroll_run_record(payroll_run_id))

    def list_payroll_items(self, payroll_run_id: str) -> list[PayrollItem]:
        self._get_payroll_run_record(payroll_run_id)
        items = [
            item
            for item in self._payroll_items.values()
            if item.payroll_run_id == payroll_run_id
        ]
        items.sort(key=lambda item: (item.year_month, item.employee_id, item.id))
        return [self._to_payroll_item(item) for item in items]

    def list_payroll_items_by_employee(self, employee_id: str) -> list[PayrollItem]:
        self._ensure_employee_exists(employee_id)
        items = [
            item
            for item in self._payroll_items.values()
            if item.employee_id == employee_id
        ]
        items.sort(key=lambda item: (item.year_month, item.payroll_run_id, item.id))
        return [self._to_payroll_item(item) for item in items]

    def generate_payroll_run(
        self, payload: PayrollRunGenerateRequest
    ) -> PayrollRun:
        if payload.tenant_id != "dev-tenant" or payload.company_id != "dev-company":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This bootstrap supports only dev-tenant/dev-company.",
            )
        self._ensure_unique_company_year_month(payload.company_id, payload.year_month)

        summaries = monthly_attendance_service.list_summaries(year_month=payload.year_month)
        matched_summaries = [
            summary
            for summary in summaries
            if summary.tenant_id == payload.tenant_id
            and summary.company_id == payload.company_id
        ]
        if not matched_summaries:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"No monthly attendance summaries found for '{payload.year_month}'."
                ),
            )

        timestamp = _now()
        payroll_run_id = f"payroll-run-{len(self._payroll_runs) + 1:03d}"
        generated_items: list[PayrollItemRepositoryRecord] = []
        for summary in matched_summaries:
            self._ensure_unique_item(payroll_run_id, summary.employee_id)
            base_pay = self._base_pay_by_employee.get(summary.employee_id, 2_500_000)
            overtime_pay = summary.overtime_minutes * 10_000
            allowance_total = 0
            deduction_total = 0
            gross_pay = base_pay + overtime_pay + allowance_total
            net_pay = gross_pay - deduction_total
            item_id = f"payroll-item-{len(self._payroll_items) + len(generated_items) + 1:03d}"
            generated_items.append(
                PayrollItemRepositoryRecord(
                    id=item_id,
                    tenant_id=summary.tenant_id,
                    company_id=summary.company_id,
                    payroll_run_id=payroll_run_id,
                    employee_id=summary.employee_id,
                    year_month=summary.year_month,
                    base_pay=base_pay,
                    overtime_pay=overtime_pay,
                    allowance_total=allowance_total,
                    deduction_total=deduction_total,
                    gross_pay=gross_pay,
                    net_pay=net_pay,
                    created_at=timestamp,
                    updated_at=timestamp,
                )
            )

        payroll_run = PayrollRunRepositoryRecord(
            id=payroll_run_id,
            tenant_id=payload.tenant_id,
            company_id=payload.company_id,
            year_month=payload.year_month,
            status=payload.status,
            total_employees=len(generated_items),
            total_gross_pay=sum(item.gross_pay for item in generated_items),
            total_deductions=sum(item.deduction_total for item in generated_items),
            total_net_pay=sum(item.net_pay for item in generated_items),
            executed_at=timestamp,
            created_at=timestamp,
            updated_at=timestamp,
            deleted_at=None,
        )
        self._payroll_runs[payroll_run_id] = payroll_run
        for item in generated_items:
            self._payroll_items[item.id] = item
        return self._to_payroll_run(payroll_run)

    def _get_payroll_run_record(self, payroll_run_id: str) -> PayrollRunRepositoryRecord:
        payroll_run = self._payroll_runs.get(payroll_run_id)
        if payroll_run is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Payroll run '{payroll_run_id}' not found.",
            )
        return payroll_run

    def _ensure_unique_company_year_month(self, company_id: str, year_month: str) -> None:
        for payroll_run in self._payroll_runs.values():
            if payroll_run.company_id == company_id and payroll_run.year_month == year_month:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Payroll run for company '{company_id}' on "
                        f"'{year_month}' already exists."
                    ),
                )

    def _ensure_unique_item(self, payroll_run_id: str, employee_id: str) -> None:
        for item in self._payroll_items.values():
            if item.payroll_run_id == payroll_run_id and item.employee_id == employee_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Payroll item for run '{payroll_run_id}' and employee "
                        f"'{employee_id}' already exists."
                    ),
                )

    @staticmethod
    def _to_payroll_run(record: PayrollRunRepositoryRecord) -> PayrollRun:
        return PayrollRun.model_validate(record.model_dump())

    @staticmethod
    def _to_payroll_item(record: PayrollItemRepositoryRecord) -> PayrollItem:
        return PayrollItem.model_validate(record.model_dump())

    @staticmethod
    def _ensure_employee_exists(employee_id: str) -> None:
        employee_service.get_employee(employee_id)


payroll_service = PayrollService()
