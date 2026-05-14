# ERD

## 설계 원칙
- 모든 업무 테이블은 `tenant_id`를 포함한다.
- 회사 소속 업무 데이터는 `company_id`를 포함한다.
- 기본적으로 `created_at`, `updated_at`를 포함한다.
- soft delete가 필요한 엔티티는 `deleted_at`을 포함한다.

## MVP 테이블 초안

### tenants
- id
- name
- created_at
- updated_at

### companies
- id
- tenant_id
- name
- business_registration_number
- representative_name
- policy_config
- created_at
- updated_at
- deleted_at

### employees
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

### attendance_records
- id
- tenant_id
- company_id
- employee_id
- work_date
- clock_in_at
- clock_out_at
- status
- attendance_type
- work_minutes
- overtime_minutes
- late_minutes
- note
- created_at
- updated_at
- deleted_at

### monthly_attendance_summaries
- id
- tenant_id
- company_id
- employee_id
- year_month
- total_work_minutes
- overtime_minutes
- late_minutes
- late_count
- absent_count
- leave_count
- workday_count
- status
- created_at
- updated_at
- deleted_at

### payroll_runs
- id
- tenant_id
- company_id
- year_month
- status
- total_employees
- total_gross_pay
- total_deductions
- total_net_pay
- executed_at
- created_at
- updated_at
- deleted_at

### payroll_items
- id
- tenant_id
- company_id
- payroll_run_id
- employee_id
- year_month
- base_pay
- overtime_pay
- allowance_total
- deduction_total
- gross_pay
- net_pay
- created_at
- updated_at

### payslips
- id
- tenant_id
- company_id
- payroll_run_id
- employee_id
- status
- issued_at
- total_earnings
- total_deductions
- net_pay
- created_at
- updated_at

## Mermaid ERD

```mermaid
erDiagram
    TENANTS {
        string id PK
        string name
        datetime created_at
        datetime updated_at
    }
    COMPANIES {
        string id PK
        string tenant_id FK
        string name
        string business_registration_number
        string representative_name
        json policy_config
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    EMPLOYEES {
        string id PK
        string tenant_id FK
        string company_id FK
        string employee_no
        string name
        string employment_type
        date hire_date
        string status
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    ATTENDANCE_RECORDS {
        string id PK
        string tenant_id FK
        string company_id FK
        string employee_id FK
        date work_date
        datetime clock_in_at
        datetime clock_out_at
        string status
        string attendance_type
        int work_minutes
        int overtime_minutes
        int late_minutes
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    MONTHLY_ATTENDANCE_SUMMARIES {
        string id PK
        string tenant_id FK
        string company_id FK
        string employee_id FK
        string year_month
        int total_work_minutes
        int overtime_minutes
        int late_minutes
        int late_count
        int absent_count
        int leave_count
        int workday_count
        string status
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    PAYROLL_RUNS {
        string id PK
        string tenant_id FK
        string company_id FK
        string year_month
        string status
        int total_employees
        decimal total_gross_pay
        decimal total_deductions
        decimal total_net_pay
        datetime executed_at
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    PAYROLL_ITEMS {
        string id PK
        string tenant_id FK
        string company_id FK
        string payroll_run_id FK
        string employee_id FK
        string year_month
        decimal base_pay
        decimal overtime_pay
        decimal allowance_total
        decimal deduction_total
        decimal gross_pay
        decimal net_pay
        datetime created_at
        datetime updated_at
    }
    PAYSLIPS {
        string id PK
        string tenant_id FK
        string company_id FK
        string payroll_run_id FK
        string employee_id FK
        string status
        datetime issued_at
        decimal total_earnings
        decimal total_deductions
        decimal net_pay
        datetime created_at
        datetime updated_at
    }
    TENANTS ||--o{ COMPANIES : owns
    COMPANIES ||--o{ EMPLOYEES : employs
    COMPANIES ||--o{ ATTENDANCE_RECORDS : records
    EMPLOYEES ||--o{ ATTENDANCE_RECORDS : has
    EMPLOYEES ||--o{ MONTHLY_ATTENDANCE_SUMMARIES : aggregates
    COMPANIES ||--o{ PAYROLL_RUNS : executes
    PAYROLL_RUNS ||--o{ PAYROLL_ITEMS : contains
    EMPLOYEES ||--o{ PAYROLL_ITEMS : receives
    EMPLOYEES ||--o{ PAYSLIPS : receives
    PAYROLL_RUNS ||--o{ PAYSLIPS : publishes
```

## Employee API 참조 필드 기준
- `tenant_id`
- `company_id`
- `employee_no`
- `name`
- `email`
- `phone`
- `department`
- `position`
- `employment_type`
- `hire_date`
- `resignation_date`
- `status`

## Status 필드 메모
- `attendance_records.status`는 `not_entered`, `present`, `late`, `absent`, `leave`, `early_leave` 기준을 따른다.
- `monthly_attendance_summaries.status`는 `draft`, `summarized`, `reviewing`, `confirmed`, `error` 기준을 따른다.
- `payroll_runs.status`는 `draft`, `calculated`, `reviewed`, `confirmed`, `closed`, `error` 기준을 따른다.
- `payslips.status`는 `draft`, `issued`, `canceled` 기준을 따른다.
