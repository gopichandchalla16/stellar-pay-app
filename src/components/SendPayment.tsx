'use client';
import { useState } from 'react';
import { Send, CheckCircle, XCircle, Loader, ExternalLink, ArrowRight } from 'lucide-react';
import { TxStatus, TxResult } from '@/lib/useWallet';

interface Props {
  onSend: (dest: string, amount: string, memo?: string) => void;
  txStatus: TxStatus;
  txResult: TxResult | null;
  txError: string;
  onReset: () => void;
  senderBalance: string;
}

const STATUS_LABELS: Record<TxStatus, string> = {
  idle: 'Send Payment',
  building: 'Building transaction...',
  signing: 'Sign in Freighter...',
  submitting: 'Submitting to Stellar...',
  success: 'Transaction Sent!',
  error: 'Transaction Failed',
};

export default function SendPayment({ onSend, txStatus, txResult, txError, onReset, senderBalance }: Props) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const isLoading = ['building', 'signing', 'submitting'].includes(txStatus);
  const maxAmount = Math.max(0, parseFloat(senderBalance || '0') - 0.5).toFixed(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !amount.trim()) return;
    onSend(destination.trim(), amount.trim(), memo.trim() || undefined);
  };

  if (txStatus === 'success' && txResult) {
    return (
      <div className="card-glow rounded-2xl bg-[#0d1a13] border border-[#0e9e6a]/20 p-6 animate-slide-in text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#0b4f37]/50 border border-[#14b87e]/30 flex items-center justify-center">
            <CheckCircle size={28} className="text-[#2ec98a]" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-[#2ec98a] mb-1">Payment Confirmed ✅</h3>
        <p className="text-sm text-slate-400 mb-4">Your transaction was successfully submitted to Stellar Testnet.</p>
        <div className="bg-[#0a1410] rounded-xl p-4 text-left mb-4 border border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Transaction Hash</p>
          <p className="font-mono text-xs text-slate-300 break-all">{txResult.hash}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txResult.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#0e9e6a]/30 text-sm text-[#2ec98a] hover:text-[#14b87e] hover:bg-[#0b4f37]/20 transition-all"
          >
            <ExternalLink size={14} />View on Explorer
          </a>
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0e9e6a] hover:bg-[#14b87e] text-white text-sm font-medium transition-colors"
          >
            New Payment <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (txStatus === 'error') {
    return (
      <div className="card-glow rounded-2xl bg-[#0d1a13] border border-red-900/30 p-6 animate-slide-in text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center">
            <XCircle size={28} className="text-red-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-red-300 mb-1">Transaction Failed ❌</h3>
        <p className="text-sm text-slate-400 mb-4 break-words">{txError}</p>
        <button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl bg-[#1a1010] border border-red-900/30 hover:border-red-700/50 text-sm text-red-400 hover:text-red-300 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="card-glow rounded-2xl bg-[#0d1a13] border border-white/5 p-6 animate-slide-in">
      <div className="flex items-center gap-2 mb-5">
        <Send size={16} className="text-[#14b87e]" />
        <h2 className="text-base font-semibold text-slate-200">Send XLM</h2>
        <span className="ml-auto text-xs text-slate-600 font-mono">Testnet</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">Destination Address</label>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="G... Stellar public key"
            disabled={isLoading}
            className="w-full bg-[#0a1410] border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#0e9e6a]/50 transition-colors disabled:opacity-50"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-500 uppercase tracking-widest">Amount (XLM)</label>
            {senderBalance && (
              <button type="button" onClick={() => setAmount(maxAmount)} className="text-xs text-[#14b87e] hover:text-[#2ec98a] transition-colors">
                Max: {parseFloat(maxAmount).toFixed(4)} XLM
              </button>
            )}
          </div>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.0000"
            min="0.0000001"
            step="0.0000001"
            disabled={isLoading}
            className="w-full bg-[#0a1410] border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#0e9e6a]/50 transition-colors disabled:opacity-50"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 uppercase tracking-widest mb-1.5">Memo <span className="text-slate-700">(optional, max 28 chars)</span></label>
          <input
            type="text"
            value={memo}
            onChange={e => setMemo(e.target.value.slice(0, 28))}
            placeholder="Payment note..."
            disabled={isLoading}
            className="w-full bg-[#0a1410] border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#0e9e6a]/50 transition-colors disabled:opacity-50"
          />
          {memo && <p className="mt-1 text-xs text-slate-600">{memo.length}/28</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading || !destination || !amount}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0e9e6a] hover:bg-[#14b87e] disabled:bg-[#0b4f37] disabled:text-[#0d7d54] text-white font-medium text-sm transition-all"
        >
          {isLoading ? (
            <><Loader size={16} className="animate-spin-slow" />{STATUS_LABELS[txStatus]}</>
          ) : (
            <><Send size={16} />{STATUS_LABELS[txStatus]}</>
          )}
        </button>
      </form>
    </div>
  );
}
