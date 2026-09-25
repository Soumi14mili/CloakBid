import React, { useState } from 'react';
import {
  Wallet,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  Droplets,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import type { WalletState } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  wallet: WalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onClaimFaucet: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userBidCount?: number;
}

export const Navbar: React.FC<Props> = ({
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

  const navItems = [
    { id: 'auctions', label: 'Auctions' },
    { id: 'my-bids', label: 'My Bids', count: userBidCount },
    { id: 'create', label: 'Create Auction' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080B11]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Simple Premium Brand Logo */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => {
              soundFx.playClick();
              setActiveTab('auctions');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {/* Minimalist Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:border-purple-500/50 transition-colors">
              <div className="w-3.5 h-3.5 border-2 border-purple-400 rounded-sm transform rotate-45" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-base tracking-tight text-white">
                CLOAKBID
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-medium">
                ZK
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
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
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  {item.label}
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-[10px] text-white flex items-center justify-center font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Network Status Pill & Connect Wallet */}
        <div className="flex items-center gap-3">
          {/* Network: Midnight Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.07] text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Network: Midnight Preview</span>
          </div>

          {/* Wallet Action Button / Connected Pill */}
          {!wallet.connected ? (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="btn-primary !py-1.5 !px-4 text-xs font-medium"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-mono text-slate-200 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  {wallet.address.slice(0, 12)}...{wallet.address.slice(-6)}
                </span>
                <span className="hidden lg:inline text-slate-400 font-sans text-xs border-l border-white/10 pl-2 ml-1">
                  {wallet.balance}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-72 surface-card p-3 border-white/15 bg-[#0F1420] shadow-xl text-xs font-mono z-50">
                  <div className="pb-2.5 mb-2 border-b border-white/10 space-y-1">
                    <p className="text-[11px] text-slate-400 font-sans">Connected Lace Account</p>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="truncate pr-2">{wallet.address}</span>
                      <button
                        onClick={handleCopy}
                        title="Copy Address"
                        className="p-1 hover:text-white text-slate-400 rounded"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="py-1.5 px-2.5 rounded bg-slate-900 mb-2 flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 font-sans">Available:</span>
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
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Claim 1,000 tDUST Faucet</span>
                    </button>

                    <a
                      href={`https://explorer.midnight.network/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>View on Midnight Explorer</span>
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

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0F1420] p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-lg text-left text-sm font-medium flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="w-4 h-4 rounded-full bg-purple-600 text-[10px] text-white flex items-center justify-center font-mono">
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Network:</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Midnight Preview
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
