import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Eye,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Cpu,
} from 'lucide-react';

export const SecurityComparison: React.FC = () => {
  const comparisons = [
    {
      feature: 'Bid Value Privacy',
      traditional: {
        status: 'fail',
        title: 'Plaintext on Chain / Mempool',
        desc: 'Bids are visible to validators, miners, and MEV arbitrage bots before settlement.',
      },
      cloakbid: {
        status: 'pass',
        title: 'Private Witness (Client-Side)',
        desc: 'Amounts never leave the bidder’s browser unshielded. Stored in zero-knowledge state.',
      },
    },
    {
      feature: 'MEV & Front-Running',
      traditional: {
        status: 'fail',
        title: 'Severe Sandwich Attacks',
        desc: 'Competitors can detect pending bids in the mempool and outbid by 1 wei in the same block.',
      },
      cloakbid: {
        status: 'pass',
        title: 'Mathematically Impossible',
        desc: 'Validators only see Poseidon commitment hashes. No value to extract or front-run.',
      },
    },
    {
      feature: 'Identity Anonymity',
      traditional: {
        status: 'fail',
        title: 'Public Wallet Address',
        desc: 'Whale addresses, institutional treasuries, and previous bidding habits are fully deanonymized.',
      },
      cloakbid: {
        status: 'pass',
        title: 'Shielded Pseudonymous ID',
        desc: 'Public key is masked under zero-knowledge proof without compromising verifiable settlement.',
      },
    },
    {
      feature: 'Shill Bidding & Sniping',
      traditional: {
        status: 'fail',
        title: 'Pervasive Market Distortion',
        desc: 'Sellers can insert fake bids or snipe during the final seconds to artificially pump reserve.',
      },
      cloakbid: {
        status: 'pass',
        title: 'Deterministic Sealed Epochs',
        desc: 'All bids are locked simultaneously during commit phase with zero reactive bid manipulation.',
      },
    },
    {
      feature: 'Settlement Verifiability',
      traditional: {
        status: 'warning',
        title: 'Centralized or Leaked',
        desc: 'Either requires trusting an off-chain auctioneer, or all losing bids must be published.',
      },
      cloakbid: {
        status: 'pass',
        title: 'ZK Compact Proof on Midnight',
        desc: 'Cryptographic proof guarantees highest bid won without disclosing any losing bid amounts.',
      },
    },
  ];

  return (
    <div className="surface-card p-6 border-white/[0.08] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              SECURITY & PRIVACY COMPARISON
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structural differences between standard Web3 / English auctions and CloakBid’s Zero-Knowledge protocol.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Legacy System
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CloakBid Protocol
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-3">
        {comparisons.map((row, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-white/[0.06] bg-slate-950/40 hover:border-white/10 transition-colors"
          >
            <div className="text-xs font-semibold text-slate-200 tracking-wide mb-3 flex items-center justify-between">
              <span className="font-mono text-purple-300 uppercase text-[11px]">
                {idx + 1}. {row.feature}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Architecture Metric
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Traditional */}
              <div className="p-3.5 rounded-lg border border-rose-500/15 bg-rose-950/10 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-300 font-medium">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-semibold text-rose-200 text-xs">
                    {row.traditional.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                  {row.traditional.desc}
                </p>
              </div>

              {/* CloakBid */}
              <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/10 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-emerald-200 text-xs">
                    {row.cloakbid.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-5">
                  {row.cloakbid.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Quote / Summary Callout */}
      <div className="p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-white">Mathematical Trust Over Institutional Trust</p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              CloakBid replaces legal non-disclosure agreements with Compact zero-knowledge cryptographic proofs verified directly by Midnight Preprod consensus.
            </p>
          </div>
        </div>

        <div className="shrink-0 font-mono text-[11px] text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
          Zero Leakage SLA: 100%
        </div>
      </div>
    </div>
  );
};
