# Domain Model

## 원칙
- 모든 업무 데이터는 `tenant_id` 기준으로 분리한다.
- 회사 소속 데이터는 `company_id` 기준으로 연결한다.
- 주민등록번호 등 민감한 고위험 개인정보는 저장하지 않는다.
- 회사별 정책은 JSON 기반 `policy_config` 구조로 관리한다.

## 핵심 도메인

### Tenant
- SaaS 상의 데이터 분리 단위
- 여러 Company를 가질 수 있다

### Company
- 실제 고객 회사 정보
- Tenant 하위 소속
- 회사별 정책 설정(`policy_config`) 보유

### Employee
- 특정 Company 소속 직원
- employee_no, employment_type, status 기반으로 관리

### AttendanceRecord
- 일 단위 또는 이벤트 단위 근태 기록
- 출근, 퇴근, 지각, 조퇴, 휴게시간 등의 원천 데이터

### MonthlyAttendanceSummary
- 월 단위 근태 집계 결과
- 급여 계산 전 단계의 확정 집계 데이터

### PayrollRun
- 특정 급여 월차수 실행 단위
- Company 기준으로 생성

### PayrollItem
- 개별 직원 급여 항목
- 기본급, 수당, 공제 등 세부 항목 포함

### Payslip
- 직원별 급여명세서 표현 단위

### PolicyConfig
- 회사별 근태/급여 정책 JSON 설정
- 예: 출퇴근 시간, 점심시간, 급여 지급일, 반올림 단위

## Status Enum Definitions

### EmployeeStatus
- active: 재직
- on_leave: 휴직
- inactive: 비활성
- resigned: 퇴사
- upcoming: 입사 예정

### AttendanceStatus
- not_entered: 미입력
- present: 출근
- late: 지각
- absent: 결근
- leave: 휴가
- early_leave: 조퇴

### AttendanceType
- workday: 근무일
- holiday: 휴일
- paid_leave: 유급휴가
- unpaid_leave: 무급휴가
- business_trip: 출장

### PayrollRunStatus
- draft: 초안
- calculated: 계산완료
- reviewed: 검토완료
- confirmed: 확정
- closed: 마감
- error: 오류

### PayrollItemType
- earning: 지급
- deduction: 공제

### PayslipStatus
- draft: 초안
- issued: 발행
- canceled: 취소

## 도메인 관계
- Tenant 1:N Company
- Company 1:N Employee
- Company 1:N AttendanceRecord
- Employee 1:N AttendanceRecord
- Employee 1:N MonthlyAttendanceSummary
- Company 1:N PayrollRun
- PayrollRun 1:N PayrollItem
- Employee 1:N PayrollItem
- Employee 1:N Payslip
- Company 1:1 PolicyConfig 또는 Company 내부 JSON 필드

## Employee 구현 기준
- Employee는 최소한 다음 필드 기준으로 시작한다.
  - id
  - tenant_id
  - company_id
  - employee_no
  - name
  - email
  - phone
  - department
  - position
  - employment_type
  - hire_date
  - resignation_date
  - status
  - created_at
  - updated_at
  - deleted_at

## Attendance Logical Rules
- AttendanceRecord는 직원별 일자별 근태 원천 데이터다.
- `employee_id`, `work_date` 기준으로 중복 입력을 방지한다.
- `clock_in_at` / `clock_out_at`은 nullable로 시작한다.
- `status`가 `absent`, `leave`이면 출퇴근 시간이 없을 수 있다.
- `work_minutes`, `overtime_minutes`, `late_minutes`는 MVP에서는 저장값으로 시작하되, 추후 계산 로직으로 전환 가능하다.
- 지각 기준은 `policy_config.attendance.work_start_time`과 `late_grace_minutes`를 기준으로 한다.
- 점심시간은 `policy_config.attendance.lunch_minutes`를 기준으로 한다.
- 복잡한 교대근무는 MVP 범위에서 제외한다.

## Payroll Logical Rules
- PayrollRun은 `company_id`와 `year_month` 기준 급여 생성 실행 단위다.
- PayrollRun이 `confirmed` 또는 `closed` 상태가 되면 재계산/수정 정책을 별도로 정의해야 한다.
- PayrollItem은 `earning` 또는 `deduction`으로 구분한다.
- Payslip은 PayrollRun과 Employee 기준으로 생성된다.
- MVP에서는 세법/4대보험 자동 계산을 완전 구현하지 않는다.
- 초기 급여 생성은 deterministic logic 기반의 단순 계산 구조로 시작한다.

## Mock / Stub / Adapter 기준
- 실제 외부 API는 MVP에서 직접 호출하지 않는다.
- 외부 연동 대상은 `mock-server` 또는 Adapter 구조로 분리한다.
- Mock 대상:
  - 전자계약
  - 급여명세서 PDF
  - 계좌검증
  - 홈택스
  - 4대보험
  - 회계연동
- Mock은 개발 및 시연용으로 현실적인 샘플 응답을 제공한다.
- 추후 Real Adapter로 교체 가능해야 한다.
