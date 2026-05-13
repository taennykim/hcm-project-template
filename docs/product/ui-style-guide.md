# UI Style Guide

## 방향
Simple HCM SaaS의 UI 방향은 중소기업 관리자용 업무 SaaS이다.
모바일 앱은 MVP 범위에서 제외한다.
관리자 중심 UX를 기준으로 한다.
HCM 전체 사이트처럼 보이되, MVP 범위는 REAL, REAL-LITE, MOCK, COMING_SOON 상태로 통제한다.

## UI Reference Direction
Simple HCM SaaS의 UI는 Modern Enterprise HCM Admin Console을 지향한다.

### 디자인 방향
- 국내 HCM SaaS 업무 화면의 실용성
- Samsung Knox 같은 Enterprise Admin Console의 신뢰감과 정돈된 구조
- 최신 B2B SaaS Dashboard의 가벼운 사용성
- 특정 제품 UI를 그대로 복제하지 않고 독자적인 Simple HCM SaaS 디자인으로 구성

### 핵심 키워드
- Clean
- Trustworthy
- Enterprise-light
- Data-first
- Admin-focused
- Card + Table
- Sidebar Navigation
- Calm Blue / Slate Gray

## UI Reference Assets
현재 UI 기준 이미지는 아래 파일을 사용한다.

- `docs/product/ui-reference/hcm-ui-reference-v1.png`

이 이미지는 다음 방향을 표현한다.
- Modern Enterprise HCM Admin Console
- 중소기업 관리자용 업무 SaaS
- Sidebar + Header + Card + Table 중심 구조
- 밝은 배경과 블루/그레이 중심 톤
- Samsung Knox 스타일의 신뢰감과 정돈된 느낌
- 최신 B2B SaaS Dashboard 스타일

주의:
- 특정 제품 UI를 그대로 복제하지 않는다.
- Simple HCM SaaS 기준으로 재구성한다.
- UI 구현 시 이 reference 이미지를 우선 참고한다.

## 레이아웃 기준
- 좌측 사이드바
- 상단 헤더
- 중앙 업무 화면
- 카드형 요약
- 테이블 중심 화면
- 오른쪽 슬라이드오버 또는 모달 폼

## 스타일 톤
- 밝은 배경
- 차분한 블루/그레이 계열
- 업무용 SaaS 느낌
- 큰 여백
- 명확한 primary button

## 피해야 할 방향
- 특정 브랜드 UI를 그대로 복제하는 방향
- 복잡한 ERP 느낌
- 과도한 애니메이션
- 마케팅 랜딩페이지 같은 방향
- 모바일 앱 우선 설계
- 대기업 HR 시스템 수준의 복잡한 화면

## 핵심 화면 방향
- 대시보드: 이번 달 처리할 일 중심
- 직원관리: 목록과 등록/수정 폼 중심
- 근태관리: 일자별 입력과 월 집계 중심
- 급여관리: 생성 단계와 결과 확인 중심

## Badge System

### Product Scope
- `REAL`: 실제 DB/API/비즈니스 로직이 연결된 기능
- `REAL_LITE`: 실제 데이터 일부를 사용하지만 운영 요약 수준으로 단순화한 기능
- `MOCK`: 샘플 데이터나 Mock 응답 중심 기능
- `COMING_SOON`: 메뉴 또는 안내만 노출되는 기능

### Employee Status
- `재직`
- `휴직`
- `퇴사`
- `비활성`

### Attendance Status
- `출근`
- `지각`
- `결근`
- `휴가`
- `미입력`

### Payroll Status
- `초안`
- `검토중`
- `생성완료`
- `오류`
- `마감완료`

### System
- `DEV`
- `LOCAL`
- `BETA`
