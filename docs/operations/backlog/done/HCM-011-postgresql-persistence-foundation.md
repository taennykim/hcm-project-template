# HCM-011 PostgreSQL Persistence Foundation

## 목적
Simple HCM SaaS MVP의 persistence 구조를 in-memory 중심 구현에서 PostgreSQL 기반 구조로 전환하기 위한 foundation을 준비한다.

## 배경
GitHub main 기준 HCM-001~HCM-010이 완료되어 Company, Employee, Attendance, MonthlyAttendanceSummary, PayrollRun, Payslip 기능의 기본 API/UI가 갖춰졌다.
다만 현재 대부분의 기능 데이터는 in-memory service/repository 기반이므로 컨테이너 재기동 시 데이터가 유지되지 않는다.
HCM-011은 기존 Docker Compose의 `db` service를 활용해 PostgreSQL connection, SQLAlchemy model, Alembic migration, seed/init, repository 전환 구조를 도입하는 foundation backlog item이다.

## HCM-011 서브단계
- HCM-011.1 task 생성
- HCM-011.2 in-progress 이동
- HCM-011.3 PostgreSQL DB foundation 구현
- HCM-011.4 Company / Employee persistence 1차 전환
- HCM-011.5 smoke-test.md 보강 및 검증
- HCM-011.6 Design Sync
- HCM-011.7 done 처리

## 작업 범위
- SQLAlchemy 2.x 기반 DB foundation 도입
- Alembic migration foundation 도입
- Tenant / Company / Employee model 정의
- dev seed/init 함수 제공
- Company PostgreSQL persistence 전환
- Employee PostgreSQL persistence 전환
- Docker Compose `db` service 기준 DATABASE_URL 문서/설정 정합성 확인
- smoke-test.md에 migration / persistence 검증 항목 보강

## DB foundation 범위
- `apps/api/app/db/` 구조 생성
- `DATABASE_URL` 환경변수 사용
- SQLAlchemy engine / sessionmaker / get_db 제공
- Alembic migration 환경 구성
- destructive reset 없이 migration 적용
- 개발 seed는 명시적 실행 방식 유지

## Company persistence 전환 기준
- Company 데이터는 PostgreSQL에서 읽고 쓴다.
- `dev-company` seed를 DB init 함수로 제공한다.
- `policy_config`는 PostgreSQL JSON/JSONB 기준으로 저장한다.
- 기존 `/api/companies*` 응답 shape는 유지한다.
- `/company` UI가 깨지지 않아야 한다.

## Employee persistence 전환 기준
- Employee 데이터는 PostgreSQL에서 읽고 쓴다.
- `dev-employee-001`, `dev-employee-002` seed를 DB init 함수로 제공한다.
- `company_id` 내 `employee_no` 중복 검증을 유지한다.
- 기존 `/api/employees*` 응답 shape는 유지한다.
- `/employee` UI가 깨지지 않아야 한다.

## 제외 범위
- Attendance persistence 전환
- MonthlyAttendanceSummary persistence 전환
- Payroll persistence 전환
- Payslip persistence 전환
- PostgreSQL OS 직접 설치
- DB volume 삭제
- destructive reset
- 세법/4대보험/원천세 구현
- PDF/외부연동 구현

## 완료 조건
- PostgreSQL DB foundation 구조가 추가됨
- Alembic migration foundation이 유효한 문법으로 추가됨
- Company / Employee repository가 PostgreSQL persistence를 기본 경로로 사용함
- dev seed/init 실행 기준이 문서화됨
- smoke-test.md에 migration / persistence 검증 항목이 반영됨
- 사용자 migration / Docker / curl 검증이 완료되고, 재기동 후 Company / Employee 데이터 유지가 확인됨

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md
- docs/operations/development-process.md
- docs/operations/daily/2026-05-15.md
- docs/product/menu-structure.md
- docs/product/ui-style-guide.md
- docs/domain/domain-model.md
- docs/domain/workflow-model.md
- docs/domain/policy-config.md
- docs/data/erd.md
- docs/architecture/tech-stack.md
- docs/operations/smoke-test.md
- docs/operations/backlog/done/
- apps/api/app/main.py
- apps/api/app/domains/tenant/
- apps/api/app/domains/employee/
- apps/web/app/company/page.tsx
- apps/web/app/employee/page.tsx
- infra/docker/docker-compose.yml
- infra/docker/.env.example

## 작업 로그
- 생성일: 2026-05-15
- 상태: DONE
- 2026-05-15: HCM-011.1 task 생성
- 2026-05-15: HCM-011.2 in-progress 이동
- 2026-05-15: HCM-011.3 PostgreSQL DB foundation 구현 시작
- 2026-05-15: HCM-011.4 Company / Employee persistence 1차 전환 시작
- 2026-05-15: HCM-011.5 smoke-test.md 보강 및 Codex 가능 범위 검증 수행
- 2026-05-15: `python3 -m py_compile` 통과, Alembic env/migration 문법 확인 통과, 로컬 `.venv-verify` 기반 FastAPI app import / route 확인 통과, `cd apps/web && npm install && npm run build` 통과
- 2026-05-15: `apps/api/app/domains/attendance/service.py` 변경은 HCM-011 범위의 회귀 방지로 유지. Employee가 PostgreSQL persistence로 전환되면서 Attendance의 직원 존재 검증도 하드코딩 대신 `employee_service` 기준을 따라야 신규 DB 직원이 근태 입력 가능하다.
- 2026-05-15: HCM-011.6 Design Sync 점검 완료. `tech-stack`, `domain-model`, `development-process`, `smoke-test` 기준과 충돌 없음. Company / Employee는 PostgreSQL persistence, Attendance / MonthlyAttendance / Payroll / Payslip은 후속 persistence 전환 대상으로 유지한다.
- 2026-05-15: HCM-011.7 done 처리. Alembic migration, `python -m app.db.init_db`, `/api/companies`, `/api/employees`, `/company`, `/employee`, 재기동 후 데이터 유지까지 사용자 검증 완료.
