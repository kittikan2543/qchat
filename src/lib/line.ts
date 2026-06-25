import crypto from 'node:crypto';
import { messagingApi } from '@line/bot-sdk';

export const lineEnabled = !!(
  process.env.LINE_CHANNEL_ACCESS_TOKEN && process.env.LINE_CHANNEL_SECRET
);

/** Verify the X-Line-Signature header against the raw request body. */
export function validateLineSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
  // timing-safe compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

let api: messagingApi.MessagingApiClient | null = null;

/** LINE Messaging API client; null when not configured. */
export function lineClient(): messagingApi.MessagingApiClient | null {
  if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) return null;
  if (!api) {
    api = new messagingApi.MessagingApiClient({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    });
  }
  return api;
}

export async function replyText(replyToken: string, text: string) {
  const client = lineClient();
  if (!client) return;
  await client.replyMessage({ replyToken, messages: [{ type: 'text', text }] });
}
