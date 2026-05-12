from fastapi import FastAPI


app = FastAPI(title="Simple HCM API")


@app.get("/health")
@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "api"}

