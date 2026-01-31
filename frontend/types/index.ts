export interface Commitment {
  id: number;
  creator: string;
  judge: string;
  description: string;
  stakeAmount: bigint;
  deadlineBlock: number;
  status: CommitmentStatus;
}

export enum CommitmentStatus {
  ACTIVE = 1,
  SUCCESS = 2,
  FAILED = 3,
  CLAIMED = 4,
}

export interface UserStats {
  totalCommitments: number;
  totalStaked: bigint;
  successfulCommitments: number;
  failedCommitments: number;
}

export interface GlobalStats {
  totalCommitments: number;
  totalStaked: bigint;
  totalBurned: bigint;
}

export interface UserData {
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
  };
}
