<?php

$params = require __DIR__ . "/params.php";
$db = require __DIR__ . "/db.php";

$config = [
    "id" => "basic",
    "basePath" => dirname(__DIR__),
    "bootstrap" => ["log"],
    "aliases" => [
        "@bower" => "@vendor/bower-asset",
        "@npm" => "@vendor/npm-asset",
    ],
    "components" => [
        "request" => [
            // !!! Вставьте секретный ключ для cookie validation
            "cookieValidationKey" => "XcfEDhV_MDRTjskIXMLosEfWzVLKoi2V",
        ],
        "cache" => [
            "class" => "yii\caching\FileCache",
        ],
        "user" => [
            "identityClass" => "app\models\User",
            "enableAutoLogin" => true,
        ],
        "errorHandler" => [
            "errorAction" => "site/error",
        ],
        "mailer" => [
            "class" => \yii\symfonymailer\Mailer::class,
            "viewPath" => "@app/mail",
            "useFileTransport" => true, // письма пока сохраняются в файл
        ],
        "log" => [
            "traceLevel" => YII_DEBUG ? 3 : 0,
            "targets" => [
                [
                    "class" => "yii\log\FileTarget",
                    "levels" => ["error", "warning"],
                ],
            ],
        ],
        "db" => $db,
        "urlManager" => [
            "enablePrettyUrl" => true,
            "showScriptName" => false,
            "rules" => [
                // Главная страница модуля story
                "story" => "story/default/index",
                "story/stream" => "story/default/stream",
                "story/history" => "story/default/history",
                "story/generate" => "story/default/generate",
            ],
        ],
    ],
    "modules" => [
        "story" => [
            "class" => "app\modules\story\Module",
            "pythonApiUrl" => "http://python-api:8000/generate_story",
        ],
    ],
    "params" => $params,
];

// Настройки для режима разработки
if (YII_ENV_DEV) {
    $config["bootstrap"][] = "debug";
    $config["modules"]["debug"] = [
        "class" => "yii\debug\Module",
        // 'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config["bootstrap"][] = "gii";
    $config["modules"]["gii"] = [
        "class" => "yii\gii\Module",
        // 'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
