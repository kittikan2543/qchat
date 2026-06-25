import fs from 'node:fs/promises';
import path from 'node:path';

// Map the prototype's static .html links to real Next routes.
const LINK_MAP: [string, string][] = [
  ['index.html', '/'],
  ['landing.html', '/landing'],
  ['chat.html', '/chat'],
  ['parcel.html', '/parcel'],
  ['inventory.html', '/inventory'],
  ['team.html', '/team'],
  ['checkout.html', '/checkout'],
  ['design-system.html', '/design-system'],
];

/**
 * Read a prototype HTML file (read at build time on static pages) and return
 * its <style> block + <body> inner markup, with links rewritten to app routes.
 * Used to render the faithful static screens (Landing, Design System).
 */
export async function loadPrototype(file: string) {
  const raw = await fs.readFile(path.join(process.cwd(), 'prototype', file), 'utf8');
  const style = (raw.match(/<style>([\s\S]*?)<\/style>/) ?? ['', ''])[1];
  let body = raw.slice(raw.indexOf('<body>') + '<body>'.length, raw.indexOf('</body>'));
  for (const [from, to] of LINK_MAP) body = body.split(`href="${from}"`).join(`href="${to}"`);
  return { style, body };
}
