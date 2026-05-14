"use client";

import { useEffect, useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type CompanyPolicyConfig = {
  attendance: {
    work_start_time: string;
    work_end_time: string;
    lunch_minutes: number;
  };
  payroll: {
    pay_day: number;
    round_unit: number;
  };
};

type Company = {
  id: string;
  tenant_id: string;
  name: string;
  business_registration_number: string | null;
  representative_name: string | null;
  policy_config: CompanyPolicyConfig;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type CompanyPolicyResponse = {
  company_id: string;
  tenant_id: string;
  policy_config: CompanyPolicyConfig;
};

const seedPolicy: CompanyPolicyConfig = {
  attendance: {
    work_start_time: "09:00",
    work_end_time: "18:00",
    lunch_minutes: 60,
  },
  payroll: {
    pay_day: 25,
    round_unit: 10,
  },
};

const seedCompany: Company = {
  id: "dev-company",
  tenant_id: "dev-tenant",
  name: "데모회사",
  business_registration_number: null,
  representative_name: null,
  policy_config: seedPolicy,
  created_at: "2026-05-13T00:00:00+00:00",
  updated_at: "2026-05-13T00:00:00+00:00",
  deleted_at: null,
};

export default function CompanyPage() {
  const [company, setCompany] = useState<Company>(seedCompany);
  const [policy, setPolicy] = useState<CompanyPolicyResponse>({
    company_id: "dev-company",
    tenant_id: "dev-tenant",
    policy_config: seedPolicy,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(
    "회사 기본정보와 정책을 확인하는 중입니다."
  );

  async function loadCompany() {
    setIsLoading(true);
    try {
      const [companyResponse, policyResponse] = await Promise.all([
        fetch("/api/companies/dev-company", { cache: "no-store" }),
        fetch("/api/companies/dev-company/policy", { cache: "no-store" }),
      ]);

      if (!companyResponse.ok || !policyResponse.ok) {
        throw new Error("회사 정보를 불러오지 못했습니다.");
      }

      const nextCompany = (await companyResponse.json()) as Company;
      const nextPolicy = (await policyResponse.json()) as CompanyPolicyResponse;
      setCompany(nextCompany);
      setPolicy(nextPolicy);
      setMessage("회사 기본정보와 정책을 확인하고 있습니다.");
    } catch (error) {
      setCompany(seedCompany);
      setPolicy({
        company_id: "dev-company",
        tenant_id: "dev-tenant",
        policy_config: seedPolicy,
      });
      setMessage(
        error instanceof Error
          ? `${error.message} seed fallback으로 표시합니다.`
          : "회사 정보를 확인하지 못해 seed fallback으로 표시합니다."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCompany();
  }, []);

  return (
    <AppLayout>
      <PageContainer
        eyebrow="Company"
        title="회사관리"
        description="회사 기본정보와 근태/급여 정책을 확인합니다."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => void loadCompany()}
              disabled={isLoading}
            >
              정보 새로고침
            </Button>
            <Button disabled>정책 편집 예정</Button>
          </>
        }
      >
        <section className="dashboard-grid">
          <Card>
            <CardHeader>
              <CardDescription>회사명</CardDescription>
              <CardTitle>{company.name}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Tenant</CardDescription>
              <CardTitle>{company.tenant_id}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>정책 상태</CardDescription>
              <CardTitle>
                <Badge variant="real">REAL</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Route 정합성</CardDescription>
              <CardTitle>
                <Badge variant="real-lite">/company</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="content-grid">
          <Card>
            <CardHeader>
              <CardTitle>회사 기본정보</CardTitle>
              <CardDescription>
                현재 MVP에서 사용하는 회사 seed 정보와 API 응답 기준입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>항목</TableHead>
                    <TableHead>값</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Company ID</TableCell>
                    <TableCell>{company.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tenant ID</TableCell>
                    <TableCell>{company.tenant_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>회사명</TableCell>
                    <TableCell>{company.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>사업자등록번호</TableCell>
                    <TableCell>{company.business_registration_number ?? "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>대표자명</TableCell>
                    <TableCell>{company.representative_name ?? "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>근태 정책</CardTitle>
              <CardDescription>
                출퇴근 시간과 점심시간 기준을 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>항목</TableHead>
                    <TableHead>값</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>출근 시간</TableCell>
                    <TableCell>{policy.policy_config.attendance.work_start_time}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>퇴근 시간</TableCell>
                    <TableCell>{policy.policy_config.attendance.work_end_time}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>점심시간</TableCell>
                    <TableCell>{policy.policy_config.attendance.lunch_minutes}분</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>급여 정책</CardTitle>
              <CardDescription>
                급여 지급일과 반올림 기준을 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>항목</TableHead>
                    <TableHead>값</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>급여 지급일</TableCell>
                    <TableCell>매월 {policy.policy_config.payroll.pay_day}일</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>반올림 단위</TableCell>
                    <TableCell>{policy.policy_config.payroll.round_unit}</TableCell>
                  </TableRow>
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
