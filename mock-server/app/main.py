from fastapi import FastAPI


app = FastAPI(title="Simple HCM Mock Server")


@app.get("/health")
@app.get("/mock/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "mock-server"}

