import React from 'react';
import { Shield, ExternalLink, Github, Twitter, Terminal, CheckCircle2 } from 'lucide-react';
import cloakbidLogo from '../assets/images/cloakbid_logo.svg';
import cloakVaultBanner from '../assets/images/cloak_vault_banner.png';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070A0F] py-12 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Cloak Vault Visual Banner */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-2 shadow-2xl">
          <img
            src={cloakVaultBanner}
            alt="CloakBid Zero-Knowledge Execution Vault"
            className="w-full h-auto object-cover rounded-xl"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo & Protocol Info */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
                <img
                  src={cloakbidLogo}
                  alt="CloakBid"
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span className="font-bold text-base tracking-tight text-white font-mono">
                CLOAKBID
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Institutional-grade privacy-preserving sealed-bid auction protocol built with Midnight Compact and Halo2 zero-knowledge proofs.
            </p>
          </div>

          {/* Protocol Links & Contract Info */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400">
            <a
              href="https://explorer.midnight.network/contract/51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15"
            >
              <span>Contract: 51d23a0...8b15</span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            </a>

            <a
              href="https://x.com/xCloakBid"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15"
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>@xCloakBid</span>
            </a>

            <a
              href="https://github.com/Soumi14mili/CloakBid"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15"
            >
              <Github className="w-3.5 h-3.5 text-white" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <p>© 2026 CloakBid Protocol. Midnight Crescent Challenge — Level 4.</p>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Knowledge Proofs Verified by Midnight Preprod Consensus</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
