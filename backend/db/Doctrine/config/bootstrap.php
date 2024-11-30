<?php

require_once __DIR__ . "/../../../vendor/autoload.php";
$config =  __DIR__ . "/../../../constants/config.php";

use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;

// "Default" Doctrine configuration
$config = ORMSetup::createAttributeMetadataConfiguration(
    paths: [__DIR__ . $config["ENTITIES_DIR"]],
    isDevMode: true,
);

// Database connection configuration
$connectionParams = [
        'dbname' => $config["DB_NAME"],
        'user' => $config["DB_USER"],
        'password' => $config["DB_PASS"],
        'host' => $config["DB_HOST"],   
        'driver' => 'pdo_mysql',
];
$connection = DriverManager::getConnection([
    ''
], $config);

// EntityManager instance
$entityManager = new EntityManager($connection, $config);