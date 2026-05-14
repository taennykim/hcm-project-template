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

type PayslipStatus = "draft" | "issued" | "canceled";

type Payslip = {
  id: string;
  tenant_id: string;
  company_id: string;
  payroll_run_id: string;
  employee_id: string;
  year_month: string;
  status: PayslipStatus;
  issued_at: string | null;
  base_pay: number;
  overtime_pay: number;
  allowance_total: number;
  deduction_total: number;
  gross_pay: number;
  net_pay: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type PayslipListResponse = { items: Payslip[] };

type EmployeeSeed = {
  id: string;
  employee_no: string;
  name: string;
};

const seedEmployees: EmployeeSeed[] = [
  { id: "dev-employee-001", employee_no: "E001", name: "김관리" },
  { id: "dev-employee-002", employee_no: "E002", name: "이운영" },
];

const seedPayslips: Payslip[] = [
  {
    id: "payslip-001",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    payroll_run_id: "payroll-run-001",
    employee_id: "dev-employee-001",
    year_month: "2026-04",
    status: "issued",
    issued_at: "2026-05-14T00:00:00+00:00",
    base_pay: 3000000,
    overtime_pay: 1800000,
    allowance_total: 0,
    deduction_total: 0,
    gross_pay: 4800000,
    net_pay: 4800000,
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
  {
    id: "payslip-002",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    payroll_run_id: "payroll-run-001",
    employee_id: "dev-employee-002",
    year_month: "2026-04",
    status: "issued",
    issued_at: "2026-05-14T00:00:00+00:00",
    base_pay: 2800000,
    overtime_pay: 600000,
    allowance_total: 0,
    deduction_total: 0,
    gross_pay: 3400000,
    net_pay: 3400000,
    created_at: "2026-05-14T00:00:00+00:00",
    updated_at: "2026-05-14T00:00:00+00:00",
    deleted_at: null,
  },
];

const statusLabelMap: Record<PayslipStatus, string> = {
  draft: "초안",
  issued: "발행",
  canceled: "취소",
};

const statusVariantMap: Record<
  PayslipStatus,
  "real" | "real-lite" | "mock" | "coming-soon"
> = {
  draft: "real-lite",
  issued: "real",
  canceled: "mock",
};

function formatAmount(value: number): string {
  return value.toLocaleString("ko-KR");
}

function formatIssuedAt(value: string | null): string {
  if (value === null) {
    return "-";
  }
  return new Date(value).toLocaleDateString("ko-KR", { timeZone: "UTC" });
}

export default function PayslipPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-04");
  const [payslips, setPayslips] = useState<Payslip[]>(seedPayslips);
  const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(
    seedPayslips[0]?.id ?? null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(
    "급여 실행 결과를 명세서 형태로 확인할 수 있습니다."
  );

  async function loadPayslips() {
    try {
      const response = await fetch("/api/payslips", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("급여명세서를 불러오지 못했습니다.");
      }
      const payload = (await response.json()) as PayslipListResponse;
      setPayslips(payload.items);
      setSelectedPayslipId(payload.items[0]?.id ?? null);
      setMessage("급여명세서를 확인하고 있습니다.");
    } catch {
      setPayslips(seedPayslips);
      setSelectedPayslipId(seedPayslips[0]?.id ?? null);
      setMessage("API 확인에 실패해 seed payslip 기준으로 표시합니다.");
    }
  }

  useEffect(() => {
    void loadPayslips();
  }, []);

  const visiblePayslips = useMemo(
    () => payslips.filter((payslip) => payslip.year_month === selectedMonth),
    [payslips, selectedMonth]
  );

  const selectedPayslip = useMemo(
    () =>
      visiblePayslips.find((payslip) => payslip.id === selectedPayslipId) ??
      visiblePayslips[0] ??
      null,
    [selectedPayslipId, visiblePayslips]
  );

  const summary = useMemo(
    () => ({
      count: visiblePayslips.length,
      draftCount: visiblePayslips.filter((payslip) => payslip.status === "draft").length,
      issuedCount: visiblePayslips.filter((payslip) => payslip.status === "issued").length,
      totalNetPay: visiblePayslips.reduce(
        (accumulator, payslip) => accumulator + payslip.net_pay,
        0
      ),
    }),
    [visiblePayslips]
  );

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/payslips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: "dev-tenant",
          company_id: "dev-company",
          year_month: selectedMonth,
        }),
      });

      if (!response.ok) {
        setMessage(
          response.status === 409
            ? "해당 급여 실행 기준 명세서가 이미 생성되어 있습니다."
            : "급여명세서 생성에 실패했습니다."
        );
        return;
      }

      const payload = (await response.json()) as PayslipListResponse;
      setPayslips((current) =>
        [...current, ...payload.items].sort((left, right) => {
          if (left.year_month !== right.year_month) {
            return left.year_month.localeCompare(right.year_month);
          }
          return left.id.localeCompare(right.id);
        })
      );
      setSelectedPayslipId(payload.items[0]?.id ?? null);
      setMessage("급여명세서 생성이 완료되었습니다.");
    } catch {
      setMessage("급여명세서 생성 요청을 확인하지 못했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <AppLayout>
      <PageContainer
        eyebrow="Payslip"
        title="급여명세서"
        description="급여 생성 결과를 직원별 명세서 형태로 확인합니다."
        actions={
          <>
            <Button variant="secondary" disabled>
              PDF 예정
            </Button>
            <Button variant="secondary" disabled>
              발송 예정
            </Button>
            <Button onClick={() => void handleGenerate()} disabled={isGenerating}>
              {isGenerating ? "명세서 생성 중..." : "명세서 생성"}
            </Button>
          </>
        }
      >
        <section className="dashboard-grid">
          <Card>
            <CardHeader>
              <CardDescription>명세서 건수</CardDescription>
              <CardTitle>{summary.count}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>발행 대기</CardDescription>
              <CardTitle>{summary.draftCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>발행 완료</CardDescription>
              <CardTitle>{summary.issuedCount}</CardTitle>
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
              <CardTitle>급여명세서 목록</CardTitle>
              <CardDescription>
                PayrollItem 결과를 직원별 명세서 단위로 표현합니다. MVP 단계에서는
                화면/JSON 기반 조회만 제공하고 PDF/이메일 발송은 후속 작업으로 분리합니다.
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
                    <TableHead>상태</TableHead>
                    <TableHead>기본급</TableHead>
                    <TableHead>연장수당</TableHead>
                    <TableHead>수당합계</TableHead>
                    <TableHead>공제합계</TableHead>
                    <TableHead>총지급</TableHead>
                    <TableHead>실지급</TableHead>
                    <TableHead>발행일</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visiblePayslips.map((payslip) => {
                    const employee =
                      seedEmployees.find((item) => item.id === payslip.employee_id) ?? null;
                    return (
                      <TableRow key={payslip.id}>
                        <TableCell>{payslip.year_month}</TableCell>
                        <TableCell>
                          {employee ? `${employee.name} (${employee.employee_no})` : payslip.employee_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariantMap[payslip.status]}>
                            {statusLabelMap[payslip.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatAmount(payslip.base_pay)}</TableCell>
                        <TableCell>{formatAmount(payslip.overtime_pay)}</TableCell>
                        <TableCell>{formatAmount(payslip.allowance_total)}</TableCell>
                        <TableCell>{formatAmount(payslip.deduction_total)}</TableCell>
                        <TableCell>{formatAmount(payslip.gross_pay)}</TableCell>
                        <TableCell>{formatAmount(payslip.net_pay)}</TableCell>
                        <TableCell>{formatIssuedAt(payslip.issued_at)}</TableCell>
                        <TableCell>
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedPayslipId(payslip.id)}
                          >
                            상세 보기
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

          <Card>
            <CardHeader>
              <CardTitle>선택 명세서 상세</CardTitle>
              <CardDescription>
                지급 항목과 공제 항목은 MVP에서는 합산값 중심으로 표시합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPayslip ? (
                <div className="workflow-list">
                  <article className="workflow-item">
                    <span className="workflow-step">1</span>
                    <div>
                      <strong>지급 항목</strong>
                      <p className="muted-text">
                        기본급 {formatAmount(selectedPayslip.base_pay)} / 연장수당{" "}
                        {formatAmount(selectedPayslip.overtime_pay)} / 수당합계{" "}
                        {formatAmount(selectedPayslip.allowance_total)}
                      </p>
                    </div>
                  </article>
                  <article className="workflow-item">
                    <span className="workflow-step">2</span>
                    <div>
                      <strong>공제 항목</strong>
                      <p className="muted-text">
                        공제합계 {formatAmount(selectedPayslip.deduction_total)} / 총지급{" "}
                        {formatAmount(selectedPayslip.gross_pay)} / 실지급{" "}
                        {formatAmount(selectedPayslip.net_pay)}
                      </p>
                    </div>
                  </article>
                  <article className="workflow-item">
                    <span className="workflow-step">3</span>
                    <div>
                      <strong>발행 상태</strong>
                      <p className="muted-text">
                        {statusLabelMap[selectedPayslip.status]} / 발행일{" "}
                        {formatIssuedAt(selectedPayslip.issued_at)}
                      </p>
                    </div>
                  </article>
                </div>
              ) : (
                <p className="muted-text">선택된 급여명세서가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </AppLayout>
  );
}
