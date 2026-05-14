# AGENTS.md

# Project Goal

대한민국 중소기업용 Simple HCM SaaS MVP 구축

중소기업이 엑셀 없이 월급을 생성할 수 있도록 한다.

복잡한 ERP가 아니라,
중소기업이 쉽게 사용할 수 있는 단순하고 빠른 HCM SaaS를 지향한다.

---

# Core Workflow

직원 등록
→ 근태 입력
→ 월 근태 집계
→ 급여 생성
→ 급여명세서 출력

---

# MVP Principles

- 단순한 웹 기반 SaaS
- 모바일 앱 제외
- 관리자 중심 UX
- tenant_id 기반 멀티테넌트
- 회사별 정책 설정 기반 구조
- 핵심 기능 우선 구현
- Mock 기반 빠른 개발
- 과설계 금지
- 유지보수 가능한 구조 우선

---

# Feature Status Policy

## REAL

실제 DB/API/비즈니스 로직 구현

예:
- 로그인
- 직원관리
- 조직관리
- 근태 입력
- 월 근태 집계

조건:
- 실제 데이터 저장
- 실제 API 동작
- 실제 비즈니스 로직 처리

---

## MOCK

화면 + Mock API + 샘플 데이터만 구현

예:
- 급여명세서
- 전자계약
- 인사발령
- 급여대장

조건:
- 실제 외부 연동 없음
- 샘플 데이터 기반
- Mock 응답 사용

---

## COMING_SOON

메뉴만 노출

예:
- 4대보험
- 세무신고
- 회계연동

조건:
- 실제 기능 구현 없음
- 안내 화면만 제공

---

# Out of Scope

- 복잡한 교대근무
- 홈택스 실제 연동
- 4대보험 자동 계산
- 소득세 완벽 계산
- SSO
- 모바일 앱
- 대기업용 기능

---

# Architecture

## Frontend

- Next.js

## Backend

- FastAPI

## Database

- PostgreSQL

## Deployment

- AWS EC2
- Docker Compose
- Nginx Reverse Proxy

초기 MVP는 AWS EC2 단일 서버에서 실행한다.

Docker Compose 파일 기본 위치는 `infra/docker/docker-compose.yml` 이다.

Compose 구성 대상:
- web
- api
- db
- mock-server
- nginx

외부 공개 포트는 기본적으로 80만 사용하고, 추후 443만 추가한다.

PostgreSQL은 Docker 내부 네트워크에서만 접근한다.

DB 포트 5432는 외부에 직접 노출하지 않는다.

nginx만 host 80 포트를 publish 한다.

web 3000, api 8000, mock-server 9000, db 5432 포트는 Docker 내부 네트워크에서만 접근한다.

nginx가 외부 요청을 web, api, mock-server 로 라우팅한다.

---

# Directory Principles

## apps/web

Frontend 애플리케이션

## apps/api

Backend API

## mock-server

외부 연동 Mock API 서버

## infra/docker

Docker Compose 및 배포 설정

## docs/operations/backlog

Task 기반 작업 관리

## docs/operations/daily

일일 작업 로그

---

# Important Rules

- 모든 업무 테이블은 tenant_id 포함
- 급여 계산은 deterministic logic 기반
- 회사별 정책은 JSON 설정 기반
- 외부 시스템은 Stub/Adapter 구조로 설계
- 주민번호 평문 저장 금지
- soft delete 기본 고려
- created_at / updated_at 기본 포함
- 문서 없는 대규모 구조 변경 금지
- HCM 개발 프로세스는 `docs/operations/development-process.md`를 따른다.
- HCM-xxx는 backlog item이며, 프로세스 단계 번호가 아니다.
- 큰 backlog 내부 세부 작업은 `HCM-xxx.1`, `HCM-xxx.2` 형식의 서브단계로 관리한다.
- 기능 구현 전 Domain & Data Design 문서를 확인한다.
- Attendance/Payroll 구현 전 `docs/domain/workflow-model.md`와 `docs/domain/policy-config.md`를 확인한다.

---

# Backend Development Rules

- FastAPI 사용
- Domain 중심 구조 유지
- Service Layer 분리
- Mock Service 분리
- DTO 명확히 분리
- API Layer / Domain Layer / Infrastructure Layer 분리 고려

---

# Frontend Development Rules

- Next.js 사용
- 관리자 중심 UX 유지
- 화면별 모듈 분리
- API Layer 분리
- Mock 상태 명확히 구분
- 실제 기능과 Mock 기능 UI 구분 가능해야 함
- UI 변경 시 `docs/product/ui-style-guide.md`와 `docs/product/ui-reference/` assets를 함께 확인한다.
- 특정 제품 UI를 복제하지 않고 Simple HCM SaaS의 독자적인 Admin Console 스타일을 유지한다.

