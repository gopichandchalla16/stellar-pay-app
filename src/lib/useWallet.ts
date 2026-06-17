'use client';
import { useState, useCallback } from 'react';
import { connectFreighter, signWithFreighter } from './freighter';
import { getXLMBalance, buildPaymentTransaction, fundTestnetAccount, NETWORK_PASSPHRASE, server } from './stellar';
import { TransactionBuilder } from '@stellar/stellar-sdk';

export type TxStatus = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error';

export interface TxResult {
  hash: string;
  ledger: number;
}

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectError, setConnectError] = useState<string>('');
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txResult, setTxResult] = useState<TxResult | null>(null);
  const [txError, setTxError] = useState<string>('');
  const [fundingLoading, setFundingLoading] = useState(false);
  const [fundingMsg, setFundingMsg] = useState<string>('');

  const refreshBalance = useCallback(async (key?: string) => {
    const pk = key ?? publicKey;
    if (!pk) return;
    setIsRefreshing(true);
    try {
      const bal = await getXLMBalance(pk);
      setBalance(bal);
    } catch {
      setBalance('—');
    } finally {
      setIsRefreshing(false);
    }
  }, [publicKey]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setConnectError('');
    const { publicKey: key, error } = await connectFreighter();
    if (error || !key) {
      setConnectError(error ?? 'Unknown error');
      setIsConnecting(false);
      return;
    }
    setPublicKey(key);
    await refreshBalance(key);
    setIsConnecting(false);
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setPublicKey('');
    setBalance('');
    setTxResult(null);
    setTxStatus('idle');
    setTxError('');
    setFundingMsg('');
    setConnectError('');
  }, []);

  const sendPayment = useCallback(async (destination: string, amount: string, memo?: string) => {
    if (!publicKey) return;
    setTxStatus('building');
    setTxError('');
    setTxResult(null);
    try {
      const xdr = await buildPaymentTransaction(publicKey, destination, amount, memo);
      setTxStatus('signing');
      const { signedXdr, error: signError } = await signWithFreighter(xdr, NETWORK_PASSPHRASE);
      if (signError || !signedXdr) throw new Error(signError ?? 'Signing failed');
      setTxStatus('submitting');
      const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      const result = await server.submitTransaction(tx);
      setTxResult({ hash: result.hash, ledger: (result as any).ledger ?? 0 });
      setTxStatus('success');
      setTimeout(() => refreshBalance(), 2000);
    } catch (e: any) {
      const msg =
        e?.response?.data?.extras?.result_codes?.operations?.[0] ??
        e?.response?.data?.title ??
        e?.message ??
        'Transaction failed.';
      setTxError(msg);
      setTxStatus('error');
    }
  }, [publicKey, refreshBalance]);

  const fundAccount = useCallback(async () => {
    if (!publicKey) return;
    setFundingLoading(true);
    setFundingMsg('');
    try {
      await fundTestnetAccount(publicKey);
      setFundingMsg('Funded! Refreshing balance...');
      setTimeout(() => { refreshBalance(); setFundingMsg(''); }, 2500);
    } catch (e: any) {
      setFundingMsg(e?.message ?? 'Funding failed.');
    } finally {
      setFundingLoading(false);
    }
  }, [publicKey, refreshBalance]);

  const resetTx = useCallback(() => {
    setTxStatus('idle');
    setTxResult(null);
    setTxError('');
  }, []);

  return {
    publicKey, balance, isConnecting, isRefreshing, connectError,
    txStatus, txResult, txError, fundingLoading, fundingMsg,
    connect, disconnect, sendPayment, refreshBalance, fundAccount, resetTx,
  };
}
