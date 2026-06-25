'use client';

import { useMemo, useState, useTransition } from 'react';
import { Search, Send, Plus, Phone, MapPin, StickyNote, ShoppingBag } from 'lucide-react';
import { platformMeta, quickReplies, type Conversation, type Platform } from '@/lib/mock-data';
import { cn, formatTHB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { sendMessage } from './actions';

function Avatar({ c, size = 40 }: { c: Conversation; size?: number }) {
  const meta = platformMeta[c.platform];
  const badge = Math.round(size * 0.42);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="flex size-full items-center justify-center rounded-full font-bold text-white" style={{ background: c.avatarBg, fontSize: size * 0.4 }}>
        {c.initial}
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border-2 border-card font-bold text-white" style={{ width: badge, height: badge, background: meta.bg, fontSize: badge * 0.5 }}>
        {meta.mark}
      </span>
      {c.online && <span className="absolute -right-0 top-0 size-3 rounded-full border-2 border-card bg-success" />}
    </div>
  );
}

function ConversationList({ list, selectedId, onSelect }: { list: Conversation[]; selectedId: string; onSelect: (id: string) => void }) {
  const [filter, setFilter] = useState<'ALL' | Platform>('ALL');
  const chips: { key: 'ALL' | Platform; label: string }[] = [
    { key: 'ALL', label: 'ทุกช่องทาง' },
    ...(Object.keys(platformMeta) as Platform[]).map((p) => ({ key: p, label: platformMeta[p].label })),
  ];
  const filtered = filter === 'ALL' ? list : list.filter((c) => c.platform === filter);

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="border-b border-border p-3.5">
        <div className="mb-2.5 font-display text-base font-bold">กล่องข้อความ</div>
        <div className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-muted-foreground">
          <Search className="size-4" />
          <span className="text-sm">ค้นหาลูกค้า…</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button key={chip.key} onClick={() => setFilter(chip.key)} className={cn('rounded-full px-2.5 py-1 text-xs font-semibold transition-colors', filter === chip.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary')}>
              {chip.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((c) => {
          const active = c.id === selectedId;
          return (
            <button key={c.id} onClick={() => onSelect(c.id)} className={cn('flex w-full items-center gap-3 border-l-[3px] px-3.5 py-3 text-left transition-colors', active ? 'border-primary bg-secondary' : 'border-transparent hover:bg-muted')}>
              <Avatar c={c} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{c.name}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{c.lastMessage}</div>
              </div>
              {c.unread > 0 && (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{c.unread}</span>
              )}
            </button>
          );
        })}
        {filtered.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">ยังไม่มีบทสนทนา</div>}
      </div>
    </aside>
  );
}

function ChatThread({ c, onSend }: { c: Conversation | null; onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  if (!c) {
    return <section className="flex flex-1 items-center justify-center bg-muted text-muted-foreground">เลือกบทสนทนาเพื่อเริ่มแชต</section>;
  }
  const meta = platformMeta[c.platform];
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }
  return (
    <section className="flex min-w-0 flex-1 flex-col bg-muted">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
        <Avatar c={c} size={34} />
        <div>
          <div className="text-sm font-semibold">{c.name}</div>
          <div className="text-[11px] font-semibold" style={{ color: c.online ? '#10B981' : '#94A3B8' }}>
            {c.online ? '● ออนไลน์' : '○ ออฟไลน์'} · {meta.label}
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {c.messages.map((m) => (
          <div key={m.id} className={cn('max-w-[72%] rounded-2xl px-3.5 py-2 text-sm', m.from === 'shop' ? 'self-end rounded-br-sm bg-primary text-primary-foreground' : 'self-start rounded-bl-sm border border-border bg-card')}>
            <div>{m.text}</div>
            <div className={cn('mt-1 text-right text-[10px]', m.from === 'shop' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{m.time}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-border bg-card px-3 pt-2.5">
        {quickReplies.map((q) => (
          <button key={q} onClick={() => setText(q)} className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 bg-card p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="พิมพ์ข้อความ…" className="h-10 flex-1 rounded-lg border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <Button type="submit" size="icon" aria-label="ส่ง"><Send /></Button>
      </form>
    </section>
  );
}

function statusStyle(status: string): { bg: string; fg: string } {
  if (status.includes('จัดส่ง') || status.includes('PAID')) return { bg: '#ECFDF5', fg: '#059669' };
  if (status.includes('แพ็ก') || status.includes('PACK')) return { bg: '#EFF6FF', fg: '#2563EB' };
  if (status.includes('สลิป') || status.includes('ชำระ') || status.includes('PENDING')) return { bg: '#FFFBEB', fg: '#D97706' };
  return { bg: '#F1F5F9', fg: '#475569' };
}

function CustomerPanel({ c }: { c: Conversation | null }) {
  if (!c) return null;
  const meta = platformMeta[c.platform];
  return (
    <aside className="hidden w-[300px] shrink-0 flex-col overflow-y-auto border-l border-border bg-card lg:flex">
      <div className="flex flex-col items-center gap-2 border-b border-border p-5 text-center">
        <Avatar c={c} size={56} />
        <div className="font-display text-base font-bold">{c.name}</div>
        <div className="text-xs text-muted-foreground">ลูกค้าผ่าน {meta.label}</div>
      </div>
      <div className="border-b border-border p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">ข้อมูลลูกค้า</div>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-start gap-2.5">
            <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="font-mono">{c.customer.phone}</span>
          </div>
          {c.customer.address && (
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="leading-relaxed">{c.customer.address}</span>
            </div>
          )}
          {c.customer.note && (
            <div className="flex items-start gap-2.5">
              <StickyNote className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>{c.customer.note}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">ประวัติออเดอร์</div>
        <div className="space-y-2.5">
          {c.orders.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">ยังไม่มีออเดอร์</div>
          )}
          {c.orders.map((o) => {
            const s = statusStyle(o.status);
            return (
              <div key={o.code} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">{o.code}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: s.bg, color: s.fg }}>{o.status}</span>
                </div>
                <div className="mt-1 text-sm">{o.title}</div>
                <div className="mt-1 font-mono text-sm font-bold">{formatTHB(o.amount)}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t border-border p-3">
        <Button className="w-full"><Plus /> สร้างออเดอร์</Button>
        <button className="mt-2 flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShoppingBag className="size-3.5" /> ดูประวัติทั้งหมด
        </button>
      </div>
    </aside>
  );
}

export function ChatInbox({ conversations }: { conversations: Conversation[] }) {
  const [convos, setConvos] = useState<Conversation[]>(conversations);
  const [selectedId, setSelectedId] = useState<string>(conversations[0]?.id ?? '');
  const [, startTx] = useTransition();
  const selected = useMemo(() => convos.find((c) => c.id === selectedId) ?? null, [convos, selectedId]);

  function select(id: string) {
    setSelectedId(id);
    setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function send(text: string) {
    if (!selectedId) return;
    const time = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    setConvos((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, lastMessage: text, time: 'เดี๋ยวนี้', messages: [...c.messages, { id: `tmp${Date.now()}`, from: 'shop', text, time }] }
          : c,
      ),
    );
    startTx(() => {
      void sendMessage(selectedId, text);
    });
  }

  return (
    <div className="flex h-full">
      <ConversationList list={convos} selectedId={selectedId} onSelect={select} />
      <ChatThread c={selected} onSend={send} />
      <CustomerPanel c={selected} />
    </div>
  );
}
