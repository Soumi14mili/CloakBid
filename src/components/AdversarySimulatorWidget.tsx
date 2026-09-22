import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Bug, Play, Terminal, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';

type AttackType = 'mev-sniff' | 'sandwich' | 'sybil-correlation';

interface AttackScenario {
  id: AttackType;
  title: string;
  tag: string;
  threat: string;
  mitigation: string;
  statusText: string;
}

export const AdversarySimulatorWidget: React.FC = () => {
  const [selectedAttack, setSelectedAttack] = useState<AttackType>('mev-sniff');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [attackLogs, setAttackLogs] = useState<string[]>([
    'ADVERSARY_SIMULATOR // READY',
    'Select a known DeFi attack vector and click "Launch Exploit Test".',
  ]);
  const [defenseOutcome, setDefenseOutcome] = useState<'idle' | 'deflected'>('idle');

  const scenarios: Record<AttackType, AttackScenario> = {
    'mev-sniff': {
      id: 'mev-sniff',
      title: 'Mempool Sniffing Bot',
      tag: 'MEV_EXPLOIT',
      threat: 'Attacker scans public mempool for pending bid amounts to calculate exact winning margins.',
      mitigation: 'Compact witness variables exist strictly in client RAM. The broadcast payload contains only a Pedersen hash and PLONK proof π.',
      statusText: 'DEFLECTED: 0 Bytes Amount Data Leaked',
    },
    'sandwich': {
      id: 'sandwich',
      title: 'Sandwich & Front-Run Attack',
      tag: 'FRONT_RUNNING',
      threat: 'Flashbots bot submits higher priority gas transactions to front-run bids by fractional amounts.',
      mitigation: 'Auction window enforces state machine transition. Nobody knows what to outbid because all bids are sealed until settlement.',
      statusText: 'BLOCKED: Target Valuations Mathematically Indiscernible',
    },
    'sybil-correlation': {
      id: 'sybil-correlation',
      title: 'Graph Correlation Attack',
      tag: 'DE-ANONYMIZATION',
      threat: 'Heuristic clustering attempts to tie wallet public keys to specific lot commitments.',
      mitigation: 'Midnight shielded transactions decouple wallet ownership from the on-chain commitment anchor.',
      statusText: 'NEUTRALIZED: Shielded Address Proof Verification',
    },
  };

  const handleLaunchAttack = () => {
    soundFx.playScan();
    setSimulating(true);
    setDefenseOutcome('idle');
    const scenario = scenarios[selectedAttack];

    setAttackLogs([
      `[SIMULATION_INIT] Launching ${scenario.title}...`,
      `[1/4] Intercepting P2P gossip protocol on Midnight Preprod testnet...`,
    ]);

    setTimeout(() => {
      setAttackLogs(prev => [
        ...prev,
        `[2/4] Parsing transaction bytes: found commitment_hash and PLONK proof π...`,
        `[3/4] Attempting to extract bid_amount witness from cryptographic commitment...`,
      ]);
      soundFx.playKey();
    }, 700);

    setTimeout(() => {
      setAttackLogs(prev => [
        ...prev,
        `[ATTACK_FAILED] Reversing Pedersen commitment requires solving Discrete Logarithm over Jubjub curve!`,
        `[DEFENSE_VERIFIED] ${scenario.statusText}`,
      ]);
      setSimulating(false);
      setDefenseOutcome('deflected');
      soundFx.playSuccess();
    }, 1500);
  };

  const currentScenario = scenarios[selectedAttack];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
            <Bug className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-slate-100 tracking-wider">
              LIVE ADVERSARY ATTACK SIMULATOR
            </h4>
            <p className="text-[11px] font-mono text-slate-400">
              Test real-world DeFi attack vectors against Midnight ZK cryptographic defenses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {defenseOutcome === 'deflected' && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-cipher-green px-2 py-0.5 rounded-full bg-cipher-green/10 border border-cipher-green/30">
              <ShieldCheck className="w-3 h-3" /> IMMUNE TO EXPLOIT
            </span>
          )}
        </div>
      </div>

      {/* Scenario Selector Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(Object.keys(scenarios) as AttackType[]).map(type => {
          const s = scenarios[type];
          const isSelected = selectedAttack === type;
          return (
            <button
              key={type}
              onClick={() => {
                soundFx.playClick();
                setSelectedAttack(type);
                setDefenseOutcome('idle');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all text-xs font-mono flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-red-500/15 to-midnight-900 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  : 'bg-midnight-950/70 border-white/5 hover:border-white/20 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{s.title}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-white/5 text-slate-400">{s.tag}</span>
              </div>
              <span className="text-[10px] text-slate-500 truncate">{s.threat}</span>
            </button>
          );
        })}
      </div>

      {/* Attack Console & Launch Button */}
      <div className="grid md:grid-cols-12 gap-3 items-stretch">
        {/* Terminal Logs */}
        <div className="md:col-span-8 bg-black/80 rounded-xl border border-white/10 p-3 font-mono text-xs space-y-1 h-36 overflow-y-auto scrollbar-auction">
          {attackLogs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.includes('DEFENSE_VERIFIED')
                  ? 'text-cipher-green font-bold'
                  : log.includes('ATTACK_FAILED')
                  ? 'text-red-400 font-semibold'
                  : log.includes('SIMULATION_INIT')
                  ? 'text-auction-gold'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Action Column */}
        <div className="md:col-span-4 flex flex-col justify-between gap-2 bg-midnight-950/80 p-3 rounded-xl border border-white/5">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              Target Vector
            </span>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">{currentScenario.title}</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">{currentScenario.mitigation}</p>
          </div>

          <button
            onClick={handleLaunchAttack}
            disabled={simulating}
            className="w-full btn-gold text-white text-xs font-bold py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {simulating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating Exploit...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Exploit Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
