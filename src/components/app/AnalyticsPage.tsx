import React from 'react';
import { Activity, Lock, Cpu, Network } from 'lucide-react';
import type { BidCommitment, LedgerState } from '../../types';

interface Props {
  commitments: BidCommitment[];
  ledgerState: LedgerState;
}

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value }) => (
  <div className="card p-5 rounded-xl">
    <div className="bg-cb-elevated rounded-lg p-2 w-8 h-8 flex items-center justify-center">
      {icon}
    </div>
    <p className="label mt-3 text-cb-t3">{label}</p>
    <p className="text-2xl font-bold text-cb-t1 mt-2">{value}</p>
  </div>
);

const BAR_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
const BAR_HEIGHTS = [30, 55, 40, 70, 45, 60, 85]; // percent

interface MetricRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, isLast = false }) => (
  <div
    className={`flex justify-between py-2.5 text-[13px] text-cb-t2${
      isLast ? '' : ' border-b border-[rgba(255,255,255,0.05)]'
    }`}
  >
    <span>{label}</span>
    <span className="text-cb-t1 font-medium">{value}</span>
  </div>
);

export const AnalyticsPage: React.FC<Props> = ({ commitments, ledgerState }) => {
  const zkProofsGenerated = (commitments.length + 9).toString();

  const kpiCards: KpiCardProps[] = [
    {
      icon: <Activity size={16} className="text-cb-t2" />,
      label: 'Active Auctions',
      value: '3',
    },
    {
      icon: <Lock size={16} className="text-cb-t2" />,
      label: 'Sealed Bids',
      value: commitments.length.toString(),
    },
    {
      icon: <Cpu size={16} className="text-cb-t2" />,
      label: 'ZK Proofs Generated',
      value: zkProofsGenerated,
    },
    {
      icon: <Network size={16} className="text-cb-t2" />,
      label: 'Network',
      value: 'Midnight Preview',
    },
  ];

  const proofMetrics: Array<{ label: string; value: string }> = [
    { label: 'Circuit Type', value: 'Halo2 PLONKish' },
    { label: 'Constraint Count', value: '~8,192' },
    { label: 'Proving Time', value: '~1.8s' },
    { label: 'Verification Time', value: '~12ms' },
    { label: 'Proof Size', value: '~2.1 KB' },
  ];

  const networkMetrics: Array<{ label: string; value: string }> = [
    { label: 'Network', value: 'Midnight Preview' },
    { label: 'Contract', value: '51d23a07...8b15' },
    { label: 'Block Height', value: '~42,891' },
    { label: 'Tx Finality', value: '~6 seconds' },
    { label: 'Protocol', value: 'Compact v0.16' },
  ];

  return (
    <div className="bg-cb-base py-8 px-5 sm:px-8 max-w-content mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cb-t1">Protocol Analytics</h2>
        <p className="text-cb-t2 text-[14px] mt-1">
          Midnight Preview · Real-time protocol telemetry
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpiCards.map((kpi) => (
          <KpiCard key={kpi.label} icon={kpi.icon} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      {/* Bid Activity */}
      <div className="mt-10">
        <h3 className="text-[15px] font-semibold text-cb-t1 mb-4">Bid Activity</h3>
        <div className="card p-6">
          <div className="flex items-end gap-2 h-32">
            {BAR_DAYS.map((day, index) => {
              const isToday = day === 'Today';
              const heightPct = BAR_HEIGHTS[index];
              const barValue = Math.round(heightPct * 0.3 + 5);

              return (
                <div key={day} className="flex flex-col items-center gap-1 flex-1">
                  {/* Value label above bar */}
                  <span className="text-[11px] text-cb-t3">{barValue}</span>
                  {/* Bar column — grows from bottom */}
                  <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                    <div
                      className={`w-full rounded-sm ${
                        isToday ? 'bg-cb-accent' : 'bg-cb-elevated'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  {/* Day label */}
                  <span className="text-[11px] text-cb-t3">{day}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[12px] text-cb-t3 italic mt-4">
            Simulated bid volume for protocol demonstration purposes
          </p>
        </div>
      </div>

      {/* ZK Prover Benchmarks */}
      <div className="mt-10">
        <h3 className="text-[15px] font-semibold text-cb-t1 mb-4">ZK Prover Benchmarks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Proof Generation */}
          <div className="card p-6">
            <p className="font-semibold text-cb-t1 mb-1">Proof Generation</p>
            <div className="mt-3">
              {proofMetrics.map((metric, i) => (
                <MetricRow
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  isLast={i === proofMetrics.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Network State */}
          <div className="card p-6">
            <p className="font-semibold text-cb-t1 mb-1">Network State</p>
            <div className="mt-3">
              {networkMetrics.map((metric, i) => (
                <MetricRow
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  isLast={i === networkMetrics.length - 1}
                />
              ))}
            </div>
            <p className="italic text-[11px] text-cb-t3 mt-4">
              Network data represents Midnight Preview conditions
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-10 text-[12px] text-cb-t3 italic text-center max-w-lg mx-auto">
        Protocol analytics are for demonstration purposes. Some metrics reflect simulated or
        estimated values appropriate for the Midnight Preview environment.
      </p>
    </div>
  );
};
