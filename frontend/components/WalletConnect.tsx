'use client';

import { useStacks } from '@/providers/StacksProvider';
import { shortenAddress } from '@/lib/stacks';

export function WalletConnect() {
  const { isConnected, isLoading, stxAddress, connect, disconnect } = useStacks();

  if (isLoading) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (isConnected && stxAddress) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-mono">
          {shortenAddress(stxAddress)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
    >
      Connect Wallet
    </button>
  );
}
