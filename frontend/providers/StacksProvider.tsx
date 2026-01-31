'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  connect as stacksConnect,
  disconnect as stacksDisconnect,
  isConnected as checkConnected,
  getLocalStorage
} from '@stacks/connect';

interface StacksContextType {
  stxAddress: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const StacksContext = createContext<StacksContextType | null>(null);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check if user is already connected on mount
    const isAlreadyConnected = checkConnected();
    setConnected(isAlreadyConnected);

    if (isAlreadyConnected) {
      const data = getLocalStorage();
      // Find mainnet STX address from stored addresses
      const stxAddresses = data?.addresses?.stx;
      if (stxAddresses && stxAddresses.length > 0) {
        // Prefer mainnet address
        const mainnetAddr = stxAddresses.find((a: { address: string }) => a.address.startsWith('SP'));
        const address = mainnetAddr?.address || stxAddresses[0]?.address;
        if (address) {
          setStxAddress(address);
        }
      }
    }

    setIsLoading(false);
  }, []);

  const connect = useCallback(async () => {
    try {
      const response = await stacksConnect();

      // Get STX addresses from response
      const stxAddresses = response.addresses.filter(
        (addr) => addr.symbol === 'STX'
      );

      if (stxAddresses.length > 0) {
        // Prefer mainnet address (starts with SP)
        const mainnetAddr = stxAddresses.find((a) => a.address.startsWith('SP'));
        const address = mainnetAddr?.address || stxAddresses[0]?.address;

        if (address) {
          setStxAddress(address);
          setConnected(true);
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    stacksDisconnect();
    setStxAddress(null);
    setConnected(false);
  }, []);

  return (
    <StacksContext.Provider
      value={{
        stxAddress,
        isConnected: connected,
        isLoading,
        connect,
        disconnect,
      }}
    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks(): StacksContextType {
  const context = useContext(StacksContext);
  if (!context) {
    throw new Error('useStacks must be used within a StacksProvider');
  }
  return context;
}
