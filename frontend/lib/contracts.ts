import {
  fetchCallReadOnlyFunction,
  cvToValue,
  standardPrincipalCV,
  uintCV,
  stringUtf8CV,
  boolCV,
  ClarityType,
  ClarityValue,
} from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { network } from './stacks';
import { CONTRACT_ADDRESS, CONTRACT_NAME, BLOCKS_PER_DAY } from './constants';
import { Commitment, GlobalStats, UserStats, CommitmentStatus } from '@/types';

// Helper to extract value from optional
function unwrapOptional<T>(cv: ClarityValue, parser: (v: ClarityValue) => T): T | null {
  if (cv.type === ClarityType.OptionalSome) {
    return parser(cv.value);
  }
  return null;
}

// Parse commitment from Clarity value
function parseCommitment(cv: ClarityValue, id: number): Commitment | null {
  if (cv.type !== ClarityType.Tuple) return null;

  const data = cv.value as Record<string, ClarityValue>;

  return {
    id,
    creator: cvToValue(data['creator']),
    judge: cvToValue(data['judge']),
    description: cvToValue(data['description']),
    stakeAmount: BigInt(cvToValue(data['stake-amount'])),
    deadlineBlock: Number(cvToValue(data['deadline-block'])),
    status: Number(cvToValue(data['status'])) as CommitmentStatus,
  };
}

// Read Functions

export async function getCommitment(id: number): Promise<Commitment | null> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-commitment',
    functionArgs: [uintCV(id)],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });

  return unwrapOptional(result, (v) => parseCommitment(v, id));
}

export async function getUserStats(address: string): Promise<UserStats | null> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-user-stats',
    functionArgs: [standardPrincipalCV(address)],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });

  const value = unwrapOptional(result, (v) => v);
  if (!value || value.type !== ClarityType.Tuple) return null;

  const data = value.value as Record<string, ClarityValue>;

  return {
    totalCommitments: Number(cvToValue(data['total-commitments'])),
    totalStaked: BigInt(cvToValue(data['total-staked'])),
    successfulCommitments: Number(cvToValue(data['successful-commitments'])),
    failedCommitments: Number(cvToValue(data['failed-commitments'])),
  };
}

export async function getGlobalStats(): Promise<GlobalStats> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-global-stats',
    functionArgs: [],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });

  if (result.type !== ClarityType.Tuple) {
    throw new Error('Invalid global stats response');
  }

  const data = result.value as Record<string, ClarityValue>;

  return {
    totalCommitments: Number(cvToValue(data['total-commitments'])),
    totalStaked: BigInt(cvToValue(data['total-staked'])),
    totalBurned: BigInt(cvToValue(data['total-burned'])),
  };
}

export async function getTotalCommitments(): Promise<number> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-total-commitments',
    functionArgs: [],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });

  return Number(cvToValue(result));
}

export async function getCurrentBlockHeight(): Promise<number> {
  const response = await fetch('https://api.mainnet.hiro.so/v2/info');
  const data = await response.json();
  return data.stacks_tip_height;
}

// Write Functions

export interface PledgeParams {
  description: string;
  judge: string;
  deadlineDays: number;
  stakeAmountUstx: bigint;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}

export async function pledge({
  description,
  judge,
  deadlineDays,
  stakeAmountUstx,
  onFinish,
  onCancel,
}: PledgeParams): Promise<void> {
  const deadlineBlocks = deadlineDays * BLOCKS_PER_DAY;

  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'pledge',
    functionArgs: [
      stringUtf8CV(description),
      standardPrincipalCV(judge),
      uintCV(deadlineBlocks),
      uintCV(stakeAmountUstx),
    ],
    network,
    postConditionMode: 0x01, // Allow
    onFinish: (data) => {
      onFinish?.({ txId: data.txId });
    },
    onCancel: () => {
      onCancel?.();
    },
  });
}

export interface JudgeParams {
  commitmentId: number;
  success: boolean;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}

export async function judgeCommitment({
  commitmentId,
  success,
  onFinish,
  onCancel,
}: JudgeParams): Promise<void> {
  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'judge-commitment',
    functionArgs: [uintCV(commitmentId), boolCV(success)],
    network,
    onFinish: (data) => {
      onFinish?.({ txId: data.txId });
    },
    onCancel: () => {
      onCancel?.();
    },
  });
}

export interface ClaimParams {
  commitmentId: number;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}

export async function claimStake({
  commitmentId,
  onFinish,
  onCancel,
}: ClaimParams): Promise<void> {
  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'claim-stake',
    functionArgs: [uintCV(commitmentId)],
    network,
    onFinish: (data) => {
      onFinish?.({ txId: data.txId });
    },
    onCancel: () => {
      onCancel?.();
    },
  });
}
