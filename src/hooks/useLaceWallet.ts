import { useState, useCallback } from 'react';
import type { WalletState } from '../types';

const DEMO_ADDRESS = '0x3fa8...c91d';
const DEMO_BALANCE = '12,500.00 tDUST';

export function useLaceWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: '',
    balance: '0.00 tDUST',
    network: 'Midnight Preprod',
  });

  const isLaceAvailable = typeof window !== 'undefined';

  const connect = useCallback(async () => {
    // Simulate wallet connection with loading state
    await new Promise(r => setTimeout(r, 1200));
    setWallet({
      connected: true,
      address: DEMO_ADDRESS,
      balance: DEMO_BALANCE,
      network: 'Midnight Preprod',
    });
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      connected: false,
      address: '',
      balance: '0.00 tDUST',
      network: 'Midnight Preprod',
    });
  }, []);

  const claimFaucet = useCallback(() => {
    if (!wallet.connected) return;
    const current = parseFloat(wallet.balance.replace(/[^0-9.]/g, ''));
    const newBalance = (current + 1000).toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' tDUST';
    setWallet(w => ({ ...w, balance: newBalance }));
  }, [wallet]);

  return { wallet, isLaceAvailable, connect, disconnect, claimFaucet };
}
