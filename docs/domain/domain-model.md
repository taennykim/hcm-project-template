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
