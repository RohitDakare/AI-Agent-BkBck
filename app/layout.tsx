import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ChatPopup from '@/components/ChatPopup';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'College Assistant',
  description: 'AI-powered college assistant chatbot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatPopup />
      </body>
    </html>
  );
}
