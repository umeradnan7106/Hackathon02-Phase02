"""
Configuration settings for the Todo API application.
Uses Pydantic Settings for environment variable management.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        DATABASE_URL: PostgreSQL connection string (Neon serverless)
        BETTER_AUTH_SECRET: Secret key for JWT token signing (min 32 chars)
        CORS_ORIGINS: Comma-separated list of allowed CORS origins
    """

    DATABASE_URL: str
    BETTER_AUTH_SECRET: str
    CORS_ORIGINS: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


# Global settings instance
settings = Settings()
