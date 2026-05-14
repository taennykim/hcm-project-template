# HCM-009 Payroll Run Bootstrap

## 목적
Simple HCM SaaS MVP의 네 번째 핵심 업무 기능인 급여 실행 기능을 구현하기 위한 기반을 준비한다.

## 배경
MVP 핵심 흐름은 직원 등록 → 근태 입력 → 월 근태 집계 → 급여 생성 → 급여명세서 출력이다.
HCM-008 Monthly Attendance Summary Bootstrap이 완료되어 월 근태 집계 기반이 준비되었으므로, 다음 단계로 급여 실행 단위를 만든다.

HCM-009는 `docs/operations/development-process.md`의 Feature Development 프로세스를 따른다.
HCM-009 내부 세부 작업은 아래 서브단계로 진행한다.
- HCM-009.1 task 생성
- HCM-009.2 in-progress 이동
- HCM-009.3 Payroll Run API 구현
- HCM-009.4 Payroll Run UI 구현
- HCM-009.5 smoke-test.md 보강 및 검증
- HCM-009.6 Design Sync
- HCM-009.7 done 처리

## 작업 범위
- payroll run 도메인 구조 정의
- tenant_id/company_id/year_month 기반 급여 실행 데이터 분리 기준 정의
- MonthlyAttendanceSummary 기반 payroll run 생성 기준 정의
- PayrollItem 직원별 급여 결과 모델 준비
- payroll run 목록 조회 API 설계
- payroll run 생성 API 설계
- payroll item 조회 API 설계
- 개발용 seed payroll run / item 검토
- Payroll Run UI 구현 기준 정리
- smoke-test.md에 추가할 검증 항목 정의

## PayrollRun 기본 필드 초안
- id
- tenant_id
- company_id
- year_month
- status
- total_employees
- total_gross_pay
- total_deductions
- total_net_pay
- executed_at nullable
- created_at
- updated_at
- deleted_at nullable

## PayrollItem 기본 필드 초안
- id
- tenant_id
- company_id
- payroll_run_id
- employee_id
- year_month
- base_pay
- overtime_pay
- allowance_total
- deduction_total
- gross_pay
- net_pay
- created_at
- updated_at

## API 초안
- GET /api/payroll-runs
- POST /api/payroll-runs/generate
- GET /api/payroll-runs/{payroll_run_id}
- GET /api/payroll-runs/{payroll_run_id}/items
- GET /api/employees/{employee_id}/payroll-items
- GET /api/payroll-runs?year_month=YYYY-MM

## UI 초안
- route: /payroll
- 급여관리 화면
- 대상 월 선택
- 급여 실행 목록 테이블
- 급여 생성 버튼
- 선택된 PayrollRun의 PayrollItem 목록 표시
- 상태 badge 표시
  - 초안
  - 계산완료
  - 검토완료
  - 확정
  - 마감
  - 오류

## 논리 규칙
- PayrollRun은 tenant_id, company_id, year_month 기준 급여 실행 단위다.
- PayrollRun 생성 시 MonthlyAttendanceSummary 데이터를 참조한다.
- PayrollItem은 직원별 급여 결과 항목이다.
- MVP에서는 기본급을 고정 seed 값 또는 단순 기본값으로 사용한다.
- overtime_minutes가 있으면 단순 overtime amount를 계산할 수 있지만, 법정 수당 계산은 하지 않는다.
- deduction은 MVP에서는 0 또는 seed 값으로 둔다.
- net_pay = total_earnings - total_deductions
- 실제 세법/4대보험/원천세는 HCM-009 범위에서 제외한다.
- 급여명세서/PDF/발행은 HCM-010 이후로 분리한다.
- 세법/4대보험/원천세/홈택스 연동은 영구 제외가 아니라 후속 Payroll Policy / Tax Calculation / External Integration task에서 단계적으로 구현 가능하다.

## 제외 범위
- 세법 자동 계산
- 4대보험 자동 계산
- 원천세 자동 계산
- 홈택스/외부 연동
- 실제 급여명세서 발행
- PDF 출력
- 실제 DB migration
- PostgreSQL persistence 전환
- 인증/로그인 구현

