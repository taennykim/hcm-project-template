from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

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
    def __init__(self) -> None:
        seed_policy = CompanyPolicyConfig(
            attendance={
                "work_start_time": "09:00",
                "work_end_time": "18:00",
                "lunch_minutes": 60,
            },
            payroll={"pay_day": 25, "round_unit": 10},
        )
        seed_time = _now()
        self._companies: dict[str, CompanyRepositoryRecord] = {
            "dev-company": CompanyRepositoryRecord(
                id="dev-company",
                tenant_id="dev-tenant",
                name="데모회사",
                business_registration_number=None,
                representative_name=None,
                policy_config=seed_policy.model_dump(),
                created_at=seed_time,
                updated_at=seed_time,
                deleted_at=None,
            )
        }

    def list_companies(self) -> list[Company]:
        return [self._to_company(record) for record in self._companies.values()]

    def create_company(self, payload: CompanyCreate) -> Company:
        company_id = payload.id or f"company-{len(self._companies) + 1}"
        if company_id in self._companies:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Company '{company_id}' already exists.",
            )

        timestamp = _now()
        record = CompanyRepositoryRecord(
            id=company_id,
            tenant_id=payload.tenant_id,
            name=payload.name,
            business_registration_number=payload.business_registration_number,
            representative_name=payload.representative_name,
            policy_config=payload.policy_config.model_dump(),
            created_at=timestamp,
            updated_at=timestamp,
            deleted_at=None,
        )
        self._companies[company_id] = record
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
        record = self._get_record(company_id)
        record.policy_config = payload.policy_config.model_dump()
        record.updated_at = _now()
        self._companies[company_id] = record
        return CompanyPolicyResponse(
            company_id=record.id,
            tenant_id=record.tenant_id,
            policy_config=payload.policy_config,
        )

    def _get_record(self, company_id: str) -> CompanyRepositoryRecord:
        record = self._companies.get(company_id)
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
