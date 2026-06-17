'use client';

import { useState, useEffect, useCallback } from 'react';
import WalletCard from '@/components/WalletCard';
import SendPayment from '@/components/SendPayment';
import TransactionHistory from '@/components/TransactionHistory';
import { StellarIcon } from '@/components/StellarIcon';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTxSuccess = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-stellar-dark">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,180,216,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-stellar-border bg-stellar-card/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StellarIcon />
            <div>
              <h1 className="text-xl font-bold gradient-text">StellarPay</h1>
              <p className="text-xs text-slate-400">Stellar Testnet dApp</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/30 rounded-full px-3 py-1.5">
            <div className="status-dot" />
            <span className="text-xs text-emerald-400 font-medium">Testnet</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Wallet Card always visible */}
        <WalletCard
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          balance={balance}
          setBalance={setBalance}
          refreshTrigger={refreshTrigger}
        />

        {/* Only show dApp features when connected */}
        {walletAddress && (
          <div className="mt-6 animate-fade-in">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-stellar-card rounded-xl border border-stellar-border mb-6">
              {(['send', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {tab === 'send' ? '💸 Send XLM' : '📋 Transaction History'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'send' && (
              <SendPayment
                walletAddress={walletAddress}
                onSuccess={handleTxSuccess}
              />
            )}
            {activeTab === 'history' && (
              <TransactionHistory
                walletAddress={walletAddress}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        )}

        {/* Not connected CTA */}
        {!walletAddress && (
          <div className="mt-10 text-center animate-fade-in">
            <div className="stellar-card rounded-2xl p-10 max-w-md mx-auto">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-xl font-semibold text-slate-200 mb-2">Connect Your Wallet</h2>
              <p className="text-slate-400 text-sm">
                Connect your Freighter wallet above to start sending XLM and exploring the Stellar testnet.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-stellar-border py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500">
          <p>StellarPay · Built on Stellar Testnet · Rise In White Belt Challenge</p>
          <p className="mt-1">
            <a
              href="https://github.com/gopichandchalla16/stellar-pay-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00B4D8] hover:underline"
            >
              github.com/gopichandchalla16/stellar-pay-app
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
