<?php

$constants = (array) [
    "ENTITY_MANAGER_PATH" => realpath(__DIR__. "/../db/Doctrine/Config/bootstrap.php"),
    "TABLE_NAMES" => [
        "ORDERS_TABLE" => "orders",
        "PRODUCTS_TABLE" => "products"
    ],
];

return $constants;