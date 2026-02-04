from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    jwt_expires_in: int = 3600

    class Config:
        env_file = ".env"


settings = Settings()

# Ensure psycopg (v3) driver is used by SQLAlchemy.
if settings.database_url.startswith("postgresql://"):
    settings.database_url = settings.database_url.replace(
        "postgresql://", "postgresql+psycopg://", 1
    )
