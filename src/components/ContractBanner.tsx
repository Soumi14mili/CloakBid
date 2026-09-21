import React from 'react';
import { ExternalLink, Hash, Wifi } from 'lucide-react';

const CONTRACT_ADDRESS = '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12';

export const ContractBanner: React.FC = () => (
  <div className="glass-card px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-cipher-teal/10 border border-cipher-teal/20 flex items-center justify-center">
        <Hash className="w-4 h-4 text-cipher-teal" />
      </div>
      <div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Deployed Contract</p>
        <p className="font-mono text-xs text-cipher-teal-light mt-0.5 break-all">{CONTRACT_ADDRESS}</p>
      </div>
    </div>
    <div className="flex items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-1.5">
        <Wifi className="w-3.5 h-3.5 text-cipher-green" />
        <span className="text-xs font-mono text-cipher-green">Midnight Preprod</span>
      </div>
      <a
        href="https://explorer.midnight.network"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-cipher-teal transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        Explorer
      </a>
    </div>
  </div>
);
