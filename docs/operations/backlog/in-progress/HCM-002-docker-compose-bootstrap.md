# HCM-002 Docker Compose Bootstrap

## 목적
AWS EC2 단일 서버에서 Simple HCM SaaS MVP를 실행할 수 있도록 Docker Compose 기반 실행 환경을 구성한다.

## 배경
초기 MVP는 ECS/EKS가 아니라 EC2 + Docker Compose 기반으로 배포한다.
구성 대상은 web, api, db, mock-server, nginx 이다.

## 작업 범위
- infra/docker/docker-compose.yml 생성
- infra/docker/.env.example 생성
- nginx reverse proxy 설정 준비
- PostgreSQL volume 구성
- web/api/mock-server 서비스 정의
- 내부 Docker network 구성
- health check 구성

## 제외 범위
- 실제 HTTPS 인증서 발급
- 운영용 CI/CD 구성
- ECS/EKS 구성
- 실제 외부 API 연동
- 실제 급여 기능 구현

## 완료 조건
- cd infra/docker && docker compose up -d 실행 가능
- web/api/db/mock-server/nginx 컨테이너 기동 가능
- api /health endpoint 응답 가능
- nginx를 통해 web 접근 가능
- PostgreSQL 포트는 외부에 직접 노출되지 않음
- nginx만 host 80 포트를 publish 함
- web/api/mock-server/db 포트는 Docker 내부 네트워크에서만 접근함

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md

## 작업 로그
- 생성일: 2026-05-11
- 상태: IN_PROGRESS
- 2026-05-12: Docker Compose bootstrap 작업 시작
- 2026-05-12: 최소 web/api/mock-server 앱 코드 생성
- 2026-05-12: Dockerfile 생성
- 2026-05-12: compose build/up 검증 준비
- 2026-05-12: 502 Bad Gateway 원인 점검 및 startup 순서 수정
- 2026-05-12: 내부 포트 비노출 원칙과 문서/compose 정합성 확인
