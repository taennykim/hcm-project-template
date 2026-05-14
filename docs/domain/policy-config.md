# Policy Config

## 목적
회사별 근태/급여 정책을 JSON 기반으로 관리한다.

## 기본 구조 예시

```json
{
  "attendance": {
    "work_start_time": "09:00",
    "work_end_time": "18:00",
    "lunch_minutes": 60,
    "late_grace_minutes": 10,
    "rounding_minutes": 10
  },
  "payroll": {
    "pay_day": 25,
    "round_unit": 10,
    "include_overtime": false
  },
  "leave": {
    "annual_leave_enabled": true,
    "half_day_enabled": true
  }
}
```

## MVP 기준
- `policy_config`는 Company에 JSON으로 저장한다.
- Attendance와 Payroll 로직은 `policy_config`를 참조한다.
- MVP에서는 회사별 단순 정책만 지원한다.
- 복잡한 교대근무, 직군별 정책, 다중 급여일은 제외한다.
