"""
Тестовый скрипт для проверки Story Generator API
"""
import asyncio
import httpx
import sys


async def test_health_check():
    """Проверка health endpoint"""
    print("🔍 Проверка health check...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://localhost:8000/health")
            data = response.json()
            print(f"✅ Health check: {data}")
            return True
        except Exception as e:
            print(f"❌ Ошибка health check: {e}")
            return False


async def test_generate_story(age: int, language: str, characters: list):
    """Тестирование генерации сказки"""
    print(f"\n📚 Генерация сказки...")
    print(f"   Возраст: {age}")
    print(f"   Язык: {language}")
    print(f"   Персонажи: {', '.join(characters)}")
    print("-" * 60)
    
    request_data = {
        "age": age,
        "language": language,
        "characters": characters
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            async with client.stream(
                "POST",
                "http://localhost:8000/generate_story",
                json=request_data
            ) as response:
                
                if response.status_code != 200:
                    print(f"❌ Ошибка: {response.status_code}")
                    print(await response.aread())
                    return False
                
                print("\n📖 Сказка:\n")
                
                async for chunk in response.aiter_text():
                    print(chunk, end="", flush=True)
                
                print("\n" + "-" * 60)
                print("✅ Сказка успешно сгенерирована!")
                return True
                
        except Exception as e:
            print(f"\n❌ Ошибка: {e}")
            return False


async def test_validation_errors():
    """Тестирование валидации"""
    print("\n🧪 Тестирование валидации...")
    
    test_cases = [
        {
            "name": "Отрицательный возраст",
            "data": {"age": -5, "language": "ru", "characters": ["Заяц"]}
        },
        {
            "name": "Неверный язык",
            "data": {"age": 5, "language": "en", "characters": ["Заяц"]}
        },
        {
            "name": "Пустой список персонажей",
            "data": {"age": 5, "language": "ru", "characters": []}
        }
    ]
    
    async with httpx.AsyncClient() as client:
        for test_case in test_cases:
            print(f"\n  Тест: {test_case['name']}")
            try:
                response = await client.post(
                    "http://localhost:8000/generate_story",
                    json=test_case["data"]
                )
                
                if response.status_code == 422:
                    print(f"  ✅ Валидация работает (422)")
                else:
                    print(f"  ⚠️  Неожиданный код: {response.status_code}")
                    
            except Exception as e:
                print(f"  ❌ Ошибка: {e}")


async def main():
    """Главная функция тестирования"""
    print("=" * 60)
    print("🧪 ТЕСТИРОВАНИЕ STORY GENERATOR API")
    print("=" * 60)
    
    # Проверка здоровья сервера
    if not await test_health_check():
        print("\n❌ Сервер недоступен. Убедитесь, что он запущен:")
        print("   python -m app.main")
        sys.exit(1)
    
    # Тестирование валидации
    await test_validation_errors()
    
    # Тест 1: Русская сказка
    print("\n" + "=" * 60)
    print("ТЕСТ 1: Русская сказка")
    print("=" * 60)
    await test_generate_story(
        age=7,
        language="ru",
        characters=["Заяц", "Волк", "Лиса"]
    )
    
    # Тест 2: Казахская сказка
    print("\n" + "=" * 60)
    print("ТЕСТ 2: Казахская сказка")
    print("=" * 60)
    await test_generate_story(
        age=6,
        language="kk",
        characters=["Алдар Көсе", "Әйел Арстан"]
    )
    
    print("\n" + "=" * 60)
    print("✅ ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())