# HCM-006 UI Foundation Bootstrap

## 목적
Simple HCM SaaS의 공통 Admin Console UI 기반을 구축하기 위한 작업 기준을 정의한다.

## 배경
HCM-005에서 메뉴 구조, UI 스타일 가이드, UI Reference Asset, 도메인 모델, ERD, 기술스택 기준이 정리되었다.
이제 Employee, Attendance, Payroll 화면을 구현하기 전에 공통 UI Layout과 기본 컴포넌트 구조를 먼저 만든다.

## 작업 범위
- Next.js App Router 기준 공통 Admin Layout 구성
- 좌측 Sidebar 구현
- 상단 Header 구현
- Page Container 구현
- Navigation 메뉴 구조 반영
- REAL / MOCK / COMING_SOON badge 표시 기준 반영
- Card / Table / Button / Input / Badge 기본 UI 패턴 준비
- Dashboard 기본 화면 개선
- UI Reference 이미지 방향 반영
- Tailwind 기반 스타일 기준 정리

## 권장 구조
apps/web/components/layout/
- app-layout.tsx
- sidebar.tsx
- header.tsx
- page-container.tsx

apps/web/components/ui/
- button.tsx
- card.tsx
- badge.tsx
- input.tsx
- table.tsx

apps/web/lib/
- navigation.ts

## 제외 범위
- Employee 실제 API 연동
- Employee 등록/수정 기능 구현
- Attendance 실제 기능 구현
- Payroll 실제 기능 구현
- 인증/로그인 구현
- 복잡한 디자인 시스템 구현
- 모바일 앱 대응

## 완료 조건
- http://localhost/ 에서 Admin Console Layout 기반 화면이 보임
- 좌측 Sidebar가 표시됨
- 상단 Header가 표시됨
- 메뉴 구조가 menu-structure.md 기준과 일치함
- REAL / MOCK / COMING_SOON badge가 표시됨
- Dashboard에 MVP 흐름 요약 카드가 표시됨
- UI 스타일이 ui-style-guide.md와 ui-reference asset 방향을 따른다
- 기존 /api/health, /api/companies 검증이 깨지지 않음

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md
- docs/product/menu-structure.md
- docs/product/ui-style-guide.md
- docs/product/ui-reference/hcm-ui-reference-v1.png
- docs/architecture/tech-stack.md
- docs/operations/backlog/done/HCM-005-minimal-product-design-docs.md
- docs/operations/backlog/todo/HCM-004-employee-bootstrap.md

## 작업 로그
- 생성일: 2026-05-13
- 상태: DONE
- 2026-05-13: UI Foundation 구현 시작
- 2026-05-13: HCM-006 완료
- 2026-05-13: Admin Console Layout, Sidebar, Header, Page Container 구현 완료
- 2026-05-13: Button, Card, Badge, Input, Table 기본 UI 컴포넌트 준비 완료
- 2026-05-13: Dashboard UI 및 navigation 구조 검증 완료
- 2026-05-13: /, /api/health, /api/companies, /mock/health 검증 완료
