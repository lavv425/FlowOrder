<?php

declare(strict_types=1);

namespace Migrations;


use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration to create the "order" table.
 */
final class Version20241130162433 extends AbstractMigration
{
    private array $constants;

    public function __construct()
    {
        $this->constants = require __DIR__ . "/../../../constants/constants.php";
    }
    public function getDescription(): string
    {
        return "Generates the '{$this->constants["TABLE_NAMES"]["ORDERS_TABLE"]}' table";
    }

    public function up(Schema $schema): void
    {
        $orderTable = $schema->createTable($this->constants["TABLE_NAMES"]["ORDERS_TABLE"]);
        $orderTable->addColumn('id', 'integer', ['autoincrement' => true]);
        $orderTable->addColumn('name', 'string', ['length' => 255]);
        $orderTable->addColumn('description', 'text', ['notnull' => false]);
        $orderTable->addColumn('date', 'datetime');
        $orderTable->setPrimaryKey(['id']);
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable($this->constants["TABLE_NAMES"]["ORDERS_TABLE"]);
    }
}
