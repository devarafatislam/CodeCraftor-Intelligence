import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/modules/auth/AuthContext';
import { Toaster } from '@/components/Toaster';

export const metadata: Metadata = {
  title: 'CodeCraftor Client AI',
  description: 'AI-assisted client acquisition operating system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
