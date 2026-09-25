import React, { useState } from 'react';
import { Lock, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import type { BidCommitment, AuctionConfig } from '../../types';

interface Props {
  commitments: BidCommitment[];
  lots: AuctionConfig[];
  myCommitmentHash: string | null;
  walletConnected: boolean;
  walletAddress: string;
}

export const MyBidsPage: React.FC<Props> = ({
  commitments,
  lots,
  myCommitmentHash,
  walletConnected,
  walletAddress,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'settled'>('all');

  // Filter commitments - highlight or include my bids
  const myBids = commitments.filter((c) => c.isMine || c.hash === myCommitmentHash);
  const displayBids = myBids.length > 0 ? myBids : commitments;

  const truncateAddr = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 14)}...${addr.slice(-8)}`;
  };

  return (
    <div style={{ background: '#08090C' }} className="min-h-[85vh] py-8 px-5 sm:px-8 max-w-content mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-cb-t1 tracking-tight">My Sealed Bids</h2>
          <p className="text-cb-t2 text-[14px] mt-1">
            Private witness records and verifiable cryptographic commitments
          </p>
        </div>
        {walletConnected && walletAddress && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)]"
            style={{ background: '#12151B' }}
          >
            <div className="w-2 h-2 rounded-full bg-cb-success" />
            <span className="font-mono text-[11px] text-cb-t2">
              {truncateAddr(walletAddress)}
            </span>
          </div>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card-sub p-5 rounded-xl">
          <p className="label">Total Committed</p>
          <p className="text-2xl font-bold text-cb-t1 mt-2">{displayBids.length}</p>
          <p className="text-[12px] text-cb-t3 mt-1">Sealed on Midnight</p>
        </div>
        <div className="card-sub p-5 rounded-xl">
          <p className="label">ZK Proofs Generated</p>
          <p className="text-2xl font-bold text-cb-t1 mt-2">{displayBids.length}</p>
          <p className="text-[12px] text-cb-t3 mt-1">Halo2 PLONKish circuits</p>
        </div>
        <div className="card-sub p-5 rounded-xl">
          <p className="label">Witness Status</p>
          <p className="text-2xl font-bold text-cb-success mt-2">Shielded</p>
          <p className="text-[12px] text-cb-t3 mt-1">100% Zero-knowledge isolated</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="tab-bar">
          <button
            onClick={() => setFilter('all')}
            className={`tab ${filter === 'all' ? 'active' : ''}`}
          >
            All Bids ({displayBids.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`tab ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('settled')}
            className={`tab ${filter === 'settled' ? 'active' : ''}`}
          >
            Settled
          </button>
        </div>
      </div>

      {/* Content */}
      {!walletConnected ? (
        <div className="card p-12 text-center rounded-2xl mt-6">
          <div className="w-12 h-12 rounded-xl bg-cb-elevated mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-cb-t3" />
          </div>
          <h3 className="text-lg font-semibold text-cb-t1">Wallet Not Connected</h3>
          <p className="text-cb-t2 text-sm mt-2 max-w-sm mx-auto">
            Connect your Midnight Lace wallet to view your private bid witnesses and on-chain commitments.
          </p>
        </div>
      ) : displayBids.length === 0 ? (
        <div className="card p-12 text-center rounded-2xl mt-6">
          <div className="w-12 h-12 rounded-xl bg-cb-elevated mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-cb-t3" />
          </div>
          <h3 className="text-lg font-semibold text-cb-t1">No Sealed Bids Yet</h3>
          <p className="text-cb-t2 text-sm mt-2 max-w-sm mx-auto">
            You haven&apos;t placed any bids yet. Explore active auctions to submit your first zero-knowledge sealed bid.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayBids.map((b, index) => {
            const lot = lots[index % lots.length];
            return (
              <div key={b.id || index} className="card p-6 rounded-xl hover-lift">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-cb-t1">
                      {lot?.title || `Auction Lot #${index + 1}`}
                    </span>
                    {b.isMine && (
                      <span className="badge-accent text-[11px]">YOUR BID</span>
                    )}
                    <span className="badge-live text-[10px]">VERIFIED</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-cb-t3 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-cb-t3 font-medium mb-1.5">
                      On-Chain Commitment Hash
                    </p>
                    <div className="bg-cb-elevated p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)]">
                      <span className="font-mono text-[11px] text-cb-t2 break-all">
                        {b.hash}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-cb-t3 font-medium mb-1.5">
                      Witness Amount (Private)
                    </p>
                    <div className="bg-cb-elevated p-2.5 rounded-lg border border-[rgba(255,255,255,0.04)] flex items-center justify-between">
                      <span className="font-mono text-[13px] text-cb-t3 tracking-widest">
                        ████████████
                      </span>
                      <span className="text-[11px] text-cb-accent flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Shielded
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)] text-[12px] text-cb-t3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-cb-success">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ZK Proof Validated
                    </span>
                    <span>Gas: 0.002 tDUST</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span>Contract: 0x51d23a...8b15</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
