# 🎨 Story Generator - Yii2 Frontend

Веб-интерфейс для генерации детских сказок на базе Yii2 Framework.

## 🚀 Быстрый старт с Docker (Рекомендуется)

### Шаг 1: Клонирование репозитория

```bash
git clone <repository-url>
cd <project-directory>
```

### Шаг 2: Настройка Yii2

Создайте файл `config/db.php` в папке `yii2-app/`:

```php
<?php
return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=db;dbname=storydb',
    'username' => 'user',
    'password' => 'pass',
    'charset' => 'utf8mb4',
];
```

### Шаг 3: Запуск контейнеров

```bash
cd docker
docker-compose up -d
```

Это запустит:
- 🐘 **PHP (Yii2)** - `http://localhost:8000`
- 🐍 **Python API** - `http://localhost:8001`
- 🗄️ **MySQL** - `localhost:3307`
- 🔧 **phpMyAdmin** - `http://localhost:8081`

### Шаг 4: Установка зависимостей Yii2

```bash
# Войти в PHP контейнер
docker exec -it yii-php bash

# Установить Composer зависимости
composer install

# Выполнить миграции
php yii migrate --interactive=0

# Выйти из контейнера
exit
```

### Шаг 6: Проверка работы

Откройте браузер:
- **Главная страница**: http://localhost:8000
- **Генератор сказок**: http://localhost:8000/story
- **phpMyAdmin**: http://localhost:8081 (root / root)

---

## 🛠️ Установка без Docker (Локальная разработка)

### Предварительные требования
- PHP 8.2+
- Composer
- MySQL 8+
- Python 3.10+ (для API)

### Шаг 1: Установка Yii2

```bash
# Клонирование проекта
git clone <repository-url>
cd yii2-app

# Установка зависимостей
composer install
```

### Шаг 4: Настройка модуля Story

В файле `config/web.php` добавьте модуль:

```php
'modules' => [
    'story' => [
        'class' => 'app\modules\story\Module',
        'pythonApiUrl' => 'http://localhost:8001', // URL Python API
        'pythonApiTimeout' => 60,
    ],
],
```


### Полезные команды Docker

```bash
# Запуск всех контейнеров
docker-compose up -d

# Остановка всех контейнеров
docker-compose down

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f php
docker-compose logs -f story-api

# Перезапуск контейнера
docker-compose restart php

# Пересборка контейнеров
docker-compose up -d --build

# Войти в PHP контейнер
docker exec -it yii-php bash

# Войти в MySQL
docker exec -it yii-db mysql -u root -p

# Очистка всего
docker-compose down -v
docker system prune -a
```

---

## 🗄️ База данных

### Миграции

Проект использует Yii2 миграции для управления структурой БД.

#### Выполнение миграций

