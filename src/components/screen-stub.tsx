import Link from 'next/link';
import { ArrowLeft, ExternalLink, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScreenStub({ title, prototype }: { title: string; prototype?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div
          className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl text-white"
          style={{ background: 'var(--brand-gradient)', boxShadow: '0 8px 20px rgba(255,103,0,.35)' }}
        >
          <Hammer className="size-7" />
        </div>
        <h1 className="mb-2 font-display text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          หน้าจอจริงกำลังพอร์ตจากดีไซน์ต้นฉบับ — ดูตัวอย่าง prototype ได้เลย
        </p>
        <div className="flex items-center justify-center gap-3">
          {prototype && (
            <a href={`/prototype/${prototype}`} target="_blank" rel="noreferrer">
              <Button variant="outline">
                <ExternalLink /> ดู prototype
              </Button>
            </a>
          )}
          <Link href="/">
            <Button>
              <ArrowLeft /> กลับหน้าหลัก
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
