import { prisma } from '@/lib/prisma';
import { getCurrentShop } from '@/lib/shop';
import { formatTHB } from '@/lib/utils';
import type { Conversation, Platform } from '@/lib/mock-data';
import { ChatInbox } from './chat-inbox';

// Reads conversations + messages live from the DB per request.
export const dynamic = 'force-dynamic';

const AVATARS = [
  'linear-gradient(135deg,#7FC4F5,#48ACF0)',
  'linear-gradient(135deg,#FBCFE8,#F472B6)',
  'linear-gradient(135deg,#6EE7B7,#34D399)',
  'linear-gradient(135deg,#FCD34D,#F59E0B)',
  'linear-gradient(135deg,#C4B5FD,#A78BFA)',
];

function relTime(d: Date | null): string {
  if (!d) return '';
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'เดี๋ยวนี้';
  if (mins < 60) return `${mins} นาที`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชม.`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'เมื่อวาน' : `${days} วัน`;
}

export default async function ChatPage() {
  const shop = await getCurrentShop();
  const rows = await prisma.conversation.findMany({
    where: { shopId: shop.id },
    orderBy: { lastMessageAt: 'desc' },
    include: {
      customer: true,
      orders: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  const conversations: Conversation[] = rows.map((c, i) => ({
    id: c.id,
    name: c.customer.displayName ?? 'ลูกค้า',
    platform: c.customer.platform as Platform,
    initial: (c.customer.displayName ?? '?').trim().charAt(0) || '?',
    avatarBg: AVATARS[i % AVATARS.length],
    lastMessage: c.messages.at(-1)?.text ?? '',
    time: relTime(c.lastMessageAt),
    unread: c.unreadCount,
    online: false,
    customer: { phone: c.customer.phone ?? '-', note: c.customer.note ?? undefined },
    orders: c.orders.map((o) => ({
      code: o.code,
      title: formatTHB(o.total),
      amount: o.total,
      status: o.status,
    })),
    messages: c.messages.map((m) => ({
      id: m.id,
      from: m.direction === 'OUTBOUND' ? 'shop' : 'customer',
      text: m.text ?? '',
      time: new Date(m.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    })),
  }));

  return <ChatInbox conversations={conversations} />;
}
