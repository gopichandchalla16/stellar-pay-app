'use client';

import { useState, useEffect } from 'react';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';

interface Tx {
  id: string;
  hash: string;
  created_at: string;
  successful: boolean;
  operation_count: number;
  fee_charged: string;
  memo?: string;
  memo_type?: string;
}

interface Props { walletAddress: string; }

export default function TransactionHistory({ walletAddress }: Props) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    setError('');
    fetch(`${HORIZON_URL}/accounts/${walletAddress}/transactions?limit=10&order=desc`)
      .then(r => r.json())
      .then(d => { setTxs(d._embedded?.records || []); })
      .catch(() => setError('Could not load transactions.'))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  };

  const shortHash = (h: string) => `${h.slice(0,8)}...${h.slice(-8)}`;

  return (
    <div className="s-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-800/30 flex items-center justify-center text-sm">📋</div>
          <div>
            <h2 className="text-sm font-semibold text-white">Transaction History</h2>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>Recent on Stellar Testnet</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="shimmer h-14 rounded-xl"></div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="alert-error p-3 text-xs text-red-400">⚠ {error}</div>
      )}

      {!loading && !error && txs.length === 0 && (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm font-medium text-white">No transactions yet</p>
          <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Send some XLM to see history here.</p>
        </div>
      )}

      {!loading && txs.length > 0 && (
        <div className="space-y-2">
          {txs.map(tx => (
            <a
              key={tx.id}
              href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
              target="_blank" rel="noopener noreferrer"
              className="block stat-box hover:border-sky-700/40 transition-all group"
              style={{textDecoration:'none'}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${tx.successful ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.successful ? '✓' : '✗'}
                  </span>
                  <span className="font-mono text-xs" style={{color:'var(--text-secondary)'}}>{shortHash(tx.hash)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{color:'var(--text-muted)'}}>{tx.operation_count} op{tx.operation_count!==1?'s':''}</span>
                  <span className="text-xs group-hover:text-sky-400 transition-colors" style={{color:'var(--text-muted)'}}>↗</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs" style={{color:'var(--text-muted)'}}>{fmt(tx.created_at)}</span>
                <span className="text-xs" style={{color:'var(--text-muted)'}}>{(parseInt(tx.fee_charged)/10000000).toFixed(5)} XLM fee</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
