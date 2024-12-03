<?php
ini_set("display_errors", E_ALL);
$config = require __DIR__ . "/../../constants/config.php";

require_once "{$config["ENTITIES_DIR"]}/Orders.php";

use Entity\Orders;
use Routify\Api;

/** 
 * @route GET /api/orders
 * Returns all orders in the database table orders.
 */

function getOrders($entityManager): void
{
    try {
        // Find all the orders from the database
        $orderRepository = $entityManager->getRepository(Orders::class);
        $orders = $orderRepository->findAll();

        // $order = new Orders();
        // $order->setName("Test");
        // $order->setDescription("Test bellolungo vediamo mpo");
        // $order->setDate(new DateTime(date("Y-m-d"))); // Convert the date to a DateTime object

        // // Persist the new order
        // $entityManager->persist($order);
        // $entityManager->flush();
        // Convert the orders to an array
        $orderData = array_map(function (Orders $order): array {
            return [
                'id' => $order->getId(),
                'name' => $order->getName(),
                'description' => $order->getDescription(),
                'date' => $order->getDate()->format('Y-m-d H:i:s'),
            ];
        }, $orders);

        Api::response("success", $orderData, "Ok");
    } catch (Exception $e) {
        Api::response("error", null, "An error occurred: " . $e->getMessage(), 500);
    } catch (PDOException $e) {
        Api::response("error", null, "Database error: " . $e->getMessage(), 500);
    }
}
