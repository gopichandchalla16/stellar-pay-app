import { Horizon, Networks } from '@stellar/stellar-sdk';

export const NETWORK = 'TESTNET';
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const FRIENDBOT_URL = 'https://friendbot.stellar.org';
export const EXPLORER_URL = 'https://stellar.expert/explorer/testnet';

export const server = new Horizon.Server(HORIZON_URL);

export async function fetchXLMBalance(address: string): Promise<string> {
  const account = await server.loadAccount(address);
  const xlm = account.balances.find((b: any) => b.asset_type === 'native');
  return xlm ? parseFloat(xlm.balance).toFixed(4) : '0.0000';
}

export async function fundWithFriendbot(address: string): Promise<boolean> {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(address)}`);
  return res.ok;
}

export function explorerTxLink(hash: string): string {
  return `${EXPLORER_URL}/tx/${hash}`;
}

export function explorerAccountLink(address: string): string {
  return `${EXPLORER_URL}/account/${address}`;
}
