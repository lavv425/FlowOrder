<?php
ini_set("display_errors", E_ALL);
$config = require __DIR__ . "/../../constants/config.php";

require_once "{$config["ENTITIES_DIR"]}/Orders.php";
// require_once __DIR__ ."/../../Routify/vendor/autoload.php";

use Entity\Orders;
use Entity\Products;
use Entity\OrdersAssociations;
use Routify\Api;

/** 
 * @route POST /api/update-order/{uuid}
 * Save the new order in the database table orders,
 * creating associations with the products.
 */

function updateOrder($uuid, $entityManager): void
{
    try {
        // Get the order data from the request
        $orderData = Api::getBody();

        // Validate the order data from the request
        if (!$orderData || !isset($orderData["name"], $orderData["description"], $orderData["date"], $orderData["products"])) {
            Api::response("bad_request", [], "Missing required fields!", 400);
            return;
        }

        $orderId = OrdersAssociations::getOrderIdByUuid($entityManager, $uuid);

        if (!$orderId) {
            Api::response("error", null, "Order not found for the given UUID.", 404);
            return;
        }

        $orderName = $orderData["name"];
        $orderDescription = $orderData["description"];
        $orderDate = $orderData["date"];
        $orderProducts = (array) $orderData["products"];

        // Date is already in the correct format, but we format it again just to be sure
        $formattedDate = (new \DateTime($orderDate))->format("Y-m-d");

        $entityManager->beginTransaction();

        $order = $entityManager->find(Orders::class, $orderId);
        $order->setName($orderName);
        $order->setDescription($orderDescription);
        $order->setDate($formattedDate);

        foreach ($order->getProducts() as $product) {
            $order->removeProduct($product);
            $entityManager->remove($product);
        }

        // Insert every product to the database
        foreach ($orderProducts as $orderProduct) {
            $product = new Products();
            $product->setName($orderProduct["name"]);
            $product->setPrice($orderProduct["price"]);
            $order->addProduct($product);
            $entityManager->persist($product); // Persist of the product to the entity manager
        }

        // Persist the updated order
        $entityManager->persist($order);

        // Save to the database
        $entityManager->flush();

        // And commit the transaction
        $entityManager->commit();

        Api::response("success", null, "Ok", 200);
        return;
    } catch (Exception $e) {
        if ($entityManager->getConnection()->isTransactionActive()) {
            $entityManager->rollback();
        }
        Api::response("error", null, "An error occurred: " . $e->getMessage(), 500);
        throw $e;
    } catch (PDOException $e) {
        if ($entityManager->getConnection()->isTransactionActive()) {
            $entityManager->rollback();
        }
        Api::response("error", null, "Database error: " . $e->getMessage(), 500);
        throw $e;
    }
}
