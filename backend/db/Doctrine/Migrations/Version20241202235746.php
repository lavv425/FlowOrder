<?php

declare(strict_types=1);

namespace Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration to create the "orders_association" table.
 * Since I don't want to modify the "orders" table directly, I'm creating a new one instead.
 * Connecting a generated uuid to every new order (id)
 */
final class Version20241202235746 extends AbstractMigration
{
    private array $constants;

    public function __construct()
    {
        $this->constants = require __DIR__ . "/../../../constants/constants.php";
    }
    public function getDescription(): string
    {
        return "Generates the '{$this->constants["TABLE_NAMES"]["ORDERS_ASSOCIATION_TABLE"]}' table";
    }

    public function up(Schema $schema): void
    {
        $ordersAssociationTable = $schema->createTable($this->constants["TABLE_NAMES"]["ORDERS_ASSOCIATION_TABLE"]);

        // UUID column
        $ordersAssociationTable->addColumn("uuid", "string", ["length" => 36]);

        // Foreign key column
        $ordersAssociationTable->addColumn("order_id", "integer");

        // Set uuid as primary key
        $ordersAssociationTable->setPrimaryKey(['uuid']);

        // Add foreign key constraint to orders table
        $ordersAssociationTable->addForeignKeyConstraint(
            $this->constants["TABLE_NAMES"]["ORDERS_TABLE"],
            ["order_id"],
            ["id"],
            ["onDelete" => "CASCADE"]
        );
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable($this->constants["TABLE_NAMES"]["ORDERS_ASSOCIATION_TABLE"]);
    }
}
