'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  Package,
  Banknote,
  TriangleAlert,
  Ban,
  Search,
  Plus,
  Minus,
  Trash2,
  Save,
  X,
  ImageIcon,
  ShoppingCart,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { categories, categoryStyle, stockState, stockMeta } from '@/lib/mock-inventory';
import { cn, formatTHB } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toggleProductActive, createProduct, saveSale } from './actions';

export type Row = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  active: boolean;
};
type CartLine = { product: Row; qty: number };

function Stat({ label, value, Icon, tint, color }: { label: string; value: string; Icon: LucideIcon; tint: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: tint, color }}>
          <Icon className="size-[18px]" />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="font-mono text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</div>
    </div>
  );
}

function PosPanel({ cart, onInc, onDec, onRemove, onSave, saving }: {
  cart: CartLine[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const subtotal = cart.reduce((s, l) => s + l.product.price * l.qty, 0);
  return (
    <aside className="hidden w-[340px] shrink-0 flex-col border-l border-border bg-card lg:flex">
      <div className="flex items-center gap-2.5 border-b border-border p-4">
        <div className="flex size-9 items-center justify-center rounded-lg" style={{ background: 'var(--brand-gradient)' }}>
          <ShoppingCart className="size-[18px] text-white" />
        </div>
        <div>
          <div className="font-display text-sm font-bold">ขายหน้าร้าน</div>
          <div className="text-xs text-muted-foreground">POS · Quick Sale</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {cart.length === 0 ? (
          <div className="mt-10 text-center text-sm text-muted-foreground">ตะกร้ายังว่าง — กด “ขาย” ที่สินค้า</div>
        ) : (
          <div className="space-y-2">
            {cart.map((l) => (
              <div key={l.product.id} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5">
                <div className="flex size-9 items-center justify-center rounded-md text-lg" style={{ background: categoryStyle(l.product.category).tint }}>
                  {categoryStyle(l.product.category).emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{l.product.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{formatTHB(l.product.price)}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onDec(l.product.id)} className="flex size-6 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"><Minus className="size-3.5" /></button>
                  <span className="w-5 text-center font-mono text-sm font-semibold">{l.qty}</span>
                  <button onClick={() => onInc(l.product.id)} className="flex size-6 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"><Plus className="size-3.5" /></button>
                  <button onClick={() => onRemove(l.product.id)} className="ml-1 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-border p-4">
        <div className="flex items-baseline justify-between">
          <span className="font-bold">รวมทั้งสิ้น</span>
          <span className="font-mono text-xl font-extrabold text-primary">{formatTHB(subtotal)}</span>
        </div>
        <Button className="mt-3 w-full" disabled={cart.length === 0 || saving} onClick={onSave}>
          {saving ? <Loader2 className="animate-spin" /> : <Save />} บันทึกการขาย
        </Button>
      </div>
    </aside>
  );
}

function Field({ label, name, placeholder, type = 'text' }: { label: string; name: string; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold">{label}</span>
      <input name={name} type={type} placeholder={placeholder} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

function AddProductSlideOver({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pending, start] = useTransition();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <form
        action={(fd) => start(async () => { await createProduct(fd); onClose(); })}
        className="relative flex w-full max-w-[440px] flex-col bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <div className="font-display text-base font-bold">เพิ่มสินค้าใหม่</div>
            <div className="text-xs text-muted-foreground">กรอกรายละเอียดเพื่อเพิ่มลงคลัง</div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-7 text-muted-foreground">
            <ImageIcon className="size-6" />
            <span className="text-xs">รูปสินค้า (อัปโหลดภายหลัง)</span>
          </div>
          <Field label="ชื่อสินค้า" name="name" placeholder="เช่น เสื้อเชิ้ตโอเวอร์ไซส์" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="SKU" name="sku" placeholder="SHIRT-WH-M" />
            <Field label="หมวดหมู่" name="category" placeholder="เสื้อผ้า" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ราคาขาย (฿)" name="price" type="number" placeholder="590" />
            <Field label="ต้นทุน (฿)" name="cost" type="number" placeholder="280" />
          </div>
          <Field label="จำนวนสต็อก" name="stock" type="number" placeholder="0" />
        </div>
        <div className="flex gap-3 border-t border-border p-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>ยกเลิก</Button>
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />} บันทึกสินค้า
          </Button>
        </div>
      </form>
    </div>
  );
}

export function InventoryClient({ products }: { products: Row[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cat, setCat] = useState('ทั้งหมด');
  const [slideOpen, setSlideOpen] = useState(false);
  const [pending, start] = useTransition();

  const filtered = useMemo(
    () => (cat === 'ทั้งหมด' ? products : products.filter((p) => p.category === cat)),
    [products, cat],
  );
  const stats = useMemo(() => {
    const value = products.reduce((s, p) => s + p.cost * p.stock, 0);
    return {
      total: products.length,
      value,
      low: products.filter((p) => stockState(p.stock) === 'low').length,
      out: products.filter((p) => stockState(p.stock) === 'out').length,
    };
  }, [products]);

  const addToCart = (p: Row) =>
    setCart((prev) => {
      const f = prev.find((l) => l.product.id === p.id);
      return f ? prev.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { product: p, qty: 1 }];
    });
  const inc = (id: string) => setCart((prev) => prev.map((l) => (l.product.id === id ? { ...l, qty: l.qty + 1 } : l)));
  const dec = (id: string) => setCart((prev) => prev.flatMap((l) => (l.product.id === id ? (l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []) : [l])));
  const remove = (id: string) => setCart((prev) => prev.filter((l) => l.product.id !== id));
  const save = () => start(async () => { await saveSale(cart.map((l) => ({ id: l.product.id, qty: l.qty }))); setCart([]); });

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">จัดการสินค้าและสต็อก</h1>
            <p className="text-sm text-muted-foreground">ข้อมูลจริงจากฐานข้อมูล · กดแล้วบันทึกถาวร</p>
          </div>
          <Button onClick={() => setSlideOpen(true)}><Plus /> เพิ่มสินค้า</Button>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <Stat label="สินค้าทั้งหมด" value={String(stats.total)} Icon={Package} tint="#FFF1E6" color="#FF6700" />
          <Stat label="มูลค่าสต็อก (ทุน)" value={formatTHB(stats.value)} Icon={Banknote} tint="#ECFDF5" color="#059669" />
          <Stat label="ใกล้หมด" value={String(stats.low)} Icon={TriangleAlert} tint="#FFFBEB" color="#D97706" />
          <Stat label="หมดสต็อก" value={String(stats.out)} Icon={Ban} tint="#FEF2F2" color="#DC2626" />
        </div>

        <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-muted-foreground">
            <Search className="size-4" /><span className="text-sm">ค้นหาสินค้า / SKU…</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors', cat === c ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted')}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-opacity', pending && 'opacity-60')}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-semibold">สินค้า</th>
                <th className="px-4 py-3 font-semibold">หมวดหมู่</th>
                <th className="px-4 py-3 font-semibold">ราคาขาย</th>
                <th className="px-4 py-3 font-semibold">คงเหลือ</th>
                <th className="px-4 py-3 font-semibold">สถานะ</th>
                <th className="px-4 py-3 text-right font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const st = stockMeta[stockState(p.stock)];
                const thumb = categoryStyle(p.category);
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg text-xl" style={{ background: thumb.tint }}>{thumb.emoji}</div>
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="font-mono text-xs text-muted-foreground">{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{p.category || '—'}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">{formatTHB(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: st.dot }} />
                        <span className="font-mono font-semibold">{p.stock}</span>
                        <span className="text-xs" style={{ color: st.fg }}>{stockState(p.stock) !== 'in' ? st.label : ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => start(() => toggleProductActive(p.id))}
                        className={cn('relative h-6 w-11 rounded-full transition-colors', p.active ? 'bg-primary' : 'bg-muted-foreground/30')}
                        aria-label="สลับสถานะ"
                      >
                        <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', p.active ? 'left-[22px]' : 'left-0.5')} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant={p.stock > 0 ? 'secondary' : 'ghost'} disabled={p.stock <= 0} onClick={() => addToCart(p)}>
                        <Plus /> ขาย
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <PosPanel cart={cart} onInc={inc} onDec={dec} onRemove={remove} onSave={save} saving={pending} />
      <AddProductSlideOver open={slideOpen} onClose={() => setSlideOpen(false)} />
    </div>
  );
}
