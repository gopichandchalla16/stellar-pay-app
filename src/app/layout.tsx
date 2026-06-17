import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StellarPay — Testnet Payment dApp',
  description: 'Send XLM on Stellar Testnet with Freighter wallet. Level 1 White Belt — Rise In × Stellar Journey to Mastery.',
  keywords: ['Stellar', 'XLM', 'Freighter', 'Testnet', 'dApp', 'Web3'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
