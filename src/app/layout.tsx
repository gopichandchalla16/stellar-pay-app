import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StellarPay - Stellar Testnet dApp',
  description: 'A Stellar dApp for sending XLM, checking balances, and viewing transactions on testnet. Built for the Rise In White Belt challenge.',
  keywords: ['Stellar', 'XLM', 'dApp', 'blockchain', 'testnet', 'Freighter'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-stellar-dark antialiased">{children}</body>
    </html>
  );
}
