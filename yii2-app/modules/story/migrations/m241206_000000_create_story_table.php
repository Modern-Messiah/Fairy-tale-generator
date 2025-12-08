<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%story}}`.
 */
class m241206_000000_create_story_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%story}}', [
            'id' => $this->primaryKey(),
            'age' => $this->integer()->notNull()->comment('Возраст ребенка'),
            'language' => $this->string(2)->notNull()->comment('Язык сказки (ru/kk)'),
            'characters' => $this->text()->notNull()->comment('Персонажи (JSON)'),
            'content' => $this->text()->notNull()->comment('Текст сказки (Markdown)'),
            'created_at' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP')->comment('Дата создания'),
        ], 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

        // Создание индексов для производительности
        $this->createIndex(
            'idx-story-created_at',
            '{{%story}}',
            'created_at'
        );

        $this->createIndex(
            'idx-story-language',
            '{{%story}}',
            'language'
        );

        $this->createIndex(
            'idx-story-age',
            '{{%story}}',
            'age'
        );

        // Комментарий к таблице
        $this->addCommentOnTable('{{%story}}', 'История сгенерированных сказок');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%story}}');
    }
}
