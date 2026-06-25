# Qchat — แพลตฟอร์มแชต + คอมเมิร์ซครบวงจร

แอปจริง (Next.js) ของ Qchat — รวมแชต Line/FB/IG/TikTok + ระบบสต็อก/POS, ติดตามพัสดุ, และรับชำระเงิน ในที่เดียว
สำหรับร้านค้าออนไลน์ไทย 🇹🇭

> ดีไซน์ต้นฉบับ (static HTML 8 หน้า) อยู่ใน [`prototype/`](prototype/) — เปิดในแอปได้ที่ `/prototype/index.html`

## Stack
| ชั้น | เทคโนโลยี |
| --- | --- |
| App (FE+BE) | **Next.js 15** (App Router · RSC · Server Actions) + TypeScript |
| UI | Tailwind v4 + shadcn/ui + lucide-react · ฟอนต์ Plus Jakarta Sans / Inter / IBM Plex Sans Thai / JetBrains Mono (next/font) |
| Database | **PostgreSQL (Neon)** + **Prisma** |
| Auth + RBAC | **Clerk** (เจ้าของ/แอดมิน/พนักงาน) |
| Realtime | **Pusher** Channels |
| Queue/Jobs | **Upstash QStash** + Vercel Cron |
| Cache/KV | Upstash Redis · **Storage:** Vercel Blob |
| Channels (v1) | **LINE Messaging API** (webhook → QStash → consumer) |
| Payments | PromptPay QR + EasySlip + บัตร (Omise/Stripe) |
| Deploy | **Vercel** (+ Neon/Upstash/Blob) |

ทุก integration ออกแบบเป็น **opt-in** — ถ้ายังไม่ใส่ env ตัวไหน แอปก็ยัง `dev`/`build` และเปิดหน้าจอได้ (ฟีเจอร์นั้นจะปิดไว้)

## เริ่มใช้งาน
```bash
pnpm install
cp .env.example .env.local     # ใส่ค่าตามบริการที่จะเปิด (ดูด้านล่าง)
pnpm dev                       # http://localhost:3000
```

### เปิดทีละบริการ (ใส่ค่าใน .env.local)
- **DB:** ตั้ง `DATABASE_URL`/`DIRECT_URL` ใน `.env` (Neon **หรือ** local Postgres เช่น `postgresql://USER@localhost:5432/qchat`) → `pnpm db:push` → `pnpm db:seed` (สร้างร้าน demo + สินค้า/แชต) → `pnpm db:studio`. **Inventory ใช้ DB จริงแล้ว** (อ่าน/เพิ่ม/toggle/บันทึกการขาย ผ่าน Server Actions)
- **Auth (Clerk):** ใส่ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` → เปิดล็อกอิน (`/sign-in`, `/sign-up`), ป้องกัน route แอป, และ sync ผู้ใช้→ร้าน/สมาชิกใน DB อัตโนมัติ · เว้นว่าง = โหมด demo (ใช้ร้าน `demo`, ทุกหน้าเปิดได้)
- **Realtime:** `PUSHER_*` + `NEXT_PUBLIC_PUSHER_*`
- **Queue/Cache:** `QSTASH_*`, `UPSTASH_REDIS_REST_*`
- **Storage:** `BLOB_READ_WRITE_TOKEN`
- **LINE:** `LINE_CHANNEL_ACCESS_TOKEN` + `LINE_CHANNEL_SECRET` → ตั้ง webhook ไปที่ `/api/webhooks/line`

## Scripts
```
pnpm dev | build | start         # Next.js
pnpm typecheck                   # tsc --noEmit
pnpm db:generate | db:push | db:migrate | db:studio | db:seed
```

## โครงสร้าง
```
src/
├─ app/
│  ├─ page.tsx                 # Console (ภาพรวม → ลิงก์ทุกส่วน)
│  ├─ chat|parcel|inventory|team|checkout|landing|design-system/  # หน้าจอ (กำลังพอร์ตจาก prototype)
│  └─ api/
│     ├─ webhooks/line/route.ts # รับ LINE (ตรวจ signature → enqueue/handle)
│     └─ jobs/line-inbound/route.ts # consumer ของ QStash (ตรวจ signature)
├─ components/  (ui/ = shadcn, providers, screen-stub)
└─ lib/         (prisma, clerk[guarded], pusher, qstash, redis, line, blob, utils)
prisma/schema.prisma            # Shop/User/Membership/Role · Channel/Customer/Conversation/Message · Product · Order/OrderItem/Shipment/Payment
prototype/                      # static HTML 8 หน้า (ดีไซน์อ้างอิง)
```

## LINE inbound flow
`LINE → POST /api/webhooks/line` (verify X-Line-Signature) → ถ้ามี QStash: enqueue ไป `/api/jobs/line-inbound` (verify Upstash signature) → `handleLineEvents()` → persist (Prisma) + push (Pusher). ถ้าไม่มี QStash ใน dev จะ process inline ทันที

## สถานะปัจจุบัน (scaffold v0.1)
✅ โครงรันได้ + build ผ่าน + typecheck สะอาด · ✅ Prisma schema ครบ domain · ✅ LINE webhook + QStash consumer · ✅ integration libs (guarded)
🔜 ถัดไป: พอร์ต UI หน้าจอจาก prototype → React, ผูก Prisma เข้ากับ inbound, onboarding ร้าน/เชื่อม LINE, ระบบออเดอร์/สต็อก/ชำระเงิน
