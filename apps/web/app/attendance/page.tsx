"use client";

import { useEffect, useMemo, useState } from "react";

import { AppLayout } from "../../components/layout/app-layout";
import { PageContainer } from "../../components/layout/page-container";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type AttendanceStatus =
  | "not_entered"
  | "present"
  | "late"
  | "absent"
  | "leave"
  | "early_leave";

type AttendanceType =
  | "workday"
  | "holiday"
  | "paid_leave"
  | "unpaid_leave"
  | "business_trip";

type AttendanceRecord = {
  id: string;
  tenant_id: string;
  company_id: string;
  employee_id: string;
  work_date: string;
  clock_in_at: string | null;
  clock_out_at: string | null;
  attendance_type: AttendanceType;
  status: AttendanceStatus;
  work_minutes: number;
  overtime_minutes: number;
  late_minutes: number;
  note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type AttendanceRecordListResponse = {
  items: AttendanceRecord[];
};

type Employee = {
  id: string;
  name: string;
  employee_no: string;
  department: string | null;
};

type EmployeeListResponse = {
  items: Employee[];
};

type AttendanceDraft = {
  tenant_id: string;
  company_id: string;
  employee_id: string;
  work_date: string;
  clock_in_at: string;
  clock_out_at: string;
  attendance_type: AttendanceType;
  status: AttendanceStatus;
  work_minutes: string;
  overtime_minutes: string;
  late_minutes: string;
  note: string;
};

const seedRecords: AttendanceRecord[] = [
  {
    id: "attendance-001",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    employee_id: "dev-employee-001",
    work_date: "2026-05-14",
    clock_in_at: "2026-05-14T09:02:00+00:00",
    clock_out_at: "2026-05-14T18:03:00+00:00",
    attendance_type: "workday",
    status: "present",
    work_minutes: 481,
    overtime_minutes: 0,
    late_minutes: 0,
    note: "정상 출근",
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
  {
    id: "attendance-002",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    employee_id: "dev-employee-002",
    work_date: "2026-05-14",
    clock_in_at: "2026-05-14T09:18:00+00:00",
    clock_out_at: "2026-05-14T18:01:00+00:00",
    attendance_type: "workday",
    status: "late",
    work_minutes: 463,
    overtime_minutes: 0,
    late_minutes: 8,
    note: "지각 허용 시간 초과",
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
  {
    id: "attendance-003",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    employee_id: "dev-employee-001",
    work_date: "2026-05-15",
    clock_in_at: null,
    clock_out_at: null,
    attendance_type: "paid_leave",
    status: "leave",
    work_minutes: 0,
    overtime_minutes: 0,
    late_minutes: 0,
    note: "연차 사용",
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
];

const seedEmployees: Employee[] = [
  {
    id: "dev-employee-001",
    name: "김관리",
    employee_no: "E001",
    department: "인사팀",
  },
  {
    id: "dev-employee-002",
    name: "이운영",
    employee_no: "E002",
    department: "운영팀",
  },
];

const emptyDraft: AttendanceDraft = {
  tenant_id: "dev-tenant",
  company_id: "dev-company",
  employee_id: "dev-employee-001",
  work_date: "2026-05-14",
  clock_in_at: "2026-05-14T09:00",
  clock_out_at: "2026-05-14T18:00",
  attendance_type: "workday",
  status: "present",
  work_minutes: "480",
  overtime_minutes: "0",
  late_minutes: "0",
  note: "",
};

const badgeVariantMap = {
  not_entered: "coming-soon",
  present: "real",
  late: "mock",
  absent: "coming-soon",
  leave: "real-lite",
  early_leave: "mock",
} as const;

const statusLabelMap: Record<AttendanceStatus, string> = {
  not_entered: "미입력",
  present: "출근",
  late: "지각",
  absent: "결근",
  leave: "휴가",
  early_leave: "조퇴",
};

const attendanceTypeLabelMap: Record<AttendanceType, string> = {
  workday: "근무일",
  holiday: "휴일",
  paid_leave: "유급휴가",
  unpaid_leave: "무급휴가",
  business_trip: "출장",
};

function toDatetimeLocalValue(value: string): string {
  return value ? value.slice(0, 16) : "";
}

function formatTime(value: string | null): string {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(seedRecords);
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [selectedDate, setSelectedDate] = useState("2026-05-14");
  const [draft, setDraft] = useState<AttendanceDraft>(emptyDraft);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadAttendance() {
    setIsLoading(true);
    try {
      const [attendanceResponse, employeeResponse] = await Promise.all([
        fetch("/api/attendance-records", { cache: "no-store" }),
        fetch("/api/employees", { cache: "no-store" }),
      ]);

      if (!attendanceResponse.ok) {
        throw new Error("근태 목록을 불러오지 못했습니다.");
      }
      if (!employeeResponse.ok) {
        throw new Error("직원 목록을 불러오지 못했습니다.");
      }

      const attendanceData =
        (await attendanceResponse.json()) as AttendanceRecordListResponse;
      const employeeData = (await employeeResponse.json()) as EmployeeListResponse;
      setRecords(attendanceData.items);
      setEmployees(employeeData.items);
      setErrorMessage(null);
    } catch (error) {
      setRecords(seedRecords);
      setEmployees(seedEmployees);
      setErrorMessage(
        error instanceof Error ? error.message : "근태 데이터를 확인하지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAttendance();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => record.work_date === selectedDate);
  }, [records, selectedDate]);

  const summary = useMemo(() => {
    return {
      total: filteredRecords.length,
      notEntered: filteredRecords.filter((record) => record.status === "not_entered")
        .length,
      late: filteredRecords.filter((record) => record.status === "late").length,
      leave: filteredRecords.filter((record) => record.status === "leave").length,
    };
  }, [filteredRecords]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...draft,
        clock_in_at: draft.clock_in_at || null,
        clock_out_at: draft.clock_out_at || null,
        work_minutes: Number(draft.work_minutes),
        overtime_minutes: Number(draft.overtime_minutes),
        late_minutes: Number(draft.late_minutes),
        note: draft.note || null,
      };

      const response = await fetch("/api/attendance-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setErrorMessage("근태 등록에 실패했습니다. 동일 직원/일자 중복 여부를 확인하세요.");
        return;
      }

      const created = (await response.json()) as AttendanceRecord;
      setRecords((current) =>
        [...current, created].sort((left, right) => {
          if (left.work_date !== right.work_date) {
            return left.work_date.localeCompare(right.work_date);
          }
          return left.employee_id.localeCompare(right.employee_id);
        })
      );
      setDraft((current) => ({ ...emptyDraft, work_date: current.work_date }));
      setSelectedDate(created.work_date);
      setErrorMessage(null);
      setIsPanelOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange<K extends keyof AttendanceDraft>(
    field: K,
    value: AttendanceDraft[K]
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function employeeLabel(employeeId: string): string {
    const employee = employees.find((item) => item.id === employeeId);
    return employee ? `${employee.name} (${employee.employee_no})` : employeeId;
  }

  return (
    <AppLayout>
      <PageContainer
        eyebrow="Attendance"
        title="근태관리"
        description="직원별 일자별 근태를 입력하고 확인합니다. MVP 단계에서는 in-memory persistence를 유지하며, 월 집계와 급여 계산은 후속 작업으로 분리합니다."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => void loadAttendance()}
              disabled={isLoading}
            >
              목록 새로고침
            </Button>
            <Button onClick={() => setIsPanelOpen(true)}>근태 입력</Button>
          </>
        }
      >
        <section className="dashboard-grid">
          <Card>
            <CardHeader>
              <CardDescription>오늘 근태</CardDescription>
              <CardTitle>{summary.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>미입력</CardDescription>
              <CardTitle>{summary.notEntered}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>지각</CardDescription>
              <CardTitle>{summary.late}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>휴가</CardDescription>
              <CardTitle>{summary.leave}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="content-grid content-grid-single">
          <Card>
            <CardHeader>
              <CardTitle>근태 입력 현황</CardTitle>
              <CardDescription>
                직원별 일자 근태 원천 데이터를 관리합니다. 날짜 기준으로 목록을 확인하고
                간단한 입력 패널에서 신규 근태를 등록할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="toolbar-row">
                <label className="field-inline">
                  <span>조회 날짜</span>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </label>
              </div>

              {errorMessage ? <p className="inline-alert">{errorMessage}</p> : null}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>일자</TableHead>
                    <TableHead>직원</TableHead>
                    <TableHead>출근</TableHead>
                    <TableHead>퇴근</TableHead>
                    <TableHead>근태유형</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>근무분</TableHead>
                    <TableHead>지각분</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.work_date}</TableCell>
                      <TableCell>{employeeLabel(record.employee_id)}</TableCell>
                      <TableCell>{formatTime(record.clock_in_at)}</TableCell>
                      <TableCell>{formatTime(record.clock_out_at)}</TableCell>
                      <TableCell>{attendanceTypeLabelMap[record.attendance_type]}</TableCell>
                      <TableCell>
                        <Badge variant={badgeVariantMap[record.status]}>
                          {statusLabelMap[record.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.work_minutes}</TableCell>
                      <TableCell>{record.late_minutes}</TableCell>
                      <TableCell>
                        <Button variant="secondary" disabled>
                          수정 예정
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {!isLoading && filteredRecords.length === 0 ? (
                <p className="muted-text table-footnote">
                  선택한 날짜에 등록된 근태가 없습니다.
                </p>
              ) : null}
              {isLoading ? (
                <p className="muted-text table-footnote">
                  근태 데이터를 확인하는 중입니다.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <aside className={`slide-panel ${isPanelOpen ? "is-open" : ""}`.trim()}>
          <div className="slide-panel-header">
            <div>
              <p className="page-eyebrow">Attendance Create</p>
              <h2 className="slide-panel-title">근태 입력</h2>
            </div>
            <Button type="button" variant="secondary" onClick={() => setIsPanelOpen(false)}>
              닫기
            </Button>
          </div>
          <form className="employee-form" onSubmit={handleSubmit}>
            <label>
              <span>직원</span>
              <select
                className="ui-input"
                value={draft.employee_id}
                onChange={(event) => handleChange("employee_id", event.target.value)}
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.employee_no})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>근무일자</span>
              <Input
                required
                type="date"
                value={draft.work_date}
                onChange={(event) => handleChange("work_date", event.target.value)}
              />
            </label>
            <label>
              <span>출근</span>
              <Input
                type="datetime-local"
                value={toDatetimeLocalValue(draft.clock_in_at)}
                onChange={(event) => handleChange("clock_in_at", event.target.value)}
              />
            </label>
            <label>
              <span>퇴근</span>
              <Input
                type="datetime-local"
                value={toDatetimeLocalValue(draft.clock_out_at)}
                onChange={(event) => handleChange("clock_out_at", event.target.value)}
              />
            </label>
            <label>
              <span>근태유형</span>
              <select
                className="ui-input"
                value={draft.attendance_type}
                onChange={(event) =>
                  handleChange("attendance_type", event.target.value as AttendanceType)
                }
              >
                <option value="workday">근무일</option>
                <option value="holiday">휴일</option>
                <option value="paid_leave">유급휴가</option>
                <option value="unpaid_leave">무급휴가</option>
                <option value="business_trip">출장</option>
              </select>
            </label>
            <label>
              <span>상태</span>
              <select
                className="ui-input"
                value={draft.status}
                onChange={(event) =>
                  handleChange("status", event.target.value as AttendanceStatus)
                }
              >
                <option value="present">출근</option>
                <option value="late">지각</option>
                <option value="absent">결근</option>
                <option value="leave">휴가</option>
                <option value="not_entered">미입력</option>
                <option value="early_leave">조퇴</option>
              </select>
            </label>
            <label>
              <span>근무분</span>
              <Input
                min={0}
                type="number"
                value={draft.work_minutes}
                onChange={(event) => handleChange("work_minutes", event.target.value)}
              />
            </label>
            <label>
              <span>연장분</span>
              <Input
                min={0}
                type="number"
                value={draft.overtime_minutes}
                onChange={(event) => handleChange("overtime_minutes", event.target.value)}
              />
            </label>
            <label>
              <span>지각분</span>
              <Input
                min={0}
                type="number"
                value={draft.late_minutes}
                onChange={(event) => handleChange("late_minutes", event.target.value)}
              />
            </label>
            <label>
              <span>메모</span>
              <Input
                value={draft.note}
                onChange={(event) => handleChange("note", event.target.value)}
              />
            </label>
            <div className="slide-panel-actions">
              <Button type="button" variant="secondary" onClick={() => setIsPanelOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "등록 중" : "등록"}
              </Button>
            </div>
          </form>
        </aside>
      </PageContainer>
    </AppLayout>
  );
}
