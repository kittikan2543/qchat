import type { WebhookEvent } from '@line/bot-sdk';
import { triggerShop } from '@/lib/pusher';

/**
 * Process inbound LINE webhook events.
 * Called inline in dev, or via the QStash consumer in production.
 *
 * TODO (next): resolve Channel -> Shop, upsert Customer + Conversation,
 * persist each Message with Prisma, then push to the shop's realtime channel.
 */
export async function handleLineEvents(events: WebhookEvent[]) {
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId ?? 'unknown';
      const text = event.message.text;

      console.log(`[LINE] inbound from ${userId}: ${text}`);

      // Demo realtime push (no-op unless Pusher is configured).
      await triggerShop('demo', 'message:new', {
        platform: 'LINE',
        userId,
        text,
        at: Date.now(),
      });

      // Demo auto-reply — uncomment once a real channel/token is configured:
      // if ('replyToken' in event) await replyText(event.replyToken, `ได้รับข้อความ: ${text}`);
    }
  }
}
