<?php

/**
 * Api Class
 *
 * A robust framework for handling HTTP API requests and responses. This class supports:
 * - **Dynamic Routing**: Define and handle routes dynamically using GET, POST, PUT, and DELETE methods.
 * - **CORS Management**: Configure Cross-Origin Resource Sharing to control client-server interaction.
 * - **ReactPHP Integration**: Utilize asynchronous event-driven programming for high-performance server operations.
 * - **Rate Limiting**: Prevent excessive client requests to protect server resources.
 * - **HTTPS Support**: Easily configure SSL/TLS for secure connections.
 *
 * ## Features
 * - Namespace-based routing for grouping related endpoints.
 * - Automatic response formatting with configurable HTTP status codes.
 * - Flexible middleware for request pre-processing.
 * - Handles raw inputs and automatically maps them to PHP globals (`$_GET`, `$_POST`, etc.).
 * - Built-in error handling for 404, 405, and 500 status codes.
 *
 * ## Usage
 * use Routify\Api;
 *
 * Api::namespace("/api", function (): void {
 *     Api::GET("/example", function (): void {
 *         Api::response("success", ["message" => "Hello, World!"]);
 *     });
 * });
 *
 * Api::startServer([
 *     "host" => "127.0.0.1",
 *     "port" => 8080,
 *     "ssl_cert_file" => "/path/to/cert.pem",
 *     "ssl_key_file" => "/path/to/key.pem",
 *     "rate_limit" => 100, // Optional: 100 requests per minute
 * ]);
 *
 * ## Notes
 * - This class is designed for small to medium-sized API services. For larger-scale services, consider load balancing or distributed rate limiting.
 * - Ensure the `ReactPHP` library is installed and properly configured.
 *
 * @author Michael Lavigna <michael.lavigna@hotmail.it>
 * @version 1.1.5
 * @namespace Routify
 */

namespace Routify;

require_once __DIR__ . "/Abstracts/Responder.php";

require_once __DIR__ . "/../../vendor/autoload.php";

use Exception;
use RuntimeException;

use Routify\RateLimiter;
use Routify\Api\Abstracts\Responder;

use React\EventLoop\Loop;
use React\Http\HttpServer;
use React\Socket\SocketServer;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamInterface;
use React\Http\Message\Response;

class Api extends Responder
{

    /**
     * @const string VERSION
     * The current version of the API framework.
     */
    const VERSION = "1.1.5";

    /**
     * @const array LOGGING_LEVELS
     * Available logging levels for the API framework.
     */
    const LOGGING_LEVELS = ["debug", "info", "error"];

    /**
     * @const array LOGGING_OUTPUTS
     * Available logging outputs for the API framework.
     * In case of "service" output, the logs will be sent to a logging service.
     * So you need to pass a valid callable logger function.
     * ex:
     * $customLogger = function (string $level, string $message) {
     *    $url = "https://example.com/log-service";
     *   $data = json_encode([
     *      "level" => $level,
     *            "message" => $message,
     *            "timestamp" => date("Y-m-d H:i:s"),
     *        ]);
     *
     *        $ch = curl_init($url);
     *        curl_setopt($ch, CURLOPT_POST, true);
     *        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
     *        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
     *        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
     *       $response = curl_exec($ch);
     *        curl_close($ch);
     *
     *        if ($response === false) {
     *            fwrite(STDERR, "Failed to send log to external service: $message" . PHP_EOL);
     *        }
     *    };
     */
    const LOGGING_OUTPUTS = ["stderr", "file", "service"];

    /**
     * @const array DEFAULT_SERVER_CONFIGURATION
     * Default configuration for the server, including host, port, and SSL certificates.
     */
    const DEFAULT_SERVER_CONFIGURATION = [
        "host" => "127.0.0.1",
        "port" => 8080,
        "ssl_cert_file" => "", // SSL certificate file
        "ssl_key_file" => "", // SSL key file
        "logger_level" => "info", // Log level: "debug", "info", "warn", "error"
        "logger_output" => "stderr", // Log output: "stderr", "file", "service"
    ];

