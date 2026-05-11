# AI Development Rules

## 프로젝트 목적

국내 중소기업용 경량 HCM SaaS 개발

---

# 핵심 원칙

- MVP 우선
- 과설계 금지
- 문서 없는 기능 추가 금지
- REAL/MOCK 상태 준수
- 외부 연동은 Mock 우선
- 멀티테넌트 구조 고려

---

# 기능 상태 정책

## REAL
실제 DB/API/비즈니스 로직 구현

## MOCK
화면 + Mock API + 샘플 데이터만 구현

## COMING_SOON
메뉴만 노출

---

# 작업 운영 규칙

모든 작업은 Task 단위로 관리한다.

Task 상태:
- todo
- in-progress
- review
- done
- blocked

Task 파일 위치:
docs/operations/backlog/

예시:
docs/operations/backlog/todo/HCM-101-employee-api.md

---

# Task 문서 규칙

Task 문서는 다음 내용을 포함한다.

- 목적
- 작업 범위
- 완료 조건
- 관련 API
- 영향 테이블
- REAL/MOCK 여부
- 작업 로그

---

# Daily Log 규칙

daily/YYYY-MM-DD.md 형식 사용

포함 내용:
- 오늘 작업
- 진행 상태
- 이슈
- 다음 작업

---

# 설계 변경 규칙

중요 설계 변경 발생 시 history를 남긴다.

포함 내용:
- 변경 이유
- 영향 범위
- 기존 방식
- 신규 방식

---

# Mock 개발 규칙

외부 연동은 Mock 우선으로 구현한다.

원칙:
- Mock/Real 분리
- 환경변수 기반 전환
- Mock 응답은 현실적으로 구성
- 실제 API 계약을 고려하여 설계

---

# 문서 생성 정책

문서는 필요할 때만 생성한다.

우선순위:
1. 코드
2. backlog task
3. 작업 history
4. 설계 문서

문서 중복 작성 금지.

---

# Codex 작업 규칙

작업 전:
- 관련 Task 확인
- 기존 API 확인
- 기존 Domain 확인

작업 후:
- backlog 상태 변경
- 작업 history 기록
- breaking change 기록
