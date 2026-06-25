# Qchat — แพลตฟอร์มแชต + คอมเมิร์ซครบวงจร

เว็บไซต์ดีไซน์ของ Qchat ทำเป็น **ไฟล์ HTML ล้วน** ที่ลิงก์ถึงกันทุกหน้า เปิดใช้งานได้จริง
ไม่ต้อง build ไม่ต้องลงอะไร — ดับเบิลคลิก `index.html` ได้เลย

## วิธีเปิด
- เปิด [index.html](index.html) ในเบราว์เซอร์ → คลิกการ์ดเพื่อเข้าแต่ละหน้า → ทุกหน้ามีปุ่ม **← ภาพรวม** (มุมซ้ายล่าง) กลับมาหน้าแรก
- (ออปชัน) เสิร์ฟแบบโลคัล: `python3 -m http.server` แล้วเปิด `http://localhost:8000`

## หน้าทั้งหมด (8 หน้า ลิงก์ถึงกัน)
| ไฟล์ | หน้า |
| --- | --- |
| [index.html](index.html) | ภาพรวม — การ์ดลิงก์ไปทุกหน้า |
| [landing.html](landing.html) | Landing Page — ฮีโร่ / ฟีเจอร์ / 3 ขั้นตอน / ราคา / รีวิว / footer |
| [chat.html](chat.html) | แชทรวมทุกช่องทาง — Line/FB/IG/TikTok + การ์ดออเดอร์ + ข้อมูลลูกค้า |
| [parcel.html](parcel.html) | ติดตามพัสดุ — EMS/Kerry/Flash/J&T + ไทม์ไลน์สถานะ |
| [inventory.html](inventory.html) | จัดการสินค้า & POS — ตารางสต็อก + แผง POS |
| [team.html](team.html) | จัดการทีม & สิทธิ์ — รายชื่อสมาชิก + บทบาท |
| [checkout.html](checkout.html) | ชำระเงิน — สรุปคำสั่งซื้อ + บัตร/พร้อมเพย์/โอน |
| [design-system.html](design-system.html) | Design System — สี ตัวอักษร ปุ่ม แบดจ์ คอมโพเนนต์ |

## ชุดสี (Palette)
สีหลัก **Pumpkin Spice `#FF6700`**

| บทบาท | สี |
| --- | --- |
| Primary / แบรนด์ | `#FF6700` (Pumpkin Spice) · gradient `#FF8A3D → #FF6700` |
| Accent — Cool Sky | `#48ACF0` |
| Accent — Amethyst Smoke | `#A67DB8` |
| Dark surface — Twilight Indigo | `#1D3461` (แถบเมนูเข้ม) |
| Neutral — Dust Grey | `#D3D0CB` |
| Success / Warning / Danger | `#10B981` / `#F59E0B` / `#EF4444` |

> สีแบรนด์ของแพลตฟอร์มจริง (Line เขียว, Messenger น้ำเงิน, IG, TikTok, Shopee ฯลฯ) และสีสถานะ
> ยังคงไว้ตามเดิม — เปลี่ยนเฉพาะโทนแบรนด์ Qchat เป็นส้ม `#FF6700`

## ฟอนต์ & ไอคอน
- **ฟอนต์:** Plus Jakarta Sans (หัวข้อ) · Inter + IBM Plex Sans Thai (เนื้อหา) · JetBrains Mono (ตัวเลข/โค้ด) — โหลดจาก Google Fonts
- **ไอคอน:** Google **Material Symbols (Rounded)** ทุกหน้า (class `.msr`) แทนที่อีโมจิเดิม
  - คงไว้: โลโก้แบรนด์ (Line/FB/IG/TikTok/Shopee, VISA/Mastercard/PromptPay), ธงชาติ 🇹🇭, จุดสถานะ, ดาวรีวิว ★ และอีโมจิที่เป็นเนื้อหา (รูปสินค้า/ข้อความแชต)

## หมายเหตุ
- หน้า `chat` / `inventory` / `team` / `checkout` แสดง **สถานะเริ่มต้น** ตามดีไซน์ต้นฉบับ (เช่น checkout แสดงฟอร์มบัตร, team แสดงแท็บสมาชิก) — สลับสถานะอื่นเพิ่มได้ถ้าต้องการ
- ไฟล์ดีไซน์ต้นฉบับ (`.dc.html`) อยู่ใน [mockup/](mockup/)
# qchat
