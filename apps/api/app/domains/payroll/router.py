from fastapi import APIRouter, Query, status

from app.domains.payroll.schemas import (
    PayrollItemListResponse,
    PayrollRun,
    PayrollRunGenerateRequest,
    PayrollRunListResponse,
)
from app.domains.payroll.service import payroll_service


router = APIRouter(tags=["payroll"])


@router.get("/payroll-runs", response_model=PayrollRunListResponse)
def list_payroll_runs(
    year_month: str | None = Query(default=None),
) -> PayrollRunListResponse:
    return PayrollRunListResponse(
        items=payroll_service.list_payroll_runs(year_month=year_month)
    )


@router.post(
    "/payroll-runs/generate",
    response_model=PayrollRun,
    status_code=status.HTTP_201_CREATED,
)
def generate_payroll_run(payload: PayrollRunGenerateRequest) -> PayrollRun:
    return payroll_service.generate_payroll_run(payload)


@router.get("/payroll-runs/{payroll_run_id}", response_model=PayrollRun)
def get_payroll_run(payroll_run_id: str) -> PayrollRun:
    return payroll_service.get_payroll_run(payroll_run_id)


@router.get(
    "/payroll-runs/{payroll_run_id}/items",
    response_model=PayrollItemListResponse,
)
def list_payroll_run_items(payroll_run_id: str) -> PayrollItemListResponse:
    return PayrollItemListResponse(items=payroll_service.list_payroll_items(payroll_run_id))


@router.get(
    "/employees/{employee_id}/payroll-items",
    response_model=PayrollItemListResponse,
)
def list_employee_payroll_items(employee_id: str) -> PayrollItemListResponse:
    return PayrollItemListResponse(
        items=payroll_service.list_payroll_items_by_employee(employee_id)
    )