```bash
# В Docker
docker exec -it yii-php php yii migrate

#### Существующие миграции

1. **m241206_000000_create_story_table** - Создание таблицы `story`
2. **m241207_000000_drop_updated_at_from_story** - Удаление колонки `updated_at`

#### Структура таблицы `story`

```sql
CREATE TABLE `story` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `age` int(11) NOT NULL COMMENT 'Возраст ребенка',
  `language` varchar(2) NOT NULL COMMENT 'Язык (ru/kk)',
  `characters` text NOT NULL COMMENT 'Персонажи (JSON)',
  `content` text NOT NULL COMMENT 'Текст сказки (Markdown)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx-story-created_at` (`created_at`),
  KEY `idx-story-language` (`language`),
  KEY `idx-story-age` (`age`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Создание новой миграции

```bash
php yii migrate/create create_new_table
```

---

## 📁 Структура модуля Story

```
modules/story/
├── Module.php                      # Конфигурация модуля
├── controllers/
│   └── DefaultController.php      # Основной контроллер
├── models/
│   ├── Story.php                  # ActiveRecord модель
│   └── StoryForm.php              # Форма создания сказки
├── services/
│   └── StoryApiService.php        # Сервис для работы с Python API
├── views/
│   ├── layouts/
│   │   └── main.php               # Главный layout
│   └── default/
│       ├── index.php              # Форма создания
│       ├── stream.php             # Страница генерации
│       ├── history.php            # История сказок
│       └── view.php               # Просмотр сказки
└── migrations/
    ├── m241206_000000_create_story_table.php
    └── m241207_000000_drop_updated_at_from_story.php
```

---

## 🎯 Основные маршруты

| URL | Описание | Метод |
|-----|----------|-------|
| `/story` | Главная страница - форма создания | GET |
| `/story/default/index` | То же самое | GET |
| `/story/default/stream` | Страница генерации (SSE) | GET |
| `/story/default/generate` | API endpoint для генерации | GET (SSE) |
| `/story/default/history` | История всех сказок | GET |
| `/story/default/view?id=1` | Просмотр конкретной сказки | GET |
| `/story/default/delete?id=1` | Удаление сказки | POST |
| `/story/default/health-check` | Проверка Python API | GET |


### Просмотр логов

```bash
# В Docker
docker-compose logs -f php

# Yii2 логи (в контейнере)
docker exec -it yii-php tail -f /app/runtime/logs/app.log

# Логи Apache
docker exec -it yii-php tail -f /var/log/apache2/error.log
```

### Очистка кеша

```bash
# В Docker
docker exec -it yii-php php yii cache/flush-all

# Локально
php yii cache/flush-all
rm -rf runtime/cache/*
```

## 📝 Composer зависимости

```json
{
  "require": {
    "php": ">=8.0",
    "yiisoft/yii2": "~2.0.45",
    "yiisoft/yii2-bootstrap5": "~2.0.2",
    "guzzlehttp/guzzle": "^7.5"
  }
}
```

### Установка дополнительных пакетов

```bash
docker exec -it yii-php composer require package/name
```

---

## 🐛 Отладка

### Проблемы с подключением к Python API

```bash
# Проверить статус API
curl http://localhost:8001/health

# Или через контейнер
docker exec -it yii-php curl http://python-api:8000/health
```


---

## 🚀 Деплой на production

###  Оптимизируйте Composer

```bash
composer install --optimize-autoloader --no-dev
```

## 📊 Мониторинг

### Health Checks

```bash
# Yii2 App
curl http://localhost:8000

# Python API
curl http://localhost:8001/health

# MySQL
docker exec -it yii-db mysqladmin ping -h localhost -u root -proot
```

### Проверка логов в реальном времени

```bash
# Все сервисы
docker-compose logs -f

# Только PHP
docker-compose logs -f php

# Только Python API
docker-compose logs -f story-api
```


## 🎓 Основные команды Yii2

```bash
# Список всех команд
php yii help

# Миграции
php yii migrate                    # Применить миграции
php yii migrate/create table_name  # Создать миграцию
php yii migrate/down              # Откатить последнюю

# Кеш
php yii cache/flush-all           # Очистить весь кеш
php yii cache/flush-schema        # Очистить схему БД

# Fixtures (тестовые данные)
php yii fixture/load              # Загрузить fixtures

# Gii (генератор кода)
# Доступен по адресу: http://localhost:8000/gii
```

---

## 🤝 Интеграция с Python API

### Как работает интеграция

1. **Форма** (`index.php`) → отправка данных
2. **Controller** → сохранение в сессию → редирект на `stream`
3. **Stream page** (`stream.php`) → подключение к SSE endpoint
4. **SSE Endpoint** (`generate`) → прокси к Python API
5. **Python API** → генерация через OpenAI
6. **Streaming** → текст возвращается по частям
7. **Сохранение** → готовая сказка в БД

### Класс StoryApiService

```php
$service = new StoryApiService([
    'apiUrl' => 'http://python-api:8000',
    'timeout' => 60,
]);

// Генерация с callback
$service->generateStoryStream($data, function($chunk) {
    echo "data: " . json_encode(['chunk' => $chunk]) . "\n\n";
    flush();
});
```
