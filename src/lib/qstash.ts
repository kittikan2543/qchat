import { Client } from '@upstash/qstash';

export const qstashEnabled = !!process.env.QSTASH_TOKEN;

const client = qstashEnabled ? new Client({ token: process.env.QSTASH_TOKEN! }) : null;

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

/**
 * Publish a background job to a local API route via QStash.
 * Returns { enqueued:false } when QStash isn't configured so callers
 * can fall back to inline processing in dev.
 */
export async function enqueue(path: string, body: unknown) {
  if (!client) return { enqueued: false as const };
  await client.publishJSON({ url: `${appUrl()}${path}`, body });
  return { enqueued: true as const };
}
