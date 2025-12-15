<?php

namespace app\modules\story\models;

use yii\base\Model;

/**
 * StoryForm - форма для создания запроса на генерацию сказки
 */
class StoryForm extends Model
{
    public $age;
    public $language;
    public $characters = [];
    public $genre;

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [["age", "language", "genre", "characters"], "required"],
            ["age", "integer", "min" => 1, "max" => 18],
            ["genre", "string"],
            [
                "genre",
                "in",
                "range" => [
                    "adventure",
                    "fantasy",
                    "magic",
                    "comedy",
                    "drama",
                    "animals",
                    "family",
                    "educational",
                    "detective",
                    "travel",
                ],
            ],
            ["language", "string"],
            ["language", "in", "range" => ["ru", "kk"]],
            ["characters", "each", "rule" => ["string"]],
            ["characters", "validateCharactersCount"],
        ];
    }

    /**
     * Валидатор: минимум один персонаж
     */
    public function validateCharactersCount($attribute, $params)
    {
        if (!is_array($this->$attribute)) {
            $this->addError($attribute, "Неверный формат данных");
            return;
        }

        $count = count($this->$attribute);

        if ($count < 2) {
            $this->addError($attribute, "Выберите минимум 2 персонажа");
        }

        if ($count > 5) {
            $this->addError($attribute, "Выберите не более 5 персонажей");
        }
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            "age" => "Возраст ребенка (лет)",
            "language" => "Язык сказки",
            "characters" => "Персонажи",
            "genre" => "Жанр сказки",
        ];
    }

    /**
     * Список доступных языков
     * @return array
     */
    public static function getLanguageOptions()
    {
        return [
            "ru" => "Русский",
            "kk" => "Казахский (Қазақша)",
        ];
    }

    /**
     * Жанр сказок
     * @return array
     */

    public static function getGenreOptions()
    {
        return [
            "adventure" => "Приключения",
            "fantasy" => "Фэнтези",
            "magic" => "Волшебная сказка",
            "comedy" => "Комедия",
            "drama" => "Драма",
            "animals" => "Сказка о животных",
            "family" => "Семейная сказка",
            "educational" => "Поучительная сказка",
            "detective" => "Детектив",
            "travel" => "Путешествия",
        ];
    }

    /**
     * Список доступных персонажей
     * @return array
     */
    public static function getCharacterOptions()
    {
        return [
            // Русские сказочные персонажи
            "Заяц" => "Заяц",
            "Волк" => "Волк",
            "Лиса" => "Лиса",
            "Медведь" => "Медведь",
            "Колобок" => "Колобок",
            "Курочка Ряба" => "Курочка Ряба",
            "Маша" => 'Маша (из "Маша и медведь")',
            "Иван-царевич" => "Иван-царевич",
            "Баба-Яга" => "Баба-Яга",
            "Кощей Бессмертный" => "Кощей Бессмертный",
            "Змей Горыныч" => "Змей Горыныч",
            "Василиса Прекрасная" => "Василиса Прекрасная",
            "Царевна-лягушка" => "Царевна-лягушка",
            "Илья Муромец" => "Илья Муромец",

            // Казахские сказочные персонажи
            "Алдар Көсе" => "Алдар Көсе",
            "Әйел Арстан" => "Әйел Арстан (Женщина-лев)",
            "Ер Төстік" => "Ер Төстік",
            "Жиренше" => "Жиренше",
            "Қарақшы" => "Қарақшы (Разбойник)",
            "Тазша бала" => "Тазша бала",
            "Қанбақ шал" => "Қанбақ шал",
            "Алпамыс батыр" => "Алпамыс батыр",
            "Қобыланды батыр" => "Қобыланды батыр",
            "Жалмауыз кемпір" => "Жалмауыз кемпір (Баба-Яга)",
        ];
    }

    /**
     * Получить данные для отправки в Python API
     * @return array
     */
    public function toApiData()
    {
        return [
            "age" => (int) $this->age,
            "language" => $this->language,
            "genre" => $this->genre,
            "characters" => array_values($this->characters),
        ];
    }
}
