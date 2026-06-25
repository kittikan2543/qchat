import Link from 'next/link';
import {
  MessageCircle,
  Truck,
  Store,
  Users,
  CreditCard,
  Palette,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

type Screen = {
  href: string;
  title: string;
  desc: string;
  tag: string;
  Icon: typeof MessageCircle;
  color: string;
  soft: string;
};

const screens: Screen[] = [
  { href: '/chat', title: 'แชทรวมทุกช่องทาง', desc: 'กล่องข้อความรวม Line/FB/IG/TikTok พร้อมการ์ดออเดอร์', tag: 'แอปหลัก', Icon: MessageCircle, color: '#FF6700', soft: '#FFF1E6' },
  { href: '/parcel', title: 'ติดตามพัสดุ', desc: 'EMS/Kerry/Flash/J&T พร้อมไทม์ไลน์สถานะเรียลไทม์', tag: 'แอปหลัก', Icon: Truck, color: '#D97706', soft: '#FFFBEB' },
  { href: '/inventory', title: 'จัดการสินค้า & POS', desc: 'ตารางสต็อก ระดับสีบ่งชี้ และแผง POS ขายหน้าร้าน', tag: 'แอปหลัก', Icon: Store, color: '#059669', soft: '#ECFDF5' },
  { href: '/team', title: 'จัดการทีม & สิทธิ์', desc: 'สมาชิก บทบาท เมทริกซ์สิทธิ์ และเชิญสมาชิกใหม่', tag: 'แอปหลัก', Icon: Users, color: '#DB2777', soft: '#FCE7F3' },
  { href: '/checkout', title: 'ชำระเงินสมัครแพ็กเกจ', desc: 'สรุปคำสั่งซื้อ บัตร/พร้อมเพย์/โอน และสถานะสำเร็จ', tag: 'การชำระเงิน', Icon: CreditCard, color: '#FF6700', soft: '#FFF1E6' },
  { href: '/landing', title: 'Landing Page', desc: 'หน้าเว็บการตลาด — ฮีโร่ ฟีเจอร์ ราคา รีวิว', tag: 'มาร์เก็ตติ้ง', Icon: Rocket, color: '#FF6700', soft: '#FFF1E6' },
  { href: '/design-system', title: 'Design System', desc: 'โทนสี ตัวอักษร ปุ่ม แบดจ์ และคอมโพเนนต์หลัก', tag: 'รากฐาน', Icon: Palette, color: '#475569', soft: '#F1F5F9' },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-14 md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-2 flex items-center gap-3.5">
          <div
            className="flex size-12 items-center justify-center rounded-2xl font-display text-2xl font-extrabold text-white"
            style={{ background: 'var(--brand-gradient)', boxShadow: '0 8px 20px rgba(255,103,0,.35)' }}
          >
            Q
          </div>
          <div>
            <div className="font-display text-2xl font-extrabold tracking-tight">Qchat</div>
            <div className="text-sm text-muted-foreground">
              แพลตฟอร์มแชต + คอมเมิร์ซครบวงจร · Console
            </div>
          </div>
          <span className="ml-auto rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-muted-foreground">
            v0.1 · scaffold
          </span>
        </header>

        <h1 className="mb-2 mt-6 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
          ภาพรวมระบบ Qchat
        </h1>
        <p className="mb-9 max-w-xl leading-relaxed text-muted-foreground">
          โครงแอปจริง (Next.js + Prisma + Clerk + Pusher) — คลิกการ์ดเพื่อเข้าแต่ละส่วน
          หน้าจอเต็มกำลังพอร์ตจากดีไซน์ใน <code className="font-mono text-xs">prototype/</code>
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {screens.map(({ href, title, desc, tag, Icon, color, soft }) => (
            <Link key={href} href={href} className="group block">
              <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="flex h-full flex-col p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{ background: soft, color }}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                      style={{ background: soft, color }}
                    >
                      {tag}
                    </span>
                  </div>
                  <div className="mb-1 font-display text-base font-bold">{title}</div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-primary">
                    เปิดดู <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center font-mono text-xs text-muted-foreground/70">
          Qchat · Pumpkin Spice #FF6700 · Next.js · Prisma · Clerk · Pusher · 🇹🇭
        </p>
      </div>
    </main>
  );
}
