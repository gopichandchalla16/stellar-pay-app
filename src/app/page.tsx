'use client';

import { useState, useEffect, useCallback } from 'react';
import SendPayment from '@/components/SendPayment';
import TransactionHistory from '@/components/TransactionHistory';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';

type Tab = 'send' | 'history';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('send');
  const [connecting, setConnecting] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [fundingMsg, setFundingMsg] = useState('');
  const [funding, setFunding] = useState(false);

  const fetchBalance = useCallback(async (address: string) => {
    setBalanceLoading(true);
    try {
      const res = await fetch(`${HORIZON_URL}/accounts/${address}`);
      if (!res.ok) throw new Error('Account not found');
      const data = await res.json();
      const native = data.balances?.find((b: any) => b.asset_type === 'native');
      setBalance(native ? parseFloat(native.balance).toFixed(4) : '0.0000');
    } catch {
      setBalance('0.0000');
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const connectFreighter = async () => {
    setConnecting(true);
    try {
      const freighter = await import('@stellar/freighter-api');
      const connected = await freighter.isConnected();
      if (!connected?.isConnected) throw new Error('not_installed');
      const access = await freighter.requestAccess();
      if (access?.error) throw new Error(access.error);
      const pubKey = await freighter.getPublicKey();
      if (pubKey?.error) throw new Error(pubKey.error);
      const addr = pubKey.address || (pubKey as any).publicKey || '';
      setWalletAddress(addr);
      await fetchBalance(addr);
    } catch (e: any) {
      if (e?.message === 'not_installed') setManualMode(true);
      else { setManualMode(true); }
    } finally {
      setConnecting(false);
    }
  };

  const connectManual = async () => {
    const addr = manualInput.trim();
    if (!addr || addr.length !== 56 || !addr.startsWith('G')) return;
    setWalletAddress(addr);
    await fetchBalance(addr);
    setManualMode(false);
    setManualInput('');
  };

  const disconnect = () => {
    setWalletAddress(null);
    setBalance(null);
    setTab('send');
    setManualMode(false);
    setManualInput('');
  };

  const fundViaFriendbot = async () => {
    if (!walletAddress) return;
    setFunding(true);
    setFundingMsg('');
    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${walletAddress}`);
      if (res.ok) {
        setFundingMsg('success');
        setTimeout(() => { fetchBalance(walletAddress); setFundingMsg(''); }, 1500);
      } else {
        setFundingMsg('already');
        setTimeout(() => setFundingMsg(''), 3000);
      }
    } catch {
      setFundingMsg('error');
      setTimeout(() => setFundingMsg(''), 3000);
    } finally {
      setFunding(false);
    }
  };

  const refreshBalance = () => { if (walletAddress) fetchBalance(walletAddress); };

  return (
    <main className="min-h-screen px-4 py-8">
      {/* Top bar */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-base shadow-lg shadow-sky-900/30">
              ✦
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">StellarPay</h1>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>Stellar Testnet dApp</p>
            </div>
          </div>
          <span className="badge-testnet">⬡ Testnet</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {/* Wallet card */}
        <div className="s-card p-5 anim-up">
          {!walletAddress ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Connect Wallet</h2>
                  <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Freighter · Stellar Testnet</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800/30 flex items-center justify-center text-lg">🔗</div>
              </div>

              {!manualMode ? (
                <>
                  <button onClick={connectFreighter} disabled={connecting} className="btn-primary w-full py-3 text-sm mb-3">
                    {connecting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                        Connecting...
                      </span>
                    ) : '🔗 Connect Freighter Wallet'}
                  </button>
                  <button onClick={() => setManualMode(true)} className="btn-ghost w-full py-2.5 text-xs">
                    📋 Enter address manually
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs" style={{color:'var(--text-secondary)'}}>Paste your Stellar public key (G...)</p>
                  <input
                    type="text"
                    value={manualInput}
                    onChange={e => setManualInput(e.target.value)}
                    placeholder="GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
                    className="s-input px-3 py-2.5 text-xs font-mono"
                    spellCheck={false}
                  />
                  <div className="flex gap-2">
                    <button onClick={connectManual} disabled={manualInput.trim().length !== 56} className="btn-primary flex-1 py-2.5 text-sm">Connect</button>
                    <button onClick={() => { setManualMode(false); setManualInput(''); }} className="btn-ghost px-4 py-2.5 text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Connected state */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="pulse-dot"></div>
                  <span className="text-xs font-semibold text-emerald-400">Connected</span>
                </div>
                <button onClick={disconnect} className="btn-danger text-xs px-3 py-1.5">Disconnect</button>
              </div>

              {/* Address */}
              <div className="stat-box mb-3">
                <p className="text-xs mb-1" style={{color:'var(--text-muted)'}}>Wallet Address</p>
                <p className="font-mono text-xs" style={{color:'var(--text-secondary)', wordBreak:'break-all', lineHeight:'1.6'}}>{walletAddress}</p>
              </div>

              {/* Balance */}
              <div className="stat-box mb-4" style={{background:'rgba(56,189,248,0.06)', borderColor:'rgba(56,189,248,0.15)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs mb-1" style={{color:'var(--text-muted)'}}>XLM Balance</p>
                    {balanceLoading ? (
                      <div className="shimmer h-7 w-32 rounded-lg"></div>
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        {balance} <span className="text-sm font-medium" style={{color:'var(--teal)'}}>XLM</span>
                      </p>
                    )}
                  </div>
                  <button onClick={refreshBalance} className="btn-ghost p-2 text-sm" title="Refresh balance">↻</button>
                </div>
              </div>

              {/* Friendbot */}
              <div className="flex gap-2 mb-1">
                <button
                  onClick={fundViaFriendbot}
                  disabled={funding}
                  className="btn-ghost flex-1 py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  {funding ? (
                    <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Funding...</>
                  ) : '🪙 Fund via Friendbot'}
                </button>
              </div>

              {fundingMsg === 'success' && <p className="text-xs text-emerald-400 text-center mt-1">✓ Account funded! Refreshing...</p>}
              {fundingMsg === 'already' && <p className="text-xs text-amber-400 text-center mt-1">Account already funded on testnet.</p>}
              {fundingMsg === 'error' && <p className="text-xs text-red-400 text-center mt-1">Funding failed. Try again.</p>}
            </>
          )}
        </div>

        {/* Tabs + Content */}
        {walletAddress && (
          <div className="anim-up" style={{animationDelay:'0.1s'}}>
            <div className="tab-bar mb-4">
              <button className={`tab-btn${tab==='send'?' active':''}`} onClick={() => setTab('send')}>💸 Send XLM</button>
              <button className={`tab-btn${tab==='history'?' active':''}`} onClick={() => setTab('history')}>📋 History</button>
            </div>
            {tab === 'send' && <SendPayment walletAddress={walletAddress} onSuccess={refreshBalance} />}
            {tab === 'history' && <TransactionHistory walletAddress={walletAddress} />}
          </div>
        )}

        {/* Empty state */}
        {!walletAddress && (
          <div className="s-card p-8 text-center anim-up" style={{animationDelay:'0.15s'}}>
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-sm font-semibold text-white mb-1">Get Started</h3>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>Connect your Freighter wallet to send XLM and explore Stellar testnet.</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs pt-2" style={{color:'var(--text-muted)'}}>
          StellarPay · Rise In White Belt Challenge ·{' '}
          <a href="https://github.com/gopichandchalla16/stellar-pay-app" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors underline underline-offset-2">GitHub</a>
        </p>
      </div>
    </main>
  );
}
