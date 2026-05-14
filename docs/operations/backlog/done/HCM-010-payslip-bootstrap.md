# HCM-010 Payslip Bootstrap

## 목적
Simple HCM SaaS MVP의 다섯 번째 핵심 업무 기능인 급여명세서 조회/표현 기능을 구현하기 위한 기반을 준비한다.

## 배경
MVP 핵심 흐름은 직원 등록 → 근태 입력 → 월 근태 집계 → 급여 생성 → 급여명세서 출력이다.
HCM-009 Payroll Run Bootstrap이 완료되어 월 근태 집계 기반 급여 실행 구조가 준비되었으므로, 다음 단계로 직원별 급여명세서 조회 구조를 만든다.

HCM-010은 `docs/operations/development-process.md`의 Feature Development 프로세스를 따른다.
HCM-010 내부 세부 작업은 아래 서브단계로 진행한다.
- HCM-010.1 task 생성
- HCM-010.2 in-progress 이동
- HCM-010.3 Payslip API 구현
- HCM-010.4 Payslip UI 구현
- HCM-010.5 smoke-test.md 보강 및 검증
- HCM-010.6 Design Sync
- HCM-010.7 done 처리

## 작업 범위
- Payslip 도메인 구조 정의
- PayrollRun / PayrollItem 기반 명세서 생성 구조 정의
- employee_id + payroll_run_id 기준 중복 방지 규칙 정의
- 급여명세서 목록 조회 API 설계
- PayrollRun 기준 명세서 생성 API 설계
- PayrollRun 기준 명세서 조회 API 설계
- 직원별 급여명세서 조회 API 설계
- 개발용 seed payslip 검토
- Payslip UI 구현 기준 정리
- smoke-test.md에 추가할 검증 항목 정의

## Payslip 기본 필드 초안
- id
- tenant_id
- company_id
- payroll_run_id
- employee_id
- year_month
- status
- issued_at nullable
- base_pay
- overtime_pay
- allowance_total
- deduction_total
- gross_pay
- net_pay
- created_at
- updated_at
- deleted_at nullable

## API 초안
- GET /api/payslips
- POST /api/payslips/generate
- GET /api/payslips/{payslip_id}
- GET /api/payroll-runs/{payroll_run_id}/payslips
- GET /api/employees/{employee_id}/payslips
- GET /api/payslips?year_month=YYYY-MM

## UI 초안
- route: /payslip
- 급여명세서 화면
- 대상 월 선택
- 직원별 급여명세서 테이블
- 명세서 생성 버튼
- PDF 예정 버튼 disabled
- 발송 예정 버튼 disabled
- 상태 badge 표시
  - 초안
  - 발행
  - 취소

## 논리 규칙
- Payslip은 PayrollRun과 Employee 기준으로 생성된다.
- Payslip은 PayrollItem의 base_pay, overtime_pay, allowance_total, deduction_total, gross_pay, net_pay를 표현한다.
- payroll_run_id + employee_id 기준 중복 생성을 방지한다.
- status 기본값은 draft로 시작한다.
- issued 상태에서만 issued_at 값을 가진다.
- MVP에서는 PDF 생성, 이메일 발송, 전자문서 발행을 하지 않는다.
- 세법/4대보험/원천세 상세 계산은 HCM-009/HCM-010 범위가 아니라 후속 Tax Calculation task에서 다룬다.

## 제외 범위
- PDF 출력
- 이메일 발송
- 홈택스/외부 연동
- 전자문서 발행
- 세법/4대보험/원천세 정교 계산
- 실제 DB migration
- PostgreSQL persistence 전환
- 인증/로그인 구현

## 완료 조건
- Payslip 구현 방향이 task 문서에 정리됨
- PayrollRun / PayrollItem 기반 명세서 생성 구조가 명확히 기록됨
- 명세서 생성/조회 API 구현 준비가 완료됨
- UI route와 화면 구성 기준이 정리됨
- docs/domain/domain-model.md, docs/domain/workflow-model.md, docs/domain/policy-config.md, docs/data/erd.md 기준과 충돌하지 않음
- 다음 구현 단계에서 FastAPI Payslip API와 UI 작업을 시작할 수 있음

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
- docs/operations/backlog/done/HCM-009-payroll-run-bootstrap.md

## 작업 로그
- 생성일: 2026-05-14
- 상태: DONE
- 2026-05-14: HCM-010.1 Payslip Bootstrap task 생성
- 2026-05-14: HCM-010.2 in-progress 이동
- 2026-05-14: HCM-010.3 Payslip API 구현
- 2026-05-14: HCM-010.4 Payslip UI 구현
- 2026-05-14: HCM-010.5 smoke-test.md 보강 및 Codex 가능 범위 검증 수행
- 2026-05-14: `python3 -m py_compile` 통과, `cd apps/web && npm install && npm run build` 통과, FastAPI app import/service 직접 호출은 로컬 Python 의존성 부재로 불가
- 2026-05-14: HCM-010.6 Design Sync 점검 완료, 설계 문서 영향 없음 또는 기존 설계와 일치
- 2026-05-14: HCM-010.7 done 처리
- 2026-05-14: Payslip API/UI 구현 완료
- 2026-05-14: `/payslip`, `/api/payslips`, `POST /api/payslips/generate` 사용자 검증 완료
- 2026-05-14: in-memory persistence 유지
- 2026-05-14: PDF 출력, 이메일 발송, 홈택스/외부 연동은 후속 task로 유지
- 2026-05-14: 세법/4대보험/원천세 정교 계산은 후속 Tax Calculation task로 유지