---

# Mock Development Rules

외부 연동은 Mock 우선으로 구현한다.

원칙:
- Mock/Real 구현 분리
- 환경변수 기반 전환
- Mock 응답은 현실적으로 구성
- 실제 API 계약을 고려하여 설계
- Adapter 패턴 기반 구조 유지
- 실제 외부 연동 API는 직접 호출하지 않고 mock-server 또는 Adapter를 통해 처리

---

# Task Workflow Rules

모든 작업은 Task 단위로 관리한다.

Task 상태:
- todo
- in-progress
- review
- done
- blocked

Task 위치:
docs/operations/backlog/

예시:
docs/operations/backlog/todo/HCM-101-employee-api.md

---

# Task Document Rules

Task 문서는 다음 내용을 포함한다.

- 목적
- 작업 범위
- 완료 조건
- 관련 API
- 영향 테이블
- REAL/MOCK 여부
- 작업 로그

---

# Daily Log Rules

daily/YYYY-MM-DD.md 형식 사용

포함 내용:
- 오늘 작업
- 진행 상태
- 이슈
- 다음 작업

---

# Design Change Rules

중요 설계 변경 발생 시 history를 남긴다.

포함 내용:
- 변경 이유
- 영향 범위
- 기존 방식
- 신규 방식

---

# Documentation Policy

문서는 최소한으로 유지한다.

우선순위:
1. 코드
2. backlog task
3. 작업 history
4. 설계 문서

문서 중복 작성 금지.

---

# Design Sync Rules

기능, API, DB 구조, 메뉴 구조, 기술스택이 변경될 때는 관련 설계 문서를 함께 확인하고 필요한 경우 업데이트한다.

## 기준 문서

- docs/product/menu-structure.md
- docs/product/ui-style-guide.md
- docs/domain/domain-model.md
- docs/data/erd.md
- docs/architecture/tech-stack.md

## 업데이트 기준

다음 변경이 발생하면 설계 문서 영향 여부를 반드시 확인한다.

- 신규 메뉴 추가
- 기존 메뉴 상태 변경
- UI 구조 변경
- 화면 스타일 방향 변경
- 신규 도메인 추가
- 도메인 필드 변경
- API 추가/변경/삭제
- 테이블 추가/변경/삭제
- tenant_id 정책 변경
- REAL / MOCK / COMING_SOON 상태 변경
- 기술스택 변경
- 배포 구조 변경

## 작업 규칙

- 코드 변경 후 관련 설계 문서를 확인한다.
- UI 변경이 있으면 ui-style-guide.md와 menu-structure.md를 함께 확인한다.
- UI 변경이 있으면 docs/product/ui-reference/ 이미지도 함께 확인한다.
- UI 구현 시 ui-style-guide.md와 ui-reference assets를 함께 참고한다.
- Sidebar/Header/Card/Table 구조를 기본 UI 패턴으로 유지한다.
- 새로운 화면 추가 시 기존 UI reference와 톤 및 레이아웃 일관성을 유지한다.
- 영향이 있으면 관련 문서를 업데이트한다.
- 영향이 없으면 Task 문서 작업 로그에 '설계 문서 영향 없음'을 기록한다.
- 문서와 코드가 충돌하면 AGENTS.md, README.md, Task 문서를 우선 확인하고 수정 방향을 제안한다.
- 기술스택의 기준 문서는 docs/architecture/tech-stack.md로 한다.
- README.md는 기술스택 요약만 유지한다.
- AGENTS.md는 Codex 개발 규칙과 문서 동기화 규칙을 유지한다.

---

# AI Working Rules

작업 전:
- 관련 Task 확인
- 기존 API 확인
- 기존 Domain 확인

작업 후:
- backlog 상태 변경
- 작업 history 기록
- breaking change 기록

---

# Deployment Rules

초기 MVP는 AWS EC2 + Docker Compose 기준으로 구현한다.

Docker Compose 구성 대상:
- web
- api
- db
- mock-server
- nginx

nginx만 외부 공개 포트를 가진다.

web, api, mock-server, db 포트는 host에 직접 publish 하지 않는다.

---

# Future Expansion Considerations

- ECS/EKS 전환 가능 구조
- Redis 캐시
- Queue 기반 비동기 처리
- 파일 스토리지 분리
- RBAC 고도화
- Audit Log 고도화
- 실제 외부 API 연동
