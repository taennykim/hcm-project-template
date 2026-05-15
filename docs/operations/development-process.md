# HCM Development Process

## 1. Purpose
Simple HCM SaaS를 Codex/AI 기반으로 일관되게 개발하기 위한 재사용 가능한 개발 프로세스를 정의한다.

## 2. Core Concept
- 개발 프로세스는 주제별 표준 흐름이다.
- HCM-xxx는 개발 프로세스 단계 번호가 아니라 backlog item이다.
- daily log는 날짜별 작업 이력이다.
- done backlog는 완료된 작업 증적이다.
- 다른 SaaS 프로젝트에서는 HCM-xxx 대신 해당 프로젝트의 backlog 번호를 사용할 수 있다.

## 3. AI Development Reference Flow
AI가 개발 시 문서를 참고하는 순서를 정리한다.

순서:
1. README.md
2. AGENTS.md
3. docs/operations/development-process.md
4. docs/product/menu-structure.md
5. docs/product/ui-style-guide.md
6. docs/domain/domain-model.md
7. docs/domain/workflow-model.md
8. docs/domain/policy-config.md
9. docs/data/erd.md
10. docs/architecture/tech-stack.md
11. current backlog task
12. existing implementation
13. implementation
14. verification
15. completion and sync

## 4. Process Areas

### 4.1 Project Definition
산출물:
- README.md
- AGENTS.md

### 4.2 Runtime & Deployment Foundation
산출물:
- infra/docker/docker-compose.yml
- infra/docker/.env.example
- infra/docker/nginx/default.conf
- apps/web/Dockerfile
- apps/api/Dockerfile
- mock-server/Dockerfile
- docs/architecture/tech-stack.md

### 4.3 Work Management & History
산출물:
- docs/operations/backlog/todo/
- docs/operations/backlog/in-progress/
- docs/operations/backlog/done/
- docs/operations/daily/YYYY-MM-DD.md

### 4.4 Product Structure Design
산출물:
- docs/product/menu-structure.md
- docs/product/ui-style-guide.md
- docs/product/ui-reference/

### 4.5 Domain & Data Design
산출물:
- docs/domain/domain-model.md
- docs/domain/workflow-model.md
- docs/domain/policy-config.md
- docs/data/erd.md

### 4.6 UI Foundation
산출물:
- apps/web/components/layout/
- apps/web/components/ui/
- apps/web/lib/navigation.ts
- apps/web/app/page.tsx

### 4.7 Feature Development
산출물:

Backend:
- apps/api/app/domains/{domain}/router.py
- apps/api/app/domains/{domain}/schemas.py
- apps/api/app/domains/{domain}/service.py

Frontend:
- apps/web/app/{feature}/page.tsx

Operations:
- docs/operations/backlog/{status}/HCM-xxx-*.md
- docs/operations/daily/YYYY-MM-DD.md
- docs/operations/smoke-test.md

