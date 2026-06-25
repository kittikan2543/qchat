import { prisma } from '@/lib/prisma';

export const clerkEnabled = !!process.env.CLERK_SECRET_KEY;

/**
 * Resolve the active shop for the current request.
 * - Clerk ON: sync the signed-in Clerk user into our DB (User + Membership),
 *   creating a personal shop on first sign-in; returns that shop.
 * - Clerk OFF (demo): returns the seeded `demo` shop so the app works without keys.
 */
export async function getCurrentShop() {
  if (clerkEnabled) {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (userId) {
      const cu = await currentUser();
      const email = cu?.primaryEmailAddress?.emailAddress ?? `${userId}@clerk.local`;
      const name = cu ? [cu.firstName, cu.lastName].filter(Boolean).join(' ') || cu.username : null;

      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: { email, name, avatarUrl: cu?.imageUrl },
        create: { clerkId: userId, email, name, avatarUrl: cu?.imageUrl },
      });

      const membership = await prisma.membership.findFirst({
        where: { userId: user.id },
        include: { shop: true },
      });
      if (membership) return membership.shop;

      const slug = `shop-${userId.slice(-8).toLowerCase()}`;
      const shop = await prisma.shop.upsert({
        where: { slug },
        update: {},
        create: { name: name ? `ร้านของ ${name}` : 'ร้านของฉัน', slug },
      });
      await prisma.membership.create({ data: { shopId: shop.id, userId: user.id, role: 'OWNER' } });
      return shop;
    }
  }
  return prisma.shop.findUniqueOrThrow({ where: { slug: 'demo' } });
}
