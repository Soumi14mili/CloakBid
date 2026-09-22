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
  Lock,
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
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-midnight-950/85 border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            soundFx.playClick();
            setActiveTab('auctions');
          }}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-midnight-900 border border-vault-purple/30 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-vault-purple/60 group-hover:shadow-vault-glow">
            <img
              src={cloakbidLogo}
              alt="CloakBid Logo"
              className="w-7 h-7 object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-vault-purple/20 via-transparent to-cipher-teal/10 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider text-white group-hover:text-vault-purple-light transition-colors">
                CLOAKBID
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-vault-purple/15 text-vault-purple-light border border-vault-purple/30">
                ZK
              </span>
            </div>
            <p className="text-[10.5px] font-sans text-slate-400 tracking-normal">
              Confidential Sealed-Bid Auctions
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-midnight-900/60 p-1.5 rounded-full border border-white/5">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(item.id);
                }}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-vault-purple/20 border border-vault-purple/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
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

        {/* Right Side: Network Badge, Audio Toggle & Wallet Button */}
        <div className="flex items-center gap-3">
          {/* Midnight Preprod Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-900/80 border border-white/5 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Midnight Preprod</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            className="w-9 h-9 rounded-xl bg-midnight-900/80 border border-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-vault-purple-light" />}
          </button>

          {/* Wallet Connector */}
          {!wallet.connected ? (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="btn-vault-primary text-xs !py-2.5 !px-4.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              {connecting ? 'Connecting Lace...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowWalletMenu(!showWalletMenu);
                }}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-midnight-900/90 border border-vault-purple/30 hover:border-vault-purple/60 transition-colors text-xs font-mono"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                <span className="text-slate-300 font-semibold">{wallet.address}</span>
                <span className="text-vault-purple-light border-l border-white/10 pl-2">
                  {wallet.balance}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-midnight-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-3 space-y-2 z-50 text-xs">
                  <div className="px-2 py-1.5 border-b border-white/5">
                    <p className="text-[10px] font-mono text-slate-400">CONNECTED WALLET (LACE)</p>
                    <p className="font-mono text-slate-200 mt-0.5 truncate">{wallet.address}</p>
                    <p className="text-vault-purple-light font-mono font-semibold mt-1">
                      {wallet.balance}
                    </p>
                  </div>

                  <button
                    onClick={onClaimFaucet}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-200 hover:bg-vault-purple/15 hover:text-vault-purple-light transition-colors text-left font-mono"
                  >
                    <Droplets className="w-3.5 h-3.5 text-cipher-teal" />
                    <span>Claim +1,000 tDUST Faucet</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-200 hover:bg-white/5 transition-colors text-left font-mono"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? 'Address Copied' : 'Copy Full Address'}</span>
                  </button>

                  <a
                    href="https://explorer.midnight.network/contract/mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-200 hover:bg-white/5 transition-colors text-left font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Contract on Explorer</span>
                  </a>

                  <div className="pt-1 border-t border-white/5">
                    <button
                      onClick={() => {
                        setShowWalletMenu(false);
                        onDisconnect();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-mono"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-midnight-900 border border-white/10 flex items-center justify-center text-slate-400"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-midnight-950/95 px-4 py-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5"
            >
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="w-4 h-4 rounded-full bg-vault-purple text-[10px] text-white flex items-center justify-center font-mono">
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 px-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Midnight Preprod
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
