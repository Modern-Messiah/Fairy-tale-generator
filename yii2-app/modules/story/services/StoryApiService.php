<?php

namespace app\modules\story\services;

use Yii;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use yii\base\Component;
use yii\base\Exception;

/**
 * StoryApiService - сервис для взаимодействия с Python API
 */
class StoryApiService extends Component
{
    /**
     * @var string URL Python API
     */
    public $apiUrl;

    /**
     * @var int Таймаут запросов
     */
    public $timeout = 60;

    /**
     * @var Client HTTP клиент
     */
    private $_client;

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();
        
        if (!$this->apiUrl) {
            throw new Exception('API URL is not configured');
        }

        $this->_client = new Client([
            'base_uri' => $this->apiUrl,
            'timeout' => $this->timeout,
            'verify' => false, // Для разработки, в продакшене установить true
        ]);
    }

    /**
     * Проверка доступности API
     * @return array
     */
    public function healthCheck()
    {
        try {
            $response = $this->_client->get('/health');
            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            Yii::error("Health check failed: " . $e->getMessage(), __METHOD__);
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Генерация сказки (синхронно, для сохранения в БД)
     * @param array $data Данные запроса
     * @return string Текст сказки
     * @throws Exception
     */
    public function generateStory($data)
    {
        try {
            $response = $this->_client->post('/generate_story', [
                'json' => $data,
                'stream' => false,
            ]);

            return $response->getBody()->getContents();
        } catch (GuzzleException $e) {
            Yii::error("Story generation failed: " . $e->getMessage(), __METHOD__);
            throw new Exception('Ошибка при генерации сказки: ' . $e->getMessage());
        }
    }

    /**
     * Генерация сказки с потоковым ответом
     * @param array $data Данные запроса
     * @param callable $callback Функция обратного вызова для каждого чанка
     * @return string Полный текст сказки
     * @throws Exception
     */
    public function generateStoryStream($data, $callback = null)
    {
        try {
            $fullContent = '';
            
            $response = $this->_client->post('/generate_story', [
                'json' => $data,
                'stream' => true,
            ]);

            $body = $response->getBody();
            
            $buffer = '';
            $maxBufferLength = 8192; // 8KB лимит буфера для предотвращения утечки памяти
            $maxContentLength = 100000; // 100KB лимит общего контента
            
            while (!$body->eof()) {
                $chunk = $body->read(1024);
                
                // Проверяем лимит буфера перед добавлением
                if (strlen($buffer) + strlen($chunk) > $maxBufferLength) {
                    // Принудительно очищаем буфер если он слишком большой
                    Yii::warning("Buffer length limit exceeded, forcing flush", __METHOD__);
                    if ($buffer !== '' && mb_check_encoding($buffer, 'UTF-8')) {
                        $fullContent .= $buffer;
                        if ($callback && is_callable($callback)) {
                            call_user_func($callback, $buffer);
                        }
                    }
                    $buffer = '';
                }
                
                $buffer .= $chunk;
                
                // Пытаемся выделить валидную UTF-8 строку из начала буфера
                $validPart = $buffer;
                $tail = '';
                
                // Если строка не валидна в UTF-8, откусываем байты с конца пока она не станет валидной
                // Максимальная длина символа UTF-8 - 4 байта, так что итераций будет мало
                while ($validPart !== '' && !mb_check_encoding($validPart, 'UTF-8')) {
                    $tail = substr($validPart, -1) . $tail;
                    $validPart = substr($validPart, 0, -1);
                    
                    // Защита от бесконечного цикла (если вдруг буфер весь невалиден)
                    if (strlen($tail) > 4) {
                        break; 
                    }
                }
                
                if ($validPart !== '') {
                    // Проверяем лимит общего контента
                    if (strlen($fullContent) < $maxContentLength) {
                        $fullContent .= $validPart;
                        if ($callback && is_callable($callback)) {
                            call_user_func($callback, $validPart);
                        }
                    } else {
                        // Логируем превышение лимита контента
                        Yii::warning("Content length limit exceeded, truncating output", __METHOD__);
                    }
                    $buffer = $tail;
                }
                // Если validPart пустой, значит у нас неполный символ, оставляем всё в buffer и ждем следующий чанк
            }
            
            // Если после завершения потока что-то осталось в буфере (хвост), дописываем
            if ($buffer !== '') {
                // Проверяем лимит перед добавлением хвоста
                if (strlen($fullContent) < $maxContentLength) {
                    $fullContent .= $buffer;
                    if ($callback && is_callable($callback)) {
                       call_user_func($callback, $buffer);
                    }
                }
            }

            // Очищаем буфер для освобождения памяти
            $buffer = null;
            unset($buffer);

            return $fullContent;
        } catch (GuzzleException $e) {
            Yii::error("Stream story generation failed: " . $e->getMessage(), __METHOD__);
            
            // Очищаем буфер при ошибке
            $buffer = null;
            unset($buffer);
            
            throw new Exception('Ошибка при генерации сказки: ' . $e->getMessage());
        }
    }

    /**
     * Получить URL для потоковой генерации (для использования в JavaScript)
     * @param array $data Данные запроса
     * @return string URL endpoint
     */
    public function getStreamUrl($data)
    {
        // В реальности будем использовать прокси через Yii2
        return $this->apiUrl . '/generate_story';
    }
}