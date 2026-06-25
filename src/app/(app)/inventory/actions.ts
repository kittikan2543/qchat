'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentShop } from '@/lib/shop';

export async function toggleProductActive(id: string) {
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return;
  await prisma.product.update({ where: { id }, data: { active: !p.active } });
  revalidatePath('/inventory');
}

export async function createProduct(formData: FormData) {
  const shop = await getCurrentShop();
  const name = String(formData.get('name') ?? '').trim();
  const sku = String(formData.get('sku') ?? '').trim();
  if (!name || !sku) return;

  await prisma.product.create({
    data: {
      shopId: shop.id,
      name,
      sku,
      category: String(formData.get('category') ?? 'อื่นๆ') || 'อื่นๆ',
      price: Math.max(0, Number(formData.get('price') ?? 0)),
      cost: Math.max(0, Number(formData.get('cost') ?? 0)),
      stock: Math.max(0, Number(formData.get('stock') ?? 0)),
      active: true,
    },
  });
  revalidatePath('/inventory');
}

/** Record a POS sale: create an Order + items and decrement stock (transaction). */
export async function saveSale(items: { id: string; qty: number }[]) {
  if (items.length === 0) return;
  const shop = await getCurrentShop();
  const ids = items.map((i) => i.id);
  const products = await prisma.product.findMany({ where: { id: { in: ids }, shopId: shop.id } });
  const qtyById = new Map(items.map((i) => [i.id, i.qty]));

  const lines = products.map((p) => ({ product: p, qty: qtyById.get(p.id) ?? 0 }));
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const code = `#${Date.now().toString().slice(-5)}`;

  await prisma.$transaction([
    prisma.order.create({
      data: {
        shopId: shop.id,
        code,
        status: 'PAID',
        subtotal,
        discount: 0,
        total: subtotal,
        items: {
          create: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            price: l.product.price,
            qty: l.qty,
          })),
        },
      },
    }),
    ...lines.map((l) =>
      prisma.product.update({
        where: { id: l.product.id },
        data: { stock: { decrement: Math.min(l.qty, l.product.stock) } },
      }),
    ),
  ]);
  revalidatePath('/inventory');
}
