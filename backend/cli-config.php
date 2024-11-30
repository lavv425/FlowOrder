<?php

$config = require_once __DIR__ . "/constants/config.php";

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Doctrine\Migrations\Configuration\EntityManager\ExistingEntityManager;
use Doctrine\Migrations\DependencyFactory;
use Doctrine\Migrations\Configuration\Migration\PhpFile;
use Doctrine\DBAL\DriverManager;

// Load the Migrations configuration
$doctrineConfig = new PhpFile("migrations.php");

$ORMConfig = ORMSetup::createAttributeMetadataConfiguration(
    paths: [$config["ENTITIES_DIR"]],
    isDevMode: true,
);

$connection = DriverManager::getConnection($config["DOCTRINE_CONNECTION_PARAMS"], $ORMConfig);

$entityManager = new EntityManager($connection, $ORMConfig);

return DependencyFactory::fromEntityManager($doctrineConfig, new ExistingEntityManager($entityManager));
