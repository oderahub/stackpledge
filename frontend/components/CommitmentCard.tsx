'use client';

import Link from 'next/link';
import { Commitment } from '@/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { formatSTX, shortenAddress, blocksToTime } from '@/lib/stacks';
import { useBlockHeight } from '@/hooks/useContract';

interface CommitmentCardProps {
  commitment: Commitment;
}

export function CommitmentCard({ commitment }: CommitmentCardProps) {
  const { blockHeight } = useBlockHeight();

  const blocksRemaining = blockHeight
    ? commitment.deadlineBlock - blockHeight
    : null;

  const isExpired = blocksRemaining !== null && blocksRemaining <= 0;

  return (
    <Link
      href={`/commitment/${commitment.id}`}
      className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm text-gray-500">#{commitment.id}</span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            STATUS_COLORS[commitment.status]
          }`}
        >
          {STATUS_LABELS[commitment.status]}
        </span>
      </div>

      <p className="text-gray-900 font-medium mb-4 line-clamp-2">
        {commitment.description}
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Stake</p>
          <p className="font-medium text-gray-900">
            {formatSTX(commitment.stakeAmount)} STX
          </p>
        </div>
        <div>
          <p className="text-gray-500">Deadline</p>
          <p className="font-medium text-gray-900">
            {blocksRemaining !== null ? (
              isExpired ? (
                <span className="text-red-600">Expired</span>
              ) : (
                blocksToTime(blocksRemaining) + ' left'
              )
            ) : (
              `Block ${commitment.deadlineBlock}`
            )}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Creator</p>
          <p className="font-mono text-gray-900">
            {shortenAddress(commitment.creator)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Judge</p>
          <p className="font-mono text-gray-900">
            {shortenAddress(commitment.judge)}
          </p>
        </div>
      </div>
    </Link>
  );
}
