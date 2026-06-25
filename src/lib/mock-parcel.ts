// Mock data for the Parcel Tracking screen. Mirrors the Prisma Shipment model.

export type Carrier = 'THAILAND_POST' | 'KERRY' | 'FLASH' | 'JT';

export const carrierMeta: Record<Carrier, { label: string; short: string; bg: string; fg: string }> = {
  THAILAND_POST: { label: 'EMS · ไปรษณีย์ไทย', short: 'EMS', bg: '#E2231A', fg: '#ffffff' },
  KERRY: { label: 'Kerry Express', short: 'K', bg: '#F37021', fg: '#ffffff' },
  FLASH: { label: 'Flash Express', short: 'F', bg: '#FCD200', fg: '#1A1A1A' },
  JT: { label: 'J&T Express', short: 'J&T', bg: '#D2232A', fg: '#ffffff' },
};

// Tab buckets / display status.
export type ShipTab = 'รอเข้ารับ' | 'กำลังนำส่ง' | 'นำส่งสำเร็จ' | 'มีปัญหา';

export const tabMeta: Record<ShipTab, { bg: string; fg: string; dot: string }> = {
  รอเข้ารับ: { bg: '#FFFBEB', fg: '#D97706', dot: '#F59E0B' },
  กำลังนำส่ง: { bg: '#FFF1E6', fg: '#E25600', dot: '#FF6700' },
  นำส่งสำเร็จ: { bg: '#ECFDF5', fg: '#059669', dot: '#10B981' },
  มีปัญหา: { bg: '#FEF2F2', fg: '#DC2626', dot: '#EF4444' },
};

// Canonical timeline steps; `current` is the index reached.
export const stepTitles = [
  'รับออเดอร์เข้าระบบ',
  'ผู้ขายเตรียมพัสดุ',
  'เข้ารับพัสดุแล้ว',
  'ถึงศูนย์คัดแยก',
  'กำลังนำส่ง',
  'นำส่งสำเร็จ',
];

export type Shipment = {
  id: string;
  orderCode: string;
  customer: string;
  carrier: Carrier;
  trackingNo: string;
  tab: ShipTab;
  current: number; // index into stepTitles
  hub: string;
  city: string;
  eta: string;
  updatedAt: string;
};

export const shipments: Shipment[] = [
  { id: 's1', orderCode: '#1042', customer: 'คุณสมหญิง', carrier: 'THAILAND_POST', trackingNo: 'EH123456789TH', tab: 'กำลังนำส่ง', current: 4, hub: 'ศูนย์ฯ หลักสี่', city: 'กรุงเทพฯ', eta: 'วันนี้ 18:00', updatedAt: '12 นาทีที่แล้ว' },
  { id: 's2', orderCode: '#1031', customer: 'Nattapong K.', carrier: 'KERRY', trackingNo: 'KEX0098123456', tab: 'นำส่งสำเร็จ', current: 5, hub: 'ศูนย์ฯ เชียงใหม่', city: 'เชียงใหม่', eta: 'ส่งแล้ว', updatedAt: 'เมื่อวาน 09:20' },
  { id: 's3', orderCode: '#1040', customer: 'mild_shopaholic', carrier: 'FLASH', trackingNo: 'TH40071234567', tab: 'กำลังนำส่ง', current: 3, hub: 'ศูนย์ฯ ห้วยขวาง', city: 'กรุงเทพฯ', eta: 'พรุ่งนี้', updatedAt: '1 ชม. ที่แล้ว' },
  { id: 's4', orderCode: '#1038', customer: 'คุณวีรพล', carrier: 'JT', trackingNo: 'JT8800123456', tab: 'รอเข้ารับ', current: 1, hub: '-', city: 'ขอนแก่น', eta: 'รอเข้ารับ', updatedAt: '3 ชม. ที่แล้ว' },
  { id: 's5', orderCode: '#1035', customer: 'คุณธนกร', carrier: 'THAILAND_POST', trackingNo: 'EH998877665TH', tab: 'มีปัญหา', current: 3, hub: 'ศูนย์ฯ พิษณุโลก', city: 'พิษณุโลก', eta: 'ติดต่อขนส่ง', updatedAt: '5 ชม. ที่แล้ว' },
  { id: 's6', orderCode: '#1015', customer: 'Beam Cosmetics', carrier: 'KERRY', trackingNo: 'KEX0098555111', tab: 'กำลังนำส่ง', current: 2, hub: 'ศูนย์ฯ พระราม 3', city: 'กรุงเทพฯ', eta: 'พรุ่งนี้', updatedAt: '2 ชม. ที่แล้ว' },
];
