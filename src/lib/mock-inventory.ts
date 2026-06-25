// Mock catalog for the Inventory & POS screen. Shape mirrors the Prisma Product model.

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  active: boolean;
  emoji: string;
  tint: string;
};

export const categories = ['ทั้งหมด', 'เสื้อผ้า', 'กระเป๋า', 'เครื่องสำอาง', 'รองเท้า', 'accessories'];

export const products: Product[] = [
  { id: 'p1', sku: 'SHIRT-WH-M', name: 'เสื้อเชิ้ตโอเวอร์ไซส์ สีขาว', category: 'เสื้อผ้า', price: 590, cost: 280, stock: 42, active: true, emoji: '👕', tint: '#EFF6FF' },
  { id: 'p2', sku: 'BAG-CV-01', name: 'กระเป๋าผ้าแคนวาส', category: 'กระเป๋า', price: 890, cost: 420, stock: 8, active: true, emoji: '👜', tint: '#FDF2F8' },
  { id: 'p3', sku: 'COSM-SR-30', name: 'เซรั่มบำรุงผิว 30ml', category: 'เครื่องสำอาง', price: 1290, cost: 650, stock: 0, active: false, emoji: '🧴', tint: '#ECFEFF' },
  { id: 'p4', sku: 'HAT-BK-02', name: 'หมวกบักเก็ต สีดำ', category: 'accessories', price: 350, cost: 150, stock: 124, active: true, emoji: '🧢', tint: '#F1F5F9' },
  { id: 'p5', sku: 'COSM-LIP-12', name: 'ลิปสติก เบอร์ #12', category: 'เครื่องสำอาง', price: 320, cost: 140, stock: 5, active: true, emoji: '💄', tint: '#FCE7F3' },
  { id: 'p6', sku: 'SHOE-SN-40', name: 'รองเท้าผ้าใบ ไซส์ 40', category: 'รองเท้า', price: 1490, cost: 720, stock: 31, active: true, emoji: '👟', tint: '#ECFDF5' },
];

// Display thumbnail (emoji + tint) derived from a product's category.
const CATEGORY_STYLE: Record<string, { emoji: string; tint: string }> = {
  เสื้อผ้า: { emoji: '👕', tint: '#EFF6FF' },
  กระเป๋า: { emoji: '👜', tint: '#FDF2F8' },
  เครื่องสำอาง: { emoji: '🧴', tint: '#ECFEFF' },
  รองเท้า: { emoji: '👟', tint: '#ECFDF5' },
  accessories: { emoji: '🧢', tint: '#F1F5F9' },
};
export function categoryStyle(category: string) {
  return CATEGORY_STYLE[category] ?? { emoji: '📦', tint: '#F1F5F9' };
}

export type StockState = 'in' | 'low' | 'out';

export function stockState(stock: number): StockState {
  if (stock <= 0) return 'out';
  if (stock <= 10) return 'low';
  return 'in';
}

export const stockMeta: Record<StockState, { label: string; dot: string; fg: string }> = {
  in: { label: 'มีสต็อก', dot: '#10B981', fg: '#059669' },
  low: { label: 'เหลือน้อย', dot: '#F59E0B', fg: '#D97706' },
  out: { label: 'หมด', dot: '#EF4444', fg: '#DC2626' },
};
