<?php
ini_set("display_errors", E_ALL);
ini_set("memory_limit", "256M");
set_time_limit(300);
require_once __DIR__ . "/Routify/vendor/autoload.php";
$config = require_once __DIR__ . "/constants/config.php";
$constants = require_once __DIR__ . "/constants/constants.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: {$config["ALLOWED_ORIGIN"]}");

use Routify\Api;

Api::configAllowedOrigin($config["ALLOWED_ORIGIN"]);

$entityManager = require_once $constants["ENTITY_MANAGER_PATH"];


Api::namespace("/api", function () use ($entityManager): void {
    Api::GET("/orders", function () use ($entityManager) {
        require_once __DIR__ . "/api/getOrders/getOrders.php";
        getOrders($entityManager);
    });
});


Api::startServer($config["SERVER_OPTIONS"]);
