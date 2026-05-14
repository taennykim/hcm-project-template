# HCM-007 Attendance Input Bootstrap

## 목적
Simple HCM SaaS MVP의 두 번째 핵심 업무 기능인 근태 입력 기능을 구현하기 위한 기반을 준비한다.

## 배경
MVP 핵심 흐름은 직원 등록 → 근태 입력 → 월 근태 집계 → 급여 생성 → 급여명세서 출력이다.
HCM-004 Employee Bootstrap이 완료되어 직원 등록 기반이 준비되었으므로, 다음 단계로 직원별 일자별 근태 입력 구조를 만든다.

HCM-007은 `docs/operations/development-process.md`의 Feature Development 프로세스를 따른다.
HCM-007 내부 세부 작업은 아래 서브단계로 진행한다.
- HCM-007.1 task 생성
- HCM-007.2 in-progress 이동
- HCM-007.3 Attendance API 구현
- HCM-007.4 Attendance UI 구현
- HCM-007.5 smoke-test.md 보강
- HCM-007.6 Design Sync
- HCM-007.7 done 처리

## 작업 범위
- attendance 도메인 구조 정의
- tenant_id/company_id/employee_id 기반 근태 데이터 분리 기준 정의
- 일자별 근태 입력 모델 준비
- 근태 목록 조회 API 설계
- 근태 등록 API 설계
- 근태 수정 API 설계
- 직원별/월별 근태 조회 기준 정의
- 개발용 seed attendance 검토
- Attendance UI 구현 기준 정리
- smoke-test.md에 추가할 검증 항목 정의

## Attendance 기본 필드 초안
- id
- tenant_id
- company_id
- employee_id
- work_date
- clock_in_at nullable
- clock_out_at nullable
- attendance_type
- status
- work_minutes
- overtime_minutes
- late_minutes
- note nullable
- created_at
- updated_at
- deleted_at nullable

## API 초안
- GET /api/attendance-records
- POST /api/attendance-records
- GET /api/attendance-records/{attendance_record_id}
- PATCH /api/attendance-records/{attendance_record_id}
- GET /api/employees/{employee_id}/attendance-records

## UI 초안
- route: /attendance
- 근태 입력 화면
- 날짜 선택
- 직원별 근태 테이블
- 출근/퇴근 시간 입력
- 상태 badge 표시
  - 출근
  - 지각
  - 결근
  - 휴가
  - 미입력

## 논리 규칙
- AttendanceRecord는 직원별 일자별 근태 원천 데이터다.
- employee_id + work_date 기준 중복 입력을 방지한다.
- status가 absent 또는 leave이면 출퇴근 시간이 없을 수 있다.
- work_minutes, overtime_minutes, late_minutes는 MVP에서는 저장값으로 시작하되 추후 계산 로직으로 전환 가능하다.
- 지각 기준은 policy_config.attendance.work_start_time과 late_grace_minutes를 기준으로 한다.
- 점심시간은 policy_config.attendance.lunch_minutes를 기준으로 한다.
- 복잡한 교대근무는 MVP 범위에서 제외한다.

## 제외 범위
- 월 근태 집계
- 급여 계산
- 연차 자동 계산
- 복잡한 교대근무
- GPS/모바일 출퇴근
- 외부 근태기기 연동
- 실제 DB migration
- PostgreSQL persistence 전환
- 인증/로그인 구현

## 완료 조건
- Attendance 구현 방향이 task 문서에 정리됨
- tenant_id/company_id/employee_id 기반 데이터 분리 원칙이 명확히 기록됨
- 근태 입력/조회/수정 API 구현 준비가 완료됨
- UI route와 화면 구성 기준이 정리됨
- `docs/domain/domain-model.md`, `docs/domain/workflow-model.md`, `docs/domain/policy-config.md`, `docs/data/erd.md` 기준과 충돌하지 않음
- 다음 구현 단계에서 FastAPI Attendance API와 Attendance UI 작업을 시작할 수 있음

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
- docs/operations/backlog/done/HCM-004-employee-bootstrap.md
- docs/operations/backlog/done/HCM-006-ui-foundation-bootstrap.md

## 작업 로그
- 생성일: 2026-05-14
- 상태: IN_PROGRESS
- 2026-05-14: HCM-007.1 Attendance Input Bootstrap task 생성
- 2026-05-14: HCM-007은 아직 구현 전이며, 다음 단계는 HCM-007.2 in-progress 이동으로 기록
- 2026-05-14: HCM-007.2 in-progress 이동
- 2026-05-14: HCM-007.3 Attendance API 구현 시작
- 2026-05-14: HCM-007.4 Attendance UI 구현 시작
- 2026-05-14: in-memory Attendance service 및 seed attendance record 기준 반영
- 2026-05-14: `/api/attendance-records`, `/api/employees/{employee_id}/attendance-records` API 구현
- 2026-05-14: `/attendance` UI route 및 근태 입력 slide panel 구현
- 2026-05-14: `docs/operations/smoke-test.md` 보강, 설계 문서 영향 없음
- 2026-05-14: HCM-007.5 검증 수행
- 2026-05-14: `python3 -m py_compile apps/api/app/main.py apps/api/app/domains/tenant/*.py apps/api/app/domains/employee/*.py apps/api/app/domains/attendance/*.py` 통과
- 2026-05-14: `cd apps/web && npm install` 완료
- 2026-05-14: `cd apps/web && npm run build` 통과, `/attendance` route 정적 생성 확인
- 2026-05-14: FastAPI app import, route 목록 확인, service 직접 호출 검증은 로컬 Python에 `fastapi`/`pydantic` 부재로 실행 불가
- 2026-05-14: `.venv-verify` 생성 후 `pip install -r apps/api/requirements.txt` 시도했으나 네트워크 제한으로 의존성 설치 실패
- 2026-05-14: `docker compose up -d --build api web nginx` 는 Docker socket 권한 부족으로 실행 불가
- 2026-05-14: `curl http://localhost/api/health`, `/api/employees`, `/api/attendance-records`, `/`, `/attendance` 는 이 세션 기준 localhost 연결 불가
- 2026-05-14: 대체 검증으로 py_compile, Next.js production build, 빌드 산출 route 확인, smoke-test 책임 분리 문서화 수행
