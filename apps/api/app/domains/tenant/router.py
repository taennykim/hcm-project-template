from fastapi import APIRouter, status

from app.domains.tenant.schemas import (
    Company,
    CompanyCreate,
    CompanyListResponse,
    CompanyPolicyResponse,
    CompanyPolicyUpdate,
)
from app.domains.tenant.service import company_service


router = APIRouter(tags=["companies"])


@router.get("/companies", response_model=CompanyListResponse)
def list_companies() -> CompanyListResponse:
    return CompanyListResponse(items=company_service.list_companies())


@router.post(
    "/companies",
    response_model=Company,
    status_code=status.HTTP_201_CREATED,
)
def create_company(payload: CompanyCreate) -> Company:
    return company_service.create_company(payload)


@router.get("/companies/{company_id}", response_model=Company)
def get_company(company_id: str) -> Company:
    return company_service.get_company(company_id)


@router.get(
    "/companies/{company_id}/policy",
    response_model=CompanyPolicyResponse,
)
def get_company_policy(company_id: str) -> CompanyPolicyResponse:
    return company_service.get_company_policy(company_id)


@router.patch(
    "/companies/{company_id}/policy",
    response_model=CompanyPolicyResponse,
)
def update_company_policy(
    company_id: str, payload: CompanyPolicyUpdate
) -> CompanyPolicyResponse:
    return company_service.update_company_policy(company_id, payload)
