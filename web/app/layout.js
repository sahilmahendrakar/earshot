import { Spectral, Courier_Prime, Homemade_Apple } from 'next/font/google';
import './globals.css';

const display = Spectral({
  weight: ['300', '400'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-display',
});
const mono = Courier_Prime({
  weight: ['400'], subsets: ['latin'], variable: '--font-mono',
});
const hand = Homemade_Apple({
  weight: ['400'], subsets: ['latin'], variable: '--font-hand',
});

export const metadata = {
  title: 'Chickadee — reads pages aloud, on your machine',
  description:
    'A browser extension that reads any web page aloud in a natural voice. The speech model runs on your own computer. Nothing you read is ever uploaded.',
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'Chickadee — reads pages aloud, on your machine',
    description: 'The speech model runs in your browser. Nothing you read is ever uploaded.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${hand.variable}`}>
      <body>
        <div className="vignette" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
