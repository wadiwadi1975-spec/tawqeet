"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';

export default function StatsGrid() {
  const { t } = useI18n();
  const stats = [
    { label: t('stats.dxy'), value: '97.2', change: '▼ -0.8%', up: false },
    { label: t('stats.cpi'), value: '3.1%', change: '▲ +0.2%', up: true },
    { label: t('stats.brent'), value: '$82.50', change: '▲ +3.1%', up: true },
    { label: t('stats.vix'), value: '18.4', change: '▲ +8.9%', up: true },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 mb-3">
      {stats.map((s, i) => (
        <div key={i} className="bg-[#0f0f0f] border border-gold/15 rounded-[10px] p-3">
          <div className="text-xs text-muted-foreground mb-0.5">{s.label}</div>
          <div className="text-base font-bold">{s.value}</div>
          <div className={`text-xs mt-0.5 ${s.up ? 'text-emerald' : 'text-danger'}`}>{s.change}</div>
        </div>
      ))}
    </div>
  );
}
