'use client';

import { useEffect, useState } from 'react';
import {
  Crown,
  Shield,
  User,
  KeyRound,
  Lock,
  Mail,
  Settings,
  MoreHorizontal,
  Check,
  X,
  Plus,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { platformMeta, type Platform } from '@/lib/mock-data';
import {
  members,
  roleMeta,
  roleCards,
  permissions,
  pendingInvites,
  activityLog,
  assignChannels,
  type TeamRole,
} from '@/lib/mock-team';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const roleIcon: Record<TeamRole, LucideIcon> = { OWNER: Crown, ADMIN: Shield, STAFF: User };
const activityIcon: Record<string, LucideIcon> = { key: KeyRound, lock_open: Lock, mail: Mail, settings: Settings };

type Tab = 'members' | 'roles' | 'invites' | 'activity';
const TABS: { key: Tab; label: string; badge?: number }[] = [
  { key: 'members', label: 'สมาชิก' },
  { key: 'roles', label: 'บทบาทและสิทธิ์' },
  { key: 'invites', label: 'คำเชิญที่รอตอบรับ', badge: pendingInvites.length },
  { key: 'activity', label: 'บันทึกกิจกรรม' },
];

function RoleBadge({ role }: { role: TeamRole }) {
  const m = roleMeta[role];
  const Icon = roleIcon[role];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: m.bg, color: m.fg }}>
      <Icon className="size-3.5" /> {m.th}
    </span>
  );
}

function ChannelChip({ p }: { p: Platform }) {
  const m = platformMeta[p];
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      <span className="flex size-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: m.bg }}>
        {m.mark}
      </span>
      {m.label}
    </span>
  );
}

