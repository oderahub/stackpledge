'use client';

import Link from 'next/link';
import { GlobalStatsDisplay, UserStatsDisplay } from '@/components/StatsDisplay';
import { CommitmentCard } from '@/components/CommitmentCard';
import { useRecentCommitments } from '@/hooks/useContract';
import { useStacks } from '@/providers/StacksProvider';

export default function HomePage() {
  const { isConnected } = useStacks();
  const { commitments, loading } = useRecentCommitments(10);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Put Your Money Where Your Mouth Is
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Create accountability pledges backed by STX. Succeed and reclaim your stake.
          Fail and it gets burned. Your judge keeps you honest.
        </p>
        <Link
          href="/pledge"
          className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
        >
          Create a Pledge
        </Link>
      </div>

      {/* Global Stats */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Stats</h2>
        <GlobalStatsDisplay />
      </section>

      {/* User Stats (if connected) */}
      {isConnected && (
        <section className="mb-12">
          <UserStatsDisplay />
        </section>
      )}

      {/* Recent Commitments */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Commitments</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse"
              >
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : commitments.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500 mb-4">No commitments yet. Be the first to create one!</p>
            <Link
              href="/pledge"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              Create First Pledge
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commitments.map((commitment) => (
              <CommitmentCard key={commitment.id} commitment={commitment} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
