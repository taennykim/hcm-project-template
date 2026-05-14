# Smoke Test

## 목적
Docker Compose 기반 MVP가 기본 기능을 정상 응답하는지 빠르게 확인한다.

## 실행 위치
`infra/docker` 디렉토리

## 기본 명령
- `docker compose ps`
- `curl http://localhost/`
- `curl http://localhost/api/health`
- `curl http://localhost/api/companies`
- `curl http://localhost/api/companies/dev-company`
- `curl http://localhost/api/companies/dev-company/policy`
- `curl http://localhost/api/employees`
- `curl http://localhost/api/employees/dev-employee-001`
- `curl http://localhost/api/attendance-records`
- `curl http://localhost/mock/health`

## UI 확인
- `http://localhost/`
- `http://localhost/employee`
- `curl http://localhost/attendance`

## 주의
- 현재 Employee 데이터는 in-memory 기반이므로 컨테이너 재시작 시 생성 데이터가 초기화될 수 있다.
- 현재 Attendance 데이터도 in-memory 기반이므로 컨테이너 재시작 시 생성 데이터가 초기화될 수 있다.
- DB persistence는 후속 작업에서 다룬다.
