# Story Generator API - Docker Image
FROM python:3.11-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Рабочая директория
WORKDIR /app

# Копирование зависимостей
COPY requirements.txt .

# Установка Python пакетов
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копирование приложения
COPY app/ ./app/

# Создание пользователя для безопасности
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Порт
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Запуск сервера
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]