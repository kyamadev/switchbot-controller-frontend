import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'SwitchBot-Controller',
  description: 'Control your devices from PC via SwitchBot API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}