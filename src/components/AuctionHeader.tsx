import React, { useState } from 'react';
import { Gavel, Wifi, ChevronDown, LogOut, Droplets, Copy, Check, ExternalLink } from 'lucide-react';
import type { WalletState } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  wallet: WalletState;
  isLaceAvailable: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onClaimFaucet: () => void;
}

export const AuctionHeader: React.FC<Props> = ({
  wallet, isLaceAvailable, onConnect, onDisconnect, onClaimFaucet
}) => {
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleConnect = async () => {
    soundFx.playClick();
    setConnecting(true);
    await onConnect();
    setConnecting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-auction-gold/10 backdrop-blur-2xl bg-midnight-950/80">
      {/* Scan line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-auction-gold/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-auction-gold/15 group-hover:bg-auction-gold/25 transition-all animate-bid-pulse" />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-auction-gold/40 to-vault-purple/40 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
            <img
              src="/images/cloakbid_logo.svg"
              alt="CloakBid Logo"
              className="w-10 h-10 object-contain relative z-10 rounded-xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <h1 className="font-display text-lg font-black gradient-text-gold tracking-wider group-hover:brightness-110 transition-all">CLOAKBID</h1>
            <p className="text-[10px] font-mono text-slate-400 -mt-1 tracking-tight">CONFIDENTIAL AUCTIONS · MIDNIGHT</p>
          </div>
        </div>

        {/* Network status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cipher-teal/5 border border-cipher-teal/20">
          <Wifi className="w-3.5 h-3.5 text-cipher-teal animate-pulse" />
          <span className="text-xs font-mono text-cipher-teal">Preprod Testnet</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cipher-green animate-ping-slow" />
        </div>

        {/* Wallet */}
        {wallet.connected ? (
          <div className="relative">
            <button
              onClick={() => { soundFx.playClick(); setShowMenu(m => !m); }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-midnight-800/80 border border-auction-gold/20 hover:border-auction-gold/40 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-auction-gold to-vault-purple flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">CB</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-mono text-slate-300">{wallet.address}</p>
                <p className="text-[10px] font-mono text-auction-gold">{wallet.balance}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 glass-card-gold p-2 space-y-1">
                <button onClick={handleCopy} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-auction-gold/10 text-xs text-slate-300 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-cipher-green" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
                <button onClick={() => { soundFx.playClick(); onClaimFaucet(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cipher-teal/10 text-xs text-slate-300 transition-colors">
                  <Droplets className="w-3.5 h-3.5 text-cipher-teal" />
                  Claim Faucet (+1000 tDUST)
                </button>
                <a href="https://explorer.midnight.network" target="_blank" rel="noreferrer" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-slate-300 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Block Explorer
                </a>
                <div className="border-t border-white/5 mt-1 pt-1">
                  <button onClick={() => { soundFx.playClick(); onDisconnect(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-xs text-red-400 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting || !isLaceAvailable}
            className="btn-gold text-sm text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {connecting ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connecting...</>
            ) : (
              <><Gavel className="w-4 h-4" /> Connect Wallet</>
            )}
          </button>
        )}
      </div>
    </header>
  );
};