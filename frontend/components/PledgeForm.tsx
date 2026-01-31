'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStacks } from '@/providers/StacksProvider';
import { usePledge } from '@/hooks/useContract';
import { parseSTX, getExplorerUrl } from '@/lib/stacks';
import { MIN_STAKE_USTX } from '@/lib/constants';

export function PledgeForm() {
  const router = useRouter();
  const { isConnected, connect } = useStacks();
  const { execute, loading, error, txId } = usePledge();

  const [description, setDescription] = useState('');
  const [judge, setJudge] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('7');
  const [stakeAmount, setStakeAmount] = useState('1');
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    setFormError(null);

    if (!description.trim()) {
      setFormError('Description is required');
      return false;
    }

    if (description.length > 256) {
      setFormError('Description must be 256 characters or less');
      return false;
    }

    if (!judge.trim()) {
      setFormError('Judge address is required');
      return false;
    }

    // Basic principal validation
    if (!judge.startsWith('SP') && !judge.startsWith('SM')) {
      setFormError('Invalid Stacks address (must start with SP or SM)');
      return false;
    }

    const days = parseInt(deadlineDays);
    if (isNaN(days) || days < 1) {
      setFormError('Deadline must be at least 1 day');
      return false;
    }

    try {
      const ustx = parseSTX(stakeAmount);
      if (ustx < MIN_STAKE_USTX) {
        setFormError('Minimum stake is 1 STX');
        return false;
      }
    } catch {
      setFormError('Invalid stake amount');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      connect();
      return;
    }

    if (!validateForm()) return;

    await execute({
      description: description.trim(),
      judge: judge.trim(),
      deadlineDays: parseInt(deadlineDays),
      stakeAmountUstx: parseSTX(stakeAmount),
    });
  };

  if (txId) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Pledge Submitted!
        </h2>
        <p className="text-gray-600 mb-4">
          Your transaction has been broadcast to the network.
        </p>
        <a
          href={getExplorerUrl(txId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          View on Explorer
        </a>
        <div className="mt-6">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What are you committing to?
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={256}
            placeholder="e.g., I will complete the Stacks course by the end of this month"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            {description.length}/256 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="judge"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Judge Address
          </label>
          <input
            id="judge"
            type="text"
            value={judge}
            onChange={(e) => setJudge(e.target.value)}
            placeholder="SP2FY55DK4NESNH6E5CJSNZP2CQ5PZ5BX64B29FYG"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-sm text-gray-500 mt-1">
            The person who will verify your commitment
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deadline (days)
            </label>
            <input
              id="deadline"
              type="number"
              min="1"
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="stake"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Stake Amount (STX)
            </label>
            <input
              id="stake"
              type="number"
              min="1"
              step="0.000001"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {(formError || error) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{formError || error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Confirming...' : isConnected ? 'Create Pledge' : 'Connect Wallet to Pledge'}
        </button>
      </div>
    </form>
  );
}