    /**
     * @var string $logLevel
     * The current log level for the API framework.
     */
    private static $logLevel = "info";
    /**
     * @var array $routes
     * An associative array of defined routes mapped by HTTP method and path.
     */
    private static array $routes = [];

    /**
     * @var string $prefix
     * The current namespace prefix for routes.
     */
    private static string $prefix = "";

    /**
     * @var bool $selfListing
     * Indicates whether the API should list its routes automatically for namespaces.
     */
    private static bool $selfListing = false;

    /**
     * @var string $allowedDefaultOrigin
     * Default origin for CORS handling.
     */
    private static string $allowedDefaultOrigin = "";

    /**
     * Configures the namespace prefix for API routes.
     *
     * @param string $prefixPath The prefix to be applied to all routes in the current namespace.
     * @return void
     */

    public static function configDir(string $prefixPath): void
    {
        self::$prefix = rtrim($prefixPath, "/");
    }

    /**
     * Configures the allowed default origin for CORS.
     *
     * @param string $allowed The allowed origin.
     * @return void
     */
    public static function configAllowedOrigin(string $allowed): void
    {
        self::$allowedDefaultOrigin = $allowed;
    }

    /**
     * Enables or disables self-listing for namespaces.
     *
     * @param bool $listSubNamespaceApis Whether to enable self-listing of routes.
     * @return void
     */
    public static function listing(bool $listSubNamespaceApis = false): void
    {
        self::$selfListing = $listSubNamespaceApis;
    }

    /**
     * Adds a route to the API.
     *
     * @param string $method The HTTP method (e.g., GET, POST).
     * @param string $path The route path.
     * @param callable $callback The callback to execute when the route is matched.
     * @return void
     */
    private static function addRoute($method, $path, $callback): void
    {
        $fullPath = self::$prefix . "/" . trim($path, "/");
        self::$routes[strtoupper($method)][$fullPath] = $callback;
    }

    /**
     * Defines a GET route.
     *
     * @param string $path The route path.
     * @param callable $callback The callback to execute.
     * @return void
     */
    public static function GET(string $path, callable $callback): void
    {
        self::addRoute("GET", trim($path), $callback);
    }

    /**
     * Defines a POST route.
     *
     * @param string $path The route path.
     * @param callable $callback The callback to execute.
     * @return void
     */
    public static function POST(string $path, callable $callback): void
    {
        self::addRoute("POST", trim($path), $callback);
    }

    /**
     * Defines a PUT route.
     *
     * @param string $path The route path.
     * @param callable $callback The callback to execute.
     * @return void
     */
    public static function PUT(string $path, callable $callback): void
    {
        self::addRoute("PUT", trim($path), $callback);
    }

    /**
     * Defines a DELETE route.
     *
     * @param string $path The route path.
     * @param callable $callback The callback to execute.
     * @return void
     */
    public static function DELETE(string $path, callable $callback): void
    {
        self::addRoute("DELETE", trim($path), $callback);
    }

    /**
     * Groups routes under a namespace.
     *
     * @param string $namespace The namespace prefix.
     * @param callable $callback The callback to define routes within the namespace.
     * @return void
     */
    public static function namespace(string $namespace, callable $callback): void
    {
        $previousPrefix = self::$prefix;
        self::$prefix .= trim($namespace);

        $callback();

        if (self::$selfListing) {
            self::GET("", function () {
                self::listRoutes(self::$prefix);
            });
        }

        self::$prefix = $previousPrefix;
    }

    /**
     * Lists all routes under the given namespace prefix.
     *
     * @param string $prefix The namespace prefix.
     * @return void
     */
    public static function listRoutes(string $prefix): void
    {
        $availableRoutes = [];

        // Normalize prefix removing eventual final "/"
        $prefix = rtrim($prefix, "/");

        foreach (self::$routes as $method => $routes) {
            foreach ($routes as $route => $callback) {
                if (strpos($route, $prefix) === 0) {
                    $availableRoutes[$method][] = $route;
                }
            }
        }

        if (empty($availableRoutes)) {
            self::handleError(404, "No routes found under the namespace '{$prefix}'.");
        } else {
            self::response("success", $availableRoutes, "Available routes under the namespace '{$prefix}':");
        }
    }

