# Показать список команд
default:
    @just --list

# Скопировать .env.example в .env, если файла ещё нет
env:
    @[ -f .env ] || cp .env.example .env

# Установить зависимости
install:
    npm install

# Поднять PostgreSQL и дождаться готовности
db:
    docker compose up -d --wait postgres

# Применить миграции Prisma
migrate: db
    npx prisma migrate deploy

# Подготовить окружение: .env, зависимости и миграции
setup: env install migrate

# Запустить сервер разработки
dev:
    npm run dev

# Прогнать тесты
test:
    npm test

# Проверить код линтером
lint:
    npm run lint

# Прогнать тесты и линтер
check: test lint

# Собрать клиент Prisma и приложение
build:
    npm run build

# Запустить собранное приложение
start:
    npm start

# Поднять приложение и базу в Docker
up:
    docker compose up --build
