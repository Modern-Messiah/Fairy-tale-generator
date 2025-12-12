# Story Generator API - Python Backend

**Генерации детских сказок на FastAPI с использованием OpenAI API**


## Быстрый старт с Docker (Рекомендуется)

### Предварительные требования
- Docker
- Docker Compose
- OpenAI API Key

### Запуск через Docker Compose

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Создайте файл `.env`**
```bash
cp .env.example .env
```

Отредактируйте `.env` и добавьте ваш OpenAI API ключ:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
```

3. **Запустите контейнеры**
```bash
docker-compose up -d
```

API будет доступен по адресу: `http://localhost:8000`

4. **Проверьте статус**
```bash
docker-compose ps
```

5. **Просмотр логов**
```bash
docker-compose logs -f python-api
```

6. **Остановка контейнеров**
```bash
docker-compose down
```

---

## Установка без Docker (Локальная разработка)

### Предварительные требования
- Python 3.10+
- pip
- virtualenv (рекомендуется)

### Шаг 1: Создайте виртуальное окружение

```bash
# Создание виртуального окружения
python -m venv venv

# Активация (Linux/Mac)
source venv/bin/activate

# Активация (Windows)
venv\Scripts\activate
```

### Шаг 2: Установите зависимости

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Шаг 3: Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=True
LOG_LEVEL=INFO
```

### Шаг 4: Запустите сервер

```bash
# Запуск через uvicorn напрямую
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Или через Python
python -m app.main
```

API будет доступен по адресу: `http://localhost:8000`

---

## API Endpoints

### Основные эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/health` | Проверка работоспособности сервиса |
| `POST` | `/generate` | Генерация сказки (обычный режим) |
| `POST` | `/generate/stream` | Генерация сказки (streaming режим) |
| `GET` | `/docs` | Swagger документация |
| `GET` | `/redoc` | ReDoc документация |

### Модели данных

#### StoryRequest
```python
{
    "age_group": "3-5",           # Возрастная группа: "3-5", "6-8", "9-12"
    "language": "ru",              # Язык: "ru" или "kk"
    "characters": ["принцесса"],   # Список персонажей (опционально)
    "theme": "приключения"        # Тема сказки (опционально)
}
```

#### StoryResponse
```python
{
    "id": "uuid-string",          # Уникальный ID сказки
    "title": "Название сказки",    # Сгенерированное название
    "content": "Текст сказки...",  # Полный текст сказки
    "age_group": "3-5",
    "language": "ru",
    "characters": ["принцесса"],
    "created_at": "2024-01-01T12:00:00Z"
}
```

---

## Структура проекта

```
python-story-api/
├── app/
│   ├── __init__.py              # Инициализация пакета
│   ├── main.py                  # FastAPI приложение и роуты
│   ├── services.py              # Бизнес-логика генерации сказок
│   ├── models.py                # Pydantic модели данных
│   └── config.py                # Конфигурация и настройки
├── .env                         # Переменные окружения (создается вручную)
├── .env.example                 # Пример переменных окружения
├── requirements.txt             # Python зависимости
├── Dockerfile                   # Docker образ для контейнеризации
├── test_api.py                  # Базовые тесты API
└── README.md                    # Этот файл
```



## Разработка

### Запуск в режиме разработки
```bash
# С автоперезагрузкой
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

```

### Запуск тестов
```bash
# Базовые тесты
python test_api.py

# С использованием pytest (если установлен)
pytest
```

### Проверка кода
```bash
# Форматирование
black app/

# Линтинг
flake8 app/

# Проверка типов
mypy app/
```


## Конфигурация

Все настройки находятся в файле `.env`:

| Переменная | Описание | Значение по умолчанию |
|-----------|----------|----------------------|
| `OPENAI_API_KEY` | API ключ OpenAI | (обязательно) |
| `OPENAI_MODEL` | Модель OpenAI | `gpt-4o-mini` |
| `API_HOST` | Хост сервера | `0.0.0.0` |
| `API_PORT` | Порт сервера | `8000` |
| `API_RELOAD` | Автоперезагрузка | `True` |
| `LOG_LEVEL` | Уровень логирования | `INFO` |

---

## Отладка

### Проблемы с OpenAI API
```bash
# Проверьте логи
docker-compose logs python-api

# Проверьте health endpoint
curl http://localhost:8000/health
```

### Проблемы с Docker
```bash
# Пересоздать контейнеры
docker-compose down -v
docker-compose up --build

# Очистить кеш Docker
docker system prune -a
```

### Проблемы с зависимостями
```bash
# Обновить зависимости
pip install --upgrade -r requirements.txt

# Очистить кеш pip
pip cache purge
```

---

## Интеграция с Yii2 Frontend

API спроектирован для работы с [Yii2 фронтендом](../yii2-app/README.md):

### Streaming генерация
```python
# Endpoint: /generate/stream
# Метод: Server-Sent Events (SSE)

# Пример запроса:
POST /generate/stream
{
    "age_group": "6-8",
    "language": "ru",
    "characters": ["заяц", "волк"]
}

# Пример ответа (streaming):
data: {"type": "start", "story_id": "uuid"}

data: {"type": "chunk", "content": "Жила-была..."}

data: {"type": "chunk", "content": " в лесу..."}

data: {"type": "end", "story_id": "uuid"}
```

### Health Check
```python
# Endpoint: /health
# Метод: GET

# Ответ:
{
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00Z",
    "version": "1.0.0"
}
```

---

## Производительность и оптимизация

### Настройки для production
```env
OPENAI_MODEL=gpt-4o-mini          # Оптимальная модель по скорости/качеству
API_RELOAD=False                 # Отключить автоперезагрузку
LOG_LEVEL=WARNING                 # Уменьшить логирование
UVICORN_WORKERS=4                # Количество worker'ов
```

### Мониторинг
```bash
# Метрики FastAPI (если установлен)
curl http://localhost:8000/metrics

# Статус памяти
docker stats python-api
```

---

## Примеры использования

### Генерация сказки через curl
```bash
# Обычная генерация
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "age_group": "3-5",
    "language": "ru",
    "characters": ["медведь", "белка"]
  }'

# Streaming генерация
curl -X POST "http://localhost:8000/generate/stream" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "age_group": "6-8",
    "language": "ru"
  }'
```

### Python клиент
```python
import requests
import json

# Обычный запрос
response = requests.post("http://localhost:8000/generate", json={
    "age_group": "9-12",
    "language": "ru",
    "characters": ["рыцарь", "дракон"]
})

story = response.json()
print(story["title"])
print(story["content"])

# Streaming запрос
response = requests.post(
    "http://localhost:8000/generate/stream",
    json={"age_group": "3-5", "language": "ru"},
    headers={"Accept": "text/event-stream"}
)

for line in response.iter_lines():
    if line:
        data = json.loads(line.decode().replace("data: ", ""))
        print(data.get("content", ""), end="")
```

---

## Безопасность

### Защита API
- Используйте reverse proxy (nginx) для SSL termination
- Настройте rate limiting для предотвращения злоупотреблений
- Валидируйте все входные данные
- Не храните API ключи в коде

### Рекомендации
```bash
# Настройка nginx reverse proxy
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
