import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Настройки приложения
    
    # OpenAI настройки
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # API настройки
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # CORS настройки
    CORS_ORIGINS: list[str] = ["*"]
    
    # Логирование
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    def validate_config(self) -> bool:
        # Проверка конфигурации
        if not self.OPENAI_API_KEY:
            return False
        return True


@lru_cache()
def get_settings() -> Settings:
    # Получить настройки (с кешированием)
    return Settings()


# Экспорт настроек
settings = get_settings()