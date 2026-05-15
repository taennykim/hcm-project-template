from __future__ import annotations

from sqlalchemy import select

from app.db.models import CompanyModel
from app.db.session import SessionLocal
from app.domains.tenant.schemas import CompanyCreate, CompanyRepositoryRecord


class CompanyRepository:
    def list_companies(self) -> list[CompanyRepositoryRecord]:
        with SessionLocal() as session:
            companies = session.scalars(
                select(CompanyModel).where(CompanyModel.deleted_at.is_(None)).order_by(CompanyModel.id)
            ).all()
            return [self._to_record(company) for company in companies]

    def create_company(self, payload: CompanyCreate) -> CompanyRepositoryRecord:
        with SessionLocal.begin() as session:
            company = CompanyModel(
                id=payload.id,
                tenant_id=payload.tenant_id,
                name=payload.name,
                business_registration_number=payload.business_registration_number,
                representative_name=payload.representative_name,
                policy_config=payload.policy_config.model_dump(),
            )
            session.add(company)
            session.flush()
            session.refresh(company)
            return self._to_record(company)

    def get_company(self, company_id: str) -> CompanyRepositoryRecord | None:
        with SessionLocal() as session:
            company = session.scalar(
                select(CompanyModel).where(
                    CompanyModel.id == company_id, CompanyModel.deleted_at.is_(None)
                )
            )
            return None if company is None else self._to_record(company)

    def update_company_policy(
        self, company_id: str, policy_config: dict
    ) -> CompanyRepositoryRecord | None:
        with SessionLocal.begin() as session:
            company = session.scalar(
                select(CompanyModel).where(
                    CompanyModel.id == company_id, CompanyModel.deleted_at.is_(None)
                )
            )
            if company is None:
                return None
            company.policy_config = policy_config
            session.add(company)
            session.flush()
            session.refresh(company)
            return self._to_record(company)

    @staticmethod
    def _to_record(company: CompanyModel) -> CompanyRepositoryRecord:
        return CompanyRepositoryRecord(
            id=company.id,
            tenant_id=company.tenant_id,
            name=company.name,
            business_registration_number=company.business_registration_number,
            representative_name=company.representative_name,
            policy_config=company.policy_config,
            created_at=company.created_at,
            updated_at=company.updated_at,
            deleted_at=company.deleted_at,
        )


company_repository = CompanyRepository()
