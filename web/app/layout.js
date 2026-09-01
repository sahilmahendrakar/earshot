import { Instrument_Serif, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const display = Instrument_Serif({
  weight: ['400'], style: ['normal','italic'], subsets: ['latin'], variable: '--font-display',
});
const mono = IBM_Plex_Mono({
  weight: ['400','500'], subsets: ['latin'], variable: '--font-mono',
});

export const metadata = {
  title: 'Earshot — reads pages aloud, on your machine',
  description:
    'A browser extension that reads any web page aloud in a natural voice. The speech model runs on your own GPU. Nothing you read is ever uploaded.',
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'Earshot — reads pages aloud, on your machine',
    description: 'The speech model runs in your browser. Nothing you read is ever uploaded.',
    images: ['/icon.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
