'use client';

import { useState, useEffect, useCallback } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

interface TxRecord {
  id: string;
  hash: string;
  created_at: string;
  operation_count: number;
  fee_charged: string;
  successful: boolean;
  source_account: string;
}

interface Props {
  walletAddress: string;
  refreshTrigger: number;
}

export default function TransactionHistory({ walletAddress, refreshTrigger }: Props) {
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await server
        .transactions()
        .forAccount(walletAddress)
        .order('desc')
        .limit(10)
        .call();
      setTxs(records.records as unknown as TxRecord[]);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setTxs([]);
        setError('Account not found on testnet. Fund it with Friendbot first.');
      } else {
        setError('Failed to fetch transactions.');
      }
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchTxs();
  }, [fetchTxs, refreshTrigger]);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const shortHash = (h: string) => `${h.slice(0, 8)}...${h.slice(-8)}`;

  return (
    <div className="stellar-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Transaction History</h2>
          <p className="text-xs text-slate-400 mt-0.5">Last 10 transactions</p>
        </div>
        <button
          onClick={fetchTxs}
          disabled={loading}
          className="text-xs text-[#00B4D8] hover:text-white bg-[#00B4D8]/10 border border-[#00B4D8]/20 px-3 py-1.5 rounded-lg transition-all hover:bg-[#00B4D8]/20"
        >
          {loading ? '⏳' : '🔄 Refresh'}
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-16 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-400">{error}</p>
        </div>
      )}

      {!loading && !error && txs.length === 0 && (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-sm font-medium text-slate-300 mb-1">No transactions yet</h3>
          <p className="text-xs text-slate-500">Send XLM to see your history here</p>
        </div>
      )}

      {!loading && txs.length > 0 && (
        <div className="space-y-3">
          {txs.map((tx) => (
            <div
              key={tx.id}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    tx.successful
                      ? 'bg-emerald-900/40 text-emerald-400'
                      : 'bg-red-900/40 text-red-400'
                  }`}
                >
                  {tx.successful ? '✓' : '✗'}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-slate-300 truncate">
                    {shortHash(tx.hash)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {tx.operation_count} op{tx.operation_count !== 1 ? 's' : ''} · {timeAgo(tx.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    tx.successful
                      ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-900/30 text-red-400 border border-red-500/20'
                  }`}
                >
                  {tx.successful ? 'Success' : 'Failed'}
                </span>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-[#00B4D8] transition-colors"
                  title="View on explorer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
