from fastapi import FastAPI

from app.domains.attendance.router import router as attendance_router
from app.domains.employee.router import router as employee_router
from app.domains.monthly_attendance.router import router as monthly_attendance_router
from app.domains.tenant.router import router as tenant_router


app = FastAPI(title="Simple HCM API")

app.include_router(tenant_router)
app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(monthly_attendance_router)


@app.get("/health")
@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "api"}