## 완료 조건
- PayrollRun / PayrollItem 구현 방향이 task 문서에 정리됨
- tenant_id/company_id/year_month 기반 급여 실행 원칙이 명확히 기록됨
- payroll run 생성/조회 API 구현 준비가 완료됨
- UI route와 화면 구성 기준이 정리됨
- `docs/domain/domain-model.md`, `docs/domain/workflow-model.md`, `docs/domain/policy-config.md`, `docs/data/erd.md` 기준과 충돌하지 않음
- 다음 구현 단계에서 FastAPI Payroll Run API와 UI 작업을 시작할 수 있음

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md
- docs/operations/development-process.md
- docs/product/menu-structure.md
- docs/product/ui-style-guide.md
- docs/domain/domain-model.md
- docs/domain/workflow-model.md
- docs/domain/policy-config.md
- docs/data/erd.md
- docs/architecture/tech-stack.md
- docs/operations/smoke-test.md
- docs/operations/backlog/done/HCM-008-monthly-attendance-summary-bootstrap.md

## 작업 로그
- 생성일: 2026-05-14
- 상태: DONE
- 2026-05-14: HCM-009.1 Payroll Run Bootstrap task 생성
- 2026-05-14: HCM-009.2 in-progress 이동
- 2026-05-14: HCM-009.3 Payroll Run API 구현 시작
- 2026-05-14: HCM-009.4 Payroll Run UI 구현 시작
- 2026-05-14: `apps/api/app/domains/payroll/`에 schemas, service, router 구현
- 2026-05-14: `/api/payroll-runs`, `/api/payroll-runs/generate`, `/api/payroll-runs/{payroll_run_id}`, `/api/payroll-runs/{payroll_run_id}/items`, `/api/employees/{employee_id}/payroll-items` API 구현
- 2026-05-14: `/payroll` UI route 및 급여 실행/항목 조회 화면 구현
- 2026-05-14: `docs/product/menu-structure.md`, `docs/domain/domain-model.md`, `docs/data/erd.md`, `docs/operations/smoke-test.md` 동기화
- 2026-05-14: HCM-009.5 Codex 가능 범위 검증 수행
- 2026-05-14: `python3 -m py_compile apps/api/app/main.py apps/api/app/domains/tenant/*.py apps/api/app/domains/employee/*.py apps/api/app/domains/attendance/*.py apps/api/app/domains/monthly_attendance/*.py apps/api/app/domains/payroll/*.py` 통과
- 2026-05-14: `cd apps/web && npm install` 완료
- 2026-05-14: `cd apps/web && npm run build` 통과, `/payroll` route 정적 생성 확인
- 2026-05-14: FastAPI app import, route 목록 확인, payroll service 직접 호출 검증은 로컬 Python에 `fastapi` 부재로 실행 불가
- 2026-05-14: 사용자 Docker/curl 검증은 후속 단계로 유지
- 2026-05-14: 사용자 Docker/curl 검증에서 `/api/health`, `/api/employees`, `/api/attendance-records`, `/api/monthly-attendance-summaries`, `/api/payroll-runs`, `/`, `/attendance`, `/attendance/monthly-summary`, `/payroll` 정상 응답 확인
- 2026-05-14: HCM-009 완료 조건 점검 결과, Payroll Run API, Payroll Item API 조회, `/payroll`, `/api/payroll-runs`, MonthlyAttendanceSummary 기반 PayrollRun 생성 구조, in-memory persistence, 제외 범위 유지, 후속 task 확장 가능성 문서화, smoke-test 반영이 모두 충족됨
- 2026-05-14: HCM-009.6 Design Sync 점검 완료, `docs/product/menu-structure.md`, `docs/product/ui-style-guide.md`, `docs/domain/domain-model.md`, `docs/domain/workflow-model.md`, `docs/domain/policy-config.md`, `docs/data/erd.md`, `docs/operations/smoke-test.md` 기준과 충돌 없음
- 2026-05-14: 설계 문서 영향 없음 또는 기존 설계와 일치
- 2026-05-14: HCM-009.7 done 처리, task 문서를 `docs/operations/backlog/done/`으로 이동
- 2026-05-14: Payroll Run API/UI 구현 완료
- 2026-05-14: `/payroll`, `/api/payroll-runs` 사용자 검증 완료
- 2026-05-14: in-memory persistence 유지
- 2026-05-14: 세법/4대보험/원천세/홈택스/급여명세서 발행은 후속 task로 유지
- 2026-05-14: Payslip은 HCM-010 이후 작업으로 분리
