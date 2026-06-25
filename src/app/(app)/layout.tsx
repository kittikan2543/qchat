import { NavRail } from '@/components/app/nav-rail';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted">
      <NavRail />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