### 4.8 Integration & Mock Strategy
산출물:
- mock-server/
- 향후 docs/integration/*

### 4.9 Verification & Smoke Test
산출물:
- docs/operations/smoke-test.md
- 향후 scripts/smoke-test.sh

### 4.10 Completion & Documentation Sync
산출물:
- docs/operations/backlog/done/HCM-xxx-*.md
- docs/operations/daily/YYYY-MM-DD.md
- updated design docs
- git commit / push

## 5. HCM Backlog Numbering Rule
- HCM-xxx는 개발 프로세스 단계 번호가 아니다.
- HCM-xxx는 특정 주제에 대해 수행된 backlog item이다.
- 큰 backlog 내부 세부 작업은 HCM-xxx.1, HCM-xxx.2 형태로 관리한다.

## 6. Current Project Mapping
GitHub main의 실제 done backlog 기준 현재 매핑은 아래와 같다.

| Process Area | Backlog Item | Status |
|---|---|---|
| Project Definition | HCM-001 | Done |
| Runtime & Deployment Foundation | HCM-002 | Done |
| Tenant/Company Domain Foundation | HCM-003 | Done |
| Employee Feature Development | HCM-004 | Done |
| Product/Domain/Data/UI Design | HCM-005 | Done |
| UI Foundation | HCM-006 | Done |
| Attendance Feature Development | HCM-007 | Done |
| Monthly Attendance Summary Feature Development | HCM-008 | Done |
| Payroll Run Feature Development | HCM-009 | Done |
| Payslip Feature Development | HCM-010 | Done |

## 7. Current Implementation Status
현재 코드 기준 구현 범위는 아래와 같다.

### Backend API
- /api/health
- /api/companies
- /api/companies/{company_id}
- /api/companies/{company_id}/policy
- /api/employees
- /api/employees/{employee_id}
- /api/employees/{employee_id}/status
- /api/employees/{employee_id}/attendance-records
- /api/employees/{employee_id}/monthly-attendance-summaries
- /api/employees/{employee_id}/payroll-items
- /api/employees/{employee_id}/payslips
- /api/attendance-records
- /api/attendance-records/{attendance_record_id}
- /api/monthly-attendance-summaries
- /api/monthly-attendance-summaries/generate
- /api/monthly-attendance-summaries/{summary_id}
- /api/payroll-runs
- /api/payroll-runs/generate
- /api/payroll-runs/{payroll_run_id}
- /api/payroll-runs/{payroll_run_id}/items
- /api/payroll-runs/{payroll_run_id}/payslips
- /api/payslips
- /api/payslips/generate
- /api/payslips/{payslip_id}

### Frontend UI Route
- /
- /company
- /employee
- /attendance
- /attendance/monthly-summary
- /payroll
- /payslip

### Smoke Test Coverage
- /, /company, /attendance, /attendance/monthly-summary, /payroll, /payslip
- /api/health
- /api/companies
- /api/companies/dev-company
- /api/companies/dev-company/policy
- /api/employees
- /api/employees/dev-employee-001
- /api/attendance-records
- /api/monthly-attendance-summaries
- /api/payroll-runs
- /api/payslips
- /mock/health

## 8. Persistence Status
- Runtime stack에는 PostgreSQL이 포함되어 있다.
- Company / Employee는 HCM-011에서 PostgreSQL persistence 1차 전환이 완료되었다.
- Attendance / MonthlyAttendanceSummary / PayrollRun / Payslip은 여전히 in-memory service/repository 기반이다.
- PostgreSQL persistence 전환은 HCM-011부터 단계적으로 진행한다.
- HCM-011의 1차 대상은 Company / Employee persistence 전환이다.
- Attendance/MonthlyAttendance/Payroll/Payslip persistence 전환은 후속 task로 분리 가능하다.

## 9. Roadmap
HCM-011이 done이므로 다음 로드맵은 HCM-012부터 정리한다.

### HCM-012 Attendance/Monthly Attendance Persistence Migration
- HCM-012.1 Attendance persistence 전환
- HCM-012.2 Monthly Attendance persistence 전환
- HCM-012.3 generate 로직 persistence 기준 보강
- HCM-012.4 Attendance soft delete API 추가 후보
- HCM-012.5 Employee Self-Service에서 재사용 가능한 employee_id 기준 Attendance API 안정화
- HCM-012.6 verification
- HCM-012.7 done 처리

### HCM-013 RBAC & Employee Self-Service Foundation
- HCM-013.1 Role Switcher 구조 정의
- HCM-013.2 Admin / Employee 메뉴 분리 기준 정의
- HCM-013.3 `/my`, `/my/attendance`, `/my/payslip` route bootstrap
- HCM-013.4 Employee role에서 본인 근태 입력/수정/삭제 흐름 정의
- HCM-013.5 기존 Attendance API 재사용 + selectedEmployeeId 제한 기준 정리
- HCM-013.6 verification
- HCM-013.7 done 처리

### HCM-014 Payroll/Payslip Persistence Migration
- HCM-014.1 PayrollRun persistence 전환
- HCM-014.2 PayrollItem persistence 전환
- HCM-014.3 Payslip persistence 전환
- HCM-014.4 verification
- HCM-014.5 done 처리

### RBAC / Employee Self-Service 기준 메모
- MVP에서는 실제 로그인/인증/JWT를 구현하지 않고 Role Switcher로 admin/employee 역할을 시뮬레이션한다.
- Employee role은 selectedEmployeeId 기준으로 본인 데이터만 조회/입력/수정/삭제한다.
- Employee Self-Service 근태 기능은 별도 /api/me API를 만들지 않고 기존 Attendance API를 재사용한다.
- API-level RBAC, JWT, User/Role DB persistence는 후속 Auth/RBAC task에서 구현한다.

### HCM-015 Payroll Policy / Tax Calculation Stub
- HCM-015.1 정책 범위 정의
- HCM-015.2 세법/4대보험/원천세 stub 설계
- HCM-015.3 deterministic calculation 보강
- HCM-015.4 verification
- HCM-015.5 done 처리

### HCM-016 External Integration / PDF / Notification 확장 후보
- HCM-016.1 PDF 출력 구조 정의
- HCM-016.2 이메일/알림 구조 정의
- HCM-016.3 외부 연동 adapter 확장
- HCM-016.4 verification
- HCM-016.5 done 처리

## 10. Reuse Guide
다른 SaaS 프로젝트에 적용할 때는 HCM 번호를 재사용하는 것이 아니라, 주제별 프로세스와 산출물을 재사용한다.
즉 backlog 번호는 프로젝트마다 달라질 수 있고, 재사용 대상은 아래다.
- 문서 참조 순서
- Process Areas
- backlog 운영 규칙
- verification / completion 규칙
- persistence 전환 로드맵 분리 방식
