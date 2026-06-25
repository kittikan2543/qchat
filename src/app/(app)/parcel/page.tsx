'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CircleCheckBig,
  TriangleAlert,
  Copy,
  Check,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  type LucideIcon,
} from 'lucide-react';
import {
  shipments as seed,
  carrierMeta,
  tabMeta,
  stepTitles,
  type Shipment,
  type ShipTab,
} from '@/lib/mock-parcel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const TABS: ('ทั้งหมด' | ShipTab)[] = ['ทั้งหมด', 'รอเข้ารับ', 'กำลังนำส่ง', 'นำส่งสำเร็จ', 'มีปัญหา'];

function CarrierBadge({ carrier, size = 'sm' }: { carrier: Shipment['carrier']; size?: 'sm' | 'lg' }) {
  const m = carrierMeta[carrier];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md font-mono font-bold',
        size === 'lg' ? 'h-10 min-w-10 px-2 text-sm' : 'h-6 min-w-6 px-1.5 text-[10px]',
      )}
      style={{ background: m.bg, color: m.fg }}
    >
      {m.short}
    </span>
  );
}

function StatusPill({ tab }: { tab: ShipTab }) {
  const m = tabMeta[tab];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: m.bg, color: m.fg }}
    >
      <span className="size-1.5 rounded-full" style={{ background: m.dot }} />
      {tab}
    </span>
  );
}

