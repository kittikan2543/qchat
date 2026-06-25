import { PrismaClient, type Role, type Platform } from '@prisma/client';
import { products } from '../src/lib/mock-inventory';
import { members } from '../src/lib/mock-team';
import { conversations } from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  // ── Shop ──
  const shop = await prisma.shop.upsert({
    where: { slug: 'demo' },
    update: {},
    create: { name: 'Pang Closet', slug: 'demo' },
  });
  console.log('shop:', shop.name);

  // ── Members (User + Membership) ──
  for (const m of members) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: { name: m.name },
      create: { clerkId: `demo-${m.id}`, email: m.email, name: m.name },
    });
    await prisma.membership.upsert({
      where: { shopId_userId: { shopId: shop.id, userId: user.id } },
      update: { role: m.role as Role },
      create: { shopId: shop.id, userId: user.id, role: m.role as Role },
    });
  }
  console.log('members:', members.length);

  // ── Products ──
  for (const p of products) {
    await prisma.product.upsert({
      where: { shopId_sku: { shopId: shop.id, sku: p.sku } },
      update: { name: p.name, category: p.category, price: p.price, cost: p.cost, stock: p.stock, active: p.active },
      create: { shopId: shop.id, sku: p.sku, name: p.name, category: p.category, price: p.price, cost: p.cost, stock: p.stock, active: p.active },
    });
  }
  console.log('products:', products.length);

  // ── Channels (one per platform) ──
  const platforms: Platform[] = ['LINE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK'];
  const channelByPlatform = new Map<Platform, string>();
  for (const platform of platforms) {
    const ch = await prisma.channel.upsert({
      where: { platform_externalId: { platform, externalId: `demo-${platform}` } },
      update: {},
      create: { shopId: shop.id, platform, externalId: `demo-${platform}`, displayName: `${shop.name} ${platform}` },
    });
    channelByPlatform.set(platform, ch.id);
  }

  // ── Conversations + Customers + Messages (reset for idempotency) ──
  await prisma.message.deleteMany({ where: { conversation: { shopId: shop.id } } });
  await prisma.conversation.deleteMany({ where: { shopId: shop.id } });

  for (const c of conversations) {
    const customer = await prisma.customer.upsert({
      where: { platform_externalId: { platform: c.platform as Platform, externalId: `demo-${c.id}` } },
      update: { displayName: c.name, phone: c.customer.phone },
      create: {
        shopId: shop.id,
        platform: c.platform as Platform,
        externalId: `demo-${c.id}`,
        displayName: c.name,
        phone: c.customer.phone,
        note: c.customer.note,
      },
    });

    await prisma.conversation.create({
      data: {
        shopId: shop.id,
        channelId: channelByPlatform.get(c.platform as Platform)!,
        customerId: customer.id,
        status: 'OPEN',
        unreadCount: c.unread,
        lastMessageAt: new Date(),
        messages: {
          create: c.messages.map((msg) => ({
            direction: msg.from === 'shop' ? 'OUTBOUND' : 'INBOUND',
            type: 'TEXT',
            text: msg.text,
            externalId: `demo-${c.id}-${msg.id}`,
          })),
        },
      },
    });
  }
  console.log('conversations:', conversations.length);
  console.log('✅ seed done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
