<?php

use yii\helpers\Html;
use yii\helpers\Markdown;

/** @var yii\web\View $this */
/** @var app\modules\story\models\Story $model */

$this->title = "Сказка #" . $model->id;
$this->params["breadcrumbs"][] = [
    "label" => "Генератор сказок",
    "url" => ["index"],
];
$this->params["breadcrumbs"][] = ["label" => "История", "url" => ["history"]];
$this->params["breadcrumbs"][] = $this->title;
?>

<div class="story-view">
    <div class="row">
        <div class="col-lg-10 mx-auto">

            <!-- Кнопки действий -->
            <div class="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2 animate-fade-in">
                <div class="btn-group" role="group">
                    <?= Html::a(
                        '<i class="bi bi-arrow-left-circle-fill"></i> Назад к истории',
                        ["history"],
                        [
                            "class" =>
                                "btn btn-outline-secondary btn-lg shadow-sm",
                        ],
                    ) ?>
                </div>

                <div class="btn-group" role="group">
                    <?= Html::a(
                        '<i class="bi bi-arrow-clockwise"></i> Новая сказка',
                        ["index"],
                        [
                            "class" =>
                                "btn btn-primary btn-lg shadow-sm pulse-button",
                        ],
                    ) ?>
                </div>
            </div>

            <!-- Информационная карточка -->
            <div class="card info-card mb-4 shadow-lg animate-slide-up">
                <div class="card-header bg-gradient text-white">
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 class="mb-0 fw-bold">
                            <i class="bi bi-info-circle-fill"></i> Информация о сказке
                        </h5>
                        <span class="badge badge-language-large">
                            <?= $model->language === "ru"
                                ? "🇷🇺 Русский"
                                : "🇰🇿 Қазақша" ?>
                        </span>
                    </div>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">

                        <!-- Возраст -->
                        <div class="col-md-3 col-sm-6">
                            <div class="info-item">
                                <div class="info-icon bg-age">
                                    👶
                                </div>
                                <div class="info-content">
                                    <small class="text-muted d-block">Возраст</small>
                                    <strong class="fs-5 text-primary"><?= Html::encode(
                                        $model->age,
                                    ) ?> лет</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Язык -->
                        <div class="col-md-3 col-sm-6">
                            <div class="info-item">
                                <div class="info-icon bg-language">
                                    🌍
                                </div>
                                <div class="info-content">
                                    <small class="text-muted d-block">Язык</small>
                                    <strong class="fs-6">
                                        <?= $model->language === "ru"
                                            ? "🇷🇺 Русский"
                                            : "🇰🇿 Казахский" ?>
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <!-- Персонажи -->
                        <div class="col-md-3 col-sm-6">
                            <div class="info-item">
                                <div class="info-icon bg-characters">
                                    🎭
                                </div>
                                <div class="info-content">
                                    <small class="text-muted d-block">Персонажи</small>
                                    <span class="badge bg-primary">
                                        <?= count(
                                            $model->getCharactersArray(),
                                        ) ?> героев
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Создана -->
                        <div class="col-md-3 col-sm-6">
                            <div class="info-item">
                                <div class="info-icon bg-date">
                                    📅
                                </div>
                                <div class="info-content">
                                    <small class="text-muted d-block">Создана</small>
                                    <strong class="fs-6"><?= $model->getFormattedDate() ?></strong>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Список персонажей -->
                    <div class="characters-list mt-4 pt-3 border-top">
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-stars text-warning me-2"></i>
                            <strong>Герои сказки:</strong>
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                            <?php foreach (
                                $model->getCharactersArray()
                                as $character
                            ): ?>
                                <span class="character-badge-view">
                                    🎭 <?= Html::encode($character) ?>
                                </span>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Контент сказки -->
            <div class="card story-card shadow-xl animate-slide-up" style="animation-delay: 0.2s;">
                <div class="card-body p-5 story-content-wrapper">
                    <div class="story-decoration-top"></div>

                    <div class="story-content">
                        <?= Markdown::process($model->content, "gfm") ?>
                    </div>

                    <div class="story-decoration-bottom"></div>

                    <!-- Конец сказки -->
                    <div class="story-end text-center mt-5 pt-4 border-top">
                        <div class="story-end-icon mb-3">
                            ✨📖✨
                        </div>
                        <p class="text-muted fst-italic mb-0">
                            Конец сказки
                        </p>
                    </div>
                </div>
            </div>

            <!-- Нижние кнопки действий -->
            <div class="mt-4 text-center animate-fade-in" style="animation-delay: 0.4s;">
                <div class="btn-group-lg" role="group">
                    <?= Html::a(
                        '<i class="bi bi-arrow-left-circle"></i> К истории',
                        ["history"],
                        ["class" => "btn btn-outline-secondary me-2"],
                    ) ?>
                    <?= Html::a(
                        '<i class="bi bi-magic"></i> Создать новую',
                        ["index"],
                        ["class" => "btn btn-primary pulse-button"],
                    ) ?>
                </div>
            </div>

        </div>
    </div>
</div>

<?php $this->registerCss("
/* Анимации */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out both;
}

.animate-slide-up {
    animation: slideUp 0.8s ease-out both;
}

.pulse-button {
    animation: pulse 2s ease-in-out infinite;
}

.pulse-button:hover {
    animation: none;
    transform: translateY(-3px) !important;
}

/* Информационная карточка */
.info-card {
    border-radius: 20px;
    border: none;
    overflow: hidden;
}

