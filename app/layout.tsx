import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import { AuthProvider } from '@/app/context/AuthContext';

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
      <body>
        <AuthProvider>
          <Header/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}