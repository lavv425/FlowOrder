<?php

/**
 * Abstract Class Responder
 *
 * Provides a foundational structure for creating JSON-based API responses.
 * It handles HTTP status codes, default responses, and configurable behavior through external configuration.
 * External (default) configuration is provided by the config/default.conf.php file.
 * 
 * @author Michael Lavigna <michael.lavigna@hotmail.it>
 * @version 1.1.5
 * @namespace Routify\Api\Abstracts
 */

namespace Routify\Api\Abstracts;

abstract class Responder
{
    /**
     * @var array $config
     * Configuration array loaded from an external file. Includes settings such as HTTP status codes and default responses.
     */
    protected static $config = [];

    /**
     * @var array $httpStatusCodes
     * Associative array mapping response types to their respective HTTP status codes.
     */
    protected static $httpStatusCodes = [];

    /**
     * @var array $responses
     * Associative array defining the default structure and messages for different response types (e.g., success, error).
     */
    protected static $responses = [];

    /**
     * Initializes the configuration, HTTP status codes, and default responses.
     * 
     * This method loads the configuration from an external file only once, ensuring optimized performance.
     */
    protected static function init()
    {
        if (empty(self::$config)) {
            self::$config = require __DIR__ . "/config/default.conf.php";
            self::$httpStatusCodes = self::$config["http_status_codes"];
            self::$responses = self::$config["responses"];
        }
    }

    /**
     * Sends a JSON response to the client.
     * 
     * This method sets the appropriate HTTP headers and encodes the given response data into JSON format.
     *
     * @param mixed $response The response data to be sent to the client.
     * @param int $statusCode The HTTP status code for the response. Defaults to 200.
     * @return void
     */
    protected static function JSONResponse(mixed $response, int $statusCode = 200): void
    {
        header('Content-Type: application/json');
        http_response_code($statusCode);

        echo json_encode($response);
        // exit;
    }

    /**
     * Handles API responses based on predefined configurations and types.
     * 
     * This method constructs a JSON response based on the specified response type, data, message, and status code.
     * If a custom status code or message is provided, it overrides the default configuration.
     * 
     * @param string $type The response type (e.g., success, error). Defaults to "success".
     * @param mixed|null $data Optional data to include in the response.
     * @param string|null $sentMessage Optional custom message to override the default message for the response type.
     * @param int|null $statusCode Optional custom HTTP status code to override the default status code for the response type.
     * @return void
     */
    protected static function responder(string $type = "success", $data = null, string $sentMessage = null, int $statusCode = null): void
    {
        self::init();

        // Validate response type and HTTP status code
        if (!isset(self::$responses[$type]) || !isset(self::$httpStatusCodes[$type])) {
            self::JSONResponse(self::$responses["error"], self::$httpStatusCodes["error"]);
        }

        // Override status code if provided
        if ($statusCode) {
            self::$httpStatusCodes[$type] = intval($statusCode);
        } else {
            $statusCode = self::$httpStatusCodes[$type];
        }

        // Override message if provided
        if ($sentMessage) {
            self::$responses[$type]["message"] = $sentMessage;
        } else {
            $sentMessage = self::$responses[$type]["message"];
        }

        // Add data if provided
        if ($data) {
            self::$responses[$type]["data"] = $data;
        }

        // Send the JSON response
        self::JSONResponse(self::$responses[$type], self::$httpStatusCodes[$type]);
    }
}
