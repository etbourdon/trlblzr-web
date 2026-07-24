import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif, Inter } from 'next/font/google';
import { LocaleProvider } from '@/lib/locale-provider';
import './globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400'],
  style: ['italic', 'normal'],
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TRLBLZR.RUN — Trace ton sentier',
  description:
    "Du trail running en montagne pour dirigeants, avec des athlètes professionnels. On ne pitche pas — on s'aligne.",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${mono.variable} ${serif.variable} ${sans.variable}`}
    >
      <body className="font-sans bg-trail-black text-paper-white">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
