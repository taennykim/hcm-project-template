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

---

# Mock Development Rules

외부 연동은 Mock 우선으로 구현한다.

원칙:
- Mock/Real 구현 분리
- 환경변수 기반 전환
- Mock 응답은 현실적으로 구성
- 실제 API 계약을 고려하여 설계
- Adapter 패턴 기반 구조 유지

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

---

# Future Expansion Considerations

- ECS/EKS 전환 가능 구조
- Redis 캐시
- Queue 기반 비동기 처리
- 파일 스토리지 분리
- RBAC 고도화
- Audit Log 고도화
- 실제 외부 API 연동
