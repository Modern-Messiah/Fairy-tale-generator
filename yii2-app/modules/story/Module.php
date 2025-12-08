<?php

namespace app\modules\story;

/**
 * Story module - Модуль генерации детских сказок
 */
class Module extends \yii\base\Module
{
    /**
     * @var string URL Python API сервиса для генерации сказок
     */
    public $pythonApiUrl = 'http://python-api:8000';

    /**
     * @var int Таймаут для HTTP запросов к Python API (в секундах)
     */
    public $pythonApiTimeout = 60;

    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\modules\story\controllers';

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();

        // Установка URL из переменных окружения, если доступен
        if ($url = getenv('PYTHON_API_URL')) {
            $this->pythonApiUrl = $url;
        }
    }
}