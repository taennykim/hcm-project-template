from __future__ import annotations

from datetime import date, datetime, timezone

from fastapi import HTTPException, status

from app.domains.attendance.schemas import (
    AttendanceRecord,
    AttendanceRecordCreate,
    AttendanceRecordRepositoryRecord,
    AttendanceRecordUpdate,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


class AttendanceService:
    def __init__(self) -> None:
        timestamp = _now()
        self._records: dict[str, AttendanceRecordRepositoryRecord] = {
            "attendance-001": AttendanceRecordRepositoryRecord(
                id="attendance-001",
                tenant_id="dev-tenant",
                company_id="dev-company",
                employee_id="dev-employee-001",
                work_date=date(2026, 5, 14),
                clock_in_at=datetime(2026, 5, 14, 9, 2, tzinfo=timezone.utc),
                clock_out_at=datetime(2026, 5, 14, 18, 3, tzinfo=timezone.utc),
                attendance_type="workday",
                status="present",
                work_minutes=481,
                overtime_minutes=0,
                late_minutes=0,
                note="정상 출근",
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
            "attendance-002": AttendanceRecordRepositoryRecord(
                id="attendance-002",
                tenant_id="dev-tenant",
                company_id="dev-company",
                employee_id="dev-employee-002",
                work_date=date(2026, 5, 14),
                clock_in_at=datetime(2026, 5, 14, 9, 18, tzinfo=timezone.utc),
                clock_out_at=datetime(2026, 5, 14, 18, 1, tzinfo=timezone.utc),
                attendance_type="workday",
                status="late",
                work_minutes=463,
                overtime_minutes=0,
                late_minutes=8,
                note="지각 허용 시간 초과",
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
            "attendance-003": AttendanceRecordRepositoryRecord(
                id="attendance-003",
                tenant_id="dev-tenant",
                company_id="dev-company",
                employee_id="dev-employee-001",
                work_date=date(2026, 5, 15),
                clock_in_at=None,
                clock_out_at=None,
                attendance_type="paid_leave",
                status="leave",
                work_minutes=0,
                overtime_minutes=0,
                late_minutes=0,
                note="연차 사용",
                created_at=timestamp,
                updated_at=timestamp,
                deleted_at=None,
            ),
        }

    def list_records(self) -> list[AttendanceRecord]:
        records = sorted(
            self._records.values(),
            key=lambda record: (record.work_date, record.employee_id, record.id),
        )
        return [self._to_attendance_record(record) for record in records]

    def list_records_by_employee(self, employee_id: str) -> list[AttendanceRecord]:
        self._ensure_employee_exists(employee_id)
        records = [
            record
            for record in self._records.values()
            if record.employee_id == employee_id
        ]
        records.sort(key=lambda record: (record.work_date, record.id))
        return [self._to_attendance_record(record) for record in records]

    def create_record(self, payload: AttendanceRecordCreate) -> AttendanceRecord:
        if payload.company_id != "dev-company" or payload.tenant_id != "dev-tenant":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This bootstrap supports only dev-tenant/dev-company.",
            )
        self._ensure_employee_exists(payload.employee_id)
        self._ensure_unique_employee_work_date(payload.employee_id, payload.work_date)

        record_id = payload.id or f"attendance-{len(self._records) + 1:03d}"
        if record_id in self._records:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Attendance record '{record_id}' already exists.",
            )

        timestamp = _now()
        record = AttendanceRecordRepositoryRecord(
            id=record_id,
            tenant_id=payload.tenant_id,
            company_id=payload.company_id,
            employee_id=payload.employee_id,
            work_date=payload.work_date,
            clock_in_at=payload.clock_in_at,
            clock_out_at=payload.clock_out_at,
            attendance_type=payload.attendance_type,
            status=payload.status,
            work_minutes=payload.work_minutes,
            overtime_minutes=payload.overtime_minutes,
            late_minutes=payload.late_minutes,
            note=payload.note,
            created_at=timestamp,
            updated_at=timestamp,
            deleted_at=None,
        )
        self._records[record_id] = record
        return self._to_attendance_record(record)

    def get_record(self, attendance_record_id: str) -> AttendanceRecord:
        return self._to_attendance_record(self._get_record(attendance_record_id))

    def update_record(
        self, attendance_record_id: str, payload: AttendanceRecordUpdate
    ) -> AttendanceRecord:
        record = self._get_record(attendance_record_id)
        for field_name, value in payload.model_dump(exclude_unset=True).items():
            setattr(record, field_name, value)
        record.updated_at = _now()
        self._records[attendance_record_id] = record
        return self._to_attendance_record(record)

    def _get_record(
        self, attendance_record_id: str
    ) -> AttendanceRecordRepositoryRecord:
        record = self._records.get(attendance_record_id)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Attendance record '{attendance_record_id}' not found.",
            )
        return record

    def _ensure_employee_exists(self, employee_id: str) -> None:
        if employee_id not in {"dev-employee-001", "dev-employee-002"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee '{employee_id}' is not available in this bootstrap.",
            )

    def _ensure_unique_employee_work_date(
        self,
        employee_id: str,
        work_date: date,
        exclude_record_id: str | None = None,
    ) -> None:
        for record in self._records.values():
            if exclude_record_id is not None and record.id == exclude_record_id:
                continue
            if record.employee_id == employee_id and record.work_date == work_date:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"Attendance for employee '{employee_id}' on "
                        f"'{work_date.isoformat()}' already exists."
                    ),
                )

    @staticmethod
    def _to_attendance_record(
        record: AttendanceRecordRepositoryRecord,
    ) -> AttendanceRecord:
        return AttendanceRecord.model_validate(record.model_dump())


attendance_service = AttendanceService()
