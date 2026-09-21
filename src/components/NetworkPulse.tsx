import React, { useEffect, useState } from 'react';
import { Activity, Zap, Clock } from 'lucide-react';

interface NetworkStat {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

export const NetworkPulse: React.FC = () => {
  const [stats, setStats] = useState<NetworkStat[]>([
    { label: 'Block Height', value: '1,245,891', trend: 'up' },
    { label: 'Avg Block Time', value: '4.2s', trend: 'stable' },
    { label: 'ZK Proofs/Hr', value: '847', trend: 'up' },
    { label: 'TPS', value: '12.4', trend: 'stable' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(s => {
        if (s.label === 'Block Height') {
          const n = parseInt(s.value.replace(/,/g, '')) + 1;
          return { ...s, value: n.toLocaleString() };
        }
        if (s.label === 'ZK Proofs/Hr') {
          const delta = Math.floor(Math.random() * 5) - 2;
          const n = Math.max(800, parseInt(s.value) + delta);
          return { ...s, value: n.toString(), trend: delta > 0 ? 'up' : 'down' };
        }
        return s;
      }));
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card px-5 py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Activity className="w-4 h-4 text-cipher-teal animate-pulse" />
        <span className="text-xs font-mono text-cipher-teal font-semibold">NETWORK</span>
      </div>
      <div className="flex items-center gap-6">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-2 flex-shrink-0">
            <div>
              <p className="text-[10px] font-mono text-slate-600">{s.label}</p>
              <p className="text-xs font-mono text-slate-300 tabular-nums">{s.value}</p>
            </div>
            <span className={`text-xs ${s.trend === 'up' ? 'text-cipher-green' : s.trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
              {s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '–'}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Zap className="w-3.5 h-3.5 text-auction-gold" />
        <span className="text-[10px] font-mono text-auction-gold">LIVE</span>
      </div>
    </div>
  );
};
