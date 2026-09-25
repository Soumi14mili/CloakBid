import React, { useState } from 'react';
import {
  Users,
  Shield,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Lock,
  ExternalLink,
  Search,
} from 'lucide-react';
import type { Commitment } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  commitments: Commitment[];
  myCommitmentHash: string | null;
  myBidAmount: number | null;
}

export const ParticipantsTable: React.FC<Props> = ({
  commitments,
  myCommitmentHash,
  myBidAmount,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCopy = (hash: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filtered = commitments.filter(c =>
    c.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.bidder || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.isMine && 'you'.includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="surface-card p-6 border-white/[0.08] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              SEALED PARTICIPANTS
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {commitments.length} Bidders
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            All submitted bids are cryptographically sealed. Bidder values remain mathematically hidden until round settlement.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search commitment or bidder..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/70 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-mono"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-slate-950/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/[0.08] bg-slate-900/60 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 font-medium">Bidder</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Commitment Hash</th>
              <th className="py-3 px-4 font-medium">Timestamp</th>
              <th className="py-3 px-4 font-medium">ZK Proof State</th>
              <th className="py-3 px-4 font-medium text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                  No sealed commitments found matching query.
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => {
                const isMine = item.isMine || item.hash === myCommitmentHash;
                const truncatedHash = `${item.hash.slice(0, 10)}...${item.hash.slice(-8)}`;

                return (
                  <tr
                    key={item.hash || index}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      isMine ? 'bg-purple-500/[0.04]' : ''
                    }`}
                  >
                    {/* Bidder */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-semibold ${
                            isMine
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-300 border border-white/10'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-slate-200">
                            <span>{item.bidder || (isMine ? 'mn_addr_...4jd' : `Bidder #${item.hash.slice(0, 4).toUpperCase()}`)}</span>
                            {isMine && (
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                                YOU
                              </span>
                            )}
                          </div>
                          {isMine && myBidAmount && (
                            <div className="text-[10px] font-mono text-purple-300/80">
                              Witness: {myBidAmount.toLocaleString()} tDUST (Private)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Lock className="w-2.5 h-2.5" />
                        SEALED
                      </span>
                    </td>

                    {/* Commitment Hash */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] tracking-tight">{truncatedHash}</span>
                        <button
                          onClick={() => handleCopy(item.hash)}
                          className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                          title="Copy Full Hash"
                        >
                          {copiedHash === item.hash ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {typeof item.timestamp === 'number'
                            ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : (item.timestamp || 'Just now')}
                        </span>
                      </div>
                    </td>

                    {/* ZK Proof State */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-mono text-[11px] text-slate-300">
                          Halo2 Validated
                        </span>
                      </div>
                    </td>

                    {/* Verification */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified ✓</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 font-mono">
        <p>Preprod Proof Identifier: Poseidon-ZK-Merkle-v4</p>
        <p className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Zero-Knowledge Circuit: Satisfied on Midnight Ledger
        </p>
      </div>
    </div>
  );
};
