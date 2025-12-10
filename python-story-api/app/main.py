import asyncio
import logging
import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import settings
from app.models import StoryRequest
from app.services import StoryGeneratorService

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация сервиса
story_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Lifecycle manager для инициализации ресурсов
    global story_service

    # Startup
    logger.info("🚀 Starting Story Generator API...")

    if not settings.OPENAI_API_KEY:
        logger.error("❌ OPENAI_API_KEY not found in environment!")
        raise RuntimeError("OPENAI_API_KEY is required")

    story_service = StoryGeneratorService()
    logger.info("✅ Story Generator Service initialized")

    yield

    # Shutdown - явная очистка ресурсов
    logger.info("👋 Shutting down Story Generator API...")
    if story_service:
        try:
            await story_service.cleanup()
            story_service = None
            logger.info("✅ Story service cleaned up")
        except Exception as e:
            logger.error(f"❌ Error cleaning up story service: {e}")


# Создание FastAPI приложения
app = FastAPI(
    title="Story Generator API",
    description="API для генерации детских сказок с помощью OpenAI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware для доступа из Yii2
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Корневой endpoint"""
    return {
        "message": "Story Generator API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {"generate": "/generate_story", "health": "/health"},
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "openai_configured": bool(settings.OPENAI_API_KEY)}


@app.post("/generate_story")
async def generate_story(request: StoryRequest):
    """
    Генерирует сказку на основе входных параметров
    Args:
        request: StoryRequest с параметрами (age, language, characters)

    Returns:
        StreamingResponse с текстом сказки по кусочкам
    """
    logger.info(
        f"📚 Generating story: age={request.age}, lang={request.language}, chars={len(request.characters)}"
    )

    if not settings.OPENAI_API_KEY:
        logger.error("❌ OpenAI API key not configured")
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        # ВАЖНО: Используем async generator для правильного стриминга
        async def generate():
            """Async generator для потоковой отправки данных"""
            chunk_count = 0
            if not story_service:
                logger.error("❌ Story service not available")
                yield "Ошибка: сервис не доступен"
                return
                
            async for chunk in story_service.generate_story_stream(
                age=request.age,
                language=request.language,
                characters=request.characters,
            ):
                chunk_count += 1
                logger.debug(f"Sending chunk #{chunk_count}: {len(chunk)} chars")
                yield chunk
                # Небольшая задержка для стабильности потока
                await asyncio.sleep(0.01)

            logger.info(f"✅ Stream completed: {chunk_count} chunks sent")

        # Возвращаем StreamingResponse с правильными заголовками
        return StreamingResponse(
            generate(),
            media_type="text/plain; charset=utf-8",
            headers={
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",  # Отключение буферизации для nginx
                "Connection": "keep-alive",
            },
        )
    except Exception as e:
        logger.error(f"❌ Error generating story: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating story: {str(e)}")


if __name__ == "__main__":
    is_dev = os.getenv("ENVIRONMENT") == "dev"
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=is_dev,
        log_level="info" if is_dev else "warning",
    )
