from pydantic import BaseModel, Field, field_validator
from typing import List

class StoryRequest(BaseModel):
    
    # Модель запроса на генерацию сказки
    age: int = Field(
        ...,
        gt=0,
        le=10,
        description="Возраст ребенка (от 1 до 10 лет)",
        examples=[6]
    )
    
    language: str = Field(
        ...,
        pattern="^(ru|kk)$",
        description="Язык сказки: 'ru' (русский) или 'kk' (казахский)",
        examples=["ru"]
    )
    
    characters: List[str] = Field(
        ...,
        min_length=1,
        max_length=10,
        description="Список персонажей сказки (минимум 1, максимум 10)",
        examples=[["Заяц", "Волк", "Лиса"]]
    )
    
    @field_validator('characters')
    @classmethod
    def validate_characters(cls, v: List[str]) -> List[str]:
        # Валидация списка персонажей
        if not v or len(v) == 0:
            raise ValueError('Должен быть указан хотя бы один персонаж')
        
        # Проверка, что персонажи не пустые строки
        cleaned = [char.strip() for char in v if char.strip()]
        if len(cleaned) == 0:
            raise ValueError('Персонажи не могут быть пустыми строками')
        
        # Проверка на дубликаты
        if len(cleaned) != len(set(cleaned)):
            raise ValueError('Персонажи не должны повторяться')
        
        # Проверка длины имен персонажей
        for char in cleaned:
            if len(char) > 50:
                raise ValueError(f'Имя персонажа слишком длинное: {char[:20]}...')
        
        return cleaned
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v: str) -> str:
        # Валидация языка
        v = v.lower().strip()
        if v not in ['ru', 'kk']:
            raise ValueError('Язык должен быть "ru" (русский) или "kk" (казахский)')
        return v
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "age": 6,
                    "language": "kk",
                    "characters": ["Алдар Көсе", "Әйел Арстан"]
                },
                {
                    "age": 7,
                    "language": "ru",
                    "characters": ["Заяц", "Волк", "Медведь"]
                }
            ]
        }
    }


class ErrorResponse(BaseModel):
    # Модель ответа с ошибкой
    detail: str
    error_type: str = "validation_error"
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "detail": "Возраст должен быть больше 0",
                "error_type": "validation_error"
            }
        }
    }