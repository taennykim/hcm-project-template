from fastapi import APIRouter, status

from app.domains.attendance.schemas import (
    AttendanceRecord,
    AttendanceRecordCreate,
    AttendanceRecordListResponse,
    AttendanceRecordUpdate,
)
from app.domains.attendance.service import attendance_service


router = APIRouter(tags=["attendance"])


@router.get("/attendance-records", response_model=AttendanceRecordListResponse)
def list_attendance_records() -> AttendanceRecordListResponse:
    return AttendanceRecordListResponse(items=attendance_service.list_records())


@router.post(
    "/attendance-records",
    response_model=AttendanceRecord,
    status_code=status.HTTP_201_CREATED,
)
def create_attendance_record(payload: AttendanceRecordCreate) -> AttendanceRecord:
    return attendance_service.create_record(payload)


@router.get("/attendance-records/{attendance_record_id}", response_model=AttendanceRecord)
def get_attendance_record(attendance_record_id: str) -> AttendanceRecord:
    return attendance_service.get_record(attendance_record_id)


@router.patch("/attendance-records/{attendance_record_id}", response_model=AttendanceRecord)
def update_attendance_record(
    attendance_record_id: str, payload: AttendanceRecordUpdate
) -> AttendanceRecord:
    return attendance_service.update_record(attendance_record_id, payload)


@router.get(
    "/employees/{employee_id}/attendance-records",
    response_model=AttendanceRecordListResponse,
)
def list_employee_attendance_records(employee_id: str) -> AttendanceRecordListResponse:
    return AttendanceRecordListResponse(
        items=attendance_service.list_records_by_employee(employee_id)
    )
