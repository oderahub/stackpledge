'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCommitment,
  getUserStats,
  getGlobalStats,
  getTotalCommitments,
  getCurrentBlockHeight,
  pledge as contractPledge,
  judgeCommitment as contractJudge,
  claimStake as contractClaim,
  PledgeParams,
  JudgeParams,
  ClaimParams,
} from '@/lib/contracts';
import { Commitment, GlobalStats, UserStats } from '@/types';

export function useCommitment(id: number | null) {
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommitment = useCallback(async () => {
    if (id === null) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getCommitment(id);
      setCommitment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch commitment');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCommitment();
  }, [fetchCommitment]);

  return { commitment, loading, error, refetch: fetchCommitment };
}

export function useUserStats(address: string | null) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getUserStats(address);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useGlobalStats() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGlobalStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch global stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useTotalCommitments() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchTotal = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTotalCommitments();
      setTotal(data);
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  return { total, loading, refetch: fetchTotal };
}

export function useBlockHeight() {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBlockHeight = useCallback(async () => {
    setLoading(true);
    try {
      const height = await getCurrentBlockHeight();
      setBlockHeight(height);
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockHeight();
    // Refresh every minute
    const interval = setInterval(fetchBlockHeight, 60000);
    return () => clearInterval(interval);
  }, [fetchBlockHeight]);

  return { blockHeight, loading, refetch: fetchBlockHeight };
}

export function useRecentCommitments(count: number = 10) {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCommitments = useCallback(async () => {
    setLoading(true);
    try {
      const total = await getTotalCommitments();
      const ids = Array.from({ length: Math.min(count, total) }, (_, i) => total - i);

      const results = await Promise.all(
        ids.map((id) => getCommitment(id).catch(() => null))
      );

      setCommitments(results.filter((c): c is Commitment => c !== null));
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchCommitments();
  }, [fetchCommitments]);

  return { commitments, loading, refetch: fetchCommitments };
}

// Transaction hooks

export function usePledge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const execute = useCallback(async (params: Omit<PledgeParams, 'onFinish' | 'onCancel'>) => {
    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      await contractPledge({
        ...params,
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setError('Transaction cancelled');
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pledge');
      setLoading(false);
    }
  }, []);

  return { execute, loading, error, txId };
}

export function useJudge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const execute = useCallback(async (params: Omit<JudgeParams, 'onFinish' | 'onCancel'>) => {
    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      await contractJudge({
        ...params,
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setError('Transaction cancelled');
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to judge commitment');
      setLoading(false);
    }
  }, []);

  return { execute, loading, error, txId };
}

export function useClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const execute = useCallback(async (params: Omit<ClaimParams, 'onFinish' | 'onCancel'>) => {
    setLoading(true);
    setError(null);
    setTxId(null);

    try {
      await contractClaim({
        ...params,
        onFinish: (data) => {
          setTxId(data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setError('Transaction cancelled');
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim stake');
      setLoading(false);
    }
  }, []);

  return { execute, loading, error, txId };
}
