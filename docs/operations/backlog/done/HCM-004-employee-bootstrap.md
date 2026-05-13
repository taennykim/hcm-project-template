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
