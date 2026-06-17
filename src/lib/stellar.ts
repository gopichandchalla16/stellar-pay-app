import { Horizon, Networks, TransactionBuilder, Asset, Operation, Memo } from '@stellar/stellar-sdk';

export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const server = new Horizon.Server(HORIZON_URL);

export interface AccountBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

export async function getXLMBalance(publicKey: string): Promise<string> {
  const account = await server.loadAccount(publicKey);
  const xlm = (account.balances as AccountBalance[]).find(b => b.asset_type === 'native');
  return xlm ? parseFloat(xlm.balance).toFixed(7) : '0.0000000';
}

export async function getRecentTransactions(publicKey: string, limit = 10) {
  const txs = await server.transactions()
    .forAccount(publicKey)
    .order('desc')
    .limit(limit)
    .call();
  return txs.records;
}

export async function buildPaymentTransaction(
  senderPublicKey: string,
  destinationPublicKey: string,
  amount: string,
  memo?: string
): Promise<string> {
  const [sourceAccount, destCheck] = await Promise.all([
    server.loadAccount(senderPublicKey),
    server.loadAccount(destinationPublicKey).catch(() => null),
  ]);

  if (!destCheck) throw new Error('Destination account does not exist on testnet. Ask them to activate it via Friendbot first.');

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) throw new Error('Invalid amount.');
  if (amountNum < 0.0000001) throw new Error('Minimum amount is 0.0000001 XLM.');

  const txBuilder = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  txBuilder.addOperation(
    Operation.payment({
      destination: destinationPublicKey,
      asset: Asset.native(),
      amount: amountNum.toFixed(7),
    })
  );

  if (memo && memo.trim()) txBuilder.addMemo(Memo.text(memo.trim().slice(0, 28)));

  txBuilder.setTimeout(30);
  return txBuilder.build().toXDR();
}

export function formatXLM(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return num.toFixed(4);
}

export function truncateAddress(address: string, chars = 6): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export async function fundTestnetAccount(publicKey: string): Promise<void> {
  const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if ((body?.detail ?? '').includes('already funded')) throw new Error('Account already funded.');
    throw new Error('Friendbot request failed.');
  }
}
