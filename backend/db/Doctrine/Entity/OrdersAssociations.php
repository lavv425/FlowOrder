<?php

namespace Entity;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "orders_association")]
class Associations
{
    #[ORM\Id]
    #[ORM\Column(type: "string", length: 36, unique: true)]
    private string $uuid;

    #[ORM\ManyToOne(targetEntity: Orders::class)]
    #[ORM\JoinColumn(name: "order_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private Orders $order;

    public function __construct()
    {
        $this->uuid = $this->uuidV4();
    }

    private function uuidV4(): string
    {
        // Generate 16 bytes (128 bits) of random data
        try {
            $data = random_bytes(16);
        } catch (\Exception $e) {
            throw new \RuntimeException('Unable to generate UUID: ' . $e->getMessage());
        }

        // Set version to 0100
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        // Set bits 6-7 to 10
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        // Output the 36 character UUID.
        $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));

        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid)) {
            $this->uuidV4();
        }

        return $uuid;
    }

    // Getters and Setters

    public function getUuid(): string
    {
        return $this->uuid;
    }

    public function getOrder(): Orders
    {
        return $this->order;
    }

    public function setOrder(Orders $order): void
    {
        $this->order = $order;
    }

    // Static Methods for Querying

    /**
     * Get the order ID associated with a given UUID.
     */
    public static function getOrderIdByUuid(EntityManagerInterface $entityManager, string $uuid): ?int
    {
        /** @var EntityRepository $repository */
        $repository = $entityManager->getRepository(self::class);

        /** @var self|null $association */
        $association = $repository->findOneBy(['uuid' => $uuid]);

        return $association ? $association->getOrder()->getId() : null;
    }

    /**
     * Get the UUID associated with a given order ID.
     */
    public static function getUuidByOrderId(EntityManagerInterface $entityManager, int $orderId): ?string
    {
        /** @var EntityRepository $repository */
        $repository = $entityManager->getRepository(self::class);

        /** @var self|null $association */
        $association = $repository->findOneBy(['order' => $orderId]);

        return $association ? $association->getUuid() : null;
    }
}
