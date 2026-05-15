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
- HCM-011부터 기본 persistence 대상

### Employee
- 특정 Company 소속 직원
- employee_no, employment_type, status 기반으로 관리
- HCM-011부터 기본 persistence 대상

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

### MonthlyAttendanceSummaryStatus
- draft: 초안
- summarized: 집계완료
- reviewing: 검토중
- confirmed: 확정
- error: 오류

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

## Monthly Attendance Summary Logical Rules
- MonthlyAttendanceSummary는 AttendanceRecord를 월 단위로 집계한 결과다.
- `employee_id`, `year_month` 기준으로 중복 생성을 방지한다.
- `total_work_minutes`, `overtime_minutes`, `late_minutes`는 AttendanceRecord 합산 기준이다.
- `late_count`, `absent_count`, `leave_count`는 AttendanceRecord의 `status` 기준 카운트다.
- `workday_count`는 AttendanceRecord의 `attendance_type`이 `workday`인 건수 기준으로 시작한다.
- MVP에서는 in-memory AttendanceRecord 데이터를 기준으로 월 집계를 생성한다.
- 집계 확정/마감 정책은 Payroll 단계 이전에 별도 보강 가능하다.

## Payroll Logical Rules
- PayrollRun은 `company_id`와 `year_month` 기준 급여 생성 실행 단위다.
- PayrollRun은 MonthlyAttendanceSummary를 참조해 생성한다.
- `company_id`, `year_month` 기준으로 중복 생성을 방지한다.
- PayrollRun이 `confirmed` 또는 `closed` 상태가 되면 재계산/수정 정책을 별도로 정의해야 한다.
- PayrollItem은 employee별 급여 결과 레코드다.
- `payroll_run_id`, `employee_id` 기준으로 중복 생성을 방지한다.
- MVP에서는 고정 기본급과 단순 연장수당(`overtime_minutes * 10000`) 기준으로 계산을 시작한다.
- `gross_pay = base_pay + overtime_pay + allowance_total`
- `net_pay = gross_pay - deduction_total`
- Payslip은 PayrollRun과 Employee 기준으로 생성된다.
- MVP에서는 세법/4대보험/원천세 자동 계산을 완전 구현하지 않는다.
- 초기 급여 생성은 deterministic logic 기반의 단순 계산 구조로 시작한다.
- 제외된 세법/4대보험/원천세/외부연동은 후속 Payroll Policy / Tax Calculation / External Integration task에서 단계적으로 구현 가능하다.

## Payslip Logical Rules
- Payslip은 PayrollRun과 Employee 기준으로 생성되는 급여명세서 표현 단위다.
- Payslip은 PayrollItem의 `base_pay`, `overtime_pay`, `allowance_total`, `deduction_total`, `gross_pay`, `net_pay`를 표시한다.
- `payroll_run_id`, `employee_id` 기준으로 중복 생성을 방지한다.
- MVP에서는 화면/JSON 기반 조회를 우선 제공하고 PDF 생성, 이메일 발송, 전자문서 발행은 제외한다.
- `status` 기본값은 `draft`로 시작하고, `issued` 상태에서만 `issued_at` 값을 가진다.
- 세법/4대보험/원천세 상세 계산은 HCM-009/HCM-010 범위가 아니라 후속 Tax Calculation task에서 다룬다.

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
