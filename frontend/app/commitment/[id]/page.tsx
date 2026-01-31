'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCommitment, useBlockHeight } from '@/hooks/useContract';
import { useStacks } from '@/providers/StacksProvider';
import { JudgeActions } from '@/components/JudgeActions';
import { ClaimButton } from '@/components/ClaimButton';
import { STATUS_LABELS, STATUS_COLORS, STATUS } from '@/lib/constants';
import { formatSTX, shortenAddress, blocksToTime, getAddressUrl } from '@/lib/stacks';

export default function CommitmentPage() {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : null;

  const { commitment, loading, error, refetch } = useCommitment(id);
  const { blockHeight } = useBlockHeight();
  const { stxAddress, isConnected } = useStacks();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !commitment) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Commitment Not Found</h2>
          <p className="text-gray-600">
            {error || 'This commitment does not exist or could not be loaded.'}
          </p>
        </div>
      </div>
    );
  }

  const blocksRemaining = blockHeight ? commitment.deadlineBlock - blockHeight : null;
  const isExpired = blocksRemaining !== null && blocksRemaining <= 0;

  const isCreator = isConnected && stxAddress === commitment.creator;
  const isJudge = isConnected && stxAddress === commitment.judge;

  const canJudge = isJudge && isExpired && commitment.status === STATUS.ACTIVE;
  const canClaim = isCreator && commitment.status === STATUS.SUCCESS;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Commitment #{commitment.id}
          </h1>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              STATUS_COLORS[commitment.status]
            }`}
          >
            {STATUS_LABELS[commitment.status]}
          </span>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <p className="text-gray-900">{commitment.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Stake Amount</p>
            <p className="text-xl font-bold text-orange-600">
              {formatSTX(commitment.stakeAmount)} STX
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Deadline</p>
            <p className="text-lg font-medium text-gray-900">
              {blocksRemaining !== null ? (
                isExpired ? (
                  <span className="text-red-600">
                    Expired {blocksToTime(Math.abs(blocksRemaining))} ago
                  </span>
                ) : (
                  <span className="text-green-600">
                    {blocksToTime(blocksRemaining)} remaining
                  </span>
                )
              ) : (
                `Block ${commitment.deadlineBlock.toLocaleString()}`
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Block {commitment.deadlineBlock.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Creator</p>
            <a
              href={getAddressUrl(commitment.creator)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-gray-900 hover:text-orange-600 flex items-center gap-1"
            >
              {shortenAddress(commitment.creator, 6)}
              {isCreator && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                  You
                </span>
              )}
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Judge</p>
            <a
              href={getAddressUrl(commitment.judge)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-gray-900 hover:text-orange-600 flex items-center gap-1"
            >
              {shortenAddress(commitment.judge, 6)}
              {isJudge && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  You
                </span>
              )}
            </a>
          </div>
        </div>

        {/* Status-specific messages */}
        {commitment.status === STATUS.ACTIVE && !isExpired && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <p className="text-blue-800 text-sm">
              This commitment is active. The judge can provide a verdict after the deadline.
            </p>
          </div>
        )}

        {commitment.status === STATUS.ACTIVE && isExpired && !isJudge && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
            <p className="text-yellow-800 text-sm">
              The deadline has passed. Waiting for the judge to provide a verdict.
            </p>
          </div>
        )}

        {commitment.status === STATUS.FAILED && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-800 text-sm">
              This commitment was marked as failed. The stake of{' '}
              <span className="font-medium">{formatSTX(commitment.stakeAmount)} STX</span> has been
              burned.
            </p>
          </div>
        )}

        {commitment.status === STATUS.CLAIMED && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
            <p className="text-gray-800 text-sm">
              This commitment was successful and the stake has been claimed.
            </p>
          </div>
        )}

        {/* Action sections */}
        {canJudge && (
          <div className="border-t border-gray-200 pt-6">
            <JudgeActions commitmentId={commitment.id} onSuccess={refetch} />
          </div>
        )}

        {canClaim && (
          <div className="border-t border-gray-200 pt-6">
            <ClaimButton
              commitmentId={commitment.id}
              stakeAmount={commitment.stakeAmount}
              onSuccess={refetch}
            />
          </div>
        )}

        {!isConnected && (commitment.status === STATUS.ACTIVE || commitment.status === STATUS.SUCCESS) && (
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-600 text-sm">
              Connect your wallet to interact with this commitment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
