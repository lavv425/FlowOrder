<?php
// ini_set("display_errors", E_ALL);
// $config = require __DIR__ . "/../../constants/config.php";


use Entity\Orders;
use Entity\OrdersAssociations;
use Routify\Api;

/** 
 * @route GET /api/orders
 * Returns all orders in the database table orders.
 */

function getOrders($entityManager): void
{
    try {
        // Find all the orders from the database
        // $orderRepository = $entityManager->getRepository(Orders::class);
        // $orders = $orderRepository->findAll();

        // // $order = new Orders();
        // // $order->setName("Test");
        // // $order->setDescription("Test bellolungo vediamo mpo");
        // // $order->setDate(date("Y-m-d")); // Convert the date to a DateTime object

        // // // Persist the new order
        // // $entityManager->persist($order);
        // // $entityManager->flush();
        // // Convert the orders to an array
        // $orderData = array_map(function (Orders $order): array {
        //     return [
        //         "id" => $order->getId(),
        //         "name" => $order->getName(),
        //         "description" => $order->getDescription(),
        //         "date" => $order->getDate()->format("Y-m-d"),
        //     ];
        // }, $orders);


        // Create a QueryBuilder instance to count associated products
        $qb = $entityManager->createQueryBuilder();
        $qb->select("o, COUNT(p.id) AS product_count")
            ->from(Orders::class, "o")
            ->leftJoin("o.products", "p")
            ->groupBy("o.id"); // Group by order ID

        $ordersWithCounts = $qb->getQuery()->getResult();

        // Map the results to include the order data and product count
        $orderData = array_map(function ($row) use ($entityManager): array {
            /** @var Orders $order */
            $order = $row[0]; // The order entity is the first element in the result
            $productCount = $row["product_count"]; // Extract the count of products

            $uuid = OrdersAssociations::getUuidByOrderId($entityManager, $order->getId());

            return [
                "id" => $order->getId(),
                "uuid" => $uuid,
                "name" => $order->getName(),
                "description" => $order->getDescription(),
                "date" => $order->getDate()->format("d/m/Y"),
                "products_count" => (int)$productCount,
            ];
        }, $ordersWithCounts);

        Api::response("success", $orderData, "Ok", 200);
        return;
    } catch (Exception $e) {
        Api::response("error", null, "An error occurred: " . $e->getMessage(), 500);
        throw $e;
    } catch (PDOException $e) {
        Api::response("error", null, "Database error: " . $e->getMessage(), 500);
        throw $e;
    }
}
