# HCM-004 Employee Bootstrap

## 목적
Simple HCM SaaS MVP의 첫 번째 핵심 업무 기능인 직원 등록 기능을 구현하기 위한 기반을 준비한다.

## 배경
MVP 핵심 흐름은 직원 등록 → 근태 입력 → 월 근태 집계 → 급여 생성 → 급여명세서 출력이다.
HCM-003에서 tenant/company 기반이 준비되었으므로, 다음 단계로 tenant_id 기반 직원 데이터를 관리한다.

## 작업 범위
- employee 도메인 구조 정의
- tenant_id 기반 employee 데이터 분리 기준 정의
- company_id 기반 직원 소속 기준 정의
- 직원 기본 정보 모델 준비
- 직원 등록 API 설계
- 직원 목록 조회 API 설계
- 직원 상세 조회 API 설계
- 직원 수정 API 설계
- 직원 퇴사/비활성 처리 기준 정의
- 개발용 seed employee 검토

## Employee 기본 필드 초안
- id
- tenant_id
- company_id
- employee_no
- name
- email nullable
- phone nullable
- department nullable
- position nullable
- employment_type
- hire_date
- resignation_date nullable
- status
- created_at
- updated_at
- deleted_at nullable

## API 초안
- GET /api/employees
- POST /api/employees
- GET /api/employees/{employee_id}
- PATCH /api/employees/{employee_id}
- PATCH /api/employees/{employee_id}/status

## 제외 범위
- 주민등록번호 저장
- 급여 계산
- 근태 입력
- 연차 계산
- 복잡한 조직/직책 이력
- 전자계약
- 실제 외부 API 연동

## 완료 조건
- Employee 구현 방향이 task 문서에 정리됨
- tenant_id/company_id 기반 데이터 분리 원칙이 명확히 기록됨
- 직원 등록/조회/수정/비활성 API 구현 준비가 완료됨
- 다음 구현 단계에서 FastAPI Employee API 작업을 시작할 수 있음

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md
- docs/operations/backlog/done/HCM-001-project-bootstrap.md
- docs/operations/backlog/done/HCM-002-docker-compose-bootstrap.md
- docs/operations/backlog/done/HCM-003-tenant-company-bootstrap.md

## 작업 로그
- 생성일: 2026-05-13
- 상태: DONE
- 2026-05-13: Employee Bootstrap 구현 시작
- 2026-05-13: Employee API 기본 라우터 및 in-memory service 구현 완료
- 2026-05-13: tenant_id/company_id 기준 seed employee 및 등록 검증 반영
- 2026-05-13: 직원관리 화면 bootstrap 및 등록 패널 구현 완료
- 2026-05-13: employee status/employment_type 입력값 제약 및 사번 중복 검증 추가
- 2026-05-13: /api/employees, /api/employees/{employee_id} 기준 API import/build 검증 진행
- 2026-05-13: HCM-004 보완 정리 진행, Employee UI route 기준 `/employee` 확인
- 2026-05-13: Employee API endpoint 기준 `/api/employees`, `/api/employees/{employee_id}`, `/api/employees/{employee_id}/status` 재확인
- 2026-05-13: Employee UI 구현 파일 `apps/web/app/employee/page.tsx` 기준 확인
- 2026-05-13: Employee 구현은 FastAPI in-memory repository/service 기반임을 명시, PostgreSQL persistence는 후속 작업으로 분리
- 2026-05-13: smoke test 후보에 `/api/employees`, `/api/employees/dev-employee-001`, `/employee` 검증 기준 추가
- 2026-05-13: HCM-007 Attendance Bootstrap은 HCM-004 보완 마감 후 별도 task로 생성 예정으로 기록
- 2026-05-13: Design Sync 확인 결과 menu-structure, ui-style-guide는 보강, domain-model 및 erd는 이번 범위에서 내용 변경 없이 유지
- 2026-05-13: UI reference 문구를 특정 브랜드명 의존 없이 일반화하고, Employee UI 기준은 기존 UI Foundation 및 `ui-style-guide.md` 기준 유지로 정리

## HCM-004 보완 메모
- 현재 Employee UI route 기준은 `/employee` 이다.
- 현재 Employee UI는 목록 조회와 등록 slide-over form까지 REAL 범위로 구현되어 있다.
- Employee 상세 버튼은 존재하지만 실제 상세 화면 route는 아직 구현되지 않았다.
- 현재 Employee API는 in-memory repository 형태의 `EmployeeService`로 동작한다.
- 컨테이너 재시작 또는 프로세스 재시작 시 런타임 생성 데이터는 초기화될 수 있다.
- 실제 PostgreSQL persistence, migration, repository 분리는 후속 작업으로 분리한다.
- 이번 보완 단계에서는 신규 Employee 기능 추가, route rename, DB persistence 구현을 수행하지 않았다.
- Employee UI 기준은 기존 UI Foundation과 `docs/product/ui-style-guide.md` 기준을 유지한다.
