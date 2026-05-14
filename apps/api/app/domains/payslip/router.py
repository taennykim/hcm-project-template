from fastapi import APIRouter, Query, status

from app.domains.payslip.schemas import (
    Payslip,
    PayslipGenerateRequest,
    PayslipListResponse,
)
from app.domains.payslip.service import payslip_service


router = APIRouter(tags=["payslip"])


@router.get("/payslips", response_model=PayslipListResponse)
def list_payslips(year_month: str | None = Query(default=None)) -> PayslipListResponse:
    return PayslipListResponse(items=payslip_service.list_payslips(year_month=year_month))


@router.post(
    "/payslips/generate",
    response_model=PayslipListResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_payslips(payload: PayslipGenerateRequest) -> PayslipListResponse:
    return PayslipListResponse(items=payslip_service.generate_payslips(payload))


@router.get("/payslips/{payslip_id}", response_model=Payslip)
def get_payslip(payslip_id: str) -> Payslip:
    return payslip_service.get_payslip(payslip_id)


@router.get("/payroll-runs/{payroll_run_id}/payslips", response_model=PayslipListResponse)
def list_payroll_run_payslips(payroll_run_id: str) -> PayslipListResponse:
    return PayslipListResponse(
        items=payslip_service.list_payslips_by_payroll_run(payroll_run_id)
    )


@router.get("/employees/{employee_id}/payslips", response_model=PayslipListResponse)
def list_employee_payslips(employee_id: str) -> PayslipListResponse:
    return PayslipListResponse(
        items=payslip_service.list_payslips_by_employee(employee_id)
    )
