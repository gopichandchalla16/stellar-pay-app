'use client';
import { useState } from 'react';
import { Wallet, Shield, Zap, Github, ExternalLink } from 'lucide-react';
import { useWallet } from '@/lib/useWallet';
import WalletCard from '@/components/WalletCard';
import SendPayment from '@/components/SendPayment';
import TransactionHistory from '@/components/TransactionHistory';

export default function Home() {
  const wallet = useWallet();
  const [txRefreshTrigger, setTxRefreshTrigger] = useState(0);

  const handleSend = (dest: string, amount: string, memo?: string) => {
    wallet.sendPayment(dest, amount, memo).then(() => {
      setTxRefreshTrigger(n => n + 1);
    });
  };

  const handleTxReset = () => {
    wallet.resetTx();
    setTxRefreshTrigger(n => n + 1);
  };

  return (
    <div className="mesh-bg min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="StellarPay Logo">
              <circle cx="14" cy="14" r="13" stroke="#14b87e" strokeWidth="1.5" />
              <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="none" stroke="#14b87e" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="14" cy="14" r="3" fill="#14b87e" opacity="0.8" />
              <path d="M14 7 L14 5 M21 14 L23 14 M14 21 L14 23 M7 14 L5 14" stroke="#2ec98a" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-slate-100 text-base tracking-tight">StellarPay</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-[#0b4f37]/60 border border-[#0d7d54]/30 text-[#2ec98a] font-medium">Testnet</span>
          </div>
          <div className="flex items-center gap-3">
            {wallet.publicKey && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2ec98a] animate-pulse-slow" />
                Connected
              </div>
            )}
            <a
              href="https://github.com/gopichandchalla16/stellar-pay-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
            >
              <Github size={13} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {!wallet.publicKey ? (
          <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#0d1a13] border border-[#0e9e6a]/25 flex items-center justify-center card-glow-active">
                  <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="13" stroke="#14b87e" strokeWidth="1.5" />
                    <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="none" stroke="#14b87e" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="14" cy="14" r="3" fill="#14b87e" opacity="0.8" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2ec98a] border-2 border-[#080d0a] animate-pulse-slow" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-3 leading-tight">
              Send XLM on<br />
              <span className="gradient-text">Stellar Testnet</span>
            </h1>
            <p className="text-slate-500 text-base mb-8 max-w-sm mx-auto leading-relaxed">
              Connect your Freighter wallet to check your balance and send XLM transactions on the Stellar testnet.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Wallet, label: 'Freighter Wallet', desc: 'Connect & disconnect' },
                { icon: Zap, label: 'Live Balance', desc: 'Real-time XLM' },
                { icon: Shield, label: 'Secure Signing', desc: 'Non-custodial' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="rounded-xl bg-[#0d1a13]/60 border border-white/5 p-3 text-center">
                  <Icon size={18} className="text-[#14b87e] mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-300">{label}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={wallet.connect}
              disabled={wallet.isConnecting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-[#0e9e6a] hover:bg-[#14b87e] text-white font-semibold text-base transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {wallet.isConnecting ? (
                <><Wallet size={18} className="animate-spin-slow" />Connecting...</>
              ) : (
                <><Wallet size={18} />Connect Freighter Wallet</>
              )}
            </button>
            {wallet.connectError && (
              <p className="mt-4 text-sm text-red-400 animate-fade-in bg-red-950/20 border border-red-900/30 rounded-xl px-4 py-3">
                {wallet.connectError}
                {wallet.connectError.includes('not installed') && (
                  <> &nbsp;<a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="underline text-red-300">Install Freighter</a></>
                )}
              </p>
            )}
            <p className="mt-6 text-xs text-slate-700">This app runs on Stellar Testnet only. No real XLM is used.</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <WalletCard
                publicKey={wallet.publicKey}
                balance={wallet.balance}
                isRefreshing={wallet.isRefreshing}
                fundingLoading={wallet.fundingLoading}
                fundingMsg={wallet.fundingMsg}
                onDisconnect={wallet.disconnect}
                onRefresh={wallet.refreshBalance}
                onFund={wallet.fundAccount}
              />
              <SendPayment
                onSend={handleSend}
                txStatus={wallet.txStatus}
                txResult={wallet.txResult}
                txError={wallet.txError}
                onReset={handleTxReset}
                senderBalance={wallet.balance}
              />
            </div>
            <TransactionHistory
              publicKey={wallet.publicKey}
              refreshTrigger={txRefreshTrigger}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
          <p>StellarPay · Built for <span className="text-[#0d7d54]">Rise In × Stellar Journey to Mastery</span> · Level 1 White Belt</p>
          <div className="flex items-center gap-4">
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 transition-colors flex items-center gap-1">
              Stellar.org <ExternalLink size={10} />
            </a>
            <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 transition-colors flex items-center gap-1">
              Testnet Explorer <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
