# HCM Development Process

## 1. Purpose
Simple HCM SaaS를 Codex/AI 기반으로 일관되게 개발하기 위한 재사용 가능한 개발 프로세스를 정의한다.

## 2. Core Concept
- 개발 프로세스는 주제별 표준 흐름이다.
- HCM-xxx는 개발 프로세스 단계 번호가 아니라 backlog item이다.
- daily log는 날짜별 작업 이력이다.
- done backlog는 완료된 작업 증적이다.
- 다른 SaaS 프로젝트에서는 HCM-xxx 대신 해당 프로젝트의 backlog 번호를 사용할 수 있다.

## 3. Process Areas

### 3.1 Project Definition
목적:
- 제품 목표, MVP 범위, 제외 범위, 기본 작업 원칙을 정의한다.

산출물:
- `README.md`
- `AGENTS.md`

포함 내용:
- 제품명
- 프로젝트 목표
- MVP 핵심 흐름
- Out of Scope
- 기술스택 요약
- Codex/AI 작업 규칙
- Mock/Real 원칙
- `tenant_id` 기본 원칙

### 3.2 Runtime & Deployment Foundation
목적:
- 로컬/서버에서 앱을 실행할 수 있는 최소 런타임 구조를 만든다.

산출물:
- `infra/docker/docker-compose.yml`
- `infra/docker/.env.example`
- `infra/docker/nginx/default.conf`
- `apps/web/Dockerfile`
- `apps/api/Dockerfile`
- `mock-server/Dockerfile`
- `docs/architecture/tech-stack.md`

포함 내용:
- Docker Compose 구조
- `web` / `api` / `db` / `mock-server` / `nginx` 구성
- 외부 공개 포트 정책
- 내부 네트워크 정책
- PostgreSQL 외부 미노출 원칙
- nginx reverse proxy 기준

### 3.3 Work Management & History
목적:
- AI/Codex 기반 개발 과정에서 작업 단위와 이력을 추적한다.

산출물:
- `docs/operations/backlog/todo/`
- `docs/operations/backlog/in-progress/`
- `docs/operations/backlog/done/`
- `docs/operations/daily/YYYY-MM-DD.md`

규칙:
- `todo` -> `in-progress` -> `done`
- HCM-xxx는 backlog item이다.
- 작업 완료 후 daily log를 업데이트한다.

### 3.4 Product Structure Design
목적:
- MVP가 전체 HCM 사이트처럼 보이도록 제품 메뉴, 기능 범위, 화면 방향을 정의한다.

산출물:
- `docs/product/menu-structure.md`
- `docs/product/ui-style-guide.md`
- `docs/product/ui-reference/`

포함 내용:
- 전체 메뉴 구조
- REAL / MOCK / COMING_SOON 기준
- UI route 기준
- Admin Console UI 방향
- Badge System
- UI reference asset

### 3.5 Domain & Data Design
목적:
- 업무 도메인과 데이터 구조를 먼저 정리하여 기능 구현 기준을 고정한다.

산출물:
- `docs/domain/domain-model.md`
- `docs/domain/workflow-model.md`
- `docs/domain/policy-config.md`
- `docs/data/erd.md`

포함 내용:
- Tenant
- Company
- Employee
- Attendance
- MonthlyAttendanceSummary
- PayrollRun
- PayrollItem
- Payslip
- `tenant_id` 원칙
- `company_id` 원칙
- status enum 기준
- soft delete 기준
- 민감정보 저장 금지
- 회사별 `policy_config` 기준

### 3.6 UI Foundation
목적:
- 각 기능 화면을 만들기 전에 공통 UI 골격을 만든다.

산출물:
- `apps/web/components/layout/`
- `apps/web/components/ui/`
- `apps/web/lib/navigation.ts`
- `apps/web/app/page.tsx`

포함 내용:
- AppLayout
- Sidebar
- Header
- PageContainer
- Card
- Button
- Input
- Table
- Badge
- Dashboard 기본 화면

### 3.7 Feature Development
목적:
- MVP 업무 기능을 실제 API/UI 단위로 구현한다.

산출물:
Backend:
- `apps/api/app/domains/{domain}/router.py`
- `apps/api/app/domains/{domain}/schemas.py`
- `apps/api/app/domains/{domain}/service.py`

Frontend:
- `apps/web/app/{feature}/page.tsx`

Operations:
- `docs/operations/backlog/{status}/HCM-xxx-*.md`
- `docs/operations/daily/YYYY-MM-DD.md`
- `docs/operations/smoke-test.md`

표준 흐름:
1. Feature backlog 생성
2. `todo` -> `in-progress` 이동
3. Backend API 구현
4. Frontend UI 구현
5. seed/mock data 구성
6. Design Sync 수행
7. Smoke Test 보강
8. `done` 이동

### 3.8 Integration & Mock Strategy
목적:
- 외부 API 연동이 필요한 기능을 실제 연동 전에 Mock/Stub/Adapter 구조로 관리한다.

