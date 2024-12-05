<?php

namespace Entity;

use Doctrine\ORM\Mapping as ORM;
use Entity\Orders;

#[ORM\Entity]
#[ORM\Table(name: "products")]
class Products
{
    #[ORM\Id]
    #[ORM\Column(type: "integer")]
    #[ORM\GeneratedValue]
    private int $id;

    #[ORM\Column(type: "string", length: 255)]
    private string $name;

    #[ORM\Column(type: "decimal", precision: 10, scale: 2)]
    private float $price;

    #[ORM\ManyToOne(targetEntity: Orders::class, inversedBy: "products")]
    #[ORM\JoinColumn(name: "order_id", referencedColumnName: "id", onDelete: "CASCADE")]
    private ?Orders $order = null;

    // Getters and Setters

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): void
    {
        $this->price = $price;
    }

    public function getOrder(): Orders
    {
        return $this->order;
    }

    public function setOrder(Orders $order): void
    {
        $this->order = $order;
    }

    public function clearOrder(): void
{
    $this->order = null;
}
}
