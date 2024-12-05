<?php

/**
 * Class RequestBodyHandler
 *
 * This class provides a secure way to manage and access HTTP request bodies in a singleton instance.
 * It supports raw and JSON-decoded retrieval of the request body for consistent API interactions.
 *
 * ## Features
 * - Secure handling of request body using the singleton pattern.
 * - Support for retrieving both raw and JSON-decoded body content.
 * - Encapsulation of request body logic to improve modularity and maintainability.
 *
 * ## Usage
 * ```php
 * use Routify\RequestBodyHandler;
 * 
 * // Set the request body
 * RequestBodyHandler::getInstance()->setBody($rawBody);
 * 
 * // Get JSON-decoded request body
 * $decodedBody = RequestBodyHandler::getInstance()->getBody();
 * 
 * // Get raw request body
 * $rawBody = RequestBodyHandler::getInstance()->getEncodedBody();
 * ```
 *
 * @author Michael Lavigna <michael.lavigna@hotmail.it>
 * @version 1.1.5
 * @package Routify
 */

namespace Routify;

/**
 * Handles the request body securely and provides access via a singleton instance.
 */
class RequestBodyHandler
{
    private string | null $body = null;

    private static RequestBodyHandler | null $instance = null;

    public array | null $reqBody = null;

    private function __construct() {}

    /**
     * Get the singleton instance of the class.
     *
     * @return RequestBodyHandler
     */
    public static function getInstance(): RequestBodyHandler
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Set the request body.
     *
     * @param string $body The request body content.
     * @return void
     */
    public function setBody(string $body): void
    {
        $body = $this->removeUtf8Bom($body);

        // Assegna il corpo pulito
        $this->body = $body;

        // // Decodifica il corpo JSON
        $decodedBody = json_decode($body, true);
        $this->reqBody = $decodedBody;
    }

    /**
     * Retrieve the JSON-decoded request body.
     *
     * @return array The JSON-decoded request body content or null if not set or invalid JSON.
     */
    public function getBody(): array
    {
        return $this->reqBody;
    }
    /**
     * Removes BOM (Byte Order Mark) from the start of the string if present.
     *
     * @param string $text The input text.
     * @return string The cleaned text.
     */
    private function removeUtf8Bom($text): string
    {
        if (substr($text, 0, 3) === "\xEF\xBB\xBF") {
            $text = substr($text, 3);
        }
        return $text;
    }
}
