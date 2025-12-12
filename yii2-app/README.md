# Story Generator - Yii2 Frontend

**Веб-приложение на Yii2 Framework для генерации детских сказок**


## Быстрый старт с Docker.

### Шаг 1: Клонирование репозитория

```bash
git clone <repository-url>
cd <project-directory>
```

### Шаг 2: Настройка окружения

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

Настройте модуль Story в `config/web.php`:

```php
'modules' => [
    'story' => [
        'class' => 'app\modules\story\Module',
        'pythonApiUrl' => 'http://python-api:8000',  // URL Python API в Docker
        'pythonApiTimeout' => 60,
    ],
],
```

### Шаг 3: Запуск контейнеров

```bash
cd docker
docker-compose up -d
```

Это запустит:
- **PHP (Yii2)** - `http://localhost:8000`
- **Python API** - `http://localhost:8001`
- **MySQL** - `localhost:3307`
- **phpMyAdmin** - `http://localhost:8081`

### Шаг 4: Установка зависимостей и миграции

```bash
# Войти в PHP контейнер
docker exec -it yii-php bash

# Установить Composer зависимости
composer install

# Выполнить миграции базы данных
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

## Установка без Docker (Локальная разработка)

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

### Шаг 5: Настройка модуля Story (для локальной разработки)

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

## База данных

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

## Структура модуля Story

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

## Основные маршруты и функционал

### Маршруты модуля Story

| URL | Описание | Метод |
|-----|----------|-------|
| `/story` | Главная страница - форма создания сказки | GET |
| `/story/default/index` | Альтернативный URL формы создания | GET |
| `/story/default/stream` | Страница генерации (SSE streaming) | GET |
| `/story/default/generate` | API endpoint для генерации (SSE) | GET |
| `/story/default/history` | История всех созданных сказок | GET |
| `/story/default/view?id=1` | Просмотр конкретной сказки | GET |
| `/story/default/delete?id=1` | Удаление сказки | POST |
| `/story/default/health-check` | Проверка доступности Python API | GET |

### Функциональные возможности

#### Создание сказки
- Выбор возрастной группы (3-5, 6-8, 9-12 лет)
- Выбор языка (Русский/Казахский)
- Добавление кастомных персонажей
- Указание темы (опционально)

#### Streaming генерация
- Отображение текста в реальном времени
- Server-Sent Events (SSE) технология
- Прогресс-бар генерации
- Автосохранение в БД по завершении

#### Управление историями
- Просмотр всех созданных сказок
- Детальный просмотр с форматированием
- Удаление ненужных сказок
- Сортировка по дате создания

#### Пользовательский интерфейс
- Responsive дизайн для всех устройств
- Bootstrap 5 компоненты
- Анимации и переходы
- Интуитивная навигация


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

##  Composer зависимости

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

##  Деплой на production

###  Оптимизируйте Composer

```bash
composer install --optimize-autoloader --no-dev
```

##  Мониторинг

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

## Интеграция с Python API

### Архитектура взаимодействия

```
 Пользовательский интерфейс (Yii2)
         ↓
    Форма создания сказки
         ↓
 Controller (DefaultController)
         ↓
 Сохранение в сессию + редирект
         ↓
 Stream страница (SSE)
         ↓
 Proxy запрос к Python API
         ↓
 Python FastAPI
         ↓
 OpenAI GPT генерация
         ↓
 Streaming ответ
         ↓
 Сохранение в MySQL БД
```

### Класс StoryApiService

Основной класс для взаимодействия с Python API:

```php
// Инициализация сервиса
$service = new StoryApiService([
    'apiUrl' => 'http://python-api:8000',
    'timeout' => 60,
]);

// Генерация сказки с streaming
$service->generateStoryStream($data, function($chunk) {
    echo "data: " . json_encode(['chunk' => $chunk]) . "\n\n";
    flush();
});

// Проверка доступности API
$isHealthy = $service->healthCheck();
```

### Примеры запросов к Python API

#### Health Check
```php
// GET /health
$response = $service->healthCheck();
// Возвращает: true/false
```

#### Генерация сказки
```php
// POST /generate/stream
$data = [
    'age_group' => '6-8',
    'language' => 'ru',
    'characters' => ['заяц', 'лиса']
];

