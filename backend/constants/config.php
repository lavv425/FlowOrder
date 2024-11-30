<?php
require_once __DIR__ . "/../vendor/autoload.php";

// Using Dotenv to load environment variables from .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/../");
// Load the environment variables into the current process. (available in )
$dotenv->load();
// Define required variables and load them into the environment.
$dotenv->required(["DB_HOST", "DB_USERNAME", "DB_PASSWORD", "DB_SCHEMA", "ALLOWED_ORIGIN", "SERVER_HOST", "SERVER_PORT"]);
$config =  (array) [
    "ENTITIES_DIR" => realpath(__DIR__ . "/../db/Doctrine/Entity"),
    "ALLOWED_ORIGIN" => $_ENV["ALLOWED_ORIGIN"],
    "DOCTRINE_CONNECTION_PARAMS" => [
        "dbname" => $_ENV["DB_SCHEMA"],
        "user" => $_ENV["DB_USERNAME"],
        "password" => $_ENV["DB_PASSWORD"],
        "host" => $_ENV["DB_HOST"],
        "driver" => "pdo_mysql",
    ],
    "SERVER_OPTIONS" => [
        "host" => $_ENV["SERVER_HOST"],
        "port" => $_ENV["SERVER_PORT"],
        "rate_limit" => $_ENV["SERVER_RATE_LIMIT"], // 50 requests per (see time_frame)
        "time_frame" => $_ENV["SERVER_RATE_LIMIT_TIME_FRAME"], // 60 seconds, 1 minute
        "logger_level" => "debug",
    ],
];


return $config;
