import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Lock, Coins, Shield } from 'lucide-react';
import type { LedgerState } from '../types';

interface Props {
  ledgerState: LedgerState;
}

function useAnimatedCount(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    startRef.current = value;
    startTimeRef.current = null;
    cancelAnimationFrame(frameRef.current);
    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startRef.current + (target - startRef.current) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

export const AuctionStats: React.FC<Props> = ({ ledgerState }) => {
  const bidCount = useAnimatedCount(ledgerState.bid_count);
  const reserve = useAnimatedCount(ledgerState.reserve_price);

  const stats = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Sealed Bids',
      value: bidCount.toString(),
      sub: 'All amounts hidden',
      hexColor: '#F59E0B',
      glow: 'rgba(245,158,11,0.25)',
    },
    {
      icon: <Coins className="w-5 h-5" />,
      label: 'Reserve Price',
      value: `${reserve.toLocaleString()}`,
      sub: 'tDUST minimum',
      hexColor: '#A78BFA',
      glow: 'rgba(139,92,246,0.25)',
    },
    {
      icon: <Lock className="w-5 h-5" />,
      label: 'Bid Privacy',
      value: '100%',
      sub: 'ZK shielded',
      hexColor: '#22D3EE',
      glow: 'rgba(6,182,212,0.25)',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Auction Status',
      value: ledgerState.finalized ? 'SETTLED' : ledgerState.auction_open ? 'LIVE' : 'CLOSED',
      sub: ledgerState.finalized ? 'Winner declared' : ledgerState.auction_open ? 'Accepting bids' : 'Awaiting finalization',
      hexColor: ledgerState.finalized ? '#34D399' : ledgerState.auction_open ? '#F59E0B' : '#A78BFA',
      glow: ledgerState.auction_open ? 'rgba(245,158,11,0.25)' : 'rgba(139,92,246,0.25)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card p-5 relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300 cursor-default"
          style={{ boxShadow: `0 0 30px -10px ${stat.glow}` }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${stat.glow}, transparent 70%)` }}
          />

          <div className="relative z-10">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${stat.glow}`, color: stat.hexColor }}
            >
              {stat.icon}
            </div>
            <p className="text-xs font-mono text-slate-500 mb-1">{stat.label}</p>
            <p
              className="font-display text-2xl font-black mb-1 tabular-nums"
              style={{ color: stat.hexColor }}
            >
              {stat.value}
            </p>
            <p className="text-[10px] font-mono text-slate-600">{stat.sub}</p>
          </div>

          {/* Progress bar for bid count */}
          {stat.label === 'Sealed Bids' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-midnight-800">
              <div
                className="h-full bg-gradient-to-r from-auction-gold to-auction-gold-light transition-all duration-1000"
                style={{ width: `${Math.min((ledgerState.bid_count / 20) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
