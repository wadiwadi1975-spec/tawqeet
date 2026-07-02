"use client";
import React, { useState } from 'react';
import { TIMELINE_DATA, L } from '@/lib/goldData';
import { useI18n } from '@/lib/i18n';

export default function TimelinePage() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState('today');

  const timeFilters = [
    { id: 'today', label: t('timeline.today') },
    { id: 'week', label: t('timeline.week') },
    { id: 'month', label: t('timeline.month') },
    { id: 'history', label: t('timeline.history') },
  ];

  const sigBadge: Record<string, string> = { buy: 'bg-emerald/10 text-emerald border-emerald/30', sell: 'bg-danger/10 text-danger border-danger/30', hold: 'bg-warn/10 text-warn border-warn/30' };
  const sigLabel: Record<string, string> = { buy: t('timeline.buy'), sell: t('timeline.sell'), hold: t('timeline.hold') };
  const items = TIMELINE_DATA[filter] || [];

  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {timeFilters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`border px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors min-h-[44px] flex items-center ${filter === f.id ? 'bg-gold/30 text-gold border-gold/30' : 'bg-transparent border-gold/15 text-muted-foreground'}`}>{f.label}</button>
        ))}
      </div>
      <div className="flex flex-col">
        {items.map((it: any, i: number) => (
          <div key={i} className="flex gap-2.5 py-2.5 border-b border-gold/15 last:border-b-0">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: it.dot }} />
              {i < items.length - 1 && <div className="w-px bg-gold/15 flex-1 min-h-[18px] mt-0.5" />}
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">{L(it, 'time', lang)}</div>
              <div className="text-xs font-semibold my-0.5">{L(it, 'title', lang)}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{L(it, 'desc', lang)}</div>
              <span className={`text-xs px-2 py-0.5 rounded-lg font-bold inline-block mt-1 border ${sigBadge[it.sig]}`}>{sigLabel[it.sig]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="h-3.5" />
    </div>
  );
}
