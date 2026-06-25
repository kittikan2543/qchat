import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, IBM_Plex_Sans_Thai, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from '@/components/providers';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const thai = IBM_Plex_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-thai',
  weight: ['400', '500', '600', '700'],
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: 'Qchat — แพลตฟอร์มแชต + คอมเมิร์ซครบวงจร',
  description: 'รวมแชต Line/FB/IG/TikTok + ระบบสต็อก ติดตามพัสดุ และรับชำระเงิน ในที่เดียว',
};

// Auth is opt-in. Without a Clerk publishable key the app still renders.
const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tree = (
    <html
      lang="th"
      className={`${jakarta.variable} ${inter.variable} ${thai.variable} ${mono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );

  return clerkEnabled ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
