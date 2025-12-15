<?php

use yii\helpers\Html;
use yii\helpers\Url;
use app\modules\story\models\StoryForm;

/** @var yii\web\View $this */
/** @var array $formData */

$this->title = "Генерация сказки";
$this->params["breadcrumbs"][] = [
    "label" => "Генератор сказок",
    "url" => ["index"],
];
$this->params["breadcrumbs"][] = $this->title;

// Преобразуем данные для отображения
$charactersStr = implode(", ", $formData["characters"]);
$languageName = $formData["language"] === "ru" ? "Русский" : "Казахский";
?>

<div class="story-stream">
    <div class="row">
        <div class="col-lg-10 mx-auto">
            <!-- Информация о запросе -->
            <div class="card mb-4 animate-fade-in">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3 fw-bold">
                        <i class="bi bi-info-circle-fill text-primary"></i> Параметры сказки
                    </h5>
                    <hr class="mb-4">
                    <div class="row">
                        <div class="col-md-4 text-center">
                            <div class="param-icon">👶</div>
                            <strong>Возраст:</strong><br>
                            <span class="text-primary fs-5"><?= Html::encode(
                                $formData["age"],
                            ) ?> лет</span>
                        </div>
                        <div class="col-md-4 text-center">
                            <div class="param-icon">🌍</div>
                            <strong>Язык:</strong><br>
                            <span class="text-primary fs-5"><?= Html::encode(
                                $languageName,
                            ) ?></span>
                        </div>
                        <div class = "col-md-4 text-center">
                            <div class ="param-icon"></div>
                            <strong>Жанр:</strong><br>
                            <span class = "text-primary fs-5"><?= Html::encode(
                                StoryForm::getGenreOptions()[
                                    $formData["genre"]
                                ] ?? "Волшебная сказка",
                            ) ?></span>
                        </div>
                        <div class="col-md-4 text-center">
                            <div class="param-icon">🎭</div>
                            <strong>Персонажи:</strong><br>
                            <span class="text-muted"><?= Html::encode(
                                $charactersStr,
                            ) ?></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Область отображения сказки -->
            <div class="card shadow-lg animate-fade-in">
                <div class="card-body p-5">
                    <!-- Контент сказки (появляется по словам в реальном времени) -->
                    <div id="story-content" class="story-content">
                        <!-- Сюда будет добавляться текст сказки -->
                    </div>

                    <!-- Индикатор загрузки (под текстом, исчезает когда готово) -->
                    <div id="loading-indicator" class="text-center py-4 loading-pulse">
                        <div class="spinner-grow text-primary" role="status" style="width: 2.5rem; height: 2.5rem;">
                            <span class="visually-hidden">Генерация...</span>
                        </div>
                        <p class="mt-3 text-muted fw-semibold">
                            <i class="bi bi-magic"></i> Создаю волшебную сказку...
                        </p>
                        <div class="progress mt-3" style="height: 4px; max-width: 300px; margin: 0 auto;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated"
                                 role="progressbar"
                                 style="width: 100%"></div>
                        </div>
                    </div>

                    <!-- Кнопки действий (появятся после генерации) -->
                    <div id="action-buttons" class="mt-5 text-center" style="display: none;">
                        <div class="alert alert-success animate-bounce" role="alert">
                            <i class="bi bi-check-circle-fill"></i> Сказка успешно создана!
                        </div>
                        <div class="btn-group-lg" role="group">
                            <a href="#" id="view-story-btn" class="btn btn-primary btn-lg me-2">
                                <i class="bi bi-eye-fill"></i> Посмотреть в истории
                            </a>
                            <?= Html::a(
                                '<i class="bi bi-arrow-clockwise"></i> Создать ещё',
                                ["index"],
                                [
                                    "class" =>
                                        "btn btn-outline-primary btn-lg me-2",
                                ],
                            ) ?>
                            <?= Html::a(
                                '<i class="bi bi-clock-history"></i> История',
                                ["history"],
                                ["class" => "btn btn-outline-secondary btn-lg"],
                            ) ?>
                        </div>
                    </div>

                    <!-- Сообщение об ошибке -->
                    <div id="error-message" class="alert alert-danger animate-shake" style="display: none;">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <strong>Ошибка:</strong> <span id="error-text"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
// Подключаем marked.js для преобразования Markdown в HTML
$this->registerJsFile("https://cdn.jsdelivr.net/npm/marked/marked.min.js", [
    "position" => \yii\web\View::POS_HEAD,
]);

// JavaScript для потокового чтения
$generateUrl = Url::to(["generate"]);
$this->registerJs(
    "
// Настройка marked для безопасного рендеринга
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true
    });
}

// Подключение к SSE (Server-Sent Events)
const eventSource = new EventSource('{$generateUrl}');
let fullContent = '';
let storyId = null;

const contentDiv = document.getElementById('story-content');
const loadingIndicator = document.getElementById('loading-indicator');

// Добавляем курсор мигающий в конец текста
let cursor = document.createElement('span');
cursor.className = 'typing-cursor';
cursor.textContent = '|';

