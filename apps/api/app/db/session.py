from __future__ import annotations

import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker


DEFAULT_DATABASE_URL = "postgresql://hcm_user:change_me@db:5432/hcm"


def normalize_database_url(url: str) -> str:
    if url.startswith("postgresql://") and not url.startswith("postgresql+"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def get_database_url() -> str:
    return normalize_database_url(os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL))


engine = create_engine(get_database_url(), future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    class_=Session,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
