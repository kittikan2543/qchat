import type { NextRequest } from 'next/server';
import type { WebhookEvent } from '@line/bot-sdk';
import { validateLineSignature } from '@/lib/line';
import { enqueue, qstashEnabled } from '@/lib/qstash';
import { handleLineEvents } from '@/lib/line-handler';

export const runtime = 'nodejs';

// LINE Messaging API webhook.
// Verify signature on the RAW body, then 200 fast — heavy work is enqueued.
export async function POST(req: NextRequest) {
  const raw = await req.text();

  if (!validateLineSignature(raw, req.headers.get('x-line-signature'))) {
    return new Response('Invalid signature', { status: 401 });
  }

  const events = (JSON.parse(raw).events ?? []) as WebhookEvent[];

  if (qstashEnabled) {
    await enqueue('/api/jobs/line-inbound', { events });
  } else {
    // Dev fallback: no queue configured → process inline.
    await handleLineEvents(events);
  }

  return new Response('OK');
}
