# Генератор сказок

Веб-приложение на TypeScript: форма, потоковая генерация сказки и история. PHP и Python в этом каталоге не используются. Старые `yii2-app` и `python-story-api` лежат рядом и в запуск не входят.

## Стек

- Next.js, React, TypeScript
- Zod и react-hook-form
- Prisma и PostgreSQL 16
- AI SDK и xAI (`XAI_API_KEY`, модель `grok-4.7`)

Ключ модели читается только на сервере.

## Локальный запуск

Нужны Node.js 22 и Docker.

```bash
cd web
cp .env.example .env
```

В `.env` впишите `XAI_API_KEY`.

```bash
docker compose up -d postgres
npm install
npx prisma migrate deploy
npm run dev
```

Откройте http://localhost:3000

| Страница | Адрес |
| --- | --- |
| Форма | http://localhost:3000 |
| История | http://localhost:3000/history |
| Проверка сервиса | http://localhost:3000/api/health |

Полный подъём приложения и базы:

```bash
docker compose up --build
```

## Проверки

```bash
npm test
npm run lint
npm run build
```

Тесты не ходят в модель и в базу. Поток генерации проверяется с подменённым генератором.
