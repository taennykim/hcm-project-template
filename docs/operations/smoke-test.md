# Smoke Test

## 목적
Docker Compose 기반 MVP가 기본 기능을 정상 응답하는지 빠르게 확인한다.

## 실행 위치
`infra/docker` 디렉토리

## Codex 검증
- `python3 -m py_compile apps/api/app/main.py apps/api/app/domains/tenant/*.py apps/api/app/domains/employee/*.py apps/api/app/domains/attendance/*.py apps/api/app/domains/monthly_attendance/*.py apps/api/app/domains/payroll/*.py`
- FastAPI app import 검증
- route 목록 확인
- attendance service 직접 호출
- monthly attendance service 직접 호출
- payroll service 직접 호출
- `cd apps/web && npm install && npm run build`

## 사용자 검증
- `cd infra/docker && docker compose up -d --build api web nginx`
- `docker compose ps`
- `curl http://localhost/`
- `curl http://localhost/company`
- `curl http://localhost/api/health`
- `curl http://localhost/api/companies`
- `curl http://localhost/api/companies/dev-company`
- `curl http://localhost/api/companies/dev-company/policy`
- `curl http://localhost/api/employees`
- `curl http://localhost/api/employees/dev-employee-001`
- `curl http://localhost/api/attendance-records`
- `curl http://localhost/api/monthly-attendance-summaries`
- `curl http://localhost/api/payroll-runs`
- `curl http://localhost/mock/health`
- 브라우저에서 `http://localhost/attendance` 확인
- 브라우저에서 `http://localhost/attendance/monthly-summary` 확인
- 브라우저에서 `http://localhost/payroll` 확인

## UI 확인
- `http://localhost/`
- `http://localhost/employee`
- `curl http://localhost/company`
- `curl http://localhost/attendance`
- `curl http://localhost/attendance/monthly-summary`
- `curl http://localhost/payroll`

## 주의
- 현재 Employee 데이터는 in-memory 기반이므로 컨테이너 재시작 시 생성 데이터가 초기화될 수 있다.
- 현재 Attendance 데이터도 in-memory 기반이므로 컨테이너 재시작 시 생성 데이터가 초기화될 수 있다.
- 현재 Monthly Attendance Summary 데이터도 in-memory 기반이므로 컨테이너 재시작 시 생성 데이터가 초기화될 수 있다.
- 현재 Payroll Run / Payroll Item 데이터도 in-memory 기반이므로 컨테이너 재시작 시 생성 데이터가 초기화될 수 있다.
- DB persistence는 후속 작업에서 다룬다.

## 502 점검 메모
- `/` 또는 `/attendance` 에서 502가 발생하면 `docker compose ps` 로 `hcm-web` 상태를 먼저 확인한다.
- web 컨테이너 내부에서 `wget -q -O - http://127.0.0.1:3000/` 응답 여부를 확인한다.
- `npm run start` 가 `0.0.0.0:3000` 에 bind 되는지와 healthcheck가 같은 포트를 확인하는지 점검한다.
