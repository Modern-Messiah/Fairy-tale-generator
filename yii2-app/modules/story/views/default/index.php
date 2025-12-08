<?php

use yii\helpers\Html;
use yii\bootstrap5\ActiveForm;
use app\modules\story\models\StoryForm;

/** @var yii\web\View $this */
/** @var app\modules\story\models\StoryForm $model */

$this->title = "Генератор сказок";
$this->params["breadcrumbs"][] = $this->title;
?>

<div class="story-index">
    <div class="row">
        <div class="col-lg-8 mx-auto">

            <!-- Заголовок -->
            <div class="text-center mb-5 animate-fade-in">
                <div class="main-icon mb-4">
                    ✨📚✨
                </div>
                <h1 class="display-3 fw-bold text-dark mb-3">
                    <?= Html::encode($this->title) ?>
                </h1>
                <p class="lead text-dark mb-4">
                    Создайте уникальную детскую сказку с помощью искусственного интеллекта
                </p>
                <div class="stars">⭐ 🌟 ✨ 💫 ⭐</div>
            </div>

            <!-- Информационный блок -->
            <div class="info-banner mb-5 animate-slide-up">
                <div class="info-banner-icon">
                    💡
                </div>
                <div class="info-banner-content">
                    <h5 class="mb-3 fw-bold">
                        <i class="bi bi-lightbulb-fill"></i> Как это работает?
                    </h5>
                    <div class="steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <span class="step-text">Укажите возраст ребенка</span>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <span class="step-text">Выберите язык сказки</span>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <span class="step-text">Отметьте интересных персонажей</span>
                        </div>
                        <div class="step">
                            <span class="step-number">4</span>
                            <span class="step-text">Нажмите 'Создать сказку' и наблюдайте за магией! ✨</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Карточка с формой -->
            <div class="card form-card shadow-xl animate-slide-up" style="animation-delay: 0.2s;">
                <div class="card-body p-5">
                    <?php $form = ActiveForm::begin([
                        "id" => "story-form",
                        "options" => ["class" => "needs-validation"],
                    ]); ?>

                    <!-- Возраст -->
                    <div class="mb-4 form-section">
                        <div class="form-section-icon">👶</div>
                        <?= $form
                            ->field($model, "age")
                            ->textInput([
                                "type" => "number",
                                "min" => 1,
                                "max" => 10,
                                "placeholder" => "Например: 7",
                                "class" =>
                                    "form-control form-control-lg shadow-sm custom-input",
                            ])
                            ->label("Возраст ребенка", [
                                "class" => "form-label fw-bold fs-5",
                            ]) ?>
                        <div class="form-text">
                            <i class="bi bi-info-circle-fill text-primary"></i>
                            Укажите возраст от 1 до 10 лет
                        </div>
                    </div>

                    <!-- Язык -->
                    <div class="mb-4 form-section">
                        <div class="form-section-icon">🌍</div>
                        <?= $form
                            ->field($model, "language")
                            ->radioList(StoryForm::getLanguageOptions(), [
                                "item" => function (
                                    $index,
                                    $label,
                                    $name,
                                    $checked,
                                    $value,
                                ) {
                                    $id = "language-{$value}";
                                    $icons = ["ru" => "🇷🇺", "kk" => "🇰🇿"];
                                    $icon = $icons[$value] ?? "";

                                    return "<div class='language-option'>
                                        <input type='radio' id='{$id}' class='language-input' name='{$name}' value='{$value}' " .
                                        ($checked ? "checked" : "") .
                                        ">
                                        <label class='language-label' for='{$id}'>
                                            <span class='language-flag'>{$icon}</span>
                                            <span class='language-name'>{$label}</span>
                                        </label>
                                    </div>";
                                },
                            ])
                            ->label("Язык сказки", [
                                "class" => "form-label fw-bold fs-5",
                            ]) ?>
                    </div>

                    <!-- Персонажи -->
                    <div class="mb-4 form-section">
                        <div class="form-section-icon">🎭</div>
                        <?= $form
                            ->field($model, "characters")
                            ->checkboxList(StoryForm::getCharacterOptions(), [
                                "class" => "characters-grid",
                                "item" => function (
                                    $index,
                                    $label,
                                    $name,
                                    $checked,
                                    $value,
                                ) {
                                    $id = "char-{$index}";
                                    return "<div class='character-item'>
                                        <input type='checkbox' id='{$id}' class='character-input' name='{$name}' value='{$value}' " .
                                        ($checked ? "checked" : "") .
                                        ">
                                        <label class='character-label' for='{$id}'>
                                            <span class='character-icon'>🎭</span>
                                            <span class='character-name'>{$label}</span>
                                        </label>
                                    </div>";
                                },
                            ])
                            ->label("Выберите персонажей", [
                                "class" => "form-label fw-bold fs-5",
                            ]) ?>
                        <div class="form-text">
                            <i class="bi bi-info-circle-fill text-primary"></i>
                            Выберите от 2 до 5 персонажей для вашей сказки
                        </div>
                    </div>

                    <!-- Кнопки -->
                    <div class="d-grid gap-3 mt-5">
                        <?= Html::submitButton(
                            '<i class="bi bi-magic"></i> Создать волшебную сказку',
                            [
                                "class" =>
                                    "btn btn-create btn-lg fw-bold shadow-lg",
                            ],
                        ) ?>

                        <?= Html::a(
                            '<i class="bi bi-clock-history"></i> Посмотреть историю сказок',
                            ["history"],
                            [
                                "class" => "btn btn-history btn-lg fw-semibold",
                            ],
                        ) ?>
                    </div>

                    <?php ActiveForm::end(); ?>
                </div>
            </div>

        </div>
    </div>
