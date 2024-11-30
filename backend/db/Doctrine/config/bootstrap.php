<?php
$config = require __DIR__ . "/../../../constants/config.php";

use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Doctrine\ORM\Mapping\DefaultQuoteStrategy;

// "Default" Doctrine configuration
$ORMConfig = ORMSetup::createAttributeMetadataConfiguration(
    paths: [$config["ENTITIES_DIR"]],
    isDevMode: true,
);

$ORMConfig->setQuoteStrategy(new DefaultQuoteStrategy());

// Database connection configuration
$connection = DriverManager::getConnection($config["DOCTRINE_CONNECTION_PARAMS"], $ORMConfig);

// EntityManager instance
$entityManager = new EntityManager($connection, $ORMConfig);

return $entityManager;