산출물:
- `mock-server/`
- `docs/domain/domain-model.md`
- `docs/product/menu-structure.md`
- 향후 `docs/integration/*`

포함 내용:
- 실제 외부 API 직접 호출 금지
- `mock-server` 또는 adapter로 분리
- Mock/Real 전환 가능 구조
- 홈택스, 4대보험, 전자계약, 회계연동 등은 MVP에서 Mock 또는 COMING_SOON

### 3.9 Verification & Smoke Test
목적:
- 기능이 서버/컨테이너/브라우저 수준에서 정상 동작하는지 확인한다.

산출물:
- `docs/operations/smoke-test.md`
- 향후 `scripts/smoke-test.sh`

검증 기준:
- `python3 -m py_compile`
- `npm run build`
- `docker compose up -d --build`
- curl smoke test
- 브라우저 UI 확인

환경 제약 시:
- 대체 검증을 task 로그에 기록한다.
- 예: Docker Compose 검증 불가 -> app import, router handler 호출, npm build로 대체 검증

### 3.10 Completion & Documentation Sync
목적:
- 기능 완료 시 문서와 이력을 정리하고 다음 작업으로 넘어갈 수 있게 한다.

산출물:
- `docs/operations/backlog/done/HCM-xxx-*.md`
- `docs/operations/daily/YYYY-MM-DD.md`
- updated design docs
- git commit / push

완료 기준:
- task 목적과 구현 범위가 일치함
- 제외 범위를 침범하지 않음
- Design Sync 완료
- smoke test 또는 대체 검증 완료
- daily log 업데이트
- `git status` clean

## 4. HCM Backlog Numbering Rule
- HCM-xxx는 개발 프로세스 단계 번호가 아니다.
- HCM-xxx는 특정 주제에 대해 수행된 backlog item이다.
- 예:
  - HCM-001 = Project Bootstrap backlog
  - HCM-002 = Docker Compose Bootstrap backlog
  - HCM-003 = Tenant/Company Bootstrap backlog
  - HCM-004 = Employee Bootstrap backlog
  - HCM-005 = Product/Domain/UI Design Docs backlog
  - HCM-006 = UI Foundation backlog
  - HCM-007 = Attendance Input backlog 예정
- 다른 프로젝트에서는 HCM-xxx 번호를 그대로 따르지 않아도 된다.

## 5. Sub-step Rule
- 큰 backlog 안에서 세부 작업이 필요한 경우 새 큰 번호를 계속 만들지 않고 서브단계를 사용한다.
- 예:
  - HCM-007.1 task 생성
  - HCM-007.2 `in-progress` 이동
  - HCM-007.3 Attendance API 구현
  - HCM-007.4 Attendance UI 구현
  - HCM-007.5 `smoke-test.md` 보강
  - HCM-007.6 Design Sync
  - HCM-007.7 done 처리

## 6. Current Project Mapping
현재 `hcm-project-template` 기준 매핑은 아래와 같다.

| Process Area | Backlog Item | Status |
|---|---|---|
| Project Definition | HCM-001 | Done |
| Runtime & Deployment Foundation | HCM-002 | Done |
| Tenant/Company Domain Foundation | HCM-003 | Done |
| Employee Feature Development | HCM-004 | Done |
| Product/Domain/Data/UI Design | HCM-005 | Done |
| UI Foundation | HCM-006 | Done |
| Attendance Feature Development | HCM-007 | Planned |

## 7. Roadmap

### HCM-007 Attendance Input Bootstrap
- HCM-007.1 task 생성
- HCM-007.2 `in-progress` 이동
- HCM-007.3 Attendance API 구현
- HCM-007.4 Attendance UI 구현
- HCM-007.5 `smoke-test.md` 보강
- HCM-007.6 Design Sync
- HCM-007.7 done 처리

### HCM-008 Monthly Attendance Summary Bootstrap
- HCM-008.1 task 생성
- HCM-008.2 월 근태 집계 도메인/API 구현
- HCM-008.3 월별 직원 근태 요약 UI 구현
- HCM-008.4 `smoke-test.md` 보강
- HCM-008.5 done 처리

### HCM-009 Payroll Run Bootstrap
- HCM-009.1 task 생성
- HCM-009.2 급여 실행 도메인/API 구현
- HCM-009.3 급여 생성 UI 구현
- HCM-009.4 `smoke-test.md` 보강
- HCM-009.5 done 처리

### HCM-010 Payslip Bootstrap
- HCM-010.1 task 생성
- HCM-010.2 급여명세서 도메인/API 구현
- HCM-010.3 급여명세서 UI/출력 Mock 구현
- HCM-010.4 REAL/MOCK 범위 재검토
- HCM-010.5 done 처리

## 8. Reuse Guide
다른 SaaS 프로젝트에 적용할 때는 다음 순서로 재사용한다.
- Project Definition
- Runtime Foundation
- Work Management
- Product Structure Design
- Domain & Data Design
- UI Foundation
- Feature Development
- Verification
- Completion
