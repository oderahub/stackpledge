'use client';

import { useJudge } from '@/hooks/useContract';
import { getExplorerUrl } from '@/lib/stacks';

interface JudgeActionsProps {
  commitmentId: number;
  onSuccess?: () => void;
}

export function JudgeActions({ commitmentId, onSuccess }: JudgeActionsProps) {
  const { execute, loading, error, txId } = useJudge();

  const handleJudge = async (success: boolean) => {
    await execute({ commitmentId, success });
    if (!error) {
      onSuccess?.();
    }
  };

  if (txId) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium mb-2">Verdict submitted!</p>
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
      <h3 className="font-semibold text-gray-900">Judge this Commitment</h3>
      <p className="text-sm text-gray-600">
        As the designated judge, you can now verify whether this commitment was fulfilled.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => handleJudge(true)}
          disabled={loading}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Confirming...' : 'Mark Successful'}
        </button>
        <button
          onClick={() => handleJudge(false)}
          disabled={loading}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Confirming...' : 'Mark Failed'}
        </button>
      </div>
    </div>
  );
}
