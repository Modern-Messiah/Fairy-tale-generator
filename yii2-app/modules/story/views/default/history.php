<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var yii\data\ActiveDataProvider $dataProvider */

$this->title = "История сказок";
$this->params["breadcrumbs"][] = [
    "label" => "Генератор сказок",
    "url" => ["index"],
];
$this->params["breadcrumbs"][] = $this->title;
?>

<div class="story-history">
    <div class="row">
        <div class="col-12">
            <!-- Заголовок -->
            <div class="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                <div>
                    <h1 class="display-5 fw-bold mb-2">
                        <i class="bi bi-clock-history text-primary"></i> <?= Html::encode(
                            $this->title,
                        ) ?>
                    </h1>
                    <p class="text-muted mb-0">
                        <i class="bi bi-book"></i> Все ваши сказочные истории в одном месте
                    </p>
                </div>
                <?= Html::a(
                    '<i class="bi bi-plus-circle-fill"></i> Создать новую сказку',
                    ["index"],
                    [
                        "class" =>
                            "btn btn-primary btn-lg shadow-sm pulse-button",
                    ],
                ) ?>
            </div>

            <!-- Список сказок -->
            <?php if ($dataProvider->getTotalCount() > 0): ?>
                <div class="row g-4">
                    <?php foreach (
                        $dataProvider->getModels()
                        as $index => $story
                    ): ?>
                        <div class="col-md-6 col-lg-4 animate-fade-in" style="animation-delay: <?= $index *
                            0.1 ?>s;">
                            <div class="card story-card h-100 shadow-hover">
                                <div class="card-ribbon">
                                    <span class="badge-language">
                                        <?= $story->language === "ru"
                                            ? "🇷🇺 Русский"
                                            : "🇰🇿 Қазақша" ?>
                                    </span>
                                </div>

                                <div class="card-body p-4">
                                    <!-- Заголовок -->
                                    <div class="story-header mb-3">
                                        <h5 class="card-title mb-2 fw-bold text-primary">
                                            📚 Сказка для <?= $story->age ?>-летнего ребенка
                                        </h5>
                                        <small class="text-muted d-flex align-items-center">
                                            <i class="bi bi-calendar3 me-1"></i>
                                            <?= method_exists(
                                                $story,
                                                "getFormattedDate",
                                            )
                                                ? $story->getFormattedDate()
                                                : date(
                                                    "d.m.Y H:i",
                                                    $story->created_at,
                                                ) ?>
                                        </small>
                                    </div>

                                    <!-- Персонажи -->
                                    <div class="characters-section mb-3">
                                        <div class="d-flex align-items-center mb-2">
                                            <i class="bi bi-people-fill text-primary me-2"></i>
                                            <strong class="small">Персонажи:</strong>
                                        </div>
                                        <div class="characters-badges">
                                            <?php foreach (
                                                array_slice(
                                                    $story->getCharactersArray(),
                                                    0,
                                                    3,
                                                )
                                                as $character
                                            ): ?>
                                                <span class="badge bg-light text-dark border">
                                                    <?= Html::encode(
                                                        $character,
                                                    ) ?>
                                                </span>
                                            <?php endforeach; ?>
                                            <?php if (
                                                count(
                                                    $story->getCharactersArray(),
                                                ) > 3
                                            ): ?>
                                                <span class="badge bg-primary">
                                                    +<?= count(
                                                        $story->getCharactersArray(),
                                                    ) - 3 ?>
                                                </span>
                                            <?php endif; ?>
                                        </div>
                                    </div>

                                    <!-- Превью текста -->
                                    <div class="story-preview">
                                        <p class="text-muted small mb-0" style="line-height: 1.6;">
                                            <?= Html::encode(
                                                $story->getPreview(120),
                                            ) ?>
                                        </p>
                                    </div>
                                </div>

                                <!-- Футер карточки -->
                                <div class="card-footer bg-transparent border-0 p-3 pt-0">
                                    <?= Html::a(
                                        '<i class="bi bi-book-half"></i> Читать сказку',
                                        ["view", "id" => $story->id],
                                        [
                                            "class" =>
                                                "btn btn-primary btn-sm w-100 shadow-sm read-button",
                                        ],
                                    ) ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Пагинация -->
                <?php
                $pagination = $dataProvider->getPagination();
                if ($pagination->pageCount > 1):

                    $currentPage = $pagination->page + 1;
                    $totalPages = $pagination->pageCount;
                    ?>
                    <div class="custom-pagination-wrapper mt-5 animate-fade-in">
                        <nav class="pagination-nav">
                            <ul class="pagination-list">

                                <!-- Страницы -->
                                <?php
                                $startPage = max(1, $currentPage - 2);
                                $endPage = min($totalPages, $currentPage + 2);

                                if ($startPage > 1): ?>
                                    <li class="pagination-item">
                                        <a href="?page=1" class="pagination-link">1</a>
                                    </li>
                                    <?php if ($startPage > 2): ?>
                                        <li class="pagination-item">
                                            <span class="pagination-dots">...</span>
                                        </li>
                                    <?php endif; ?>
                                <?php endif;
                                ?>

                                <?php for (
                                    $i = $startPage;
                                    $i <= $endPage;
                                    $i++
                                ): ?>
                                    <li class="pagination-item">
                                        <?php if ($i == $currentPage): ?>
                                            <span class="pagination-link active"><?= $i ?></span>
                                        <?php else: ?>
                                            <a href="?page=<?= $i ?>" class="pagination-link"><?= $i ?></a>
                                        <?php endif; ?>
                                    </li>
                                <?php endfor; ?>

                                <?php if ($endPage < $totalPages): ?>
                                    <?php if ($endPage < $totalPages - 1): ?>
                                        <li class="pagination-item">
                                            <span class="pagination-dots">...</span>
                                        </li>
                                    <?php endif; ?>
                                    <li class="pagination-item">
                                        <a href="?page=<?= $totalPages ?>" class="pagination-link"><?= $totalPages ?></a>
                                    </li>
                                <?php endif; ?>
                            </ul>
                        </nav>

                        <!-- Информация о странице -->
                        <div class="pagination-info">
                            Страница <strong><?= $currentPage ?></strong> из <strong><?= $totalPages ?></strong>
                        </div>
                    </div>
                <?php
                endif;
                ?>

            <?php else: ?>

                <!-- Пустое состояние -->
                <div class="empty-state text-center py-5 animate-fade-in">
                    <div class="empty-icon mb-4">
                        <i class="bi bi-book" style="font-size: 6rem; opacity: 0.2;"></i>
                    </div>
                    <h3 class="text-muted mb-3">История сказок пуста</h3>
                    <p class="text-muted mb-4">
                        Создайте свою первую волшебную сказку прямо сейчас!
                    </p>

                    <?= Html::a(
                        '<i class="bi bi-magic"></i> Создать первую сказку',
                        ["index"],
                        [
                            "class" =>
                                "btn btn-primary btn-lg shadow-sm pulse-button",
                        ],
                    ) ?>
                </div>

            <?php endif; ?>
        </div>
    </div>
