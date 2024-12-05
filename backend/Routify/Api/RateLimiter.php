<?php

/**
 * Class RateLimiter
 *
 * This class provides a simple rate-limiting mechanism to restrict the number of requests 
 * that a client (identified by IP address) can make within a specified time frame. 
 *
 * ## Usage
 * $rateLimiter = new RateLimiter(10, 60); // Allow max 10 requests per 60 seconds.
 *
 * $clientIp = $_SERVER['REMOTE_ADDR']; // Get client IP
 * if ($rateLimiter->isAllowed($clientIp)) {
 *     // Proceed with the request
 * } else {
 *     // Deny the request (e.g., respond with HTTP 429 Too Many Requests)
 * }
 *
 * ## Features
 * - Supports customizable maximum requests and time windows.
 * - Tracks requests for each client separately using their IP address.
 * - Automatically removes expired request timestamps to optimize memory usage.
 *
 * ## Notes
 * - This implementation is suitable for small to medium traffic. For high-traffic systems, consider using a distributed rate-limiting solution.
 * 
 * @author Michael Lavigna <michael.lavigna@hotmail.it>
 * @version 1.1.5
 * @package Routify
 */

namespace Routify;

/**
 * Class RateLimiter
 *
 * This class implements a basic rate-limiting mechanism to control the number
 * of requests allowed from a client (identified by IP address) within a given time frame.
 */
class RateLimiter
{
    /**
     * @var array $requests
     * An associative array where the key is the client IP address, and the value
     * is an array of timestamps representing the times of the client's requests.
     */
    private array $requests = [];

    /**
     * @var int $maxRequests
     * The maximum number of requests allowed for a client within the specified time frame.
     */
    private int $maxRequests;

    /**
     * @var int $timeFrame
     * The time frame (in seconds) within which the requests are counted.
     */
    private int $timeFrame;

    /**
     * Constructor for the RateLimiter class.
     *
     * @param int $maxRequests The maximum number of requests allowed per client.
     * @param int $timeFrame The time frame (in seconds) for counting requests.
     */
    public function __construct(int $maxRequests = 10, int $timeFrame = 60)
    {
        $this->maxRequests = $maxRequests; // Max number of requests
        $this->timeFrame = $timeFrame;     // Time window in seconds
    }

    /**
     * Checks if a client (identified by IP address) is allowed to make a request.
     *
     * @param string $clientIp The IP address of the client making the request.
     * @return bool Returns true if the client is allowed to make the request, false otherwise.
     */
    public function isAllowed(string $clientIp): bool
    {
        $now = time();

        // Initialize or clean up old requests for the client IP
        if (!isset($this->requests[$clientIp])) {
            $this->requests[$clientIp] = [];
        } else {
            $this->requests[$clientIp] = array_filter(
                $this->requests[$clientIp],
                fn($timestamp) => $timestamp > $now - $this->timeFrame
            );
        }

        // Check if the client has exceeded the limit
        if (count($this->requests[$clientIp]) >= $this->maxRequests) {
            return false;
        }

        // Log the current request
        $this->requests[$clientIp][] = $now;
        return true;
    }
}
