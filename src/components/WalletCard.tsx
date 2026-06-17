'use client';

import { useState, useCallback, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_URL);

interface Props {
  walletAddress: string | null;
  setWalletAddress: (addr: string | null) => void;
  balance: string | null;
  setBalance: (bal: string | null) => void;
  refreshTrigger: number;
}

function detectFreighter(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).freighter || !!(window as any).freighterApi;
}

export default function WalletCard({
  walletAddress,
  setWalletAddress,
  balance,
  setBalance,
  refreshTrigger,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [funding, setFunding] = useState(false);
  const [fundMsg, setFundMsg] = useState<string | null>(null);
  const [freighterAvailable, setFreighterAvailable] = useState<boolean>(false);
  const [showManual, setShowManual] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Detect Freighter after mount (not available in SSR or iframes)
  useEffect(() => {
    const check = () => {
      const found = detectFreighter();
      setFreighterAvailable(found);
    };
    // Give the extension 800ms to inject itself
    const t = setTimeout(check, 800);
    return () => clearTimeout(t);
  }, []);

  const fetchBalance = useCallback(async (address: string) => {
    setBalanceLoading(true);
    try {
      const account = await server.loadAccount(address);
      const xlm = account.balances.find((b: any) => b.asset_type === 'native');
      setBalance(xlm ? parseFloat(xlm.balance).toFixed(4) : '0.0000');
    } catch {
      setBalance('0.0000');
    } finally {
      setBalanceLoading(false);
    }
  }, [setBalance]);

  useEffect(() => {
    if (walletAddress) fetchBalance(walletAddress);
  }, [walletAddress, refreshTrigger, fetchBalance]);

  // --- Freighter connect ---
  const connectFreighter = async () => {
    setLoading(true);
    setError(null);
    try {
      const { isConnected, requestAccess, getAddress } = await import('@stellar/freighter-api');
      const connRes = await isConnected();
      if (!connRes.isConnected) {
        setError('Freighter not detected. Use "Enter Address Manually" below.');
        setLoading(false);
        return;
      }
      const accessRes = await requestAccess();
      if (accessRes.error) { setError(accessRes.error); setLoading(false); return; }
      const addrRes = await getAddress();
      if (addrRes.error) { setError(addrRes.error); setLoading(false); return; }
      setWalletAddress(addrRes.address);
      await fetchBalance(addrRes.address);
    } catch (e: any) {
      setError(e?.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Manual address connect ---
  const connectManual = async () => {
    const addr = manualInput.trim();
    setManualError(null);
    if (!/^G[A-Z0-9]{55}$/.test(addr)) {
      setManualError('Invalid Stellar address. Must start with G and be 56 characters.');
      return;
    }
    setLoading(true);
    try {
      await fetchBalance(addr);
      setWalletAddress(addr);
      setShowManual(false);
      setManualInput('');
    } catch {
      setManualError('Could not fetch balance. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    setFundMsg(null);
    setError(null);
    setManualError(null);
  };

  const fundWithFriendbot = async () => {
    if (!walletAddress) return;
    setFunding(true);
    setFundMsg(null);
    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(walletAddress)}`);
      if (res.ok) {
        setFundMsg('✅ Account funded with 10,000 XLM!');
        await fetchBalance(walletAddress);
      } else {
        const body = await res.json().catch(() => ({}));
        const detail = body?.detail || '';
        if (detail.includes('already exists') || detail.includes('createAccountAlreadyExist')) {
          setFundMsg('ℹ️ Account already funded on testnet.');
          await fetchBalance(walletAddress);
        } else {
          setFundMsg('⚠️ Friendbot failed. Try again in a moment.');
        }
      }
    } catch {
      setFundMsg('⚠️ Network error. Try again.');
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="stellar-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-200">Wallet</h2>
          <p className="text-xs text-slate-400 mt-0.5">Freighter · Stellar Testnet</p>
        </div>
        {walletAddress && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="status-dot" style={{ width: 6, height: 6 }} />
            Connected
          </span>
        )}
      </div>

      {!walletAddress ? (
        <>
          {/* Primary: Freighter connect */}
          <button
            onClick={connectFreighter}
            disabled={loading}
            className="stellar-button w-full py-3 px-6 rounded-xl text-white font-semibold text-sm mb-3"
          >
            {loading && !showManual ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Connecting...
              </span>
            ) : '🔗 Connect Freighter Wallet'}
          </button>

          {/* Error from Freighter attempt */}
          {error && (
            <p className="mb-3 text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg p-3">{error}</p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Manual address input */}
          {!showManual ? (
            <button
              onClick={() => { setShowManual(true); setError(null); }}
              className="w-full py-2.5 text-sm font-medium rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
            >
              📋 Enter Wallet Address Manually
            </button>
          ) : (
            <div className="animate-fade-in">
              <p className="text-xs text-slate-400 mb-2">
                Paste your Stellar testnet address (starts with G...)
              </p>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="GB3ZTOE64ESLST264FNHWWGFYA5QN6LPET3OQ4..."
                className="input-field w-full px-4 py-3 rounded-xl text-xs font-mono mb-2"
                autoFocus
              />
              {manualError && (
                <p className="text-xs text-red-400 mb-2">{manualError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={connectManual}
                  disabled={loading || !manualInput.trim()}
                  className="flex-1 stellar-button py-2.5 rounded-xl text-white text-sm font-semibold"
                >
                  {loading ? '⏳ Loading...' : '✅ Connect'}
                </button>
                <button
                  onClick={() => { setShowManual(false); setManualInput(''); setManualError(null); }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💡 Find your address in the Freighter extension (top of the popup)
              </p>
            </div>
          )}

          {/* Install hint */}
          {!freighterAvailable && !showManual && (
            <p className="mt-3 text-center text-xs text-slate-500">
              Don't have Freighter?{' '}
              <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="text-[#00B4D8] hover:underline">
                Install here
              </a>
            </p>
          )}
        </>
      ) : (
        <>
          {/* Address */}
          <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Address</p>
            <p className="font-mono text-xs text-slate-200 break-all">{walletAddress}</p>
          </div>

          {/* Balance */}
          <div className="mb-5 p-4 bg-gradient-to-br from-[#00B4D8]/10 to-[#7B2FBE]/10 rounded-xl border border-[#00B4D8]/20">
            <p className="text-xs text-slate-400 mb-1">XLM Balance</p>
            {balanceLoading ? (
              <div className="shimmer h-9 w-36 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold text-white">
                {balance ?? '—'}{' '}
                <span className="text-sm font-normal text-[#00B4D8]">XLM</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={fundWithFriendbot}
              disabled={funding}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-violet-900/30 border border-violet-500/30 text-violet-300 hover:bg-violet-900/50 transition-all"
            >
              {funding ? '⏳ Funding...' : '🪙 Fund via Friendbot'}
            </button>
            <button
              onClick={disconnectWallet}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-red-900/20 border border-red-500/20 text-red-400 hover:bg-red-900/30 transition-all"
            >
              🔌 Disconnect
            </button>
          </div>

          {fundMsg && (
            <p className="mt-3 text-xs text-center text-slate-300 bg-white/5 rounded-lg p-2.5">{fundMsg}</p>
          )}
        </>
      )}
    </div>
  );
}
