<?php

namespace app\modules\story\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;
use app\modules\story\models\Story;
use app\modules\story\models\StoryForm;
use app\modules\story\services\StoryApiService;

/**
 * Default controller for the `story` module
 */
class DefaultController extends Controller
{
    /**
     * @var StoryApiService
     */
    private $_apiService;
    public $layout = "@app/modules/story/views/layouts/main";

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();

        // Инициализация API сервиса
        $this->_apiService = new StoryApiService([
            "apiUrl" => $this->module->pythonApiUrl,
            "timeout" => $this->module->pythonApiTimeout,
        ]);
    }

    /**
     * Главная страница - форма для создания сказки
     * @return string
     */
    public function actionIndex()
    {
        $model = new StoryForm();

        if ($model->load(Yii::$app->request->post()) && $model->validate()) {
            Yii::$app->session->set("storyFormData", $model->toApiData());
            return $this->redirect(["stream"]);
        }

        // Используем твой layout main.php из модуля
        $this->layout = "@app/modules/story/views/layouts/main";

        return $this->render("index", [
            "model" => $model,
        ]);
    }

    /**
     * Страница потоковой генерации сказки
     * @return string
     */
    public function actionStream()
    {
        $formData = Yii::$app->session->get("storyFormData");

        if (!$formData) {
            Yii::$app->session->setFlash(
                "error",
                "Данные формы не найдены. Заполните форму заново.",
            );
            return $this->redirect(["index"]);
        }

        return $this->render("stream", [
            "formData" => $formData,
        ]);
    }

    /**
     * API endpoint для потоковой генерации (прокси к Python API)
     * @return Response
     */
    public function actionGenerate()
    {
        // КРИТИЧНО: Отключаем все буферизацию
        while (ob_get_level()) {
            ob_end_clean();
        }

        Yii::$app->response->format = Response::FORMAT_RAW;
        $formData = Yii::$app->session->get("storyFormData");

        if (!$formData) {
            header("Content-Type: text/event-stream");
            header("Cache-Control: no-cache");
            header("Connection: keep-alive");
            header("X-Accel-Buffering: no");

            echo "data: " . json_encode(["error" => "No form data"]) . "\n\n";
            flush();
            Yii::$app->end();
            return;
        }

        try {
            // Устанавливаем заголовки для SSE
            header("Content-Type: text/event-stream");
            header("Cache-Control: no-cache");
            header("Connection: keep-alive");
            header("X-Accel-Buffering: no"); // Отключаем буферизацию nginx

            // Переменная для хранения полного контента
            $fullContent = "";

            // Логируем начало
            Yii::info("Starting stream generation", __METHOD__);

            // Генерируем сказку с потоковым выводом
            $this->_apiService->generateStoryStream($formData, function (
                $chunk,
            ) use (&$fullContent) {
                $fullContent .= $chunk;

                // Отправляем chunk клиенту
                $sseData = json_encode(["chunk" => $chunk]);
                echo "data: {$sseData}\n\n";

                // КРИТИЧНО: принудительная отправка
                if (function_exists("fastcgi_finish_request")) {
                    fastcgi_finish_request();
                } else {
                    flush();
                }

                // Небольшая задержка для стабильности
                usleep(1000); // 1ms
            });

            // Сохраняем в базу данных после завершения
            $story = new Story();
            $story->age = $formData["age"];
            $story->language = $formData["language"];
            $story->setCharactersArray($formData["characters"]);
            $story->content = $fullContent;

            if ($story->save()) {
                // Отправляем финальное сообщение с ID сохраненной сказки
                $finalData = json_encode([
                    "done" => true,
                    "story_id" => $story->id,
                ]);
                echo "data: {$finalData}\n\n";

                if (function_exists("fastcgi_finish_request")) {
                    fastcgi_finish_request();
                } else {
                    flush();
                }
            }

            // Очищаем данные из сессии
            Yii::$app->session->remove("storyFormData");
        } catch (\Exception $e) {
            Yii::error($e->getMessage(), __METHOD__);
            $errorData = json_encode([
                "error" => "Ошибка генерации: " . $e->getMessage(),
            ]);
            echo "data: {$errorData}\n\n";
            flush();
        }

        Yii::$app->end();
    }

    /**
     * История сгенерированных сказок
     * @return string
     */
    public function actionHistory()
    {
        $dataProvider = new ActiveDataProvider([
            "query" => Story::find()->orderBy(["created_at" => SORT_DESC]),
            "pagination" => [
                "pageSize" => 9, // 3x3 сетка
            ],
        ]);

        return $this->render("history", [
            "dataProvider" => $dataProvider,
        ]);
    }

    /**
     * Просмотр конкретной сказки
     * @param int $id ID сказки
     * @return string
     * @throws NotFoundHttpException
     */
    public function actionView($id)
    {
        $model = $this->findModel($id);

        return $this->render("view", [
            "model" => $model,
        ]);
    }

    /**
     * Удаление сказки
     * @param int $id ID сказки
     * @return Response
     * @throws NotFoundHttpException
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        Yii::$app->session->setFlash("success", "Сказка успешно удалена");
        return $this->redirect(["history"]);
    }

    /**
     * Проверка здоровья Python API
     * @return array
     */
    public function actionHealthCheck()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        return $this->_apiService->healthCheck();
    }

    /**
     * Найти модель Story по ID
     * @param int $id
     * @return Story
     * @throws NotFoundHttpException
     */
    protected function findModel($id)
    {
        if (($model = Story::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException("Сказка не найдена.");
    }
}
