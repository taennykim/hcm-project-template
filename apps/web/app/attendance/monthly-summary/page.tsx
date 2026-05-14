"use client";

import { useMemo, useState } from "react";

import { AppLayout } from "../../../components/layout/app-layout";
import { PageContainer } from "../../../components/layout/page-container";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

type MonthlyAttendanceSummaryStatus =
  | "draft"
  | "summarized"
  | "reviewing"
  | "confirmed"
  | "error";

type MonthlyAttendanceSummary = {
  id: string;
  tenant_id: string;
  company_id: string;
  employee_id: string;
  year_month: string;
  total_work_minutes: number;
  overtime_minutes: number;
  late_minutes: number;
  late_count: number;
  absent_count: number;
  leave_count: number;
  workday_count: number;
  status: MonthlyAttendanceSummaryStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type MonthlyAttendanceSummaryListResponse = {
  items: MonthlyAttendanceSummary[];
};

type Employee = {
  id: string;
  name: string;
  employee_no: string;
};

const initialSummaries: MonthlyAttendanceSummary[] = [
  {
    id: "monthly-summary-001",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    employee_id: "dev-employee-001",
    year_month: "2026-04",
    total_work_minutes: 9600,
    overtime_minutes: 180,
    late_minutes: 10,
    late_count: 1,
    absent_count: 0,
    leave_count: 1,
    workday_count: 20,
    status: "confirmed",
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
  {
    id: "monthly-summary-002",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    employee_id: "dev-employee-002",
    year_month: "2026-04",
    total_work_minutes: 9480,
    overtime_minutes: 60,
    late_minutes: 25,
    late_count: 2,
    absent_count: 1,
    leave_count: 0,
    workday_count: 20,
    status: "reviewing",
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
];

const seedEmployees: Employee[] = [
  { id: "dev-employee-001", name: "김관리", employee_no: "E001" },
  { id: "dev-employee-002", name: "이운영", employee_no: "E002" },
];

const statusLabelMap: Record<MonthlyAttendanceSummaryStatus, string> = {
  draft: "초안",
  summarized: "집계완료",
  reviewing: "검토중",
  confirmed: "확정",
  error: "오류",
};

const statusVariantMap: Record<
  MonthlyAttendanceSummaryStatus,
  "real" | "real-lite" | "mock" | "coming-soon"
> = {
  draft: "real-lite",
  summarized: "real",
  reviewing: "mock",
  confirmed: "real",
  error: "coming-soon",
};

function formatMinutes(value: number): string {
  return value.toLocaleString("ko-KR");
}

export default function MonthlyAttendanceSummaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-05");
  const [summaries, setSummaries] =
    useState<MonthlyAttendanceSummary[]>(initialSummaries);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(
    "월 근태 집계 결과를 확인하고 집계 생성을 준비할 수 있습니다."
  );

  const visibleSummaries = useMemo(
    () => summaries.filter((item) => item.year_month === selectedMonth),
    [selectedMonth, summaries]
  );

  const summary = useMemo(() => {
    return {
      employeeCount: visibleSummaries.length,
      totalWorkMinutes: visibleSummaries.reduce(
        (accumulator, item) => accumulator + item.total_work_minutes,
        0
      ),
      lateCount: visibleSummaries.reduce(
        (accumulator, item) => accumulator + item.late_count,
        0
      ),
      absentCount: visibleSummaries.reduce(
        (accumulator, item) => accumulator + item.absent_count,
        0
      ),
    };
  }, [visibleSummaries]);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/monthly-attendance-summaries/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: "dev-tenant",
          company_id: "dev-company",
          year_month: selectedMonth,
        }),
      });

      if (!response.ok) {
        const nextMessage =
          response.status === 409
            ? "해당 기준월 집계가 이미 생성되어 있습니다."
            : "월 근태 집계 생성에 실패했습니다.";
        setMessage(nextMessage);
        return;
      }

      const created =
        (await response.json()) as MonthlyAttendanceSummaryListResponse;
      setSummaries((current) => {
        const filtered = current.filter((item) => item.year_month !== selectedMonth);
        return [...filtered, ...created.items].sort((left, right) => {
          if (left.year_month !== right.year_month) {
            return left.year_month.localeCompare(right.year_month);
          }
          return left.employee_id.localeCompare(right.employee_id);
        });
      });
      setMessage("월 근태 집계 생성이 완료되었습니다.");
    } catch {
      setMessage("월 근태 집계 생성 요청을 확인하지 못했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <AppLayout>
      <PageContainer
        eyebrow="Attendance Summary"
        title="월 근태 집계"
        description="직원별 월 근태 집계 결과를 확인하고 급여 생성 전 기준 데이터를 준비합니다."
        actions={
          <>
            <Button variant="secondary" disabled>
              집계 기준 확인
            </Button>
            <Button onClick={() => void handleGenerate()} disabled={isGenerating}>
              {isGenerating ? "집계 생성 중..." : "집계 생성"}
            </Button>
          </>
        }
      >

        <section className="dashboard-grid">
          <Card>
            <CardHeader>
              <CardDescription>집계 대상 직원</CardDescription>
              <CardTitle>{summary.employeeCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>총 근무분</CardDescription>
              <CardTitle>{formatMinutes(summary.totalWorkMinutes)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>지각 건수</CardDescription>
              <CardTitle>{summary.lateCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>결근 건수</CardDescription>
              <CardTitle>{summary.absentCount}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="content-grid content-grid-single">
          <Card>
            <CardHeader>
              <CardTitle>월 근태 집계 결과</CardTitle>
              <CardDescription>
                AttendanceRecord를 월 단위로 합산한 결과입니다. MVP 단계에서는
                in-memory 집계를 유지하며 급여 계산은 후속 작업으로 분리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="toolbar-row">
                <label className="field-inline">
                  <span>기준월</span>
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                  />
                </label>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>기준월</TableHead>
                    <TableHead>직원</TableHead>
                    <TableHead>총 근무분</TableHead>
                    <TableHead>연장분</TableHead>
                    <TableHead>지각분</TableHead>
                    <TableHead>지각</TableHead>
                    <TableHead>결근</TableHead>
                    <TableHead>휴가</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleSummaries.map((item) => {
                    const employee = seedEmployees.find(
                      (candidate) => candidate.id === item.employee_id
                    );
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.year_month}</TableCell>
                        <TableCell>
                          {employee
                            ? `${employee.name} (${employee.employee_no})`
                            : item.employee_id}
                        </TableCell>
                        <TableCell>{formatMinutes(item.total_work_minutes)}</TableCell>
                        <TableCell>{formatMinutes(item.overtime_minutes)}</TableCell>
                        <TableCell>{formatMinutes(item.late_minutes)}</TableCell>
                        <TableCell>{item.late_count}</TableCell>
                        <TableCell>{item.absent_count}</TableCell>
                        <TableCell>{item.leave_count}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariantMap[item.status]}>
                            {statusLabelMap[item.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="secondary" disabled>
                            상세 예정
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <p className="muted-text table-footnote">{message}</p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </AppLayout>
  );
}
