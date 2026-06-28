from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.exceptions import missing_config


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    service_name: str = "dream-to-real-agent-backend"
    version: str = "0.1.0"
    api_v1_prefix: str = "/api/v1"
    static_url_path: str = "/static"

    dtr_host: str = "0.0.0.0"
    dtr_port: int = 8000
    dtr_cors_allow_origins: str = "*"
    dtr_log_level: str = "INFO"

    dtr_database_path: Path = BACKEND_DIR / "var" / "dream_to_real.sqlite3"
    dtr_static_dir: Path = BACKEND_DIR / "static"

    dtr_llm_provider: str = "mock"
    dtr_llm_api_key: str | None = None
    dtr_llm_base_url: str | None = None
    dtr_llm_model: str | None = None
    dtr_llm_timeout_seconds: int = 30

    dtr_image_provider: str = "mock"
    dtr_image_api_key: str | None = None
    dtr_image_base_url: str | None = None
    dtr_image_model: str | None = None
    dtr_image_timeout_seconds: int = 60
    dtr_image_cfg_scale: float | None = None
    dtr_image_steps: int | None = None
    dtr_image_seed: int | None = None
    dtr_image_size: str | None = None
    dtr_image_max_retries: int = 2

    @model_validator(mode="before")
    @classmethod
    def _drop_blank_values(cls, data):
        if isinstance(data, dict):
            return {k: v for k, v in data.items() if not (isinstance(v, str) and v.strip() == "")}
        return data

    @property
    def database_path(self) -> Path:
        return self.dtr_database_path

    @property
    def static_dir(self) -> Path:
        return self.dtr_static_dir

    @property
    def cors_allow_origins(self) -> list[str]:
        raw = (self.dtr_cors_allow_origins or "").strip()
        if not raw:
            return ["*"]
        return [item.strip() for item in raw.split(",") if item.strip()]

    def require_llm_credentials(self) -> None:
        if self.dtr_llm_provider.lower() == "mock":
            return
        if not self.dtr_llm_api_key:
            raise missing_config("DTR_LLM_API_KEY")

    def require_image_credentials(self) -> None:
        if self.dtr_image_provider.lower() == "mock":
            return
        if not self.dtr_image_api_key:
            raise missing_config("DTR_IMAGE_API_KEY")


settings = Settings()