eventSource.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);

        if (data.error) {
            // Ошибка генерации
            loadingIndicator.style.display = 'none';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-text').textContent = data.error;
            eventSource.close();
            return;
        }

        if (data.chunk) {
            // Получен chunk текста
            const chunk = data.chunk;
            fullContent += chunk;

            // Удаляем курсор если есть
            if (cursor.parentNode) {
                cursor.remove();
            }

            // Добавляем chunk как текстовый узел
            const textNode = document.createTextNode(chunk);
            contentDiv.appendChild(textNode);

            // Добавляем курсор обратно
            contentDiv.appendChild(cursor);

            // Автоскролл
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }

        if (data.done) {
            // Убираем курсор
            if (cursor.parentNode) {
                cursor.remove();
            }

            // Генерация завершена - теперь применяем markdown форматирование
            contentDiv.innerHTML = marked.parse(fullContent);

            storyId = data.story_id;

            // Плавно скрываем индикатор загрузки
            loadingIndicator.classList.add('fade-out');
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                // Показываем кнопки действий
                document.getElementById('action-buttons').style.display = 'block';

                // Плавный скролл к кнопкам
                document.getElementById('action-buttons').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 500);

            // Устанавливаем ссылку на просмотр сказки
            if (storyId) {
                const viewBtn = document.getElementById('view-story-btn');
                viewBtn.href = '" .
        Url::to(["view", "id" => ""]) .
        "' + storyId;
            }

            // Закрываем соединение
            eventSource.close();
        }
    } catch (e) {
        console.error('Error parsing SSE data:', e);
    }
};

eventSource.onerror = function(error) {
    console.error('SSE Error:', error);
    loadingIndicator.style.display = 'none';
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-text').textContent = 'Ошибка соединения с сервером';
    eventSource.close();
};
",
    \yii\web\View::POS_READY,
);

$this->registerCss("
/* Анимации появления */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out;
}

.animate-bounce {
    animation: bounce 0.5s ease-out;
}

.animate-shake {
    animation: shake 0.5s ease-out;
}

/* Параметры */
.param-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

/* Контент сказки */
.story-content {
    font-size: 1.15rem;
    line-height: 1.85;
    color: #1a1a1a;
    font-family: 'Georgia', 'Times New Roman', serif;
    letter-spacing: 0.01em;
    min-height: 50px;
    text-align: justify;
}

/* Мигающий курсор при наборе */
.typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background-color: #2c5aa0;
    margin-left: 2px;
    animation: blink 1s infinite;
    vertical-align: text-bottom;
}

@keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
}

/* Заголовки */
.story-content h1 {
    color: #2c5aa0;
    margin: 30px 0 25px 0;
    font-size: 2.2rem;
    font-weight: 700;
    text-align: center;
    border-bottom: 3px solid #2c5aa0;
    padding-bottom: 15px;
    font-family: 'Georgia', serif;
    letter-spacing: 0.02em;
}

.story-content h2 {
    color: #34495e;
    margin: 25px 0 15px 0;
    font-size: 1.75rem;
    font-weight: 600;
    border-left: 5px solid #3498db;
    padding-left: 15px;
}

.story-content h3 {
    color: #34495e;
    margin: 20px 0 12px 0;
    font-size: 1.4rem;
    font-weight: 600;
}

.story-content h4, .story-content h5, .story-content h6 {
    color: #555;
    margin: 18px 0 10px 0;
    font-weight: 600;
}

/* Параграфы - ИСПРАВЛЕНО! */
.story-content p {
    margin-bottom: 1.2em;
    text-align: justify;
    hyphens: auto;
    text-indent: 2.5em;
    line-height: 1.85;
}

/* Убираем двойные отступы */
.story-content p + p {
    margin-top: 0;
}

/* Выделение текста */
.story-content strong, .story-content b {
    color: #2c3e50;
    font-weight: 700;
}

.story-content em, .story-content i {
    font-style: italic;
    color: #34495e;
}

/* Списки */
.story-content ul, .story-content ol {
    margin: 15px 0;
    padding-left: 2.5rem;
}

.story-content li {
    margin-bottom: 8px;
    line-height: 1.8;
}

.story-content ul li {
    list-style-type: disc;
}

.story-content ul ul li {
    list-style-type: circle;
}

/* Цитаты */
.story-content blockquote {
    margin: 20px 0;
    padding: 15px 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-left: 5px solid #3498db;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #555;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.story-content blockquote p {
    margin-bottom: 8px;
    text-indent: 0;
}

.story-content blockquote p:last-child {
    margin-bottom: 0;
}

/* Код */
.story-content code {
    background-color: #f4f4f4;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.95em;
    color: #c7254e;
}

.story-content pre {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 15px 0;
    border: 1px solid #dee2e6;
}

.story-content pre code {
    background-color: transparent;
    padding: 0;
    color: #333;
}

/* Горизонтальная линия */
.story-content hr {
    margin: 25px 0;
    border: none;
    border-top: 2px solid #e0e0e0;
    opacity: 0.6;
}

/* Ссылки */
.story-content a {
    color: #3498db;
    text-decoration: none;
    border-bottom: 1px dotted #3498db;
    transition: all 0.2s ease;
}

.story-content a:hover {
    color: #2c5aa0;
    border-bottom-style: solid;
}

/* Анимация загрузки */
.spinner-grow {
    animation-duration: 1s;
}

.loading-pulse {
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.loading-pulse.fade-out {
    opacity: 0;
    transform: translateY(20px);
}

#error-message {
    animation: shake 0.5s ease-out;
}

/* Кнопки действий появляются плавно */
#action-buttons {
    animation: fadeIn 0.8s ease-out;
}

/* Карточки */
.card {
    border-radius: 15px;
    border: none;
}

/* Улучшенные кнопки */
.btn-lg {
    padding: 12px 30px;
    font-size: 1.1rem;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
}

.btn-outline-primary:hover {
    transform: translateY(-2px);
}

.btn-outline-secondary:hover {
    transform: translateY(-2px);
}

/* Прогресс бар */
.progress {
    background-color: rgba(13, 110, 253, 0.1);
    border-radius: 10px;
}

.progress-bar {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}
");


?>
