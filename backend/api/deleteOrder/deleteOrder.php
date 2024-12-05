<?php
// ini_set("display_errors", E_ALL);
// $config = require __DIR__ . "/../../constants/config.php";

use Entity\Orders;
use Entity\OrdersAssociations;
use Routify\Api;

/** 
 * @route DELETE /api/delete-order/{uuid}
 * Deletes an order, its uuid associations, and the associated products.
 */


function deleteOrder(string $uuid, $entityManager): void
{
    try {
        // Get the order ID from the UUID
        $orderId = OrdersAssociations::getOrderIdByUuid($entityManager, $uuid);
        
        if (!$orderId) {
            Api::response("error", null, "Order not found for the given UUID.", 404);
            return;
        }
        
        // Retrieve the order entity
        $order = $entityManager->find(Orders::class, $orderId);
        
        if (!$order) {
            Api::response("error", null, "Order not found.", 404);
            return;
        }
        
        $entityManager->beginTransaction();

        // Retrieve and delete all associated products
        $products = $order->getProducts();
        foreach ($products as $product) {
            $entityManager->remove($product);
        }

        // Remove the association
        $association = $entityManager->getRepository(OrdersAssociations::class)->findOneBy(['order' => $orderId]);
        if ($association) {
            $entityManager->remove($association);
        }

        // Remove the order itself
        $entityManager->remove($order);

        // Commit the transaction
        $entityManager->flush();
        $entityManager->commit();

        Api::response("success", null, "Ok", 200);
        return;
    } catch (Exception $e) {
        if ($entityManager->getConnection()->isTransactionActive()) {
            $entityManager->rollback();
        }
        Api::response("error", null, "An error occurred: " . $e->getMessage(), 500);
    } catch (PDOException $e) {
        if ($entityManager->getConnection()->isTransactionActive()) {
            $entityManager->rollback();
        }
        Api::response("error", null, "Database error: " . $e->getMessage(), 500);
    }
}
