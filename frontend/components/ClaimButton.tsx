'use client';

import { useClaim } from '@/hooks/useContract';
import { getExplorerUrl, formatSTX } from '@/lib/stacks';

interface ClaimButtonProps {
  commitmentId: number;
  stakeAmount: bigint;
  onSuccess?: () => void;
}

export function ClaimButton({ commitmentId, stakeAmount, onSuccess }: ClaimButtonProps) {
  const { execute, loading, error, txId } = useClaim();

  const handleClaim = async () => {
    await execute({ commitmentId });
    if (!error) {
      onSuccess?.();
    }
  };

  if (txId) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium mb-2">Claim submitted!</p>
        <a
          href={getExplorerUrl(txId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 text-sm"
        >
          View transaction
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Claim Your Stake</h3>
      <p className="text-sm text-gray-600">
        Congratulations! Your commitment was verified as successful. You can now claim your stake of{' '}
        <span className="font-medium text-orange-600">{formatSTX(stakeAmount)} STX</span>.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleClaim}
        disabled={loading}
        className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? 'Confirming...' : 'Claim Stake'}
      </button>
    </div>
  );
}
