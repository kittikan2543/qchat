'use server';

import { prisma } from '@/lib/prisma';
import { triggerShop } from '@/lib/pusher';

/** Send an outbound message: persist to DB + push realtime (no-op without Pusher). */
export async function sendMessage(conversationId: string, text: string) {
  const t = text.trim();
  if (!t) return;

  const message = await prisma.message.create({
    data: { conversationId, direction: 'OUTBOUND', type: 'TEXT', text: t },
  });
  const conv = await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: message.createdAt },
    select: { shopId: true },
  });

  await triggerShop(conv.shopId, 'message:new', {
    conversationId,
    from: 'shop',
    text: t,
    at: message.createdAt.toISOString(),
  });
}
