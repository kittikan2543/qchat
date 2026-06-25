'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  ReceiptText,
  Store,
  Truck,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Item = { href: string; label: string; Icon: LucideIcon };

const items: Item[] = [
  { href: '/chat', label: 'แชท', Icon: MessageCircle },
  { href: '/checkout', label: 'ออเดอร์', Icon: ReceiptText },
  { href: '/inventory', label: 'สต็อก', Icon: Store },
  { href: '/parcel', label: 'พัสดุ', Icon: Truck },
  { href: '/', label: 'รายงาน', Icon: BarChart3 },
];

export function NavRail() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-[68px] shrink-0 flex-col items-center gap-2 bg-navy py-3.5 text-white">
      <Link
        href="/"
        className="mb-2 flex size-9 items-center justify-center rounded-lg font-display text-lg font-extrabold text-white"
        style={{ background: 'var(--brand-gradient)' }}
      >
        Q
      </Link>

      {items.map(({ href, label, Icon }) => {
        const active = href !== '/' && pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'flex w-[52px] flex-col items-center justify-center gap-0.5 rounded-xl py-2 transition-colors',
              active ? 'text-white' : 'text-white/55 hover:text-white/90',
            )}
            style={active ? { background: 'var(--brand-gradient)' } : undefined}
          >
            <Icon className="size-[18px]" />
            <span className="text-[9px] font-semibold">{label}</span>
          </Link>
        );
      })}

      <div className="mt-auto flex flex-col items-center gap-3">
        <Link href="/team" className="text-white/55 transition-colors hover:text-white/90">
          <Settings className="size-[18px]" />
        </Link>
        <Link
          href="/team"
          className="flex size-9 items-center justify-center rounded-full border-2 border-white/20 text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#7FC4F5,#48ACF0)' }}
        >
          ป
        </Link>
      </div>
    </nav>
  );
}
