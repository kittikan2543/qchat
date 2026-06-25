import { loadPrototype } from '@/lib/prototype';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Qchat — Design System',
  description: 'โทนสี ตัวอักษร ปุ่ม แบดจ์ และคอมโพเนนต์หลักของ Qchat',
};

export default async function DesignSystemPage() {
  const { style, body } = await loadPrototype('design-system.html');
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0"
      />
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
