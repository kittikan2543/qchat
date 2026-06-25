// Mock data for the Team & Roles screen. Mirrors Prisma Membership/Role.
import type { Platform } from '@/lib/mock-data';

export type TeamRole = 'OWNER' | 'ADMIN' | 'STAFF';

export const roleMeta: Record<TeamRole, { th: string; en: string; bg: string; fg: string }> = {
  OWNER: { th: 'เจ้าของ', en: 'Owner', bg: '#FFF1E6', fg: '#E25600' },
  ADMIN: { th: 'แอดมิน', en: 'Admin', bg: '#EFF6FF', fg: '#2563EB' },
  STAFF: { th: 'พนักงาน', en: 'Staff', bg: '#F1F5F9', fg: '#475569' },
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  initial: string;
  avatarBg: string;
  channels: Platform[];
  online: boolean;
  lastActive: string;
};

export const members: Member[] = [
  { id: 'u1', name: 'คุณปนัดดา วงศ์ทอง', email: 'panadda@pangcloset.com', role: 'OWNER', initial: 'ป', avatarBg: 'linear-gradient(135deg,#FF8A3D,#FF6700)', channels: ['LINE', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK'], online: true, lastActive: 'ใช้งานอยู่' },
  { id: 'u2', name: 'คุณธนกร ศรีสุข', email: 'thanakorn@pangcloset.com', role: 'ADMIN', initial: 'ธ', avatarBg: 'linear-gradient(135deg,#93C5FD,#3B82F6)', channels: ['LINE', 'FACEBOOK'], online: true, lastActive: 'ใช้งานอยู่' },
  { id: 'u3', name: 'คุณมนัสนันท์ ดีงาม', email: 'manasnan@pangcloset.com', role: 'ADMIN', initial: 'ม', avatarBg: 'linear-gradient(135deg,#FBCFE8,#F472B6)', channels: ['INSTAGRAM', 'TIKTOK'], online: false, lastActive: 'active 2 ชม.' },
  { id: 'u4', name: 'คุณวีรพล จันทร์', email: 'weerapol@pangcloset.com', role: 'STAFF', initial: 'ว', avatarBg: 'linear-gradient(135deg,#6EE7B7,#34D399)', channels: ['LINE'], online: true, lastActive: 'ใช้งานอยู่' },
];

export const roleCards: { role: TeamRole; desc: string; count: number }[] = [
  { role: 'OWNER', desc: 'สิทธิ์สูงสุด เข้าถึงทุกฟังก์ชัน จัดการการเงินและสมาชิกได้ทั้งหมด', count: 1 },
  { role: 'ADMIN', desc: 'จัดการแชท สต็อก พัสดุ และดูรายงานได้ แต่ไม่สามารถตั้งค่าระบบหลัก', count: 2 },
  { role: 'STAFF', desc: 'ตอบแชทและดูรายงานพื้นฐานในช่องทางที่ได้รับมอบหมายเท่านั้น', count: 1 },
];

export const permissions: { label: string; owner: boolean; admin: boolean; staff: boolean }[] = [
  { label: 'ดูแชท', owner: true, admin: true, staff: true },
  { label: 'ตอบแชท', owner: true, admin: true, staff: true },
  { label: 'จัดการสต็อก', owner: true, admin: true, staff: false },
  { label: 'ดูรายงาน', owner: true, admin: true, staff: true },
  { label: 'จัดการการเงิน', owner: true, admin: false, staff: false },
  { label: 'จัดการสมาชิก', owner: true, admin: false, staff: false },
  { label: 'ตั้งค่าระบบ', owner: true, admin: false, staff: false },
];

export const pendingInvites: { email: string; role: TeamRole; sent: string }[] = [
  { email: 'siriporn.k@gmail.com', role: 'STAFF', sent: '2 ชม. ที่แล้ว' },
  { email: 'newadmin@pangcloset.com', role: 'ADMIN', sent: 'เมื่อวาน' },
];

export const activityLog: { who: string; action: string; time: string; icon: string }[] = [
  { who: 'คุณปนัดดา', action: 'เปลี่ยนบทบาท คุณธนกร เป็น แอดมิน', time: 'วันนี้ 09:42', icon: 'key' },
  { who: 'คุณธนกร', action: 'เข้าสู่ระบบจากอุปกรณ์ใหม่', time: 'วันนี้ 08:15', icon: 'lock_open' },
  { who: 'คุณปนัดดา', action: 'ส่งคำเชิญถึง siriporn.k@gmail.com', time: 'เมื่อวาน 17:30', icon: 'mail' },
  { who: 'คุณมนัสนันท์', action: 'อัปเดตการตั้งค่าการแจ้งเตือน', time: 'เมื่อวาน 14:02', icon: 'settings' },
];

export const assignChannels: { platform: Platform; checked: boolean }[] = [
  { platform: 'LINE', checked: true },
  { platform: 'FACEBOOK', checked: true },
  { platform: 'INSTAGRAM', checked: false },
  { platform: 'TIKTOK', checked: false },
];