</div>

<?php $this->registerJs("
    const checkboxes = document.querySelectorAll('.character-input');
    let max = 5;

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = Array.from(checkboxes).filter(x => x.checked);

            if (checked.length > max) {
                cb.checked = false;

                const note = document.createElement('div');
                note.className = 'limit-warning';
                note.innerText = 'Можно выбрать не более 5 персонажей';
                document.body.appendChild(note);

                setTimeout(() => note.remove(), 2000);
            }
        });
    });
"); ?>

<?php $this->registerCss("
.limit-warning {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff5252;
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 1rem;
    box-shadow: 0 6px 15px rgba(0,0,0,0.2);
    animation: fadeInOut 2s ease;
    z-index: 9999;
}

@keyframes fadeInOut {
    0%   { opacity: 0; transform: translate(-50%, 20px); }
    10%  { opacity: 1; transform: translate(-50%, 0); }
    90%  { opacity: 1; }
    100% { opacity: 0; transform: translate(-50%, 20px); }
}
"); ?>

<?php $this->registerCss("
/* Анимации */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
}

.animate-fade-in {
    animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
    animation: slideUp 0.8s ease-out both;
}

/* Главная иконка */
.main-icon {
    font-size: 4rem;
    animation: sparkle 2s ease-in-out infinite;
}

.stars {
    font-size: 1.5rem;
    animation: sparkle 3s ease-in-out infinite;
}

/* Информационный баннер */
.info-banner {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-radius: 20px;
    padding: 30px;
    border: 2px solid #90caf9;
    display: flex;
    gap: 25px;
    box-shadow: 0 8px 25px rgba(33, 150, 243, 0.15);
    transition: all 0.3s ease;
}

.info-banner:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(33, 150, 243, 0.25);
}

.info-banner-icon {
    font-size: 3rem;
    flex-shrink: 0;
    animation: pulse 2s ease-in-out infinite;
}

.info-banner-content {
    flex: 1;
}

.steps {
    display: grid;
    gap: 12px;
}

.step {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: white;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.step:hover {
    transform: translateX(10px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.step-number {
    width: 35px;
    height: 35px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.step-text {
    color: #333;
    font-weight: 500;
}

/* Карточка формы */
.form-card {
    border-radius: 25px;
    border: none;
    background: white;
    overflow: hidden;
}

/* Секции формы */
.form-section {
    position: relative;
    padding: 25px;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    border-radius: 15px;
    border: 2px solid #e0e0e0;
    transition: all 0.3s ease;
}

.form-section:hover {
    border-color: #667eea;
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.1);
}

.form-section-icon {
    position: absolute;
    top: -15px;
    left: 20px;
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Кастомный инпут */
.custom-input {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 15px 20px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.custom-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Выбор языка */
.language-option {
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 15px;
}

.language-input {
    display: none;
}

.language-label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 25px;
    background: white;
    border: 3px solid #e0e0e0;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.1rem;
}

.language-label:hover {
    border-color: #667eea;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.language-input:checked + .language-label {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.language-flag {
    font-size: 2rem;
}

.language-name {
    font-weight: 600;
}

/* Сетка персонажей */
.characters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 15px;
}

.character-item {
    position: relative;
}

.character-input {
    display: none;
}

.character-label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 15px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100%;
}

.character-label:hover {
    border-color: #667eea;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.character-input:checked + .character-label {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-color: #2196f3;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.character-icon {
    font-size: 1.3rem;
}

.character-name {
    font-weight: 500;
    font-size: 0.95rem;
}

/* Кнопка создания */
.btn-create {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 15px;
    padding: 18px 30px;
    font-size: 1.2rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.btn-create::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn-create:hover::before {
    width: 300px;
    height: 300px;
}

.btn-create:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* Кнопка истории */
.btn-history {
    background: white;
    color: #333;
    border: 3px solid #e0e0e0;
    border-radius: 15px;
    padding: 18px 30px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.btn-history:hover {
    background: #f5f5f5;
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* Тени */
.shadow-xl {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
}

/* Адаптивность */
@media (max-width: 768px) {
    .info-banner {
        flex-direction: column;
        text-align: center;
    }

    .characters-grid {
        grid-template-columns: 1fr;
    }

    .step {
        font-size: 0.9rem;
    }

    .main-icon {
        font-size: 3rem;
    }
}
");
?>
