'use client';

export interface FreighterAPI {
  isConnected: () => Promise<{ isConnected: boolean }>;
  getPublicKey: () => Promise<string>;
  getNetwork: () => Promise<string>;
  signTransaction: (xdr: string, opts?: { networkPassphrase?: string; accountToSign?: string }) => Promise<string>;
  isAllowed: () => Promise<boolean>;
  requestAccess: () => Promise<string>;
}

declare global {
  interface Window {
    freighter?: FreighterAPI;
  }
}

export function getFreighter(): FreighterAPI | null {
  if (typeof window === 'undefined') return null;
  return window.freighter ?? null;
}

export async function connectFreighter(): Promise<{ publicKey: string; error?: string }> {
  const freighter = getFreighter();
  if (!freighter) {
    return { publicKey: '', error: 'Freighter wallet not installed. Please install the Freighter browser extension.' };
  }
  try {
    const { isConnected } = await freighter.isConnected();
    if (!isConnected) return { publicKey: '', error: 'Freighter is not connected. Open the extension and log in.' };
    const allowed = await freighter.isAllowed();
    if (!allowed) {
      const key = await freighter.requestAccess();
      return { publicKey: key };
    }
    const key = await freighter.getPublicKey();
    return { publicKey: key };
  } catch (e: any) {
    return { publicKey: '', error: e?.message ?? 'Failed to connect Freighter.' };
  }
}

export async function signWithFreighter(xdr: string, networkPassphrase: string): Promise<{ signedXdr: string; error?: string }> {
  const freighter = getFreighter();
  if (!freighter) return { signedXdr: '', error: 'Freighter not found.' };
  try {
    const signed = await freighter.signTransaction(xdr, { networkPassphrase });
    return { signedXdr: signed };
  } catch (e: any) {
    return { signedXdr: '', error: e?.message ?? 'User rejected or signing failed.' };
  }
}
