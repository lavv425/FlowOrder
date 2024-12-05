<?php
// ini_set("display_errors", E_ALL);
// $config = require __DIR__ . "/../../constants/config.php";

use Entity\Orders;
use Entity\OrdersAssociations;
use Routify\Api;

/** 
 * @route GET /api/order/{uuid}
 * Returns all orders in the with the associated products usign the given uuid.
 */
function getOrder($uuid, $entityManager): void
{
    try {
        $orderId = OrdersAssociations::getOrderIdByUuid($entityManager, $uuid);

        if (!$orderId) {
            Api::response("error", null, "Order not found for the given UUID.", 404);
            return;
        }

        $qb = $entityManager->createQueryBuilder();

        $qb->select("o", "p")
            ->from(Orders::class, "o")
            ->leftJoin("o.products", "p")
            ->where("o.id = :orderId")
            ->setParameter("orderId", $orderId);

        /** @var Orders $orderWithProducts */
        $orderWithProducts = $qb->getQuery()->getOneOrNullResult();

        if (!$orderWithProducts) {
            Api::response("error", null, "Order details not found.", 404);
            return;
        }

        // Prepare order data
        $orderData = [
            "name" => $orderWithProducts->getName(),
            "description" => $orderWithProducts->getDescription(),
            "date" => $orderWithProducts->getDate()->format("d/m/Y"),
            "products" => array_values(array_map(function ($product): array {
                return [
                    "name" => $product->getName(),
                    "price" => $product->getPrice(),
                ];
            }, $orderWithProducts->getProducts()->toArray()))
        ];

        Api::response("success", $orderData, "Ok.", 200);
        return;
    } catch (Exception $e) {
        Api::response("error", null, "An error occurred: " . $e->getMessage(), 500);
        throw $e;
    } catch (PDOException $e) {
        Api::response("error", null, "Database error: " . $e->getMessage(), 500);
        throw $e;
    }
}
