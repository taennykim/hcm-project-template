from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.domains.attendance.service import attendance_service
from app.domains.monthly_attendance.schemas import (
    MonthlyAttendanceSummary,
    MonthlyAttendanceSummaryGenerateRequest,
    MonthlyAttendanceSummaryRepositoryRecord,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


class MonthlyAttendanceSummaryService:
    def __init__(self) -> None:
        timestamp = _now()
        self._summaries: dict[str, MonthlyAttendanceSummaryRepositoryRecord] = {
            "monthly-summary-001": MonthlyAttendanceSummaryRepositoryRecord(
                id="monthly-summary-001",
                tenant_id="dev-tenant",
                company_id="dev-company",
                employee_id="dev-employee-001",
                year_month="2026-04",
                total_work_minutes=9600,
                overtime_minutes=180,
                late_minutes=10,
                late_count=1,
                absent_count=0,
                leave_count=1,
                workday_count=20,
                status="confirmed",
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
            "monthly-summary-002": MonthlyAttendanceSummaryRepositoryRecord(
                id="monthly-summary-002",
                tenant_id="dev-tenant",
                company_id="dev-company",
                employee_id="dev-employee-002",
                year_month="2026-04",
                total_work_minutes=9480,
                overtime_minutes=60,
                late_minutes=25,
                late_count=2,
                absent_count=1,
                leave_count=0,
                workday_count=20,
                status="reviewing",
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
        }

    def list_summaries(self, year_month: str | None = None) -> list[MonthlyAttendanceSummary]:
        summaries = list(self._summaries.values())
        if year_month is not None:
            summaries = [
                summary for summary in summaries if summary.year_month == year_month
            ]
        summaries.sort(
            key=lambda summary: (summary.year_month, summary.employee_id, summary.id)
        )
        return [self._to_summary(summary) for summary in summaries]

    def list_summaries_by_employee(self, employee_id: str) -> list[MonthlyAttendanceSummary]:
        self._ensure_employee_exists(employee_id)
        summaries = [
            summary
            for summary in self._summaries.values()
            if summary.employee_id == employee_id
        ]
        summaries.sort(key=lambda summary: (summary.year_month, summary.id))
        return [self._to_summary(summary) for summary in summaries]

    def get_summary(self, summary_id: str) -> MonthlyAttendanceSummary:
        return self._to_summary(self._get_summary(summary_id))

    def generate_summaries(
        self, payload: MonthlyAttendanceSummaryGenerateRequest
    ) -> list[MonthlyAttendanceSummary]:
        if payload.tenant_id != "dev-tenant" or payload.company_id != "dev-company":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This bootstrap supports only dev-tenant/dev-company.",
            )

        attendance_records = attendance_service.list_records()
        matched_records = [
            record
            for record in attendance_records
            if record.tenant_id == payload.tenant_id
            and record.company_id == payload.company_id
            and record.work_date.strftime("%Y-%m") == payload.year_month
        ]
        if not matched_records:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No attendance records found for '{payload.year_month}'.",
            )

        employees = sorted({record.employee_id for record in matched_records})
        generated: list[MonthlyAttendanceSummary] = []
        for employee_id in employees:
            self._ensure_unique_employee_year_month(employee_id, payload.year_month)
            employee_records = [
                record for record in matched_records if record.employee_id == employee_id
            ]
            timestamp = _now()
            summary_id = f"monthly-summary-{len(self._summaries) + 1:03d}"
            summary = MonthlyAttendanceSummaryRepositoryRecord(
                id=summary_id,
                tenant_id=payload.tenant_id,
                company_id=payload.company_id,
                employee_id=employee_id,
                year_month=payload.year_month,
                total_work_minutes=sum(
                    record.work_minutes for record in employee_records
                ),
                overtime_minutes=sum(
                    record.overtime_minutes for record in employee_records
                ),
                late_minutes=sum(record.late_minutes for record in employee_records),
                late_count=sum(
                    1 for record in employee_records if record.status == "late"
                ),
                absent_count=sum(
                    1 for record in employee_records if record.status == "absent"
                ),
                leave_count=sum(
                    1 for record in employee_records if record.status == "leave"
                ),
                workday_count=sum(
                    1 for record in employee_records if record.attendance_type == "workday"
                ),
                status=payload.status,
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            )
            self._summaries[summary_id] = summary
            generated.append(self._to_summary(summary))
        return generated

    def _get_summary(
        self, summary_id: str
    ) -> MonthlyAttendanceSummaryRepositoryRecord:
        summary = self._summaries.get(summary_id)
        if summary is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Monthly attendance summary '{summary_id}' not found.",
            )
        return summary

    def _ensure_employee_exists(self, employee_id: str) -> None:
        if employee_id not in {"dev-employee-001", "dev-employee-002"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee '{employee_id}' is not available in this bootstrap.",
            )

    def _ensure_unique_employee_year_month(
        self, employee_id: str, year_month: str
    ) -> None:
        for summary in self._summaries.values():
            if summary.employee_id == employee_id and summary.year_month == year_month:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Monthly summary for employee '{employee_id}' on "
                        f"'{year_month}' already exists."
                    ),
                )

    @staticmethod
    def _to_summary(
        summary: MonthlyAttendanceSummaryRepositoryRecord,
    ) -> MonthlyAttendanceSummary:
        return MonthlyAttendanceSummary.model_validate(summary.model_dump())


monthly_attendance_service = MonthlyAttendanceSummaryService()
