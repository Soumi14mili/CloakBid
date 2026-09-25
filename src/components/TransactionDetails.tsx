import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  contractAddress?: string;
  txHash?: string;
  proofHash?: string;
}

export const TransactionDetails: React.FC<Props> = ({
  contractAddress = '0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15',
  txHash = '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
  proofHash = '0x3fa8c91d2e4b6a8c0e2b4d6f8a0c2e4b6d8f0a2b4d6f8a0c2e4b6d8f0a2b4d6f',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, val: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <section className="relative py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="vault-card border-white/[0.08] bg-midnight-950/70 overflow-hidden">
          {/* Header Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsOpen(!isOpen);
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-xs font-semibold text-slate-300 tracking-wide uppercase">
                TRANSACTION & PROTOCOL DETAILS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                TECHNICAL
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>{isOpen ? 'Collapse' : 'Expand'}</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Collapsible Content */}
          {isOpen && (
            <div className="p-4 sm:p-5 pt-0 border-t border-white/[0.06] space-y-3 font-mono text-xs animate-in fade-in duration-150">
              {/* Contract */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Contract</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 select-all truncate max-w-xs sm:max-w-sm">
                    {contractAddress}
                  </span>
                  <button
                    onClick={() => copyToClipboard('contract', contractAddress)}
                    title="Copy contract address"
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedKey === 'contract' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://explorer.midnight.network/contract/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:text-white text-slate-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Transaction */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Transaction</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 select-all truncate max-w-xs sm:max-w-sm">
                    {txHash}
                  </span>
                  <button
                    onClick={() => copyToClipboard('tx', txHash)}
                    title="Copy transaction hash"
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedKey === 'tx' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Proof */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-400">Proof</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 select-all truncate max-w-xs sm:max-w-sm">
                    {proofHash}
                  </span>
                  <button
                    onClick={() => copyToClipboard('proof', proofHash)}
                    title="Copy proof hash"
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedKey === 'proof' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Network & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400">Network</span>
                  <span className="text-slate-200 font-semibold">Midnight Preview</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-400">Status</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
