# Tech Stack

## 현재 기준
- Frontend: Next.js
- Backend: FastAPI
- Database: PostgreSQL
- Deployment: AWS EC2 + Docker Compose
- Reverse Proxy: Nginx
- Mock Server: FastAPI

## 운영 원칙
- README.md에는 기술스택 요약만 유지한다.
- 상세 기준은 이 문서를 우선 참조한다.
- 기술스택이 변경되면 README.md, AGENTS.md, tech-stack.md를 함께 확인한다.
- 배포 구조가 변경되면 Docker Compose 및 Nginx 구성과 함께 문서 동기화를 수행한다.

## API Style Guide
- Base prefix는 `/api`를 기준으로 한다.
- List 응답 기본 형식은 `{ "items": [...] }`를 사용한다.
- 단건 응답은 리소스 JSON을 직접 반환한다.
- Error 응답 초안은 `{ "error": { "code": "...", "message": "..." } }` 형식을 사용한다.
- MVP 초기에는 단순 JSON 응답을 허용하지만, HCM-004 이후 신규 API는 이 기준을 따른다.
- health check는 예외적으로 `{ "status": "ok", "service": "..." }` 형식을 유지한다.
