"use client";
import React from 'react';
import LiveCard from '../LiveCard';
import GaugeCard from '../GaugeCard';
import StatsGrid from '../StatsGrid';
import KuwaitCard from '../KuwaitCard';
import AICard from '../AICard';
import PriceChart from '../PriceChart';

interface DashboardPageProps {
  spot: number | null; change: number | null; pct: number | null; provider: string | null;
  updateTime: Date | null; countdown: number; isUp: boolean; gram24: number;
  fx: Record<string, number>;
}

export default function DashboardPage(props: DashboardPageProps) {
  const { spot, change, pct, provider, updateTime, countdown, isUp, gram24, fx } = props;
  return (
    <div>
      <LiveCard spot={spot} change={change} pct={pct} provider={provider} updateTime={updateTime} countdown={countdown} isUp={isUp} />
      <GaugeCard />
      <PriceChart spot={spot} />
      <StatsGrid />
      <KuwaitCard gram24={gram24} fxKWD={fx.KWD || 0.3071} />
      <AICard spot={spot} pct={pct} provider={provider} fx={fx} />
      <div className="h-3.5" />
    </div>
  );
}
