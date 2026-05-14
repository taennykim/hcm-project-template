from fastapi import APIRouter, Query, status

from app.domains.monthly_attendance.schemas import (
    MonthlyAttendanceSummary,
    MonthlyAttendanceSummaryGenerateRequest,
    MonthlyAttendanceSummaryListResponse,
)
from app.domains.monthly_attendance.service import monthly_attendance_service


router = APIRouter(tags=["monthly-attendance"])


@router.get(
    "/monthly-attendance-summaries",
    response_model=MonthlyAttendanceSummaryListResponse,
)
def list_monthly_attendance_summaries(
    year_month: str | None = Query(default=None),
) -> MonthlyAttendanceSummaryListResponse:
    return MonthlyAttendanceSummaryListResponse(
        items=monthly_attendance_service.list_summaries(year_month=year_month)
    )


@router.post(
    "/monthly-attendance-summaries/generate",
    response_model=MonthlyAttendanceSummaryListResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_monthly_attendance_summaries(
    payload: MonthlyAttendanceSummaryGenerateRequest,
) -> MonthlyAttendanceSummaryListResponse:
    return MonthlyAttendanceSummaryListResponse(
        items=monthly_attendance_service.generate_summaries(payload)
    )


@router.get(
    "/monthly-attendance-summaries/{summary_id}",
    response_model=MonthlyAttendanceSummary,
)
def get_monthly_attendance_summary(summary_id: str) -> MonthlyAttendanceSummary:
    return monthly_attendance_service.get_summary(summary_id)


@router.get(
    "/employees/{employee_id}/monthly-attendance-summaries",
    response_model=MonthlyAttendanceSummaryListResponse,
)
def list_employee_monthly_attendance_summaries(
    employee_id: str,
) -> MonthlyAttendanceSummaryListResponse:
    return MonthlyAttendanceSummaryListResponse(
        items=monthly_attendance_service.list_summaries_by_employee(employee_id)
    )
