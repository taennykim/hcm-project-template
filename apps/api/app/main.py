from fastapi import FastAPI

from app.domains.tenant.router import router as tenant_router


app = FastAPI(title="Simple HCM API")

app.include_router(tenant_router)


@app.get("/health")
@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "api"}
