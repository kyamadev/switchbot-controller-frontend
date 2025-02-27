import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import { AuthProvider } from '@/app/context/AuthContext';
import CustomThemeProvider from '@/app/theme/ThemeProvider';

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
        <CustomThemeProvider>
          <AuthProvider>
            <Header/>
            {children}
          </AuthProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}