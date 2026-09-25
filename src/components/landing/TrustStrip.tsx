import React from 'react';
import { Shield, Cpu, CheckCircle2, Code2 } from 'lucide-react';

interface TrustItem {
  icon: React.ReactNode;
  label: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: <Shield className="w-4 h-4 text-cb-t3 shrink-0" />,
    label: 'Built on Midnight Network',
  },
  {
    icon: <Cpu className="w-4 h-4 text-cb-t3 shrink-0" />,
    label: 'Zero-Knowledge Proofs',
  },
  {
    icon: <CheckCircle2 className="w-4 h-4 text-cb-t3 shrink-0" />,
    label: 'On-Chain Settlement',
  },
  {
    icon: <Code2 className="w-4 h-4 text-cb-t3 shrink-0" />,
    label: 'Compact Smart Contracts',
  },
];

const CONTRACT_ADDRESS = '51d23a07...8b15';

export const TrustStrip: React.FC = () => {
  return (
    <div
      className="w-full py-5"
      style={{
        backgroundColor: '#0D0F13',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-center flex-wrap gap-x-8 gap-y-3">
        {TRUST_ITEMS.map((item, index) => (
          <React.Fragment key={item.label}>
            {/* Divider between items */}
            {index > 0 && (
              <span
                className="hidden sm:block select-none text-cb-t3 text-xs leading-none"
                aria-hidden="true"
                style={{ opacity: 0.3 }}
              >
                |
              </span>
            )}

            {/* Trust item */}
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-[13px] text-cb-t3 font-medium whitespace-nowrap">
                {item.label}
              </span>
            </div>
          </React.Fragment>
        ))}

        {/* Contract address — lg+ only, pushed to far right */}
        <div className="hidden lg:flex items-center gap-2 ml-auto">
          <span
            className="text-cb-t3 text-xs leading-none select-none"
            aria-hidden="true"
            style={{ opacity: 0.3 }}
          >
            |
          </span>
          <span
            className="mono text-[11px] text-cb-t3 whitespace-nowrap"
            title="Contract address: 51d23a07...8b15"
          >
            {CONTRACT_ADDRESS}
          </span>
        </div>
      </div>
    </div>
  );
};
