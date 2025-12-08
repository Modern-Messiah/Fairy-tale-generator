<?php

namespace app\modules\story\models;

use yii\db\ActiveRecord;

/**
 * Модель для таблицы `story`
 *
 * @property int $id
 * @property int $age
 * @property string $language
 * @property string $characters
 * @property string $content
 * @property string $created_at
 * @property string $updated_at
 */
class Story extends ActiveRecord
{
    public static function tableName()
    {
        return "story";
    }

    public function getCharactersArray(): array
    {
        return $this->characters ? json_decode($this->characters, true) : [];
    }

    public function setCharactersArray(array $chars): void
    {
        // JSON_UNESCAPED_UNICODE сохраняет кириллицу в читабельном виде
        $this->characters = json_encode($chars, JSON_UNESCAPED_UNICODE);
    }

    public function getFormattedDate(): string
    {
        return date("d.m.Y H:i", strtotime($this->created_at));
    }

    /**
     * Возвращает превью текста (ограниченный по длине кусок)
     */
    public function getPreview(int $length = 100): string
    {
        $text = strip_tags($this->content); // убираем HTML/Markdown, если есть
        if (mb_strlen($text) > $length) {
            return mb_substr($text, 0, $length) . "...";
        }
        return $text;
    }

    public function rules()
    {
        return [
            [["age", "language", "characters", "content"], "required"],
            ["age", "integer", "min" => 1, "max" => 10],
            ["language", "string", "max" => 5],
            ["characters", "string"],
            ["content", "string"],
        ];
    }

    public function attributeLabels()
    {
        return [
            "id" => "ID",
            "age" => "Возраст",
            "language" => "Язык",
            "characters" => "Персонажи",
            "content" => "Содержание",
            "created_at" => "Создано",
        ];
    }
}
