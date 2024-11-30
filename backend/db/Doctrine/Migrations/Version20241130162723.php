<?php

declare(strict_types=1);

namespace Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration to create the "products" table.
 */
final class Version20241130162723 extends AbstractMigration
{
    private array $constants;

    public function __construct()
    {
        $this->constants = require __DIR__ . "/../../../constants/constants.php";
    }

    public function getDescription(): string
    {
        return "Generates the {$this->constants["TABLE_NAMES"]["PRODUCTS_TABLE"]} table";
    }

    public function up(Schema $schema): void
    {
        $productsTable = $schema->createTable($this->constants["TABLE_NAMES"]["PRODUCTS_TABLE"]);
        $productsTable->addColumn('id', 'integer', ['autoincrement' => true]);
        $productsTable->addColumn('name', 'string', ['length' => 255]);
        $productsTable->addColumn('price', 'decimal', ['precision' => 10, 'scale' => 2]);
        $productsTable->addColumn('order_id', 'integer');
        $productsTable->setPrimaryKey(['id']);

        $productsTable->addForeignKeyConstraint(
            $this->constants["TABLE_NAMES"]["ORDERS_TABLE"],
            ['order_id'],
            ['id'],
            ['onDelete' => 'CASCADE']
        );
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable($this->constants["TABLE_NAMES"]["PRODUCTS_TABLE"]);
    }
}
