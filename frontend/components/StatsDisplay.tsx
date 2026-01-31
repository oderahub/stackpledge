'use client';

import { useGlobalStats, useUserStats } from '@/hooks/useContract';
import { useStacks } from '@/providers/StacksProvider';
import { formatSTX } from '@/lib/stacks';

export function GlobalStatsDisplay() {
  const { stats, loading } = useGlobalStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Total Commitments</p>
        <p className="text-2xl font-bold text-gray-900">
          {stats.totalCommitments.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Total Staked</p>
        <p className="text-2xl font-bold text-orange-600">
          {formatSTX(stats.totalStaked)} STX
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">Total Burned</p>
        <p className="text-2xl font-bold text-red-600">
          {formatSTX(stats.totalBurned)} STX
        </p>
      </div>
    </div>
  );
}

export function UserStatsDisplay() {
  const { stxAddress, isConnected } = useStacks();
  const { stats, loading } = useUserStats(stxAddress);

  if (!isConnected) return null;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
        <p className="text-gray-500">No commitments yet. Create your first pledge!</p>
      </div>
    );
  }

  const successRate =
    stats.totalCommitments > 0
      ? Math.round(
          (stats.successfulCommitments / stats.totalCommitments) * 100
        )
      : 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">Commitments</p>
          <p className="text-xl font-bold text-gray-900">
            {stats.totalCommitments}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Staked</p>
          <p className="text-xl font-bold text-orange-600">
            {formatSTX(stats.totalStaked)} STX
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Successful</p>
          <p className="text-xl font-bold text-green-600">
            {stats.successfulCommitments}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-xl font-bold text-gray-900">{successRate}%</p>
        </div>
      </div>
    </div>
  );
}