</div>

<?php $this->registerCss("
/* Анимации */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out both;
}

/* Пульсирующая кнопка */
.pulse-button {
    animation: pulse 2s ease-in-out infinite;
    transition: all 0.3s ease;
}

.pulse-button:hover {
    animation: none;
    transform: translateY(-3px) !important;
    box-shadow: 0 10px 25px rgba(13, 110, 253, 0.3) !important;
}

/* Карточки сказок */
.story-card {
    border-radius: 15px;
    border: 1px solid rgba(0,0,0,0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    background: white;
}

.story-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transform: scaleX(0);
    transition: transform 0.4s ease;
}

.story-card:hover::before {
    transform: scaleX(1);
}

.shadow-hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.story-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.15);
    border-color: rgba(13, 110, 253, 0.2);
}

/* Лента с языком */
.card-ribbon {
    position: absolute;
    top: 15px;
    right: -5px;
    z-index: 1;
}

.badge-language {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 15px;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: 8px 0 0 8px;
    box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

/* Заголовок карточки */
.story-header {
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
}

/* Секция персонажей */
.characters-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.05);
}

.characters-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.characters-badges .badge {
    font-size: 0.8rem;
    padding: 5px 10px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.characters-badges .badge.bg-light {
    border: 1px solid #dee2e6;
}

.characters-badges .badge:hover {
    transform: scale(1.05);
}

/* Превью текста */
.story-preview {
    min-height: 60px;
    max-height: 80px;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;
}

.story-preview::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to bottom, transparent, white);
}

/* Кнопка чтения */
.read-button {
    border-radius: 10px;
    padding: 10px 20px;
    font-weight: 600;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
}

.read-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* Пустое состояние */
.empty-state {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 20px;
    padding: 60px 40px;
    margin-top: 40px;
}

.empty-icon {
    animation: pulse 3s ease-in-out infinite;
}

/* КАСТОМНАЯ ПАГИНАЦИЯ */
.custom-pagination-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.pagination-nav {
    background: white;
    padding: 15px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.pagination-list {
    display: flex;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
}

.pagination-item {
    list-style: none;
}

.pagination-link {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 50px;
    height: 50px;
    padding: 0 15px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    color: #333;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.pagination-link:hover:not(.disabled):not(.active) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.pagination-link.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    color: white;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    transform: scale(1.15);
    z-index: 1;
    cursor: default;
}

.pagination-link.disabled {
    background: #f5f5f5;
    border-color: #e0e0e0;
    color: #ccc;
    cursor: not-allowed;
    opacity: 0.5;
}

/* Полное скрытие пустых элементов пагинации */
.pagination-link.disabled {
    display: none !important;
}

.pagination-arrow {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-color: #90caf9;
    color: #1976d2;
    font-size: 1.1rem;
}

.pagination-arrow:hover:not(.disabled) {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    border-color: #2196f3;
    color: white;
}

.pagination-arrow.disabled {
    background: #f5f5f5;
    border-color: #e0e0e0;
    color: #ccc;
}

.pagination-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 50px;
    color: #999;
    font-weight: bold;
    font-size: 1.2rem;
}

.pagination-info {
    color: #666;
    font-size: 0.95rem;
    text-align: center;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
}

.pagination-info strong {
    color: #667eea;
    font-weight: 700;
}

/* Адаптивность */
@media (max-width: 768px) {
    .story-card {
        margin-bottom: 20px;
    }

    .pulse-button {
        font-size: 0.9rem;
        padding: 10px 20px;
    }

    .custom-pagination-wrapper {
        padding: 0 15px;
    }

    .pagination-list {
        gap: 5px;
    }

    .pagination-link {
        min-width: 45px;
        height: 45px;
        padding: 0 12px;
        font-size: 0.9rem;
    }

    .pagination-dots {
        min-width: 30px;
        font-size: 1rem;
    }
}

/* Улучшенные тени */
.shadow-sm {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
}

/* Плавные переходы для всех интерактивных элементов */
.btn, .card, .badge, a {
    transition: all 0.3s ease;
}
");
?>
