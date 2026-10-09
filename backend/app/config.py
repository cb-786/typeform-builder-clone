import os
from pathlib import Path
from typing import Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Typeform Clone API"
    PROJECT_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'data' / 'typeform.db'}")
    ALLOWED_ORIGINS: str = "*"

    @property
    def cors_origins(self) -> list[str]:
        val = self.ALLOWED_ORIGINS.strip()
        if val == "*":
            return ["*"]
        if val.startswith("[") and val.endswith("]"):
            import json
            try:
                parsed = json.loads(val)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass
        return [i.strip() for i in val.split(",") if i.strip()]
    
    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()