.bg-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.badge-language-large {
    background: rgba(255,255,255,0.2);
    padding: 8px 16px;
    font-size: 1rem;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.info-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    transition: all 0.3s ease;
    height: 100%;
}

.info-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.info-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: white;
    font-size: 1.8rem;
    flex-shrink: 0;
}

.bg-age {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-language {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.bg-characters {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.bg-date {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.info-content {
    flex: 1;
}

/* Список персонажей */
.characters-list {
    background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
    padding: 15px;
    border-radius: 12px;
}

.character-badge-view {
    display: inline-block;
    background: white;
    color: #333;
    padding: 8px 16px;
    border-radius: 10px;
    font-weight: 500;
    font-size: 0.95rem;
    border: 2px solid #ffd700;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
}

.character-badge-view:hover {
    transform: translateY(-3px) rotate(2deg);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
}

/* Карточка сказки */
.story-card {
    border-radius: 20px;
    border: none;
    position: relative;
    background: white;
}

.story-content-wrapper {
    position: relative;
    background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
}

/* Декоративные элементы */
.story-decoration-top {
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
    margin-bottom: 30px;
    border-radius: 2px;
}

.story-decoration-bottom {
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%);
    margin: 40px auto 0;
    opacity: 0.5;
}

/* Контент сказки */
.story-content {
    font-size: 1.2rem;
    line-height: 2;
    color: #1a1a1a;
    font-family: 'Georgia', 'Times New Roman', serif;
    letter-spacing: 0.02em;
    text-align: justify;
}

/* Заголовки */
.story-content h1 {
    color: #2c5aa0;
    margin: 0 0 40px 0;
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    border-bottom: 4px solid #2c5aa0;
    padding-bottom: 25px;
    font-family: 'Georgia', serif;
    letter-spacing: 0.03em;
    position: relative;
}

.story-content h1::after {
    content: '✨';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 0 10px;
    font-size: 1.5rem;
}

.story-content h2 {
    color: #34495e;
    margin: 40px 0 25px 0;
    font-size: 1.9rem;
    font-weight: 600;
    border-left: 6px solid #3498db;
    padding-left: 20px;
    background: linear-gradient(to right, rgba(52, 152, 219, 0.1) 0%, transparent 100%);
    padding: 15px 20px;
    border-radius: 0 10px 10px 0;
}

.story-content h3 {
    color: #34495e;
    margin: 35px 0 20px 0;
    font-size: 1.6rem;
    font-weight: 600;
}

.story-content h4, .story-content h5, .story-content h6 {
    color: #555;
    margin: 30px 0 15px 0;
    font-weight: 600;
}

/* Параграфы */
.story-content p {
    margin-bottom: 1.5em;
    text-align: justify;
    hyphens: auto;
    text-indent: 3em;
    line-height: 2;
}

.story-content p:first-of-type {
    font-size: 1.25rem;
    color: #2c3e50;
    text-indent: 0;
}

.story-content p:first-of-type::first-letter {
    font-size: 3.5rem;
    font-weight: bold;
    float: left;
    line-height: 1;
    margin: 0 5px 0 0;
    color: #667eea;
    font-family: Georgia, serif;
}


/* Выделение текста */
.story-content strong, .story-content b {
    color: #2c3e50;
    font-weight: 700;
    background: linear-gradient(transparent 60%, rgba(255, 215, 0, 0.3) 60%);
}

.story-content em, .story-content i {
    font-style: italic;
    color: #34495e;
}

/* Списки */
.story-content ul, .story-content ol {
    margin: 25px 0;
    padding-left: 3rem;
}

.story-content li {
    margin-bottom: 12px;
    line-height: 2;
}

.story-content ul li {
    list-style-type: '✓ ';
}

/* Цитаты */
.story-content blockquote {
    margin: 30px 0;
    padding: 25px 30px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-left: 6px solid #3498db;
    border-radius: 0 15px 15px 0;
    font-style: italic;
    color: #555;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    position: relative;
}

.story-content blockquote::before {
    content: '\"';
    font-size: 4rem;
    color: #3498db;
    opacity: 0.3;
    position: absolute;
    top: -10px;
    left: 10px;
    font-family: Georgia, serif;
}

.story-content blockquote p {
    margin-bottom: 12px;
    text-indent: 0;
}

.story-content blockquote p:last-child {
    margin-bottom: 0;
}

/* Горизонтальная линия */
.story-content hr {
    margin: 40px auto;
    border: none;
    height: 3px;
    background: linear-gradient(to right, transparent 0%, #667eea 50%, transparent 100%);
    opacity: 0.6;
    width: 50%;
}

/* Конец сказки */
.story-end {
    background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
    padding: 25px;
    border-radius: 15px;
}

.story-end-icon {
    font-size: 2rem;
    animation: pulse 2s ease-in-out infinite;
}

/* Кнопки */
.btn {
    transition: all 0.3s ease;
    font-weight: 600;
    border-radius: 12px;
    padding: 12px 25px;
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.shadow-xl {
    box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
}

/* Адаптивность */
@media (max-width: 768px) {
    .story-content {
        font-size: 1.1rem;
        line-height: 1.8;
    }

    .story-content h1 {
        font-size: 2rem;
    }

    .story-content h2 {
        font-size: 1.6rem;
    }

    .info-item {
        flex-direction: column;
        text-align: center;
    }
}
"); ?>
