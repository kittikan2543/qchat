import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

const enabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {enabled ? (
        <SignIn />
      ) : (
        <div className="max-w-sm text-center">
          <div className="mb-2 font-display text-xl font-bold">โหมด demo</div>
          <p className="mb-4 text-sm text-muted-foreground">
            ยังไม่ได้ตั้งค่า Clerk — ใส่คีย์ใน <code className="font-mono">.env.local</code> เพื่อเปิดระบบล็อกอิน
          </p>
          <Link href="/" className="text-sm font-semibold text-primary">← กลับหน้าหลัก</Link>
        </div>
      )}
    </div>
  );
}
