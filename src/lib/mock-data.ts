// Mock data for the Chat Inbox UI. Shapes mirror the Prisma models so swapping
// to real data later is a drop-in (Conversation / Message / Customer / Order).

export type Platform = 'LINE' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK';

export const platformMeta: Record<Platform, { label: string; mark: string; bg: string }> = {
  LINE: { label: 'Line', mark: 'L', bg: '#06C755' },
  FACEBOOK: { label: 'Messenger', mark: 'f', bg: '#1877F2' },
  INSTAGRAM: { label: 'Instagram', mark: '◎', bg: 'linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)' },
  TIKTOK: { label: 'TikTok', mark: '♪', bg: '#111827' },
};

export type ChatMessage = {
  id: string;
  from: 'customer' | 'shop';
  text: string;
  time: string;
};

export type OrderSummary = {
  code: string;
  title: string;
  amount: number;
  status: string;
};

export type Conversation = {
  id: string;
  name: string;
  platform: Platform;
  initial: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  customer: { phone: string; address: string; note?: string };
  orders: OrderSummary[];
  messages: ChatMessage[];
};

export const quickReplies = [
  'สวัสดีค่ะ ยินดีให้บริการนะคะ 😊',
  'สินค้าพร้อมส่งเลยค่ะ',
  'ขอที่อยู่จัดส่งด้วยนะคะ',
  'โอนแล้วแจ้งสลิปได้เลยค่ะ',
  'ขอบคุณที่อุดหนุนค่ะ 🙏',
];

export const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'คุณสมหญิง',
    platform: 'LINE',
    initial: 'ส',
    avatarBg: 'linear-gradient(135deg,#7FC4F5,#48ACF0)',
    lastMessage: 'สนใจเสื้อตัวนี้ค่ะ มีไซส์ M ไหม',
    time: '2 นาที',
    unread: 2,
    online: true,
    customer: { phone: '081-234-5678', address: '88/12 ถ.สุขุมวิท คลองเตย กทม. 10110', note: 'ลูกค้าประจำ' },
    orders: [
      { code: '#1042', title: 'เสื้อเชิ้ตโอเวอร์ไซส์ ×1', amount: 590, status: 'รอชำระเงิน' },
      { code: '#0988', title: 'กระเป๋าผ้า ×1', amount: 320, status: 'จัดส่งแล้ว' },
    ],
    messages: [
      { id: 'm1', from: 'customer', text: 'สวัสดีค่ะ', time: '14:01' },
      { id: 'm2', from: 'customer', text: 'สนใจเสื้อตัวนี้ค่ะ มีไซส์ M ไหม', time: '14:02' },
      { id: 'm3', from: 'shop', text: 'มีค่ะ พร้อมส่งเลยนะคะ 😊', time: '14:03' },
    ],
  },
  {
    id: 'c2',
    name: 'Nattapong K.',
    platform: 'FACEBOOK',
    initial: 'N',
    avatarBg: 'linear-gradient(135deg,#93C5FD,#3B82F6)',
    lastMessage: 'ขอบคุณครับ ได้รับของแล้ว',
    time: '18 นาที',
    unread: 0,
    online: false,
    customer: { phone: '089-555-0199', address: '5 หมู่ 3 ต.สุเทพ อ.เมือง เชียงใหม่ 50200' },
    orders: [{ code: '#1031', title: 'หมวกบักเก็ต ×2', amount: 700, status: 'จัดส่งแล้ว' }],
    messages: [
      { id: 'm1', from: 'shop', text: 'จัดส่งเรียบร้อยแล้วนะครับ เลขพัสดุ TH123456', time: 'เมื่อวาน' },
      { id: 'm2', from: 'customer', text: 'ขอบคุณครับ ได้รับของแล้ว', time: '08:30' },
    ],
  },
  {
    id: 'c3',
    name: 'mild_shopaholic',
    platform: 'INSTAGRAM',
    initial: 'm',
    avatarBg: 'linear-gradient(135deg,#FBCFE8,#F472B6)',
    lastMessage: 'โอนแล้วนะคะ 🙏',
    time: '1 ชม.',
    unread: 5,
    online: true,
    customer: { phone: '062-777-1234', address: '120/4 ถ.พระราม 9 ห้วยขวาง กทม. 10310' },
    orders: [{ code: '#1040', title: 'ลิปสติก ×2', amount: 640, status: 'รอตรวจสลิป' }],
    messages: [
      { id: 'm1', from: 'customer', text: 'รับลิปสี #03 สองแท่งค่ะ', time: '13:10' },
      { id: 'm2', from: 'shop', text: 'รวม 640 บาทค่ะ โอนพร้อมเพย์ได้เลยนะคะ', time: '13:12' },
      { id: 'm3', from: 'customer', text: 'โอนแล้วนะคะ 🙏', time: '13:20' },
    ],
  },
  {
    id: 'c4',
    name: 'tiktok_buyer_99',
    platform: 'TIKTOK',
    initial: 't',
    avatarBg: 'linear-gradient(135deg,#C4B5FD,#A78BFA)',
    lastMessage: 'สินค้าในไลฟ์ยังมีไหมคะ',
    time: '3 ชม.',
    unread: 1,
    online: true,
    customer: { phone: '094-321-8888', address: '9 ซ.ลาดพร้าว 71 วังทองหลาง กทม. 10310' },
    orders: [],
    messages: [
      { id: 'm1', from: 'customer', text: 'สินค้าในไลฟ์ยังมีไหมคะ', time: '11:45' },
    ],
  },
  {
    id: 'c5',
    name: 'Beam Cosmetics',
    platform: 'LINE',
    initial: 'B',
    avatarBg: 'linear-gradient(135deg,#6EE7B7,#34D399)',
    lastMessage: 'รบกวนสรุปยอดออเดอร์รอบนี้ด้วยนะคะ',
    time: 'เมื่อวาน',
    unread: 0,
    online: false,
    customer: { phone: '02-111-2222', address: 'ร้าน Beam ชั้น 2 เซ็นทรัลพระราม 3', note: 'ขายส่ง' },
    orders: [{ code: '#1015', title: 'เซ็ตเครื่องสำอาง ×10', amount: 8900, status: 'กำลังแพ็ก' }],
    messages: [
      { id: 'm1', from: 'customer', text: 'รบกวนสรุปยอดออเดอร์รอบนี้ด้วยนะคะ', time: 'เมื่อวาน' },
    ],
  },
];
