'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  QrCode,
  Landmark,
  Check,
  Copy,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { cn, formatTHB } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Method = 'card' | 'promptpay' | 'bank';
const METHODS: { key: Method; label: string; Icon: LucideIcon }[] = [
  { key: 'card', label: 'บัตรเครดิต/เดบิต', Icon: CreditCard },
  { key: 'promptpay', label: 'พร้อมเพย์ / QR', Icon: QrCode },
  { key: 'bank', label: 'โอนผ่านธนาคาร', Icon: Landmark },
];

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={cn('flex justify-between', muted && 'text-muted-foreground')}>
      <span className={strong ? 'font-bold' : ''}>{label}</span>
      <span className={cn('font-mono', strong && 'font-bold')}>{value}</span>
    </div>
  );
}

function Field({ label, placeholder, defaultValue, className }: { label: string; placeholder?: string; defaultValue?: string; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-xs font-semibold">{label}</span>
      <input
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

export default function CheckoutPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [method, setMethod] = useState<Method>('card');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const monthly = 990;
  const yearlyBase = monthly * 12;
  const discount = billing === 'yearly' ? Math.round(yearlyBase * 0.2) : 0;
  const subtotal = billing === 'yearly' ? yearlyBase - discount : monthly;
  const vat = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  function copyAcct() {
    navigator.clipboard?.writeText('123-4-56789-0').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-3 border-b border-border bg-card px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg font-display text-base font-extrabold text-white" style={{ background: 'var(--brand-gradient)' }}>Q</span>
          <span className="font-display text-lg font-extrabold">Qchat</span>
        </Link>
        <span className="h-5 w-px bg-border" />
        <span className="text-sm text-muted-foreground">ชำระเงินเพื่อสมัครแพ็กเกจ</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: '#ECFDF5', color: '#059669' }}>
          <ShieldCheck className="size-3.5" /> ปลอดภัย เข้ารหัส SSL
        </span>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 p-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Order summary */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold">สรุปการสั่งซื้อ</h2>

          <div className="mb-4 flex items-center gap-3 rounded-xl p-4" style={{ background: 'var(--brand-gradient)' }}>
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/20 text-white">
              <CreditCard className="size-5" />
            </div>
            <div className="flex-1 text-white">
              <div className="font-display font-bold">แพ็กเกจ “ธุรกิจ”</div>
              <div className="text-xs text-white/80">ทุกช่องทาง · 5 ผู้ใช้ · POS + สต็อก</div>
            </div>
          </div>

          <div className="mb-4 flex rounded-lg bg-muted p-1 text-sm">
            {(['monthly', 'yearly'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-semibold transition-colors',
                  billing === b ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground',
                )}
              >
                {b === 'monthly' ? 'รายเดือน' : 'รายปี'}
                {b === 'yearly' && (
                  <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ background: '#ECFDF5', color: '#059669' }}>
                    ประหยัด 20%
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <Row label={`ราคาแพ็กเกจ (${billing === 'yearly' ? 'รายปี' : 'รายเดือน'})`} value={formatTHB(billing === 'yearly' ? yearlyBase : monthly)} muted />
            {billing === 'yearly' && <Row label="ส่วนลด 20% (รายปี)" value={`-${formatTHB(discount)}`} muted />}
            <Row label="ยอดหลังหักส่วนลด" value={formatTHB(subtotal)} muted />
            <Row label="VAT 7%" value={formatTHB(vat)} muted />
            <div className="flex items-baseline justify-between border-t border-border pt-3">
              <span className="font-bold">รวมทั้งสิ้น</span>
              <span className="font-mono text-xl font-extrabold text-primary">{formatTHB(total)}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-semibold">มีโค้ดส่วนลด?</div>
            <div className="mt-1.5 flex gap-2">
              <input placeholder="กรอกโค้ดส่วนลด" className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <Button variant="outline" className="bg-foreground text-background hover:opacity-90">ใช้โค้ด</Button>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold">วิธีการชำระเงิน</h2>

          <div className="mb-5 grid grid-cols-3 gap-2.5">
            {METHODS.map(({ key, label, Icon }) => {
              const on = method === key;
              return (
                <button
                  key={key}
                  onClick={() => setMethod(key)}
                  className={cn(
                    'relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors',
                    on ? 'border-primary bg-secondary text-secondary-foreground' : 'border-input text-muted-foreground hover:bg-muted',
                  )}
                >
                  {on && (
                    <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                  <Icon className="size-5" /> {label}
                </button>
              );
            })}
          </div>

          {method === 'card' && (
            <div className="space-y-3">
              <Field label="หมายเลขบัตร" defaultValue="4242 4242 4242 4242" />
              <Field label="ชื่อบนบัตร" defaultValue="SOMYING JAIDEE" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="วันหมดอายุ" defaultValue="08 / 27" />
                <Field label="CVV" placeholder="123" />
              </div>
            </div>
          )}

          {method === 'promptpay' && (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div
                className="size-40 rounded-xl"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg,#0f172a 0 6px,#fff 6px 12px)', opacity: 0.85 }}
              />
              <div className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-bold text-white" style={{ background: '#003D7A' }}>
                PromptPay
              </div>
              <div className="text-sm text-muted-foreground">สแกน QR ด้วยแอปธนาคารเพื่อชำระผ่าน PromptPay</div>
              <div className="font-mono text-sm font-semibold text-destructive">หมดอายุใน 14:58 น.</div>
            </div>
          )}

          {method === 'bank' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border p-4">
                <div className="text-xs text-muted-foreground">ธนาคาร</div>
                <div className="font-semibold">กสิกรไทย (KBank)</div>
                <div className="mt-3 text-xs text-muted-foreground">เลขที่บัญชี</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold">123-4-56789-0</span>
                  <Button variant="outline" size="sm" onClick={copyAcct}>
                    {copied ? <Check /> : <Copy />} {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </Button>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">ชื่อบัญชี</div>
                <div className="font-semibold">บจก. คิวแชท</div>
              </div>
              <p className="text-xs text-muted-foreground">โอนแล้วแนบสลิปในระบบเพื่อยืนยันการชำระเงินอัตโนมัติ</p>
            </div>
          )}

          <Button className="mt-5 w-full" size="lg" onClick={() => setSuccess(true)}>
            <Lock /> ยืนยันการชำระเงิน {formatTHB(total)}
          </Button>

          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono font-bold" style={{ color: '#1A1F71' }}>VISA</span>
            <span className="font-mono font-bold text-destructive">Mastercard</span>
            <span className="font-mono font-bold" style={{ color: '#003D7A' }}>PromptPay</span>
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5" /> ปลอดภัย 100%</span>
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setSuccess(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-card p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-9" />
            </div>
            <div className="font-display text-xl font-extrabold">ชำระเงินสำเร็จ! 🎉</div>
            <p className="mt-2 text-sm text-muted-foreground">
              แพ็กเกจ <b>“ธุรกิจ”</b> เริ่มใช้งานได้ทันที<br />ใบเสร็จส่งไปที่ <b>shop@pangcloset.com</b> แล้ว
            </p>
            <div className="my-4 flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm">
              <span className="text-muted-foreground">ยอดชำระ</span>
              <span className="font-mono text-lg font-extrabold text-primary">{formatTHB(total)}</span>
            </div>
            <Link href="/">
              <Button className="w-full" size="lg">เข้าสู่แดชบอร์ด <ArrowRight /></Button>
            </Link>
            <button onClick={() => setSuccess(false)} className="mt-2 text-xs text-muted-foreground hover:text-foreground">
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