function Stat({ label, value, Icon, tint, color }: { label: string; value: number; Icon: LucideIcon; tint: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: tint, color }}>
        <Icon className="size-[18px]" />
      </div>
      <div>
        <div className="font-mono text-xl font-extrabold leading-none" style={{ color }}>{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function Timeline({ s }: { s: Shipment }) {
  const steps = stepTitles.map((title, i) => {
    let state: 'done' | 'current' | 'pending' | 'problem';
    if (i < s.current) state = 'done';
    else if (i === s.current) state = s.tab === 'มีปัญหา' ? 'problem' : s.tab === 'นำส่งสำเร็จ' ? 'done' : 'current';
    else state = 'pending';
    let detail = '';
    if (i === 3) detail = s.hub;
    if (i === 4) detail = `ปลายทาง ${s.city}`;
    return { title, detail, state };
  });

  return (
    <ol className="relative ml-1.5 space-y-5 border-l-2 border-border pl-6">
      {steps.map((step, i) => {
        const color =
          step.state === 'done' ? '#10B981' : step.state === 'current' ? '#FF6700' : step.state === 'problem' ? '#EF4444' : '#CBD5E1';
        return (
          <li key={i} className="relative">
            <span
              className="absolute left-[-31px] flex size-5 items-center justify-center rounded-full border-2 border-card"
              style={{ background: color }}
            >
              {step.state === 'done' && <Check className="size-3 text-white" />}
              {step.state === 'current' && (
                <span className="absolute inline-flex size-5 animate-ping rounded-full opacity-60" style={{ background: color }} />
              )}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn('text-sm', step.state === 'pending' ? 'text-muted-foreground' : 'font-semibold')}
              >
                {step.title}
              </span>
              {step.state === 'current' && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  ปัจจุบัน
                </span>
              )}
              {step.state === 'problem' && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  มีปัญหา
                </span>
              )}
            </div>
            {step.detail && (step.state === 'done' || step.state === 'current' || step.state === 'problem') && (
              <div className="mt-0.5 text-xs text-muted-foreground">{step.detail}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Detail({ s }: { s: Shipment | null }) {
  const [copied, setCopied] = useState(false);
  if (!s) {
    return <section className="flex flex-1 items-center justify-center text-muted-foreground">เลือกพัสดุเพื่อดูสถานะ</section>;
  }
  const m = carrierMeta[s.carrier];

  function copy() {
    navigator.clipboard?.writeText(s!.trackingNo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center gap-3">
          <CarrierBadge carrier={s.carrier} size="lg" />
          <div className="flex-1">
            <div className="font-display text-lg font-bold">{m.label}</div>
            <div className="text-sm text-muted-foreground">
              ออเดอร์ <span className="font-mono font-semibold text-foreground">{s.orderCode}</span> · {s.customer}
            </div>
          </div>
          <StatusPill tab={s.tab} />
        </div>

        <div className="mb-5 flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <div className="text-xs text-muted-foreground">เลขพัสดุ</div>
            <div className="font-mono text-base font-bold">{s.trackingNo}</div>
          </div>
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check /> : <Copy />}
            {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
            <MapPin className="size-4 text-muted-foreground" />
            <span>ปลายทาง <b>{s.city}</b></span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
            <Clock className="size-4 text-muted-foreground" />
            <span>กำหนดส่ง <b>{s.eta}</b></span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display font-bold">ไทม์ไลน์สถานะ</div>
            <span className="text-xs text-muted-foreground">อัปเดต {s.updatedAt}</span>
          </div>
          <Timeline s={s} />
        </div>

        <div className="mt-5 flex gap-3">
          <Button className="flex-1">
            <Send /> แจ้งสถานะลูกค้า
          </Button>
          <Link href="/checkout" className="flex-1">
            <Button variant="outline" className="w-full">
              ดูออเดอร์ <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ParcelPage() {
  const [list] = useState<Shipment[]>(seed);
  const [tab, setTab] = useState<'ทั้งหมด' | ShipTab>('ทั้งหมด');
  const [selectedId, setSelectedId] = useState(seed[0].id);

  const filtered = useMemo(() => (tab === 'ทั้งหมด' ? list : list.filter((s) => s.tab === tab)), [list, tab]);
  const selected = useMemo(() => list.find((s) => s.id === selectedId) ?? null, [list, selectedId]);
  const stats = useMemo(
    () => ({
      total: list.length,
      transit: list.filter((s) => s.tab === 'กำลังนำส่ง').length,
      done: list.filter((s) => s.tab === 'นำส่งสำเร็จ').length,
      problem: list.filter((s) => s.tab === 'มีปัญหา').length,
    }),
    [list],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 pb-3 pt-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">ติดตามพัสดุ</h1>
            <p className="text-sm text-muted-foreground">EMS / Kerry / Flash / J&amp;T แบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-muted-foreground">
            <Search className="size-4" />
            <span className="text-sm">ค้นหาเลขพัสดุ / ออเดอร์…</span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="พัสดุทั้งหมด" value={stats.total} Icon={Package} tint="#FFF1E6" color="#FF6700" />
          <Stat label="กำลังนำส่ง" value={stats.transit} Icon={Truck} tint="#FFF1E6" color="#E25600" />
          <Stat label="นำส่งสำเร็จ" value={stats.done} Icon={CircleCheckBig} tint="#ECFDF5" color="#059669" />
          <Stat label="มีปัญหา" value={stats.problem} Icon={TriangleAlert} tint="#FEF2F2" color="#DC2626" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-[340px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card md:flex">
          {filtered.map((s) => {
            const active = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={cn(
                  'flex flex-col gap-2 border-b border-l-[3px] border-border px-4 py-3 text-left transition-colors',
                  active ? 'border-l-primary bg-secondary' : 'border-l-transparent hover:bg-muted',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-primary">{s.orderCode}</span>
                  <CarrierBadge carrier={s.carrier} />
                </div>
                <div className="text-sm font-medium">{s.customer}</div>
                <div className="flex items-center justify-between">
                  <StatusPill tab={s.tab} />
                  <span className="text-[11px] text-muted-foreground">{s.updatedAt}</span>
                </div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">{s.trackingNo}</div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">ไม่มีพัสดุในสถานะนี้</div>
          )}
        </aside>

        <Detail s={selected} />
      </div>
    </div>
  );
}
