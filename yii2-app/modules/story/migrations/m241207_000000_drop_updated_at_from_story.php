<?php

use yii\db\Migration;

/**
 * Handles dropping column `updated_at` from table `{{%story}}`.
 */
class m241207_000000_drop_updated_at_from_story extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        // Проверяем, существует ли колонка перед удалением
        $tableSchema = $this->db->getTableSchema('{{%story}}');
        if ($tableSchema !== null && isset($tableSchema->columns['updated_at'])) {
            $this->dropColumn('{{%story}}', 'updated_at');
        }
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->addColumn(
            '{{%story}}',
            'updated_at',
            $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')->comment('Дата обновления')
        );
    }
}
