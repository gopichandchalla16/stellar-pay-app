'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  isConnected,
  getAddress,
  requestAccess,
} from '@stellar/freighter-api';
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
  const [freighterInstalled, setFreighterInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    isConnected().then((res) => setFreighterInstalled(res.isConnected));
  }, []);

  const fetchBalance = useCallback(async (address: string) => {
    try {
      const account = await server.loadAccount(address);
      const xlm = account.balances.find((b: any) => b.asset_type === 'native');
      setBalance(xlm ? parseFloat(xlm.balance).toFixed(4) : '0.0000');
    } catch {
      setBalance('0.0000');
    }
  }, [setBalance]);

  useEffect(() => {
    if (walletAddress) fetchBalance(walletAddress);
  }, [walletAddress, refreshTrigger, fetchBalance]);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const connRes = await isConnected();
      if (!connRes.isConnected) {
        setError('Freighter wallet extension not found. Please install it from freighter.app');
        return;
      }
      const accessRes = await requestAccess();
      if (accessRes.error) {
        setError(accessRes.error);
        return;
      }
      const addrRes = await getAddress();
      if (addrRes.error) {
        setError(addrRes.error);
        return;
      }
      setWalletAddress(addrRes.address);
      await fetchBalance(addrRes.address);
    } catch (e: any) {
      setError(e?.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    setFundMsg(null);
    setError(null);
  };

  const fundWithFriendbot = async () => {
    if (!walletAddress) return;
    setFunding(true);
    setFundMsg(null);
    try {
      const res = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(walletAddress)}`
      );
      if (res.ok) {
        setFundMsg('✅ Account funded with 10,000 XLM!');
        await fetchBalance(walletAddress);
      } else {
        const body = await res.json();
        const detail = body?.detail || '';
        if (detail.includes('already exists') || detail.includes('createAccountAlreadyExist')) {
          setFundMsg('ℹ️ Account already funded on testnet.');
        } else {
          setFundMsg('⚠️ Could not fund. Account may already exist.');
        }
      }
    } catch {
      setFundMsg('⚠️ Friendbot request failed. Try again.');
    } finally {
      setFunding(false);
    }
  };

  const shortAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-6)}`;

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
          {freighterInstalled === false && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
              <p className="text-xs text-yellow-400">
                ⚠️ Freighter not detected.{' '}
                <a
                  href="https://freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Install it here
                </a>{' '}
                then refresh.
              </p>
            </div>
          )}
          <button
            onClick={connectWallet}
            disabled={loading}
            className="stellar-button w-full py-3 px-6 rounded-xl text-white font-semibold text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Connecting...
              </span>
            ) : (
              '🔗 Connect Freighter Wallet'
            )}
          </button>
          {error && (
            <p className="mt-3 text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg p-3">{error}</p>
          )}
        </>
      ) : (
        <>
          {/* Address */}
          <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Address</p>
            <p className="font-mono text-sm text-slate-200 break-all">{walletAddress}</p>
          </div>

          {/* Balance */}
          <div className="mb-5 p-4 bg-gradient-to-br from-[#00B4D8]/10 to-[#7B2FBE]/10 rounded-xl border border-[#00B4D8]/20">
            <p className="text-xs text-slate-400 mb-1">XLM Balance</p>
            {balance !== null ? (
              <p className="text-3xl font-bold text-white">
                {balance} <span className="text-sm font-normal text-[#00B4D8]">XLM</span>
              </p>
            ) : (
              <div className="shimmer h-9 w-36 rounded-lg" />
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
