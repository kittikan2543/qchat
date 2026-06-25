import { prisma } from '@/lib/prisma';
import { getCurrentShop } from '@/lib/shop';
import { InventoryClient } from './inventory-client';

// Reads per-request from the DB so toggles / sales / new products show immediately.
export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const shop = await getCurrentShop();
  const rows = await prisma.product.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'asc' },
  });
  const products = rows.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    category: p.category ?? '',
    price: p.price,
    cost: p.cost,
    stock: p.stock,
    active: p.active,
  }));
  return <InventoryClient products={products} />;
}
