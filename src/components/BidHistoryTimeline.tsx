import React from 'react';
import { Clock, CheckCircle, XCircle, Loader, Gavel, Lock, Trophy, Play, RefreshCw } from 'lucide-react';
import type { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const TX_ICONS: Record<Transaction['type'], React.ReactNode> = {
  commit_bid: <Lock className="w-4 h-4 text-auction-gold" />,
  close_bidding: <Gavel className="w-4 h-4 text-amber-400" />,
  finalize_auction: <Trophy className="w-4 h-4 text-cipher-teal" />,
  initialize: <Play className="w-4 h-4 text-cipher-green" />,
  reset_auction: <RefreshCw className="w-4 h-4 text-vault-purple" />,
};

const TX_LABELS: Record<Transaction['type'], string> = {
  commit_bid: 'Commit Sealed Bid',
  close_bidding: 'Close Bidding Window',
  finalize_auction: 'Finalize & Prove Winner',
  initialize: 'Initialize Auction',
  reset_auction: 'Reset Auction',
};

export const BidHistoryTimeline: React.FC<Props> = ({ transactions }) => {
  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return new Date(ts).toLocaleTimeString();
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center space-y-3">
        <Clock className="w-10 h-10 text-slate-600 mx-auto" />
        <p className="text-slate-500 text-sm font-mono">No transactions yet.</p>
        <p className="text-xs text-slate-600 font-mono">Transactions will appear here as you interact with the auction.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-white">TRANSACTION HISTORY</h2>
        <span className="text-xs font-mono text-slate-500">{transactions.length} txs</span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-auction pr-1">
        {transactions.map((tx, idx) => (
          <div
            key={tx.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-midnight-900/60 border border-white/5 hover:border-auction-gold/20 transition-all duration-200 group"
          >
            {/* Status */}
            <div className="flex-shrink-0">
              {tx.status === 'pending' ? (
                <Loader className="w-4 h-4 text-auction-gold animate-spin" />
              ) : tx.status === 'confirmed' ? (
                <CheckCircle className="w-4 h-4 text-cipher-green" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>

            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-midnight-800 flex items-center justify-center flex-shrink-0">
              {TX_ICONS[tx.type]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{TX_LABELS[tx.type]}</p>
              <p className="text-xs font-mono text-slate-500 truncate">
                {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
              </p>
            </div>

            {/* Right */}
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-mono text-slate-500">{formatTime(tx.timestamp)}</p>
              <p className="text-[10px] font-mono text-slate-600">Fee: {tx.fee}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
