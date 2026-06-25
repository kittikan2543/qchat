import Pusher from 'pusher';

export const pusherEnabled = !!(
  process.env.PUSHER_APP_ID &&
  process.env.PUSHER_SECRET &&
  process.env.NEXT_PUBLIC_PUSHER_KEY
);

let client: Pusher | null = null;

function getPusher(): Pusher | null {
  if (!pusherEnabled) return null;
  if (!client) {
    client = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'ap1',
      useTLS: true,
    });
  }
  return client;
}

/** Per-shop realtime channel name. */
export const shopChannel = (shopId: string) => `private-shop-${shopId}`;

/** Trigger a realtime event; safe no-op when Pusher isn't configured. */
export async function triggerShop(shopId: string, event: string, data: unknown) {
  const p = getPusher();
  if (!p) return;
  await p.trigger(shopChannel(shopId), event, data);
}
