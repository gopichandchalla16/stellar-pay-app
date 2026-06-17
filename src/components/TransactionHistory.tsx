'use client';
import { useState, useEffect } from 'react';
import { Clock, ExternalLink, ArrowUpRight, ArrowDownLeft, Loader } from 'lucide-react';
import { getRecentTransactions } from '@/lib/stellar';

interface Props {
  publicKey: string;
  refreshTrigger?: number;
}

interface TxRecord {
  id: string;
  hash: string;
  created_at: string;
  source_account: string;
  successful: boolean;
  operation_count: number;
}

export default function TransactionHistory({ publicKey, refreshTrigger }: Props) {
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!publicKey) return;
    setLoading(true);
    setError('');
    getRecentTransactions(publicKey, 8)
      .then((records: any[]) => {
        setTxs(records.map(r => ({
          id: r.id,
          hash: r.hash,
          created_at: r.created_at,
          source_account: r.source_account,
          successful: r.successful,
          operation_count: r.operation_count,
        })));
      })
      .catch(() => setError('Could not load transactions.'))
      .finally(() => setLoading(false));
  }, [publicKey, refreshTrigger]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const truncateHash = (h: string) => `${h.slice(0, 8)}...${h.slice(-6)}`;

  return (
    <div className="card-glow rounded-2xl bg-[#0d1a13] border border-white/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-slate-500" />
        <h2 className="text-base font-semibold text-slate-200">Recent Transactions</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-slate-600">
          <Loader size={16} className="animate-spin-slow" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : error ? (
        <p className="text-center py-8 text-sm text-red-400/70">{error}</p>
      ) : txs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-600">No transactions yet</p>
          <p className="text-xs text-slate-700 mt-1">Send a payment to see it here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {txs.map(tx => (
            <div key={tx.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0a1410] hover:bg-[#0e1e15] transition-colors group border border-white/3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  tx.successful ? 'bg-[#0b4f37]/50 text-[#2ec98a]' : 'bg-red-950/50 text-red-400'
                }`}>
                  {tx.source_account === publicKey ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-slate-300 truncate">{truncateHash(tx.hash)}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{formatDate(tx.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tx.successful ? 'bg-[#0b4f37]/40 text-[#14b87e]' : 'bg-red-950/40 text-red-500'
                }`}>
                  {tx.successful ? 'Success' : 'Failed'}
                </span>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-600 hover:text-[#14b87e] transition-all"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
