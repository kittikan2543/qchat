import type { NextRequest } from 'next/server';
import type { WebhookEvent } from '@line/bot-sdk';
import { Receiver } from '@upstash/qstash';
import { handleLineEvents } from '@/lib/line-handler';

export const runtime = 'nodejs';

// Verifies the QStash signature so only QStash can invoke this job.
const receiver =
  process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY
    ? new Receiver({
        currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
        nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
      })
    : null;

export async function POST(req: NextRequest) {
  const raw = await req.text();

  if (receiver) {
    const valid = await receiver
      .verify({ signature: req.headers.get('upstash-signature') ?? '', body: raw })
      .catch(() => false);
    if (!valid) return new Response('Invalid QStash signature', { status: 401 });
  }

  const events = (JSON.parse(raw).events ?? []) as WebhookEvent[];
  await handleLineEvents(events);

  return new Response('OK');
}
