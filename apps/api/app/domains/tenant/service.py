from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.domains.tenant.repository import company_repository
from app.domains.tenant.schemas import (
    Company,
    CompanyCreate,
    CompanyPolicyConfig,
    CompanyPolicyResponse,
    CompanyPolicyUpdate,
    CompanyRepositoryRecord,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


class CompanyService:
    def list_companies(self) -> list[Company]:
        return [self._to_company(record) for record in company_repository.list_companies()]

    def create_company(self, payload: CompanyCreate) -> Company:
        company_id = payload.id or f"company-{int(datetime.now(timezone.utc).timestamp())}"
        if company_repository.get_company(company_id) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Company '{company_id}' already exists.",
            )

        payload.id = company_id
        record = company_repository.create_company(payload)
        return self._to_company(record)

    def get_company(self, company_id: str) -> Company:
        return self._to_company(self._get_record(company_id))

    def get_company_policy(self, company_id: str) -> CompanyPolicyResponse:
        record = self._get_record(company_id)
        return CompanyPolicyResponse(
            company_id=record.id,
            tenant_id=record.tenant_id,
            policy_config=CompanyPolicyConfig.model_validate(record.policy_config),
        )

    def update_company_policy(
        self, company_id: str, payload: CompanyPolicyUpdate
    ) -> CompanyPolicyResponse:
        record = company_repository.update_company_policy(
            company_id, payload.policy_config.model_dump()
        )
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Company '{company_id}' not found.",
            )
        return CompanyPolicyResponse(
            company_id=record.id,
            tenant_id=record.tenant_id,
            policy_config=payload.policy_config,
        )

    def _get_record(self, company_id: str) -> CompanyRepositoryRecord:
        record = company_repository.get_company(company_id)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Company '{company_id}' not found.",
            )
        return record

    @staticmethod
    def _to_company(record: CompanyRepositoryRecord) -> Company:
        return Company(
            id=record.id,
            tenant_id=record.tenant_id,
            name=record.name,
            business_registration_number=record.business_registration_number,
            representative_name=record.representative_name,
            policy_config=CompanyPolicyConfig.model_validate(record.policy_config),
            created_at=record.created_at,
            updated_at=record.updated_at,
            deleted_at=record.deleted_at,
        )


company_service = CompanyService()
