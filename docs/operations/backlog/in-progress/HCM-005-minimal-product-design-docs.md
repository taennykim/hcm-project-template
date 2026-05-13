# HCM-005 Minimal Product Design Docs

## 목적
Employee API와 이후 근태/급여 기능 구현 전에 Simple HCM SaaS의 최소 제품 설계 기준을 정리한다.

## 배경
HCM-003까지 완료되어 tenant/company 기반이 준비되었고, HCM-004 Employee Bootstrap task가 생성되었다.
Employee 구현 전 메뉴 구조, 핵심 도메인, ERD, 기술스택 기준을 먼저 정리하여 이후 Codex 작업의 기준 문서로 사용한다.

## 작업 범위
- docs/product/menu-structure.md 생성
- docs/domain/domain-model.md 생성
- docs/data/erd.md 생성
- docs/architecture/tech-stack.md 생성
- AGENTS.md에 Design Sync Rules 추가
- REAL / MOCK / COMING_SOON 기준을 메뉴 구조에 반영
- Tenant, Company, Employee, Attendance, Payroll 핵심 도메인 관계 정의
- MVP 핵심 흐름 기준 ERD 초안 작성
- 모든 업무 테이블의 tenant_id 포함 원칙 반영
- Employee API 구현에 필요한 필드 기준 정리
- 기술스택의 기준 문서를 tech-stack.md로 분리

## 제외 범위
- 실제 코드 구현
- 실제 DB migration 구현
- 실제 UI 구현
- 복잡한 급여 계산식 구현
- 복잡한 교대근무 모델링
- 4대보험/홈택스 실제 연동

## 완료 조건
- menu-structure.md에 HCM 전체 메뉴와 REAL/MOCK/COMING_SOON 상태가 정리됨
- domain-model.md에 핵심 도메인과 관계가 정리됨
- erd.md에 MVP 기준 테이블 초안과 tenant_id 원칙이 정리됨
- tech-stack.md에 현재 기술스택 기준이 정리됨
- AGENTS.md에 기능/API/DB/메뉴 변경 시 설계 문서 동기화 규칙이 추가됨
- HCM-004 Employee Bootstrap 구현 시 참조할 필드 기준이 명확해짐

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md
- docs/operations/backlog/done/HCM-001-project-bootstrap.md
- docs/operations/backlog/done/HCM-002-docker-compose-bootstrap.md
- docs/operations/backlog/done/HCM-003-tenant-company-bootstrap.md
- docs/operations/backlog/todo/HCM-004-employee-bootstrap.md

## 작업 로그
- 생성일: 2026-05-13
- 상태: IN_PROGRESS
- 2026-05-13: Minimal Product Design Docs 작성 시작
- 2026-05-13: ERD Mermaid 필드 보강
- 2026-05-13: API Style Guide 추가
- 2026-05-13: Mock/Stub/Adapter 기준 추가
- 2026-05-13: UI Style Guide 추가
- 2026-05-13: HCM-004 구현 전 설계 기준 보강
