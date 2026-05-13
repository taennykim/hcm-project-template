# HCM-003 Tenant Company Bootstrap

## 목적
Simple HCM SaaS의 멀티테넌트 기반을 만들기 위해 회사/테넌트 기본 구조를 정의하고 구현 준비를 한다.

## 배경
AGENTS.md의 Important Rules에 따라 모든 업무 테이블은 tenant_id를 포함해야 한다.
직원, 근태, 급여, 승인 기능을 구현하기 전에 tenant/company 구조를 먼저 잡아야 한다.

## 작업 범위
- tenant/company 도메인 구조 정의
- company 기본 정보 모델 준비
- tenant_id 기반 데이터 분리 기준 정의
- 회사별 정책 JSON 설정 구조 준비
- 기본 seed company 또는 dev tenant 구성 검토
- API 설계 준비
  - 회사 조회
  - 회사 생성
  - 회사 설정 조회
  - 회사 설정 수정

## 제외 범위
- 실제 직원관리 구현
- 실제 근태관리 구현
- 실제 급여 계산 구현
- SSO
- 복잡한 권한관리
- 실제 외부 API 연동

## 완료 조건
- tenant/company 구현 방향이 task 문서에 정리됨
- tenant_id 사용 원칙이 명확히 기록됨
- 회사별 정책 JSON 설정 초안이 기록됨
- 다음 구현 단계에서 FastAPI 모델/API 작업을 시작할 수 있음

## REAL/MOCK 여부
REAL

## 관련 문서
- README.md
- AGENTS.md
- docs/operations/backlog/done/HCM-001-project-bootstrap.md
- docs/operations/backlog/done/HCM-002-docker-compose-bootstrap.md

## 작업 로그
- 생성일: 2026-05-13
- 상태: IN_PROGRESS
- 2026-05-13: Tenant/Company bootstrap 구현 시작
- 2026-05-13: api unhealthy 원인 점검 및 Python 3.10 호환성 수정
