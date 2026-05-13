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

type EmployeeStatus = "active" | "on_leave" | "inactive" | "upcoming";

type Employee = {
  id: string;
  tenant_id: string;
  company_id: string;
  employee_no: string;
  name: string;
  email: string | null;
  phone: string | null;
  department: string | null;
  position: string | null;
  employment_type: string;
  hire_date: string;
  resignation_date: string | null;
  status: EmployeeStatus;
};

type EmployeeListResponse = {
  items: Employee[];
};

type EmployeeDraft = {
  company_id: string;
  department: string;
  email: string;
  employee_no: string;
  employment_type: string;
  hire_date: string;
  name: string;
  phone: string;
  position: string;
  status: EmployeeStatus;
  tenant_id: string;
};

const emptyDraft: EmployeeDraft = {
  tenant_id: "dev-tenant",
  company_id: "dev-company",
  employee_no: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  employment_type: "full_time",
  hire_date: "2026-05-13",
  status: "active",
};

const seedEmployees: Employee[] = [
  {
    id: "dev-employee-001",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    employee_no: "E001",
    name: "김관리",
    email: "manager.kim@example.com",
    phone: "010-1234-5678",
    department: "인사팀",
    position: "매니저",
    employment_type: "full_time",
    hire_date: "2026-01-01",
    resignation_date: null,
    status: "active",
  },
  {
    id: "dev-employee-002",
    tenant_id: "dev-tenant",
    company_id: "dev-company",
    employee_no: "E002",
    name: "이운영",
    email: "ops.lee@example.com",
    phone: "010-2345-6789",
    department: "운영팀",
    position: "스태프",
    employment_type: "full_time",
    hire_date: "2026-02-10",
    resignation_date: null,
    status: "active",
  },
];

const badgeVariantMap = {
  active: "real",
  on_leave: "mock",
  inactive: "coming-soon",
  upcoming: "real-lite",
} as const;

const statusLabelMap: Record<EmployeeStatus, string> = {
  active: "재직",
  on_leave: "휴직",
  inactive: "비활성",
  upcoming: "입사 예정",
};

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [draft, setDraft] = useState<EmployeeDraft>(emptyDraft);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadEmployees() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/employees", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("직원 목록을 불러오지 못했습니다.");
      }
      const data = (await response.json()) as EmployeeListResponse;
      setEmployees(data.items);
      setErrorMessage(null);
    } catch (error) {
      setEmployees(seedEmployees);
      setErrorMessage(
        error instanceof Error ? error.message : "직원 목록을 확인하지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadEmployees();
  }, []);

  const summary = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter((employee) => employee.status === "active").length,
      upcoming: employees.filter((employee) => employee.status === "upcoming").length,
      inactive: employees.filter((employee) => employee.status === "inactive").length,
    };
  }, [employees]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      ...draft,
      email: draft.email || null,
      phone: draft.phone || null,
      department: draft.department || null,
      position: draft.position || null,
      resignation_date: null,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setErrorMessage("직원 등록에 실패했습니다.");
        return;
      }

      const created = (await response.json()) as Employee;
      setEmployees((current) => [...current, created]);
      setDraft(emptyDraft);
      setErrorMessage(null);
      setIsPanelOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange<K extends keyof EmployeeDraft>(
    field: K,
    value: EmployeeDraft[K]
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  return (
    <AppLayout>
      <PageContainer
        eyebrow="Employee"
        title="직원관리"
        description="직원 등록과 기본 정보를 관리합니다. tenant_id와 company_id 기준으로 직원 데이터를 분리하고, 관리자 중심 업무 화면으로 운영합니다."
        actions={
          <>
            <Button variant="secondary" onClick={() => void loadEmployees()} disabled={isLoading}>
              목록 새로고침
            </Button>
            <Button onClick={() => setIsPanelOpen(true)}>직원 등록</Button>
          </>
        }
      >
        <section className="dashboard-grid">
          <Card>
            <CardHeader>
              <CardDescription>전체 직원</CardDescription>
              <CardTitle>{summary.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>재직</CardDescription>
              <CardTitle>{summary.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>입사 예정</CardDescription>
              <CardTitle>{summary.upcoming}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>비활성</CardDescription>
              <CardTitle>{summary.inactive}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="content-grid content-grid-single">
          <Card>
            <CardHeader>
              <CardTitle>직원 목록</CardTitle>
              <CardDescription>
                사번, 부서, 직책, 입사일, 상태를 기본 단위로 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorMessage ? <p className="inline-alert">{errorMessage}</p> : null}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사번</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직책</TableHead>
                    <TableHead>입사일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.employee_no}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department ?? "-"}</TableCell>
                      <TableCell>{employee.position ?? "-"}</TableCell>
                      <TableCell>{employee.hire_date}</TableCell>
                      <TableCell>
                        <Badge variant={badgeVariantMap[employee.status]}>
                          {statusLabelMap[employee.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="secondary" disabled>
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!isLoading && employees.length === 0 ? (
                <p className="muted-text table-footnote">등록된 직원이 없습니다.</p>
              ) : null}
              {isLoading ? (
                <p className="muted-text table-footnote">
                  직원 데이터를 확인하는 중입니다.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <aside className={`slide-panel ${isPanelOpen ? "is-open" : ""}`.trim()}>
          <div className="slide-panel-header">
            <div>
              <p className="page-eyebrow">Employee Create</p>
              <h2 className="slide-panel-title">직원 등록</h2>
            </div>
            <Button type="button" variant="secondary" onClick={() => setIsPanelOpen(false)}>
              닫기
            </Button>
          </div>
          <form className="employee-form" onSubmit={handleSubmit}>
            <label>
              <span>사번</span>
              <Input
                required
                value={draft.employee_no}
                onChange={(event) => handleChange("employee_no", event.target.value)}
              />
            </label>
            <label>
              <span>이름</span>
              <Input
                required
                value={draft.name}
                onChange={(event) => handleChange("name", event.target.value)}
              />
            </label>
            <label>
              <span>이메일</span>
              <Input
                type="email"
                value={draft.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
            </label>
            <label>
              <span>연락처</span>
              <Input
                value={draft.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
            </label>
            <label>
              <span>부서</span>
              <Input
                value={draft.department}
                onChange={(event) => handleChange("department", event.target.value)}
              />
            </label>
            <label>
              <span>직책</span>
              <Input
                value={draft.position}
                onChange={(event) => handleChange("position", event.target.value)}
              />
            </label>
            <label>
              <span>고용형태</span>
              <select
                className="ui-input"
                value={draft.employment_type}
                onChange={(event) => handleChange("employment_type", event.target.value)}
              >
                <option value="full_time">정규직</option>
                <option value="contract">계약직</option>
                <option value="part_time">파트타임</option>
              </select>
            </label>
            <label>
              <span>입사일</span>
              <Input
                required
                type="date"
                value={draft.hire_date}
                onChange={(event) => handleChange("hire_date", event.target.value)}
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
