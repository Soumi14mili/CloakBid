import { useState, useCallback } from 'react';
import type { WalletState } from '../types';

const DEMO_ADDRESS = 'mn_addr_preview19fx47fv4pkvsdrl9wlzw5u4tjcd5kuaf4u3yjqvfrc4xs4lz4dns0wg4jd';
const DEMO_BALANCE = '49,384.67 tDUST';

export function useLaceWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: '',
    balance: '0.00 tDUST',
    network: 'Midnight Preview',
  });

  const isLaceAvailable = typeof window !== 'undefined';

  const connect = useCallback(async () => {
    // Simulate wallet connection with loading state
    await new Promise(r => setTimeout(r, 1200));
    setWallet({
      connected: true,
      address: DEMO_ADDRESS,
      balance: DEMO_BALANCE,
      network: 'Midnight Preview',
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
