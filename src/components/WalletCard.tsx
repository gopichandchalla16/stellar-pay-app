'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, RefreshCw, Power, Droplets } from 'lucide-react';
import { truncateAddress, formatXLM } from '@/lib/stellar';

interface Props {
  publicKey: string;
  balance: string;
  isRefreshing: boolean;
  fundingLoading: boolean;
  fundingMsg: string;
  onDisconnect: () => void;
  onRefresh: () => void;
  onFund: () => void;
}

export default function WalletCard({ publicKey, balance, isRefreshing, fundingLoading, fundingMsg, onDisconnect, onRefresh, onFund }: Props) {
  const [copied, setCopied] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => { setDisplayBalance(balance); }, [balance]);

  const copyAddress = () => {
    navigator.clipboard.writeText(publicKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card-glow-active rounded-2xl bg-[#0d1a13] border border-[#0e9e6a]/20 p-6 animate-slide-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2ec98a] animate-pulse-slow" />
          <span className="text-xs font-medium text-[#2ec98a] uppercase tracking-widest">Testnet Connected</span>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-950/30"
        >
          <Power size={12} />Disconnect
        </button>
      </div>

      <div className="mb-5">
        <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-widest">XLM Balance</p>
        <div className="flex items-end gap-2">
          {isRefreshing ? (
            <div className="h-10 w-40 rounded-lg animate-shimmer" />
          ) : (
            <span className="text-4xl font-bold font-mono gradient-text animate-count-up" key={displayBalance}>
              {formatXLM(displayBalance)}
            </span>
          )}
          <span className="text-slate-400 font-medium mb-1">XLM</span>
        </div>
        <p className="text-xs text-slate-600 mt-1 font-mono">{parseFloat(displayBalance || '0').toFixed(7)} XLM</p>
      </div>

      <div className="bg-[#0a1410] rounded-xl p-3.5 mb-4 border border-white/5">
        <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-widest">Public Key</p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm text-slate-300 truncate">{truncateAddress(publicKey, 8)}</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={copyAddress} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#14b87e] transition-colors">
              {copied ? <Check size={14} className="text-[#14b87e]" /> : <Copy size={14} />}
            </button>
            <a
              href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#14b87e] transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin-slow' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <button
          onClick={onFund}
          disabled={fundingLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#0e9e6a]/30 text-sm text-[#2ec98a] hover:text-[#14b87e] hover:bg-[#0b4f37]/20 transition-all disabled:opacity-50"
        >
          <Droplets size={14} className={fundingLoading ? 'animate-spin-slow' : ''} />
          {fundingLoading ? 'Funding...' : 'Friendbot'}
        </button>
      </div>

      {fundingMsg && (
        <p className={`mt-3 text-xs text-center animate-fade-in ${fundingMsg.startsWith('Funded') ? 'text-[#2ec98a]' : 'text-red-400'}`}>
          {fundingMsg}
        </p>
      )}
    </div>
  );
}
