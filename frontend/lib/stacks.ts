import { STACKS_MAINNET } from '@stacks/network';

export const network = STACKS_MAINNET;

export function getExplorerUrl(txId: string): string {
  return `https://explorer.stacks.co/txid/${txId}?chain=mainnet`;
}

export function getAddressUrl(address: string): string {
  return `https://explorer.stacks.co/address/${address}?chain=mainnet`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatSTX(ustx: bigint): string {
  const stx = Number(ustx) / 1_000_000;
  return stx.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
}

export function parseSTX(stx: string): bigint {
  const num = parseFloat(stx);
  if (isNaN(num) || num < 0) {
    throw new Error('Invalid STX amount');
  }
  return BigInt(Math.floor(num * 1_000_000));
}

export function blocksToTime(blocks: number): string {
  const minutes = blocks * 10; // ~10 min per block
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}