    /**
     * Handles CORS headers and checks request methods.
     *
     * @param array|string $allowedMethods Allowed HTTP methods.
     * @param array|string $allowedOrigins Allowed origins.
     * @param array|string $allowedHeaders Allowed headers.
     * @param bool $allowedCredentials Whether credentials are allowed (needed if you need to access a server session from a client request).
     * @return void
     */
    public static function cors(array | string $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], array | string $allowedOrigins = ['*'], array | string $allowedHeaders = ['Content-Type', 'Authorization'], bool $allowedCredentials = false): void
    {
        if ($allowedMethods) {
            if (!is_string($allowedMethods) && is_array($allowedMethods)) {
                self::checkMethod($allowedMethods);
                $allowedMethods = implode(",", $allowedMethods);
            } else if (is_string($allowedMethods) && !is_array($allowedMethods)) {
                $allArr = explode(",", $allowedMethods);
                self::checkMethod($allArr);
            }

            if ((is_array($allowedMethods) && !empty($allowedMethods)) || (is_string($allowedMethods) && strlen($allowedMethods) > 0)) {
                header("Access-Control-Allow-Methods: {$allowedMethods}");
            } else {
                header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            }
        }

        if ($allowedOrigins) {
            if (!is_string($allowedOrigins) && is_array($allowedOrigins)) {
                $allowedOrigins = implode(",", $allowedOrigins);
            }

            if ((is_array($allowedOrigins) && !empty($allowedOrigins)) || (is_string($allowedOrigins) && strlen($allowedOrigins) > 0)) {
                header("Access-Control-Allow-Origin: {$allowedOrigins}");
            } else {
                header("Access-Control-Allow-Origin: " . self::$allowedDefaultOrigin ? self::$allowedDefaultOrigin : "*");
            }
        }

        if ($allowedHeaders) {
            if (!is_string($allowedHeaders) && is_array($allowedHeaders)) {
                $allowedHeaders = implode(",", $allowedHeaders);
            }

            if ((is_array($allowedHeaders) && !empty($allowedHeaders)) || (is_string($allowedHeaders) && strlen($allowedHeaders) > 0)) {
                header("Access-Control-Allow-Headers: {$allowedHeaders}");
            } else {
                header("Access-Control-Allow-Headers: Content-Type, Authorization");
            }
        }

        header("Access-Control-Allow-Credentials: " . ($allowedCredentials ? "true" : "false"));
    }

    /**
     * Validates if the current HTTP method matches any of the allowed methods.
     *
     * If the current HTTP method is not in the list of allowed methods, a "method_not_allowed"
     * response will be sent, and the script execution will be terminated.
     *
     * @param array $methods An array of allowed HTTP methods (e.g., ["GET", "POST"]).
     * @return void
     */
    private static function checkMethod(array $methods): void
    {
        // foreach ($methods as $method) {
        //     if ($_SERVER["REQUEST_METHOD"] !== strtoupper($method)) {
        //         self::responder("method_not_allowed", null, "Error, method not allowed", 400);
        //         // exit;
        //     }
        // }
        $requestMethod = strtoupper($_SERVER["REQUEST_METHOD"]);
        if (!in_array($requestMethod, array_map('strtoupper', $methods), true)) {
            self::responder("method_not_allowed", null, "Error, method not allowed", 400);
        }
    }

    /**
     * Dispatches the incoming request to the appropriate route.
     */
    public static function dispatch(): void
    {
        $method = $_SERVER["REQUEST_METHOD"];

        if ($method === "OPTIONS") {
            $response = self::handlePreflight();
            echo $response->getBody();
            return;
        }

        if (!isset(self::$routes[$method])) {
            self::handleError(405, "Method Not Allowed.");
            return;
        }

        $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

        // Ciclo attraverso le rotte per vedere se c'è una corrispondenza con parametri dinamici
        foreach (self::$routes[$method] as $route => $callback) {
            // Sostituisci {parametro} con una regex per catturare i valori
            $pattern = preg_replace("/\{[a-zA-Z0-9_]+\}/", "([a-zA-Z0-9_=\-]+)", $route);
            // $pattern = preg_replace("/\{[a-zA-Z0-9_]+\}/", "([a-zA-Z0-9_]+)", $route);
            $pattern = str_replace("/", "\/", $pattern);
            $pattern = "/^" . $pattern . "$/";

            // Verifica se il percorso richiesto corrisponde al pattern della rotta
            if (preg_match($pattern, $path, $matches)) {
                array_shift($matches); // Rimuovi il primo elemento che è il percorso completo

                if (is_callable($callback)) {
                    // Verifica se la callback è un array (classe e metodo)
                    if (is_array($callback) && count($callback) === 2 && is_object($callback[0]) && is_string($callback[1])) {
                        $classInstance = $callback[0];
                        $methodName = $callback[1];

                        // Chiama il metodo sulla classe e ottieni il risultato
                        $response = call_user_func_array([$classInstance, $methodName], $matches);

                        // Invia il risultato come risposta
                        self::responder("success", $response, "Request successful", 200);
                    } else {
                        // If the callback is not a valid array, call it normally
                        call_user_func_array($callback, $matches);
                    }
                    return;
                } else {
                    self::handleError(500, "Callback is not callable.");
                    return;
                }
            }
        }

        // Controlla se la rotta esiste ma con un metodo diverso
        if (self::routeExistsForDifferentMethod($path)) {
            self::handleError(405, "Method Not Allowed.");
        } else {
            self::handleError(404, "Route not found.");
        }
    }

    /**
     * Checks if a route exists with a different method.
     *
     * @param string $path The requested path.
     * @return bool True if a route exists with a different method, false otherwise.
     */
    protected static function routeExistsForDifferentMethod($path): bool
    {
        foreach (self::$routes as $methodRoutes) {
            foreach ($methodRoutes as $route => $callback) {
                $pattern = preg_replace("/\{[a-zA-Z0-9_]+\}/", "([a-zA-Z0-9_]+)", $route);
                $pattern = str_replace("/", "\/", $pattern);
                if (preg_match("/^" . $pattern . "$/", $path)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Starts the server using ReactPHP.
     *
     * @param array $options Server configuration options.
     * @return void
     * @throws \RuntimeException If SSL certificates are missing for TLS.
     */
    public static function startServer(array $options = self::DEFAULT_SERVER_CONFIGURATION): void
    {
        try {
            $host = $options["host"] ?? self::DEFAULT_SERVER_CONFIGURATION["host"];
            $port = $options["port"] ?? self::DEFAULT_SERVER_CONFIGURATION["port"];
            $sslCertFile = $options["ssl_cert_file"] ?? "";
            $sslKeyFile = $options["ssl_key_file"] ?? "";

            $maxRequests = $options["rate_limit"] ?? 10; // Default 10 requests per minute
            $timeFrame = $options["time_frame"] ?? 60;   // Default 1-minute window

            $rateLimiter = new RateLimiter($maxRequests, $timeFrame);

            $loggerLevel = strtolower($options["logger_level"] ?? self::DEFAULT_SERVER_CONFIGURATION["logger_level"]);
            self::$logLevel = $loggerLevel;

            self::log("info", "Starting server on $host:$port with logger level: $loggerLevel");

            $loop = Loop::get();

            $scheme = (!empty($sslCertFile) && !empty($sslKeyFile)) ? "tls" : "tcp";
            $uri = "$scheme://$host:$port";

            $server = new HttpServer(function (ServerRequestInterface $request) use ($rateLimiter): Response {
                $startTime = microtime(true);

                // Log incoming request if in debug mode
                if (self::$logLevel === "debug") {
                    self::log("debug", "Incoming request: " . json_encode([
                        "method" => $request->getMethod(),
                        "uri" => (string)$request->getUri(),
                        "headers" => $request->getHeaders(),
                        "body" => (string)$request->getBody(),
                    ]));
                }

                // Identify the client by IP address
                $clientIp = $request->getServerParams()["REMOTE_ADDR"] ?? "unknown";

                if (!$rateLimiter->isAllowed($clientIp)) {
                    return new Response(429, ["Content-Type" => "application/json"], json_encode([
                        "status" => "error",
                        "message" => "Too many requests. Please try again later.",
                    ]));
                }
                // Populate PHP's global variables
                self::configureGlobals($request);

                // Handle raw input
                $inputData = (string) $request->getBody();
                file_put_contents("php://input", $inputData);

                ob_start();
                self::dispatch();
                $output = ob_get_clean();

                return new Response(200, [
                    "Content-Type" => "application/json",
                    "Access-Control-Allow-Origin" => self::$allowedDefaultOrigin,
                    "Access-Control-Allow-Methods" => "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers" => "Content-Type, Authorization",
                    "Access-Control-Allow-Credentials" => "true",
                ], $output);

                // Log outgoing response if in debug mode
                if (self::$logLevel === "debug") {
                    $endTime = microtime(true);
                    self::log("debug", "Response sent: " . json_encode([
                        "status" => 200,
                        "headers" => ["Content-Type" => "application/json"],
                        "body" => $output,
                        "processing_time_ms" => round(($endTime - $startTime) * 1000, 2),
                    ]));
                }

                return $response;
            });

            // SSL context for TLS
            $context = self::configureSSLContext($scheme, $sslCertFile, $sslKeyFile);

            $socket = new SocketServer($uri, $context, $loop);
            $server->listen($socket);

            // Using fwrite instead of echo to avoid interfering with headers
            self::log("info", "Server running at " . ($scheme === "tls" ? "https" : "http") . "://$host:$port");
            $loop->run();
        } catch (RuntimeException $re) {
            self::log("error", "Runtime exception: " . $re->getMessage());
            throw $re;
        } catch (Exception $e) {
            self::log("error", "Unexpected error: " . $e->getMessage());
            throw $e;
        }
    }

    private static function handlePreflight(): Response
    {
        Api::cors(
            ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            self::$allowedDefaultOrigin,
            ['Content-Type', 'Authorization'],
            true
        );

        return new Response(204, ["Content-Type" => "application/json"], "");
    }

    /**
     * Configures global variables such as $_SERVER, $_GET, $_POST, and request body
     * to maintain compatibility with traditional PHP workflows.
     *
     * @param ServerRequestInterface $request The PSR-7 request object containing HTTP request details.
     * @return void
     */
    private static function configureGlobals(ServerRequestInterface $request): void
    {
        $_SERVER["REQUEST_METHOD"] = $request->getMethod();
        $_SERVER["REQUEST_URI"] = $request->getUri()->getPath();
        $_SERVER["HTTP_ORIGIN"] = $request->getHeaderLine("Origin");
        $_GET = $request->getQueryParams();
        $body = $request->getParsedBody();
        $_POST = is_array($body) ? $body : [];

        file_put_contents("php://input", (string)$request->getBody());
    }

    /**
     * Configures the SSL context required for an HTTPS server.
     *
     * @param string $scheme The protocol scheme, e.g., "tls" for HTTPS or "tcp" for HTTP.
     * @param string $certFile Path to the SSL certificate file.
     * @param string $keyFile Path to the private key file for SSL.
     * @return array Returns the SSL context to be passed to the server, or an empty array for non-TLS connections.
     * @throws RuntimeException If the certificate or key file does not exist.
     */
    private static function configureSSLContext(string $scheme, string $certFile, string $keyFile): array
    {
        if ($scheme !== "tls") {
            return [];
        }

        if (!file_exists($certFile) || !file_exists($keyFile)) {
            throw new RuntimeException("SSL certificate or key file not found.");
        }

        return [
            "local_cert" => $certFile,
            "local_pk" => $keyFile,
        ];
    }

    /**
     * Logs messages based on the specified logger level.
     *
     * @param string $level The log level (e.g., "debug", "info", "warn", "error").
     * @param string $message The message to log.
     * @return void
     */
    public static function log(string $level, string $message, string $output = null, ?callable $callback = null): void
    {
        // Get the configured log level
        $configuredLevel = self::$logLevel ?? self::DEFAULT_SERVER_CONFIGURATION["logger_level"] ?? "info";

        // Map log levels to priorities
        $levels = ["debug" => 0, "info" => 1, "warn" => 2, "error" => 3];
        $configuredPriority = $levels[$configuredLevel] ?? 1;
        $currentPriority = $levels[$level] ?? 2;

        // Log only if the current message level is at or above the configured level
        if ($currentPriority >= $configuredPriority) {
            $formattedMessage = "[" . strtoupper($level) . "] " . date("Y-m-d H:i:s") . " - " . $message;

            switch ($output) {
                case "file":
                    file_put_contents("server.log", $formattedMessage . PHP_EOL, FILE_APPEND);
                    break;
                case "service":
                    self::sendToLoggingService($level, $formattedMessage, $callback);
                    break;
                default:
                    // fwrite(STDERR, $formattedMessage . PHP_EOL);
                    if (defined('STDERR') && php_sapi_name() === 'cli') {
                        fwrite(STDERR, $formattedMessage . PHP_EOL);
                    } else {
                        error_log($formattedMessage . PHP_EOL);
                    }
            }
        }
    }

    /**
     * Sends log messages to an external logging service via a callback.
     *
     * @param string $level The log level (e.g., "debug", "info", "warn", "error").
     * @param string $message The log message.
     * @param callable|null $callback Optional. A user-defined callback to handle the log message.
     * @return void
     */
    private static function sendToLoggingService(string $level, string $message, ?callable $callback = null): void
    {
        if (is_callable($callback)) {
            // Execute the callback with the log details
            $callback($level, $message);
        } else {
            // Default behavior if no callback is provided
            // fwrite(STDERR, strtoupper($level) . ": " . $message . PHP_EOL);
            if (defined('STDERR') && php_sapi_name() === 'cli') {
                fwrite(STDERR, strtoupper($level) . ": " . $message . PHP_EOL);
            } else {
                error_log(strtoupper($level) . ": " . $message . PHP_EOL);
            }
        }
    }
    /**
     * Handles errors by sending a JSON response.
     *
     * @param int $statusCode HTTP status code for the error.
     * @param string $message Error message.
     * @return void
     */
    private static function handleError(int $statusCode, string $message): void
    {
        self::cors(
            ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Metodi permessi
            self::$allowedDefaultOrigin,                     // Origine consentita
            ["Content-Type", "Authorization"],          // Header consentiti
            true                                        // Credenziali consentite
        );
        self::responder("error", null, $message, $statusCode);
    }

    /**
     * Sends a JSON response with the specified type, data, message, and HTTP status code using the Abstract::responder method.
     *
     * @param string $type The response type (e.g., "success", "error").
     * @param mixed $data The data to include in the response.
     * @param string|null $sentMessage An optional custom message for the response.
     * @param int|null $statusCode An optional HTTP status code for the response. If not provided, the default status code for the type will be used.
     * @return void
     */
    public static function response(string $type = "success", $data = null, string $sentMessage = null, int $statusCode = null): void
    {
        $type = strtolower($type);

        self::cors(
            ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Metodi permessi
            self::$allowedDefaultOrigin,                     // Origine consentita
            ["Content-Type", "Authorization"],          // Header consentiti
            true                                        // Credenziali consentite
        );
    
        self::responder($type, $data, $sentMessage, $statusCode);
    }
}
