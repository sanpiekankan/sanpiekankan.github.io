import './globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Serif_SC } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VisitorStats from '@/components/VisitorStats';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-sc',
});

export const metadata: Metadata = {
  title: 'Photostory | 光影叙事',
  description: '一个用镜头记录生活的地方。',
};

/**
 * Root layout for the application.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props for the layout.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerifSC.variable}`}>
      <body className="bg-background text-foreground font-sans">
        <Header />
        <main className="min-h-screen">{children}</main>
        {/* <Footer /> */}
        <VisitorStats />
        // 在body标签内添加：
        // <GoogleAnalytics gaId="G-1E1GX8CQ4M" />
      </body>
    </html>
  );
}