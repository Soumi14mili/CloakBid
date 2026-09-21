import React, { useState } from 'react';
import { Cpu, Shield, Lock, CheckCircle2, ArrowRight, EyeOff, Sparkles, Layers, Activity } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CircuitNode {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  tag: string;
  status: 'private' | 'zk-circuit' | 'public-ledger';
  equation: string;
  description: string;
  compactCode: string;
}

export const ZKCircuitVisualizer: React.FC<{ reservePrice: number }> = ({ reservePrice }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('witness');
  const [testAmount, setTestAmount] = useState<number>(750);
  const isSatisfied = testAmount >= reservePrice;

  const nodes: CircuitNode[] = [
    {
      id: 'witness',
      name: 'Private Witness',
      subtitle: 'Client RAM Sandbox',
      icon: <Lock className="w-5 h-5 text-auction-gold" />,
      tag: 'WITNESS_ALLOC',
      status: 'private',
      equation: 'w = \\{ bid\\_amount, \\; salt \\} \\in \\mathbb{F}_p',
      description: 'The bid value and random 256-bit salt remain locked strictly in browser client memory. No network socket or mempool ever observes this data.',
      compactCode: `witness bid_amount(): Uint<64>;\nwitness bid_salt(): Bytes<32>;`,
    },
    {
      id: 'pedersen',
      name: 'Pedersen Commitment',
      subtitle: 'Homomorphic Binding',
      icon: <Shield className="w-5 h-5 text-vault-purple-light" />,
      tag: 'COLLISION_RESIST',
      status: 'zk-circuit',
      equation: 'C = g^{bid\\_amount} \\cdot h^{salt} \\pmod p',
      description: 'Creates an unconditionally hiding, computationally binding cryptographic commitment. Reversing this commitment requires solving the Discrete Logarithm problem.',
      compactCode: `export ledger winner_hash: Bytes<32>;\n// Hash computed inside circuit`,
    },
    {
      id: 'constraint',
      name: 'Arithmetic Gate',
      subtitle: 'ZK Range Assertion',
      icon: <Cpu className="w-5 h-5 text-cipher-teal" />,
      tag: 'R1CS_GATE',
      status: 'zk-circuit',
      equation: 'q_L \\cdot w_a + q_R \\cdot w_b + q_M (w_a w_b) + q_C = 0',
      description: 'Mathematical assertion that bid_amount >= reserve_price without exposing the underlying bid amount. If the condition fails, proof synthesis halts immediately.',
      compactCode: `assert(bid_amount >= reserve_price, "Bid below reserve");`,
    },
    {
      id: 'plonk',
      name: 'PLONK Prover',
      subtitle: 'KZG Polynomial Proof',
      icon: <Sparkles className="w-5 h-5 text-auction-gold" />,
      tag: 'POLY_COMMIT',
      status: 'zk-circuit',
      equation: '\\pi = \\{ [a]_1, [b]_1, [c]_1, [z]_1, [t_{lo}]_1, [t_{mid}]_1, [t_{hi}]_1 \\}',
      description: 'Synthesizes an ultra-compact 192-byte SNARK proof. Verifiable on-chain by the Midnight ledger in under 5 milliseconds.',
      compactCode: `export circuit commit_bid(): [] {\n  // Zero-Knowledge Proof generated here\n}`,
    },
    {
      id: 'ledger',
      name: 'Midnight Ledger',
      subtitle: 'Dual-State Consensus',
      icon: <Layers className="w-5 h-5 text-cipher-green" />,
      tag: 'PUBLIC_ANCHOR',
      status: 'public-ledger',
      equation: '\\Delta \\mathcal{S} = \\{ bid\\_count \\leftarrow bid\\_count + 1, \\; C \\in \\mathcal{T} \\}',
      description: 'The Midnight blockchain stores the commitment hash and verifies proof π. Zero information regarding losing bid valuations is ever revealed.',
      compactCode: `ledger bid_count: Uint<32>;\nbid_count = bid_count + 1;`,
    },
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="space-y-6">
      <div className="glass-card-gold p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-auction-gold animate-pulse" />
              <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">
                COMPACT ZK CIRCUIT PIPELINE
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Interactive structural map of the Zero-Knowledge PLONK proof system on Midnight
            </p>
          </div>

          {/* Interactive Test Simulator */}
          <div className="flex items-center gap-2 bg-midnight-900/80 p-2 rounded-xl border border-white/10">
            <span className="text-[11px] font-mono text-slate-400">Test Bid:</span>
            <input
              type="number"
              value={testAmount}
              onChange={e => setTestAmount(parseFloat(e.target.value) || 0)}
              className="w-20 bg-black/50 border border-auction-gold/30 rounded px-2 py-0.5 text-xs font-mono text-auction-gold text-right focus:outline-none"
            />
            <span className="text-[11px] font-mono text-slate-500">tDUST</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                isSatisfied
                  ? 'bg-cipher-green/15 text-cipher-green border border-cipher-green/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}
            >
              {isSatisfied ? 'VALID' : 'BELOW RESERVE'}
            </span>
          </div>
        </div>

        {/* Pipeline Graph Node Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {nodes.map((node, idx) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <div key={node.id} className="relative flex flex-col items-center">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedNodeId(node.id);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-b from-auction-gold/15 to-midnight-900 border-auction-gold shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-midnight-900/60 border-white/5 hover:border-white/20 hover:bg-midnight-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      {node.icon}
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                      STEP 0{idx + 1}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-slate-200 truncate">{node.name}</h4>
                  <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{node.subtitle}</p>

                  <div className="mt-3 flex items-center gap-1 text-[9px] font-mono">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        node.status === 'private'
                          ? 'bg-amber-400'
                          : node.status === 'zk-circuit'
                          ? 'bg-cipher-teal'
                          : 'bg-cipher-green'
                      }`}
                    />
                    <span className="text-slate-400 uppercase">{node.status}</span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-auction-gold via-cipher-teal to-auction-gold animate-shimmer" />
                  )}
                </button>

                {/* Arrow connector for desktop */}
                {idx < nodes.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <ArrowRight className="w-3.5 h-3.5 text-auction-gold/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Deep Node Inspector Panel */}
        <div className="glass-card p-5 rounded-xl border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-auction-gold/10 text-auction-gold border border-auction-gold/30">
                {selectedNode.tag}
              </span>
              <h4 className="font-display font-bold text-sm text-slate-100">{selectedNode.name} Inspector</h4>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Mathematical & Compact Implementation Details
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Description & Formula */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Cryptographic Operation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                  Mathematical Formalism
                </span>
                <div className="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-xs text-cipher-teal break-all">
                  {selectedNode.equation}
                </div>
              </div>
            </div>

            {/* Compact Code Snippet */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Compact Smart Contract Language (contracts/cloakbid.compact)
              </span>
              <pre className="bg-black/60 p-3 rounded-lg border border-white/5 font-mono text-xs text-emerald-400 overflow-x-auto">
                <code>{selectedNode.compactCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
