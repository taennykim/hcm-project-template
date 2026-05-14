"use client";

import { useMemo, useState } from "react";

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

type PayrollRunStatus =
  | "draft"
  | "calculated"
  | "reviewed"
  | "confirmed"
  | "closed"
  | "error";

type PayrollRun = {
  id: string;
  tenant_id: string;
  company_id: string;
  year_month: string;
  status: PayrollRunStatus;
  total_employees: number;
  total_gross_pay: number;
  total_deductions: number;
  total_net_pay: number;
  executed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type PayrollItem = {
  id: string;
  tenant_id: string;
  company_id: string;
  payroll_run_id: string;
  employee_id: string;
  year_month: string;
  base_pay: number;
  overtime_pay: number;
  allowance_total: number;
  deduction_total: number;
  gross_pay: number;
  net_pay: number;
  created_at: string;
  updated_at: string;
};

type PayrollRunListResponse = { items: PayrollRun[] };
type PayrollItemListResponse = { items: PayrollItem[] };

type Employee = {
  id: string;
  name: string;
  employee_no: string;
};

const initialRuns: PayrollRun[] = [
  {
    id: "payroll-run-001",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    year_month: "2026-04",
    status: "reviewed",
    total_employees: 2,
    total_gross_pay: 8200000,
    total_deductions: 0,
    total_net_pay: 8200000,
    executed_at: "2026-05-14T00:00:00+00:00",
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
];

const initialItems: PayrollItem[] = [
  {
    id: "payroll-item-001",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    payroll_run_id: "payroll-run-001",
    employee_id: "dev-employee-001",
    year_month: "2026-04",
    base_pay: 3000000,
    overtime_pay: 1800000,
    allowance_total: 0,
    deduction_total: 0,
    gross_pay: 4800000,
    net_pay: 4800000,
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
  },
  {
    id: "payroll-item-002",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    payroll_run_id: "payroll-run-001",
    employee_id: "dev-employee-002",
    year_month: "2026-04",
    base_pay: 2800000,
    overtime_pay: 600000,
    allowance_total: 0,
    deduction_total: 0,
    gross_pay: 3400000,
    net_pay: 3400000,
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
  },
];

const seedEmployees: Employee[] = [
  { id: "dev-employee-001", name: "김관리", employee_no: "E001" },
  { id: "dev-employee-002", name: "이운영", employee_no: "E002" },
];

const statusLabelMap: Record<PayrollRunStatus, string> = {
  draft: "초안",
  calculated: "계산완료",
  reviewed: "검토완료",
  confirmed: "확정",
  closed: "마감",
  error: "오류",
};

const statusVariantMap: Record<
  PayrollRunStatus,
  "real" | "real-lite" | "mock" | "coming-soon"
> = {
  draft: "real-lite",
  calculated: "real",
  reviewed: "mock",
  confirmed: "real",
  closed: "coming-soon",
  error: "coming-soon",
};

function formatAmount(value: number): string {
  return value.toLocaleString("ko-KR");
}

function formatExecutedAt(value: string | null): string {
  if (value === null) {
    return "-";
  }
  return new Date(value).toLocaleString("ko-KR", { timeZone: "UTC" });
}

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-05");
  const [runs, setRuns] = useState<PayrollRun[]>(initialRuns);
  const [items, setItems] = useState<PayrollItem[]>(initialItems);
  const [selectedPayrollRunId, setSelectedPayrollRunId] = useState<string | null>(
    initialRuns[0]?.id ?? null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(
    "월 근태 집계 기반 급여 실행 결과를 확인할 수 있습니다."
  );

  const visibleRuns = useMemo(
    () => runs.filter((run) => run.year_month === selectedMonth),
    [runs, selectedMonth]
  );

  const selectedPayrollRun = useMemo(
    () =>
      visibleRuns.find((run) => run.id === selectedPayrollRunId) ??
      visibleRuns[0] ??
      null,
    [selectedPayrollRunId, visibleRuns]
  );

  const visibleItems = useMemo(() => {
    if (selectedPayrollRun === null) {
      return [];
    }
    return items.filter((item) => item.payroll_run_id === selectedPayrollRun.id);
  }, [items, selectedPayrollRun]);

  const summary = useMemo(() => {
    return {
      payrollRuns: visibleRuns.length,
      totalEmployees: visibleRuns.reduce(
        (accumulator, run) => accumulator + run.total_employees,
        0
      ),
      totalGrossPay: visibleRuns.reduce(
        (accumulator, run) => accumulator + run.total_gross_pay,
        0
      ),
      totalNetPay: visibleRuns.reduce(
        (accumulator, run) => accumulator + run.total_net_pay,
        0
      ),
    };
  }, [visibleRuns]);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/payroll-runs/generate", {
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
            ? "해당 기준월 급여 실행이 이미 생성되어 있습니다."
            : "급여 생성 실행에 실패했습니다.";
        setMessage(nextMessage);
        return;
      }

      const createdRun = (await response.json()) as PayrollRun;
      const itemResponse = await fetch(`/api/payroll-runs/${createdRun.id}/items`);
      const createdItems = itemResponse.ok
        ? ((await itemResponse.json()) as PayrollItemListResponse).items
        : [];

      setRuns((current) =>
        [...current, createdRun].sort((left, right) => {
          if (left.year_month !== right.year_month) {
            return left.year_month.localeCompare(right.year_month);
          }
          return left.id.localeCompare(right.id);
        })
      );
      setItems((current) => [...current, ...createdItems]);
      setSelectedPayrollRunId(createdRun.id);
      setMessage("급여 생성 실행이 완료되었습니다.");
    } catch {
      setMessage("급여 실행 요청을 확인하지 못했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <AppLayout>
      <PageContainer
        eyebrow="Payroll"
        title="급여관리"
        description="월 근태 집계 기반으로 급여 생성 실행 결과를 확인합니다."
        actions={
          <>
            <Button variant="secondary" disabled>
              실행 기준 확인
            </Button>
            <Button onClick={() => void handleGenerate()} disabled={isGenerating}>
              {isGenerating ? "급여 생성 중..." : "급여 생성"}
            </Button>
          </>
        }
      >
        <section className="dashboard-grid">
          <Card>
            <CardHeader>
              <CardDescription>급여 실행 건수</CardDescription>
              <CardTitle>{summary.payrollRuns}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>대상 직원</CardDescription>
              <CardTitle>{summary.totalEmployees}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>총 지급액</CardDescription>
              <CardTitle>{formatAmount(summary.totalGrossPay)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>총 실지급액</CardDescription>
              <CardTitle>{formatAmount(summary.totalNetPay)}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="content-grid">
          <Card>
            <CardHeader>
              <CardTitle>급여 실행 목록</CardTitle>
              <CardDescription>
                월 근태 집계 결과를 기준으로 생성된 급여 실행 단위입니다.
                MVP 단계에서는 deterministic in-memory 계산을 유지합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="toolbar-row">
                <label className="field-inline">
                  <span>기준월</span>
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(event) => {
                      setSelectedMonth(event.target.value);
                      setSelectedPayrollRunId(null);
                    }}
                  />
                </label>
              </div>
              <div className="ui-table-wrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>기준월</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>대상 직원</TableHead>
                      <TableHead>총 지급액</TableHead>
                      <TableHead>총 공제액</TableHead>
                      <TableHead>실지급액</TableHead>
                      <TableHead>실행일</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell>{run.year_month}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariantMap[run.status]}>
                            {statusLabelMap[run.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{run.total_employees}</TableCell>
                        <TableCell>{formatAmount(run.total_gross_pay)}</TableCell>
                        <TableCell>{formatAmount(run.total_deductions)}</TableCell>
                        <TableCell>{formatAmount(run.total_net_pay)}</TableCell>
                        <TableCell>{formatExecutedAt(run.executed_at)}</TableCell>
                        <TableCell>
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedPayrollRunId(run.id)}
                          >
                            상세 보기
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>급여 항목 결과</CardTitle>
              <CardDescription>
                선택한 Payroll Run의 직원별 급여 결과입니다. 급여명세서 발행은
                HCM-010 이후 단계로 분리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ui-table-wrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>직원</TableHead>
                      <TableHead>기본급</TableHead>
                      <TableHead>연장수당</TableHead>
                      <TableHead>수당합계</TableHead>
                      <TableHead>공제합계</TableHead>
                      <TableHead>총지급</TableHead>
                      <TableHead>실지급</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleItems.map((item) => {
                      const employee = seedEmployees.find(
                        (candidate) => candidate.id === item.employee_id
                      );
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {employee?.name ?? item.employee_id}
                            {employee ? ` (${employee.employee_no})` : ""}
                          </TableCell>
                          <TableCell>{formatAmount(item.base_pay)}</TableCell>
                          <TableCell>{formatAmount(item.overtime_pay)}</TableCell>
                          <TableCell>{formatAmount(item.allowance_total)}</TableCell>
                          <TableCell>{formatAmount(item.deduction_total)}</TableCell>
                          <TableCell>{formatAmount(item.gross_pay)}</TableCell>
                          <TableCell>{formatAmount(item.net_pay)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <p className="muted-text table-footnote">{message}</p>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </AppLayout>
  );
}
