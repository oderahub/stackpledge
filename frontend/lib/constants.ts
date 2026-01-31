export const CONTRACT_ADDRESS = 'SP2FY55DK4NESNH6E5CJSNZP2CQ5PZ5BX64B29FYG';
export const CONTRACT_NAME = 'stake-pledge';
export const FULL_CONTRACT_ID = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;

// 144 blocks per day on Stacks (roughly 10 minute block times)
export const BLOCKS_PER_DAY = 144;

// Minimum stake in microSTX (1 STX = 1,000,000 microSTX)
export const MIN_STAKE_USTX = 1_000_000n;
export const USTX_PER_STX = 1_000_000n;

// Status codes from contract
export const STATUS = {
  ACTIVE: 1,
  SUCCESS: 2,
  FAILED: 3,
  CLAIMED: 4,
} as const;

export const STATUS_LABELS: Record<number, string> = {
  [STATUS.ACTIVE]: 'Active',
  [STATUS.SUCCESS]: 'Success',
  [STATUS.FAILED]: 'Failed',
  [STATUS.CLAIMED]: 'Claimed',
};

export const STATUS_COLORS: Record<number, string> = {
  [STATUS.ACTIVE]: 'bg-blue-100 text-blue-800',
  [STATUS.SUCCESS]: 'bg-green-100 text-green-800',
  [STATUS.FAILED]: 'bg-red-100 text-red-800',
  [STATUS.CLAIMED]: 'bg-gray-100 text-gray-800',
};
