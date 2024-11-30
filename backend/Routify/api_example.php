<?php
// ini_set('display_errors', E_ALL);
ini_set('memory_limit', '1024M');
set_time_limit(300);
require_once __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
use Routify\Api;

Api::configAllowedOrigin("http://localhost:5173");

Api::namespace("/api", function (): void {
    Api::GET('/try-yes', function (): void {
        Api::cors(["GET"], ["http://localhost:5173"], ["Content-Type", "Accept"], true);

        try {
            $res = [
                'wela' => 'yes',
            ];

            Api::response("error", $res, "Ok", 200);
        } catch (Exception $e) {
            Api::response("error", null, $e->getMessage(), 500);
        }
    });

    Api::POST('/try-no', function (): void {
        Api::cors(["POST"], [], [], true);

        $route = json_decode(file_get_contents("php://input"), true)["route"];

        if (!$route) {
            Api::response("bad_request", [], "Route not given!", 400);
        }
        try {
            $res = [
                'wela' => 'no',
            ];
            Api::response("success", $res, "Ok", 200);
        } catch (Exception $e) {
            Api::response("error", null, $e->getMessage(), 500);
        }
    });
});

// Api::dispatch();
$serverOptions = [
    "host" => "127.0.0.1",
    "port" => 3003,
    "rate_limit" => 50, // 50 requests per (see time_frame)
    "time_frame" => 60, // 60 seconds, 1 minute
    "logger_level" => "debug", // Change to "debug" for more detailed logs
];

Api::startServer($serverOptions); // Starts the server to 127.0.0.1:3003 with rate limiting enabled for 50 requests per 60 seconds