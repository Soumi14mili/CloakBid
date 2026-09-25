import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Terminal,
  Shield,
  Server,
  FileCode,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  contractAddress?: string;
  txHash?: string;
  proofHash?: string;
}

export const TechnicalDetails: React.FC<Props> = ({
  contractAddress = '0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15',
  txHash = '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
  proofHash = '0x3fa8c91d2e4b6a8c0e2b4d6f8a0c2e4b6d8f0a2b4d6f8a0c2e4b6d8f0a2b4d6f',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, val: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const specs = [
    { label: 'Contract Address', value: contractAddress, isLink: true, link: `https://preview.midnightexplorer.com/contracts/${contractAddress}` },
    { label: 'Verification Key (VK)', value: '0x7d92f58e1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e' },
    { label: 'Settlement Tx Hash', value: txHash },
    { label: 'Halo2 Proof Hash', value: proofHash },
  ];

  const metadata = [
    { label: 'Target Network', value: 'Midnight Preview (Preprod RPC: wss://rpc.preview.midnight.network)' },
    { label: 'Smart Contract Language', value: 'Midnight Compact v0.18.2' },
    { label: 'Proof System', value: 'Halo2 PLONKish Arithmetization' },
    { label: 'Hash Primitive', value: 'Poseidon Hash (Field: Pasta pallas/vesta)' },
    { label: 'Witness Masking', value: 'Client-Side Private State Isolation' },
    { label: 'Consensus Finality', value: 'Deterministic Substrate Grandpa' },
  ];

  return (
    <div className="surface-card border-white/[0.08] overflow-hidden">
      {/* Header Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-purple-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <span>TECHNICAL SPECIFICATIONS & PROVING PARAMETERS</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                DEV & AUDIT
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Compact bytecode, circuit verification keys, and cryptographic hashes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{isOpen ? 'Collapse' : 'Expand Specs'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Drawer Content */}
      {isOpen && (
        <div className="p-6 pt-0 border-t border-white/[0.06] space-y-6 animate-in fade-in duration-150">
          {/* Cryptographic Identifiers */}
          <div className="space-y-3 pt-4">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
              On-Chain Identifiers
            </span>

            <div className="space-y-2">
              {specs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <span className="text-slate-400 shrink-0">{item.label}:</span>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="truncate text-slate-200 text-[11px] select-all">
                      {item.value}
                    </span>
                    <button
                      onClick={() => handleCopy(item.label, item.value)}
                      className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                      title="Copy"
                    >
                      {copiedKey === item.label ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {item.isLink && item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                        title="Open Explorer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Architecture Metadata Table */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Cryptographic Engine Parameters
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {metadata.map((meta, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/40 border border-white/[0.04] space-y-1"
                >
                  <p className="text-[11px] font-mono text-slate-500">{meta.label}</p>
                  <p className="font-mono text-slate-200 text-xs font-medium">{meta.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Snippet Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Compact Circuit Excerpt: sealed_bid_commit()</span>
              </span>
              <span className="text-[10px] text-slate-500">Contract: CloakBid.compact</span>
            </div>

            <pre className="p-4 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`export circuit commitBid(bidAmount: Uint<64>, salt: Bytes<32>): Bytes<32> {
    // 1. Enforce reserve price satisfaction in zero-knowledge
    assert(bidAmount >= ledger.reservePrice, "Bid strictly below reserve");
    
    // 2. Compute non-interactive Poseidon commitment
    const commitment = poseidon_hash([bidAmount as Field, salt as Field]);
    
    // 3. Post commitment to ledger state without exposing witness
    disclose(commitment);
    return commitment;
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
