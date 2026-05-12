# HCM-001 Project Bootstrap

## 목적
Simple HCM SaaS MVP 개발을 위한 기본 프로젝트 구조와 실행 환경을 준비한다.

## 배경
이 프로젝트는 대한민국 중소기업용 경량 인사/급여/근태 SaaS이다.
핵심 흐름은 직원 등록 → 근태 입력 → 월 근태 집계 → 급여 생성 → 급여명세서 출력이다.
초기 MVP는 AWS EC2 + Docker Compose 기반으로 배포한다.

## 작업 범위
- Next.js 기반 web 앱 초기화
- FastAPI 기반 api 앱 초기화
- PostgreSQL 연결 준비
- Docker Compose 구성 준비
- Nginx Reverse Proxy 구성 준비
- Mock Server 구성 준비
- Health Check API 준비

## 제외 범위
- 실제 직원관리 기능 구현
- 실제 근태 기능 구현
- 실제 급여 계산 구현
- 실제 외부 API 연동
- 홈택스 실제 연동
- 4대보험 자동 계산
- 모바일 앱

## 완료 조건
- apps/web 구조 생성 가능
- apps/api 구조 생성 가능
- infra/docker/docker-compose.yml 생성 가능
- mock-server 구조 생성 가능
- api /health endpoint 구현 가능
- docker compose up 으로 기본 서비스 실행 가능

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md

## 작업 로그
- 생성일: 2026-05-11
- 상태: IN_PROGRESS
- 갱신일: 2026-05-12
- 메모: web, api, mock-server 기본 부트스트랩 진행 중

