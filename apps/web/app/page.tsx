import { AppLayout } from "../components/layout/app-layout";
import { PageContainer } from "../components/layout/page-container";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

type BadgeStatus = "REAL" | "REAL-LITE" | "MOCK" | "COMING_SOON";

const workflow = [
  "직원 등록",
  "근태 입력",
  "월 근태 집계",
  "급여 생성",
  "급여명세서 출력"
];

const summaryCards = [
  { label: "전체 직원", value: "18", detail: "REAL 기준 employee bootstrap 예정" },
  { label: "이번 달 근태 입력", value: "74%", detail: "Attendance REAL 구현 전 샘플 지표" },
  { label: "급여 생성 상태", value: "MOCK", detail: "Payroll bootstrap 전 단계" },
  { label: "안내", value: "2", detail: "Coming Soon 메뉴 2개 영역 우선 노출" }
];

const taskRows: Array<{ area: string; note: string; status: BadgeStatus }> = [
  { area: "Company", status: "REAL", note: "회사 정보와 정책 설정 우선 운영" },
  { area: "Employee", status: "REAL", note: "다음 단계에서 API와 화면 연결 예정" },
  { area: "Payroll", status: "MOCK", note: "시연용 흐름과 결과 화면 중심" },
  { area: "Integration", status: "COMING_SOON", note: "실제 외부 연동은 후속 단계" }
];

const badgeVariantMap = {
  REAL: "real",
  "REAL-LITE": "real-lite",
  MOCK: "mock",
  COMING_SOON: "coming-soon"
} as const;

export default function HomePage() {
  return (
    <AppLayout>
      <PageContainer
        eyebrow="Simple HCM SaaS"
        title="대한민국 중소기업용 경량 인사/급여/근태 SaaS"
        description="Modern Enterprise HCM Admin Console 방향을 따르는 MVP 운영 화면입니다. Sidebar, Header, Card, Table 패턴을 기준으로 후속 Employee, Attendance, Payroll 화면을 확장합니다."
        actions={
          <>
            <Button variant="secondary">UI Foundation</Button>
            <Button>다음 작업 확인</Button>
          </>
        }
      >
        <section className="dashboard-grid">
          {summaryCards.map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle>{item.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="muted-text">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="content-grid">
          <Card className="feature-card">
            <CardHeader>
              <Badge variant="real-lite">REAL-LITE Dashboard</Badge>
              <CardTitle>MVP 흐름</CardTitle>
              <CardDescription>직원 등록부터 급여명세서 출력까지 가장 짧은 운영 흐름입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="workflow-list">
                {workflow.map((step, index) => (
                  <article className="workflow-item" key={step}>
                    <span className="workflow-step">{index + 1}</span>
                    <div>
                      <strong>{step}</strong>
                      <p className="muted-text">후속 bootstrap task에서 단계별 API와 화면을 연결합니다.</p>
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 준비 상태</CardTitle>
              <CardDescription>REAL, MOCK, COMING_SOON 기준으로 MVP 범위를 통제합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>영역</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>설명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskRows.map((row) => (
                    <TableRow key={row.area}>
                      <TableCell>{row.area}</TableCell>
                      <TableCell>
                        <Badge variant={badgeVariantMap[row.status]}>{row.status}</Badge>
                      </TableCell>
                      <TableCell>{row.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </PageContainer>
    </AppLayout>
  );
}
