<?php

namespace Entity;


use Doctrine\ORM\Mapping as ORM;
use Entity\Products;

#[ORM\Entity]
#[ORM\Table(name: "orders")]
class Orders
{
    #[ORM\Id]
    #[ORM\Column(type: "integer")]
    #[ORM\GeneratedValue]
    private int $id;

    #[ORM\Column(type: "string", length: 255)]
    private string $name;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $description;

    #[ORM\Column(type: "date")]
    private \DateTime $date;

    #[ORM\OneToMany(mappedBy: "order", targetEntity: Products::class, cascade: ["persist", "remove"])]
    private $products;

    public function __construct()
    {
        $this->products = new \Doctrine\Common\Collections\ArrayCollection();
    }

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function getDate(): \DateTime
    {
        return $this->date;
    }

    public function setDate(string $date): void
    {
        $dateTime = \DateTime::createFromFormat('Y-m-d', $date);

        if (!$dateTime) {
            throw new \InvalidArgumentException("Invalid date format. Expected Y-m-d.");
        }

        $this->date = $dateTime;
    }

    public function getProducts(): \Doctrine\Common\Collections\Collection
    {
        return $this->products;
    }

    public function addProduct(Products $product): void
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->setOrder($this);
        }
    }

    public function removeProduct(Products $product): void
    {
        if ($this->products->contains($product)) {
            $this->products->removeElement($product);
            // Rimuove il riferimento all'ordine dal prodotto
            $product->clearOrder();
        }
    }
}
