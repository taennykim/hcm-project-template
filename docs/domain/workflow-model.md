# Workflow Model

## MVP Core Workflow
- 직원 등록
- 근태 입력
- 월 근태 집계
- 급여 생성
- 급여명세서 출력

## Workflow Steps
1. Employee Registration
   - Employee 생성
   - `tenant_id`/`company_id` 기준
2. Attendance Input
   - AttendanceRecord 생성/수정
   - `employee_id`/`work_date` 기준
3. Monthly Attendance Summary
   - AttendanceRecord를 월 단위로 집계
   - MonthlyAttendanceSummary 생성
4. Payroll Run
   - MonthlyAttendanceSummary와 `policy_config` 기반으로 PayrollRun 생성
   - PayrollItem 생성
5. Payslip Issue
   - PayrollItem 기반으로 Payslip 생성
   - MVP에서는 Payslip 조회는 REAL로 구현하고, PDF/이메일/전자문서 발행은 후속 task로 분리

## Mermaid Flow

```mermaid
flowchart TD
    A[Employee Registration] --> B[Attendance Input]
    B --> C[Monthly Attendance Summary]
    C --> D[Payroll Run]
    D --> E[Payslip Issue]

    A1[Employee created with tenant_id and company_id] --> A
    B1[AttendanceRecord upsert by employee_id and work_date] --> B
    C1[Aggregate monthly work, overtime, late, absent metrics] --> C
    D1[Apply company policy_config to payroll calculation] --> D
    E1[Generate payslip JSON or UI view and defer PDF delivery] --> E
```