/* ── Tabs content ──────────────────────────────────────────────────── */
function MembersTab() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-semibold">สมาชิก</th>
            <th className="px-4 py-3 font-semibold">บทบาท</th>
            <th className="px-4 py-3 font-semibold">ช่องทางที่ดูแล</th>
            <th className="px-4 py-3 font-semibold">สถานะ</th>
            <th className="px-4 py-3 text-right font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: m.avatarBg }}>
                      {m.initial}
                    </div>
                    {m.online && <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-success" />}
                  </div>
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3"><RoleBadge role={m.role} /></td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {m.channels.map((c) => <ChannelChip key={c} p={c} />)}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs font-semibold" style={{ color: m.online ? '#10B981' : '#94A3B8' }}>
                  {m.online ? '● ออนไลน์' : '○ ออฟไลน์'}
                </div>
                <div className="text-[11px] text-muted-foreground">{m.lastActive}</div>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RolesTab() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {roleCards.map(({ role, desc, count }) => {
          const m = roleMeta[role];
          const Icon = roleIcon[role];
          return (
            <div key={role} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-2.5 flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: m.bg, color: m.fg }}>
                  <Icon className="size-[18px]" />
                </div>
                <div className="font-display font-bold" style={{ color: m.fg }}>
                  {m.th} ({m.en})
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <div className="mt-3 text-xs text-muted-foreground">{count} คน</div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="font-display font-bold">เมทริกซ์สิทธิ์การเข้าถึง</div>
          <span className="text-xs text-muted-foreground">กำหนดสิทธิ์ของแต่ละบทบาท</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-semibold">ความสามารถ</th>
              <th className="px-4 py-2.5 text-center font-semibold">เจ้าของ</th>
              <th className="px-4 py-2.5 text-center font-semibold">แอดมิน</th>
              <th className="px-4 py-2.5 text-center font-semibold">พนักงาน</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p) => (
              <tr key={p.label} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5">{p.label}</td>
                {[p.owner, p.admin, p.staff].map((allowed, i) => (
                  <td key={i} className="px-4 py-2.5 text-center">
                    {allowed ? (
                      <Check className="mx-auto size-4 text-success" />
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvitesTab() {
  return (
    <div className="space-y-3">
      {pendingInvites.map((inv) => (
        <div key={inv.email} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Mail className="size-4" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">{inv.email}</div>
            <div className="text-xs text-muted-foreground">ส่งเมื่อ {inv.sent}</div>
          </div>
          <RoleBadge role={inv.role} />
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: '#FFFBEB', color: '#D97706' }}>
            รอตอบรับ
          </span>
          <Button size="sm" variant="secondary">ส่งอีกครั้ง</Button>
          <Button size="sm" variant="ghost" className="text-destructive">ยกเลิก</Button>
        </div>
      ))}
    </div>
  );
}

function ActivityTab() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {activityLog.map((a, i) => {
        const Icon = activityIcon[a.icon] ?? Settings;
        return (
          <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-0">
            <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Icon className="size-[18px]" />
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <b>{a.who}</b> {a.action}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">{a.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Invite modal ──────────────────────────────────────────────────── */
function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [role, setRole] = useState<TeamRole>('ADMIN');
  const [channels, setChannels] = useState(() => assignChannels.map((c) => ({ ...c })));
  if (!open) return null;

  const toggle = (p: Platform) =>
    setChannels((prev) => prev.map((c) => (c.platform === p ? { ...c, checked: !c.checked } : c)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="font-display text-lg font-bold">เชิญสมาชิกใหม่</div>
            <div className="text-xs text-muted-foreground">ส่งคำเชิญทางอีเมลเพื่อเข้าร่วมทีม</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-semibold">อีเมล</span>
          <input placeholder="name@example.com" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </label>

        <div className="mb-3">
          <span className="mb-1.5 block text-xs font-semibold">บทบาท</span>
          <div className="flex gap-2">
            {(['ADMIN', 'STAFF'] as TeamRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                  role === r ? 'border-primary bg-secondary text-secondary-foreground' : 'border-input text-muted-foreground hover:bg-muted',
                )}
              >
                <RoleBadge role={r} />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <span className="mb-1.5 block text-xs font-semibold">ช่องทางที่มอบหมาย</span>
          <div className="grid grid-cols-2 gap-2">
            {channels.map((c) => {
              const m = platformMeta[c.platform];
              return (
                <button
                  key={c.platform}
                  onClick={() => toggle(c.platform)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                    c.checked ? 'border-primary bg-secondary' : 'border-input hover:bg-muted',
                  )}
                >
                  <span className={cn('flex size-4 items-center justify-center rounded border', c.checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input')}>
                    {c.checked && <Check className="size-3" />}
                  </span>
                  <span className="flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: m.bg }}>{m.mark}</span>
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>ยกเลิก</Button>
          <Button className="flex-1" onClick={onClose}><Mail /> ส่งคำเชิญ</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function TeamPage() {
  const [tab, setTab] = useState<Tab>('members');
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    const h = window.location.hash.replace('#', '');
    if (['members', 'roles', 'invites', 'activity'].includes(h)) setTab(h as Tab);
    if (h === 'invite') setInviteOpen(true);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 pt-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">จัดการสมาชิกในทีม</h1>
            <p className="text-sm text-muted-foreground">จัดการผู้ใช้ บทบาท และสิทธิ์การเข้าถึงระบบของร้าน</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-44 rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">ผู้ใช้งาน</span>
                <span className="font-semibold"><b className="text-primary">4</b> / 5 ที่นั่ง</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-input">
                <div className="h-full rounded-full" style={{ width: '80%', background: 'var(--brand-gradient)' }} />
              </div>
            </div>
            <Button onClick={() => setInviteOpen(true)}><Plus /> เชิญสมาชิก</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors',
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
              {t.badge ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-2 rounded-lg border border-input px-3 py-1.5 text-muted-foreground sm:flex">
            <Search className="size-4" />
            <span className="text-sm">ค้นหาสมาชิก…</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'members' && <MembersTab />}
        {tab === 'roles' && <RolesTab />}
        {tab === 'invites' && <InvitesTab />}
        {tab === 'activity' && <ActivityTab />}
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
