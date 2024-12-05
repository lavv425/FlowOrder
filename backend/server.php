<?php

/**
 * Initialize the application.
 *
 * - Sets memory limits and timeouts.
 * - Configures allowed origins for CORS.
 * - Initializes the entity manager.
 * - Sets up API routes for the application.
 */

// Commented for production
// ini_set("display_errors", E_ALL);
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

/**
 * Define API routes under the "/api" namespace.
 */
Api::namespace("/api", function () use ($entityManager): void {
    /**
     * @route GET /api/orders
     * @description Retrieve all orders.
     * @response JSON containing a list of orders.
     */
    Api::GET("/orders", function () use ($entityManager): void {
        require_once __DIR__ . "/api/getOrders/getOrders.php";
        getOrders($entityManager);
    });

    /**
     * @route GET /api/order/{uuid}
     * @description Retrieve details of a specific order by UUID.
     * @param string $uuid The unique identifier of the order.
     * @response JSON containing order details and associated products.
     */
    Api::GET("/order/{uuid}", function ($uuid) use ($entityManager): void {
        require_once __DIR__ . "/api/getOrder/getOrder.php";
        getOrder($uuid, $entityManager);
    });

    /**
     * @route POST /api/save-order
     * @description Save a new order with associated products.
     * @request JSON object containing order details and product data.
     * @response JSON indicating success or failure.
     */
    Api::POST("/save-order", function () use ($entityManager): void {
        require_once __DIR__ . "/api/saveOrder/saveOrder.php";
        saveOrder($entityManager);
    });

    /**
     * @route POST /api/update-order/{uuid}
     * @description Update an existing order and its associated products.
     * @param string $uuid The unique identifier of the order.
     * @request JSON object with updated order and product details.
     * @response JSON indicating success or failure.
     */
    Api::POST("/update-order/{uuid}", function ($uuid) use ($entityManager): void {
        require_once __DIR__ . "/api/updateOrder/updateOrder.php";
        updateOrder($uuid, $entityManager);
    });

    /**
     * @route DELETE /api/delete-order/{uuid}
     * @description Delete an order, its association, and associated products.
     * @param string $uuid The unique identifier of the order.
     * @response JSON indicating success or failure.
     */
    Api::DELETE("/delete-order/{uuid}", function ($uuid) use ($entityManager) {
        require_once __DIR__ . "/api/deleteOrder/deleteOrder.php";
        deleteOrder($uuid, $entityManager);
    });
});


/**
 * Start the API server with the provided configuration.
 */
Api::startServer($config["SERVER_OPTIONS"]);
