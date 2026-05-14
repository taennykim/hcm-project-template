export type NavigationStatus = "REAL" | "REAL-LITE" | "MOCK" | "COMING_SOON";

export type NavigationItem = {
  description: string;
  href: string;
  label: string;
  status: NavigationStatus;
};

export const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Dashboard",
    description: "개요와 운영 요약",
    status: "REAL-LITE"
  },
  {
    href: "/company",
    label: "Company",
    description: "회사 정보와 정책",
    status: "REAL"
  },
  {
    href: "/employee",
    label: "Employee",
    description: "직원 목록과 등록",
    status: "REAL"
  },
  {
    href: "/attendance",
    label: "Attendance",
    description: "근태 입력과 집계",
    status: "REAL"
  },
  {
    href: "/attendance/monthly-summary",
    label: "Attendance Summary",
    description: "월별 근태 집계",
    status: "REAL"
  },
  {
    href: "/payroll",
    label: "Payroll",
    description: "급여 생성과 검토",
    status: "REAL"
  },
  {
    href: "/payslip",
    label: "Payslip",
    description: "급여명세서 조회",
    status: "REAL"
  },
  {
    href: "/documents",
    label: "Documents",
    description: "전자계약과 문서",
    status: "MOCK"
  },
  {
    href: "/integration",
    label: "Integration",
    description: "외부 연동 영역",
    status: "COMING_SOON"
  },
  {
    href: "/settings",
    label: "Settings",
    description: "관리자 설정",
    status: "COMING_SOON"
  }
];
