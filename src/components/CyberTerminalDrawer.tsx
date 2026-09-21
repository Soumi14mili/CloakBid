import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2, Zap, Play, CornerDownLeft } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { computeCommitmentHash, generateSalt, truncateHash } from '../utils/crypto';
import type { LedgerState, AuctionConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ledgerState: LedgerState;
  lots: AuctionConfig[];
}

interface CommandLog {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const CyberTerminalDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  ledgerState,
  lots,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: '1', type: 'system', text: 'CLOAK_SHELL v1.4.0 — MIDNIGHT COMPACT RUNTIME INITIALIZED' },
    { id: '2', type: 'system', text: 'Connected to Midnight Preprod [mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop]' },
    { id: '3', type: 'output', text: 'Type "help" to view available cryptographic commands or click the quick tags below.' },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const appendLog = (type: CommandLog['type'], text: string) => {
    setLogs(prev => [...prev, { id: Math.random().toString(), type, text }]);
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundFx.playClick();
    appendLog('cmd', `> ${trimmed}`);
    setHistory(prev => [trimmed, ...prev]);
    setHistoryIdx(-1);

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        appendLog('output', '┌── AVAILABLE COMMANDS ────────────────────────────────────────────────────────┐');
        appendLog('output', '│  status            Dump active ledger state, phase & reserve price          │');
        appendLog('output', '│  hash <amount>     Compute Pedersen commitment hash with CSPRNG salt        │');
        appendLog('output', '│  prove <amount>    Simulate client-side PLONK ZK proof generation sequence  │');
        appendLog('output', '│  witness           Inspect shielded client witness memory isolation         │');
        appendLog('output', '│  circuits          Audit Compact smart contract circuit definitions         │');
        appendLog('output', '│  lots              List active confidential auction lots                    │');
        appendLog('output', '│  matrix            Toggle falling Matrix stream visualization               │');
        appendLog('output', '│  clear             Wipe terminal buffer                                     │');
        appendLog('output', '└──────────────────────────────────────────────────────────────────────────────┘');
        break;

      case 'status':
        appendLog('success', '=== MIDNIGHT LEDGER STATE ===');
        appendLog('output', `• Auction Open:    ${ledgerState.auction_open ? 'TRUE (Accepting Sealed Bids)' : 'FALSE (Bidding Closed)'}`);
        appendLog('output', `• Finalized:       ${ledgerState.finalized ? 'TRUE (Winner Declared)' : 'FALSE'}`);
        appendLog('output', `• Reserve Price:   ${ledgerState.reserve_price.toLocaleString()} tDUST`);
        appendLog('output', `• Sealed Bid Count: ${ledgerState.bid_count} commitments`);
        appendLog('output', `• Winner Hash:     ${ledgerState.winner_hash || 'None (Auction active)'}`);
        break;

      case 'hash': {
        const amt = parseFloat(args[0]);
        if (!amt || isNaN(amt)) {
          appendLog('error', 'Usage: hash <amount_in_tDUST> (e.g. hash 750)');
          soundFx.playError();
          return;
        }
        const salt = generateSalt();
        const hash = computeCommitmentHash(amt, salt);
        appendLog('success', `Computing Pedersen Hash:`);
        appendLog('output', `  Amount Witness : [PRIVATE: ${amt} tDUST]`);
        appendLog('output', `  CSPRNG Salt    : [PRIVATE: ${truncateHash(salt)}]`);
        appendLog('output', `  Commitment Hash: 0x${hash}`);
        appendLog('output', `  Ledger Result  : ONLY hash is posted. Amount is zero-knowledge protected.`);
        soundFx.playLock();
        break;
      }

      case 'prove': {
        const amt = parseFloat(args[0]) || 500;
        appendLog('system', `[ZK_PLONK] Initiating circuit proof for bid amount >= ${ledgerState.reserve_price}...`);
        soundFx.playScan();

        setTimeout(() => appendLog('output', '  [1/4] Allocating witness variables in isolated browser memory sandbox...'), 300);
        setTimeout(() => appendLog('output', '  [2/4] Evaluating arithmetic constraint: (bid_amount >= reserve_price) -> SATISFIED'), 700);
        setTimeout(() => appendLog('output', '  [3/4] Computing quotient polynomial Q(X) across evaluation domain...'), 1100);
        setTimeout(() => {
          appendLog('output', '  [4/4] Generating KZG polynomial commitment batch proof π...');
          appendLog('success', '  ✓ ZK Proof π successfully synthesized! (Proof size: 192 bytes, Verification: 4.2ms)');
          soundFx.playSuccess();
        }, 1600);
        break;
      }

      case 'witness':
        appendLog('output', '=== CLIENT WITNESS MEMORY ISOLATION ===');
        appendLog('output', 'Slot 0x01: [SHIELDED_WITNESS_KEY] -> 256-bit entropy locked');
        appendLog('output', 'Slot 0x02: [BID_AMOUNT_WITNESS]  -> Local RAM only (0 network packets)');
        appendLog('output', 'Slot 0x03: [SALT_NONCE_REGISTER] -> Destroyed upon proof confirmation');
        appendLog('success', '✓ ZERO leakage to public mempool or RPC endpoints');
        break;

      case 'circuits':
        appendLog('output', '=== COMPACT v0.23 EXPORTED CIRCUITS ===');
        appendLog('output', '1. initialize(reserve: Uint<64>): []');
        appendLog('output', '2. commit_bid(): []  { assert(auction_open); assert(bid_amount >= reserve); }');
        appendLog('output', '3. close_bidding(): []  { assert(!finalized); auction_open = false; }');
        appendLog('output', '4. finalize_auction(): []  { assert(!auction_open); finalized = true; }');
        appendLog('output', '5. reset_auction(new_reserve: Uint<64>): []');
        break;

      case 'lots':
        appendLog('output', `=== ${lots.length} ACTIVE CONFIDENTIAL LOTS ===`);
        lots.forEach((lot, i) => {
          appendLog('output', `[#${i + 1}] ${lot.title} | Reserve: ${lot.reservePrice} tDUST | Rarity: ${lot.rarity}`);
        });
        break;

      case 'matrix':
        setMatrixMode(m => !m);
        appendLog('system', `Matrix mode ${!matrixMode ? 'ENABLED' : 'DISABLED'}`);
        break;

      case 'clear':
        setLogs([]);
        break;

      default:
        appendLog('error', `Unknown command: "${command}". Type "help" for command list.`);
        soundFx.playError();
        break;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundFx.playKey();

    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 bg-midnight-950/95 border-t border-auction-gold/30 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 flex flex-col ${
        isExpanded ? 'h-[85vh]' : 'h-[420px]'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-midnight-900/90 border-b border-white/10 select-none">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <TerminalIcon className="w-4 h-4 text-auction-gold animate-pulse" />
          <span className="font-bold text-auction-gold">CLOAK_SHELL</span>
          <span className="text-slate-500">//</span>
          <span className="text-slate-400">MIDNIGHT_COMPACT_ZK_VM</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cipher-teal/10 text-cipher-teal border border-cipher-teal/30">
            ONLINE
          </span>
        </div>

        {/* Quick action chips */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono">
          {['help', 'status', 'prove 750', 'witness', 'circuits'].map(cmd => (
            <button
              key={cmd}
              onClick={() => handleCommand(cmd)}
              className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-auction-gold hover:border-auction-gold/40 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLogs([])}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(e => !e)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            title={isExpanded ? 'Restore' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Close Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div
        className={`flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-auction ${
          matrixMode ? 'text-emerald-400 bg-black/90' : 'text-slate-300'
        }`}
      >
        {logs.map(log => {
          if (log.type === 'cmd') {
            return <div key={log.id} className="text-auction-gold font-bold">{log.text}</div>;
          }
          if (log.type === 'system') {
            return <div key={log.id} className="text-cipher-teal font-semibold">{log.text}</div>;
          }
          if (log.type === 'success') {
            return <div key={log.id} className="text-cipher-green font-semibold">{log.text}</div>;
          }
          if (log.type === 'error') {
            return <div key={log.id} className="text-red-400 font-semibold">{log.text}</div>;
          }
          return <div key={log.id} className="text-slate-300 whitespace-pre-wrap">{log.text}</div>;
        })}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Row */}
      <div className="flex items-center gap-2 p-3 bg-midnight-900/80 border-t border-white/5">
        <span className="text-auction-gold font-mono text-xs font-bold pl-2 select-none">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter command... (try 'help', 'status', 'prove 750', 'hash 1000')"
          className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
        />
        <button
          onClick={() => {
            handleCommand(inputVal);
            setInputVal('');
          }}
          className="p-1.5 rounded-lg bg-auction-gold/10 border border-auction-gold/30 text-auction-gold hover:bg-auction-gold/20 transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
