<?php
/** @var yii\web\View $this */
/** @var string $content */

use app\assets\AppAsset;
use yii\bootstrap5\Html;

AppAsset::register($this);

$this->registerCsrfMetaTags();
$this->registerMetaTag(["charset" => Yii::$app->charset], "charset");
$this->registerMetaTag([
    "name" => "viewport",
    "content" => "width=device-width, initial-scale=1, shrink-to-fit=no",
]);
$this->registerLinkTag([
    "rel" => "icon",
    "type" => "image/x-icon",
    "href" => Yii::getAlias("@web/favicon.ico"),
]);
?>
<?php $this->beginPage(); ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" class="h-100">
<head>
    <title><?= Html::encode($this->title) ?> | Генератор Сказок</title>
    <?php $this->head(); ?>
    <style>
        /* Анимированный градиентный фон */
        body {
            background: linear-gradient(135deg, #fceabb 0%, #f8b500 50%, #fceabb 100%);
            background-size: 200% 200%;
            animation: gradientShift 15s ease infinite;
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: relative;
            overflow-x: hidden;
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* Декоративные элементы на фоне */
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background-image:
                radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
            animation: float 20s ease-in-out infinite;
            pointer-events: none;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(30px, 30px) rotate(180deg); }
        }

        /* Плавающие звездочки */
        .sparkles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .sparkle {
            position: absolute;
            font-size: 1.5rem;
            opacity: 0;
            animation: sparkleFloat 8s ease-in-out infinite;
        }

        @keyframes sparkleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }

        .sparkle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .sparkle:nth-child(2) { left: 25%; animation-delay: 2s; }
        .sparkle:nth-child(3) { left: 45%; animation-delay: 4s; }
        .sparkle:nth-child(4) { left: 65%; animation-delay: 1s; }
        .sparkle:nth-child(5) { left: 80%; animation-delay: 3s; }
        .sparkle:nth-child(6) { left: 90%; animation-delay: 5s; }

        /* Контейнер */
        .story-container {
            padding: 50px 0;
            position: relative;
            z-index: 2;
        }

        /* Хедер */
        .main-header {
            text-align: center;
            padding: 30px 0;
            margin-bottom: 30px;
        }

        .logo {
            display: inline-block;
            font-size: 3rem;
            margin-bottom: 10px;
            animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .site-title {
            font-size: 2rem;
            font-weight: bold;
            color: #333;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            margin: 0;
        }

        /* Футер */
        .main-footer {
            text-align: center;
            padding: 30px 0;
            margin-top: 50px;
            color: #666;
        }

        .footer-hearts {
            font-size: 1.2rem;
            margin-bottom: 10px;
            animation: heartBeat 2s ease-in-out infinite;
        }

        @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
        }

        /* Кнопка "Наверх" */
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .scroll-to-top.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
        }

        /* Улучшенный контейнер */
        .container {
            position: relative;
        }

        /* Breadcrumbs стилизация */
        .breadcrumb {
            background: rgba(255, 255, 255, 0.9);
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .breadcrumb-item + .breadcrumb-item::before {
            content: "→";
            color: #667eea;
        }

        .breadcrumb-item.active {
            color: #667eea;
            font-weight: 600;
        }

        /* Плавное появление контента */
        .content-fade-in {
            animation: contentFadeIn 0.8s ease-out;
        }

        @keyframes contentFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Адаптивность */
        @media (max-width: 768px) {
            .logo {
                font-size: 2rem;
            }

            .site-title {
                font-size: 1.5rem;
            }

            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    </style>
</head>
<body class="d-flex flex-column h-100">
<?php $this->beginBody(); ?>

<!-- Плавающие звездочки -->
<div class="sparkles">
    <div class="sparkle">✨</div>
    <div class="sparkle">⭐</div>
    <div class="sparkle">💫</div>
    <div class="sparkle">🌟</div>
    <div class="sparkle">✨</div>
    <div class="sparkle">⭐</div>
</div>

<!-- Основной контент -->
<div class="story-container flex-grow-1">
    <div class="container content-fade-in">
        <?= $content ?>
    </div>
</div>

<!-- Футер -->
<footer class="main-footer mt-auto">
    <div class="container">
        <p style="margin-top: 5px; font-size: 0.85rem; color: #999;">
            © <?= date("Y") ?> Генератор Сказок. Все сказки уникальны!
        </p>
    </div>
</footer>

<!-- Кнопка "Наверх" -->
<div class="scroll-to-top" id="scrollToTop">
    <i class="bi bi-arrow-up"></i>
</div>

<script>
// Кнопка "Наверх"
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
});

document.getElementById('scrollToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
</script>

<?php $this->endBody(); ?>
</body>
</html>
<?php $this->endPage(); ?>
