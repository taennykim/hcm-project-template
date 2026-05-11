# Simple HCM SaaS

대한민국 중소기업용 경량 인사/급여/근태 SaaS

---

# MVP 범위

직원 등록  
→ 근태 입력  
→ 월 근태 집계  
→ 급여 생성  
→ 급여명세서 출력

---

# 목표

중소기업이 엑셀 없이 월급을 생성할 수 있도록 한다.

복잡한 ERP가 아니라,  
중소기업이 쉽게 사용할 수 있는 단순하고 빠른 HCM SaaS를 지향한다.

---

# 프로젝트 목표

중소기업에서 쉽게 사용할 수 있는 경량 HR/HCM SaaS를 개발한다.

초기 MVP에서는 핵심 기능만 실제 구현하며,
나머지 기능은 Mock 또는 Coming Soon 형태로 제공한다.

---

# 주요 기능 영역

- 직원관리
- 조직관리
- 근태관리
- 휴가/연차관리
- 승인관리
- 급여관리
- 전자계약
- 4대보험 연계
- 세무 연계

---

# MVP 전략

초기 MVP에서는 다음 원칙을 따른다.

- 핵심 기능 우선 구현
- Mock 기반 빠른 개발
- REAL / MOCK 기능 분리
- 외부 연동 최소화
- 점진적 기능 확장

---

# 기능 상태 정책

## REAL

실제 DB/API/비즈니스 로직 구현

예:
- 로그인
- 직원관리
- 조직관리
- 근태 입력

---

## MOCK

화면 + Mock API + 샘플 데이터만 제공

예:
- 급여명세서
- 전자계약
- 인사발령

---

## COMING_SOON

메뉴만 제공

예:
- 4대보험
- 세무신고
- 회계연동

---

# 기술스택

## Frontend
- Next.js

## Backend
- FastAPI

## Database
- PostgreSQL

## Infra
- AWS EC2
- Docker Compose

## Reverse Proxy
- Nginx

---

# 배포 전략

초기 MVP는 AWS EC2 단일 서버에 Docker Compose 기반으로 배포한다.

Docker Compose 설정 기본 위치는 `infra/docker/docker-compose.yml` 이다.

구성:
- web: Next.js
- api: FastAPI
- db: PostgreSQL
- mock-server: 외부 연동 Mock API
- nginx: Reverse Proxy

EC2 서버에는 Docker와 Docker Compose가 설치되어 있어야 한다.

외부 공개 포트는 초기에는 80만 사용하고, 추후 443을 추가한다.

PostgreSQL 5432 포트는 외부에 직접 노출하지 않는다.

추후 필요 시 ECS/EKS 기반 구조로 확장 가능하도록 설계한다.

## 실행 예시

```bash
cd infra/docker
docker compose up -d
docker compose ps
docker compose logs -f
```

---

# 프로젝트 운영 원칙

- AI(Codex) 기반 개발
- Task 기반 backlog 운영
- 외부 연동은 Mock 우선
- 설계 변경 history 기록
- 문서는 최소화
- 과설계 금지

---

# 주요 디렉토리

## apps/web
Frontend 애플리케이션

## apps/api
Backend API

## mock-server
외부 연동 Mock API 서버

## infra/docker
Docker Compose 및 배포 설정

## docs/operations/backlog
작업 Task 관리

## docs/operations/daily
일일 작업 로그

---

# 작업 흐름

1. backlog task 생성
2. Task 기반 개발 진행
3. 작업 상태 변경
4. history 기록
5. daily 로그 기록

---

# 향후 확장 고려사항

- 멀티테넌트 SaaS 구조
- 권한 관리 고도화
- 실제 외부 API 연동
- 급여 계산 엔진
- 전자결재
- 모바일 지원
- ECS/EKS 전환
