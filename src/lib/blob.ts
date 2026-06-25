import { put } from '@vercel/blob';

export const blobEnabled = !!process.env.BLOB_READ_WRITE_TOKEN;

/** Upload a file (e.g. product image, payment slip) to Vercel Blob. */
export async function uploadBlob(pathname: string, body: Parameters<typeof put>[1]) {
  if (!blobEnabled) throw new Error('Vercel Blob is not configured (BLOB_READ_WRITE_TOKEN)');
  return put(pathname, body, { access: 'public', addRandomSuffix: true });
}
