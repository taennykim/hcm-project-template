# Menu Structure

## 방향
Simple HCM SaaS는 관리자 중심 웹 UX를 기준으로 구성한다.
모바일 앱은 MVP 범위에서 제외한다.
전체적으로 HCM 제품처럼 보이되, 초기 MVP 범위만 실제 구현하고 나머지는 MOCK 또는 COMING_SOON으로 통제한다.
UI 방향의 상세 기준은 `docs/product/ui-style-guide.md`를 참조한다.

## 메뉴 구조

### Dashboard
- 개요 대시보드: REAL-LITE
  - 회사 기본 현황
  - 직원 수 요약
  - 오늘 처리할 항목 요약

### Company
- 회사 정보: REAL
- 회사 정책 설정: REAL

### Employee
- 직원 목록: REAL, route: `/employee`
- 직원 등록: REAL, `/employee` 내 slide-over form
- 직원 상세: MOCK, route 미정

### Attendance
- 근태 입력: REAL, route: `/attendance`
- 근태 기록 조회: REAL, route: `/attendance`
- 월 근태 집계: REAL, route: `/attendance/monthly-summary`

### Payroll
- 급여 실행: REAL, route: `/payroll`
- 급여 항목 검토: REAL, route: `/payroll`
- 급여명세서 출력: MOCK

### Approval
- 승인함: COMING_SOON
- 결재선 관리: COMING_SOON

### Leave
- 휴가 유형 설정: COMING_SOON
- 휴가 신청/조회: COMING_SOON

### Org
- 부서 관리: MOCK
- 직책 관리: MOCK

### Documents
- 전자계약: MOCK
- 인사발령 문서: MOCK

### Integration
- 4대보험: COMING_SOON
- 세무신고: COMING_SOON
- 회계연동: COMING_SOON

## MVP 핵심 흐름
1. 직원 등록
2. 근태 입력
3. 월 근태 집계
4. 급여 생성
5. 급여명세서 출력

## 상태 기준
- REAL: 실제 DB/API/비즈니스 로직 구현
- REAL-LITE: 실제 데이터 일부를 사용하되, 복합 지표나 고급 통계 없이 최소 운영 화면만 제공
- MOCK: 화면과 샘플 응답 중심 구현
- COMING_SOON: 메뉴만 노출

## UI 참고 기준
- 화면 구현 시 `docs/product/ui-style-guide.md`와 UI reference assets를 함께 참고한다.
- MVP 범위 내에서 동일한 Admin Console 스타일을 유지한다.

## Route 기준 메모
- Employee UI의 현재 구현 기준 route는 `/employee` 이다.
- Employee API의 현재 구현 기준 endpoint는 `/api/employees`, `/api/employees/{employee_id}` 이다.
- Attendance UI의 현재 구현 기준 route는 `/attendance`, `/attendance/monthly-summary` 이다.
- Monthly Attendance Summary API의 현재 구현 기준 endpoint는 `/api/monthly-attendance-summaries`, `/api/monthly-attendance-summaries/{summary_id}` 이다.
- Payroll UI의 현재 구현 기준 route는 `/payroll` 이다.
- Payroll Run API의 현재 구현 기준 endpoint는 `/api/payroll-runs`, `/api/payroll-runs/{payroll_run_id}`, `/api/payroll-runs/{payroll_run_id}/items` 이다.
- `/employees` UI route로의 rename은 검토 가능하나, 이번 단계에서는 실제 route 변경 없이 현재 구현 기준만 문서화한다.
