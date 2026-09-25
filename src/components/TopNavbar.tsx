import React, { useState } from 'react';
import {
  Shield,
  Wallet,
  Volume2,
  VolumeX,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  Droplets,
  Menu,
  X,
} from 'lucide-react';
import type { WalletState } from '../types';
import { soundFx } from '../utils/audio';
import cloakbidLogo from '../assets/images/cloakbid_logo.svg';

interface Props {
  wallet: WalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onClaimFaucet: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userBidCount?: number;
}

export const TopNavbar: React.FC<Props> = ({
  wallet,
  onConnect,
  onDisconnect,
  onClaimFaucet,
  activeTab,
  setActiveTab,
  userBidCount = 0,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnect = async () => {
    soundFx.playClick();
    setConnecting(true);
    await onConnect();
    setConnecting(false);
  };

  const handleCopy = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
    if (!nextMuted) soundFx.playClick();
  };

  const navItems = [
    { id: 'auctions', label: 'Auctions' },
    { id: 'my-bids', label: 'My Bids', count: userBidCount },
    { id: 'create', label: 'Create Auction' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-midnight-950/80 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Tagline */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveTab('auctions');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-midnight-900 border border-white/10 flex items-center justify-center overflow-hidden transition-colors group-hover:border-vault-purple/40">
            <img
              src={cloakbidLogo}
              alt="CloakBid"
              className="w-5 h-5 object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-vault-purple-light transition-colors">
                CLOAKBID
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-vault-purple/15 text-vault-purple-light border border-vault-purple/20">
                ZK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Private Auctions Infrastructure
            </p>
          </div>
        </div>

        {/* Center: Global Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(item.id);
                }}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {item.label}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="w-4 h-4 rounded-full bg-vault-purple text-[10px] text-white flex items-center justify-center font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Network Status & Connect Wallet */}
        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{wallet.network || 'Midnight Preview'}</span>
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Wallet Action Button / State */}
          {!wallet.connected ? (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="btn-vault-primary !py-1.5 !px-4 text-xs font-medium"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-midnight-900 border border-white/10 hover:border-vault-purple/40 text-xs font-mono text-slate-200 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  {wallet.address.slice(0, 7)}...{wallet.address.slice(-4)}
                </span>
                <span className="hidden lg:inline text-slate-400 font-sans text-[11px] border-l border-white/10 pl-2 ml-1">
                  {wallet.balance}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-64 vault-card p-3 border-white/15 bg-midnight-950/95 shadow-xl text-xs font-mono z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2.5 mb-2 border-b border-white/10 space-y-1">
                    <p className="text-[10px] text-slate-400 font-sans">Connected Lace Account</p>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="truncate">{wallet.address}</span>
                      <button
                        onClick={handleCopy}
                        title="Copy Address"
                        className="p-1 hover:text-white text-slate-400 rounded"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="py-1 px-2 rounded bg-midnight-900/80 mb-2 flex items-center justify-between text-slate-300">
                    <span className="text-[11px] font-sans text-slate-400">Available Balance:</span>
                    <span className="font-bold text-white">{wallet.balance}</span>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onClaimFaucet();
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                    >
                      <Droplets className="w-3.5 h-3.5 text-cipher-teal" />
                      <span>Claim 2,500 tDUST</span>
                    </button>

                    <a
                      href={`https://explorer.midnight.network/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>View on Explorer</span>
                    </a>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setShowWalletMenu(false);
                        onDisconnect();
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-rose-500/10 text-rose-400 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-midnight-950/95 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="w-4 h-4 rounded-full bg-vault-purple text-[10px] text-white flex items-center justify-center font-mono">
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Network:</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {wallet.network || 'Midnight Preview'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
