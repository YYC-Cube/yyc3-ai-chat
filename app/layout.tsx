import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Providers } from './providers';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YYC³ AI · yyc3-ai-programming',
  description: 'YYC³ AI Programming Workspace',
  generator: 'yyc3-ai-programming',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'),
  icons: {
    icon: '/yyc3-logo-blue.png',
    shortcut: '/yyc3-logo-blue.png',
    apple: '/yyc3-logo-blue.png',
  },
  openGraph: {
    title: 'YYC³ AI · yyc3-ai-programming',
    description: 'AI Chat · 架构健康监控 · 文档与测试完备',
    url: 'https://example.com',
    siteName: 'YYC³ AI',
    images: [{ url: '/Git-Nexus.png', alt: 'YanYu Cloud³ — Nexus Expansion' }],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YYC³ AI · yyc3-ai-programming',
    description: 'AI Chat · 架构健康监控 · 文档与测试完备',
    images: ['/Git-Nexus.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