$service->generateStoryStream($data, $callback);
```

---

## Модуль Story - детальная структура

### Controller: DefaultController

Основные методы:
- `actionIndex()` - форма создания сказки
- `actionStream()` - страница генерации
- `actionGenerate()` - SSE endpoint
- `actionHistory()` - история сказок
- `actionView($id)` - просмотр сказки
- `actionDelete($id)` - удаление сказки
- `actionHealthCheck()` - проверка API

### Models

#### Story (ActiveRecord)
```php
class Story extends \yii\db\ActiveRecord
{
    // Атрибуты:
    // - id: int
    // - age: int (возраст ребенка)
    // - language: string (ru/kk)
    // - characters: text (JSON)
    // - content: text (Markdown)
    // - created_at: timestamp
}
```

#### StoryForm (Form Model)
```php
class StoryForm extends Model
{
    // Валидация:
    // - age_group: required, in range
    // - language: required, in range
    // - characters: array, max 5 items
    // - theme: string, max 100 chars
}
```

### Views

#### Layouts
- `main.php` - основной layout модуля
- Bootstrap 5 стилизация
- Навигационное меню

#### Pages
- `index.php` - форма создания сказки
- `stream.php` - страница генерации с SSE
- `history.php` - список всех сказок
- `view.php` - детальный просмотр сказки

---

## Тестирование

### Запуск тестов

```bash
# Все тесты
vendor/bin/codecept run

# Функциональные тесты
vendor/bin/codecept run functional

# Юнит-тесты
vendor/bin/codecept run unit

# Тесты модуля Story
vendor/bin/codecept run functional StoryCest
```

### Написание тестов

```php
// Пример функционального теста
class StoryCest
{
    public function testCreateStory(FunctionalTester $I)
    {
        $I->amOnPage('/story');
        $I->see('Создать сказку');
        $I->selectOption('[name="age_group"]', '6-8');
        $I->click('Создать сказку');
        $I->seeInCurrentUrl('/story/default/stream');
    }
}
```

---

## Мониторинг и логирование

### Yii2 логи

```bash
# Просмотр логов приложения
docker exec -it yii-php tail -f /app/runtime/logs/app.log

# Логи ошибок
docker exec -it yii-php tail -f /app/runtime/logs/error.log

# Логи веб-сервера
docker exec -it yii-php tail -f /var/log/apache2/error.log
```

### Настройка логирования

В `config/web.php`:
```php
'components' => [
    'log' => [
        'traceLevel' => YII_DEBUG ? 3 : 0,
        'targets' => [
            [
                'class' => 'yii\log\FileTarget',
                'levels' => ['error', 'warning'],
                'logFile' => '@runtime/logs/error.log',
            ],
            [
                'class' => 'yii\log\FileTarget',
                'levels' => ['info'],
                'logFile' => '@runtime/logs/app.log',
                'categories' => ['story'],
            ],
        ],
    ],
],
```

---

## Оптимизация производительности

### Кеширование

```bash
# Очистка всего кеша
docker exec -it yii-php php yii cache/flush-all

# Очистка кеша схемы БД
docker exec -it yii-php php yii cache/flush-schema
```

### Оптимизация для production

```bash
# Оптимизация автозагрузки Composer
docker exec -it yii-php composer install --optimize-autoloader --no-dev

# Включение OPcache (в php.ini)
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000
```

---

## Безопасность

### Защита от CSRF

Все формы защищены CSRF токенами:
```php
<?= Html::beginForm(['story/default/generate'], 'post', ['csrf' => true]) ?>
```

### Валидация входных данных

```php
// StoryForm правила валидации
public function rules()
{
    return [
        [['age_group', 'language'], 'required'],
        ['age_group', 'in', 'range' => ['3-5', '6-8', '9-12']],
        ['language', 'in', 'range' => ['ru', 'kk']],
        ['characters', 'each', 'rule' => ['string', 'max' => 50]],
        ['characters', 'validateCharacterCount'],
    ];
}
```

### Защита от XSS

```php
// Автоматическое экранирование в View
<?= Html::encode($story->title) ?>

// Безопасный рендеринг Markdown
<?= Yii::$app->formatter->asMarkdown($story->content) ?>
```
