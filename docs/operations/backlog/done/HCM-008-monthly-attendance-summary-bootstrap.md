# HCM-008 Monthly Attendance Summary Bootstrap

## 목적
Simple HCM SaaS MVP의 세 번째 핵심 업무 기능인 월 근태 집계 기능을 구현하기 위한 기반을 준비한다.

## 배경
MVP 핵심 흐름은 직원 등록 → 근태 입력 → 월 근태 집계 → 급여 생성 → 급여명세서 출력이다.
HCM-007 Attendance Input Bootstrap이 완료되어 직원별 일자별 근태 입력 기반이 준비되었으므로, 다음 단계로 월 단위 근태 집계 구조를 만든다.

HCM-008은 `docs/operations/development-process.md`의 Feature Development 프로세스를 따른다.
HCM-008 내부 세부 작업은 아래 서브단계로 진행한다.
- HCM-008.1 task 생성
- HCM-008.2 in-progress 이동
- HCM-008.3 Monthly Attendance Summary API 구현
- HCM-008.4 Monthly Attendance Summary UI 구현
- HCM-008.5 smoke-test.md 보강 및 검증
- HCM-008.6 Design Sync
- HCM-008.7 done 처리

## 작업 범위
- monthly attendance summary 도메인 구조 정의
- tenant_id/company_id/employee_id/year_month 기반 월 집계 데이터 분리 기준 정의
- AttendanceRecord 기반 월 집계 모델 준비
- 월 근태 집계 목록 조회 API 설계
- 월 근태 집계 생성 API 설계
- 직원별 월 근태 집계 조회 API 설계
- 개발용 seed summary 검토
- Monthly Attendance Summary UI 구현 기준 정리
- smoke-test.md에 추가할 검증 항목 정의

## MonthlyAttendanceSummary 기본 필드 초안
- id
- tenant_id
- company_id
- employee_id
- year_month
- total_work_minutes
- overtime_minutes
- late_minutes
- late_count
- absent_count
- leave_count
- workday_count
- status
- created_at
- updated_at
- deleted_at nullable

## API 초안
- GET /api/monthly-attendance-summaries
- POST /api/monthly-attendance-summaries/generate
- GET /api/monthly-attendance-summaries/{summary_id}
- GET /api/employees/{employee_id}/monthly-attendance-summaries
- GET /api/monthly-attendance-summaries?year_month=YYYY-MM

## UI 초안
- route: /attendance/monthly-summary
- 월 근태 집계 화면
- 대상 월 선택
- 직원별 월 집계 테이블
- 집계 생성 버튼
- 상태 badge 표시
  - 초안
  - 집계완료
  - 검토중
  - 확정
  - 오류

## 논리 규칙
- MonthlyAttendanceSummary는 AttendanceRecord를 월 단위로 집계한 결과다.
- employee_id + year_month 기준 중복 생성을 방지한다.
- total_work_minutes, overtime_minutes, late_minutes는 AttendanceRecord 합산 기준이다.
- late_count, absent_count, leave_count는 status 기준 카운트다.
- workday_count는 근무일 기준 카운트다.
- MVP에서는 집계 생성 시 in-memory AttendanceRecord를 기반으로 계산한다.
- 집계 확정/마감 정책은 Payroll 단계 전에 별도 보강 가능하다.
- 급여 계산은 이번 범위에서 제외한다.

## 제외 범위
- 급여 계산
- 급여 생성
- 급여명세서 생성
- 연차 자동 계산
- 복잡한 교대근무 집계
- 법정근로시간/수당 자동 판정
- 실제 DB migration
- PostgreSQL persistence 전환
- 인증/로그인 구현

## 완료 조건
- MonthlyAttendanceSummary 구현 방향이 task 문서에 정리됨
- tenant_id/company_id/employee_id/year_month 기반 데이터 분리 원칙이 명확히 기록됨
- 월 근태 집계 생성/조회 API 구현 준비가 완료됨
- UI route와 화면 구성 기준이 정리됨
- `docs/domain/domain-model.md`, `docs/domain/workflow-model.md`, `docs/domain/policy-config.md`, `docs/data/erd.md` 기준과 충돌하지 않음
- 다음 구현 단계에서 FastAPI Monthly Attendance Summary API와 UI 작업을 시작할 수 있음

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
- docs/operations/backlog/done/HCM-007-attendance-input-bootstrap.md

## 작업 로그
- 생성일: 2026-05-14
- 상태: DONE
- 2026-05-14: HCM-008.1 Monthly Attendance Summary Bootstrap task 생성
- 2026-05-14: HCM-008은 아직 구현 전이며, 다음 단계는 HCM-008.2 in-progress 이동으로 기록
- 2026-05-14: HCM-008.2 in-progress 이동
- 2026-05-14: HCM-008.3 Monthly Attendance Summary API 구현 시작
- 2026-05-14: HCM-008.4 Monthly Attendance Summary UI 구현 시작
- 2026-05-14: `apps/api/app/domains/monthly_attendance/`에 schemas, service, router 구현
- 2026-05-14: `/api/monthly-attendance-summaries`, `/api/monthly-attendance-summaries/generate`, `/api/employees/{employee_id}/monthly-attendance-summaries` API 구현
- 2026-05-14: `/attendance/monthly-summary` UI route 및 월별 집계 화면 구현
- 2026-05-14: `docs/domain/domain-model.md`, `docs/data/erd.md`, `docs/product/menu-structure.md`, `docs/operations/smoke-test.md` 동기화
- 2026-05-14: HCM-008.5 Codex 가능 범위 검증 수행
- 2026-05-14: `python3 -m py_compile apps/api/app/main.py apps/api/app/domains/tenant/*.py apps/api/app/domains/employee/*.py apps/api/app/domains/attendance/*.py apps/api/app/domains/monthly_attendance/*.py` 통과
- 2026-05-14: `cd apps/web && npm install` 완료
- 2026-05-14: `cd apps/web && npm run build` 통과, `/attendance/monthly-summary` route 정적 생성 확인
- 2026-05-14: FastAPI app import, route 목록 확인, service 직접 호출 검증은 로컬 Python에 `fastapi` 부재로 실행 불가
- 2026-05-14: 사용자 Docker/curl 검증은 후속 단계로 유지
- 2026-05-14: 사용자 Docker/curl 검증에서 `/api/monthly-attendance-summaries` 및 generate API 정상 응답 확인
- 2026-05-14: `/attendance/monthly-summary` 외부 502는 `nginx`가 재기동된 `web` 컨테이너 IP를 재해석하지 못한 upstream DNS 캐시 문제로 확인
- 2026-05-14: `infra/docker/nginx/default.conf`에 Docker DNS resolver(`127.0.0.11`)와 variable 기반 `proxy_pass`를 적용해 upstream 재해석 가능하도록 수정
- 2026-05-14: HCM-008 완료 조건 점검 결과, Monthly Attendance Summary API/UI, `/attendance/monthly-summary`, `/api/monthly-attendance-summaries`, generate API, in-memory persistence, 제외 범위 유지, smoke-test 반영, 사용자 런타임 검증이 모두 충족됨
- 2026-05-14: HCM-008.6 Design Sync 점검 완료, `docs/product/menu-structure.md`, `docs/product/ui-style-guide.md`, `docs/domain/domain-model.md`, `docs/domain/workflow-model.md`, `docs/domain/policy-config.md`, `docs/data/erd.md`, `docs/operations/smoke-test.md` 기준과 충돌 없음
- 2026-05-14: HCM-008.7 done 처리, task 문서를 `docs/operations/backlog/done/`으로 이동
