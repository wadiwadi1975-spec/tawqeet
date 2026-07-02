"use client";
import React from 'react';

export default function Ticker({ spot, pct, fx }: { spot: number | null; pct: number | null; fx: Record<string, number> }) {
  const isUp = (pct || 0) >= 0;
  const items = [
    { s: 'XAU/USD', v: '$' + (spot || 4150).toFixed(2), c: (isUp ? '+' : '') + (pct || 0).toFixed(2) + '%', up: isUp },
    { s: 'XAG/USD', v: '28.40', c: '+0.85%', up: true },
    { s: 'DXY', v: '97.2', c: '-0.8%', up: false },
    { s: 'BRENT', v: '82.50', c: '+3.1%', up: true },
    { s: 'VIX', v: '18.4', c: '+8.9%', up: true },
    { s: 'USD/KWD', v: fx.KWD?.toFixed(4) || '0.3071', c: '+0.01%', up: true },
    { s: 'USD/SAR', v: fx.SAR?.toFixed(4) || '3.75', c: '0.0%', up: true },
    { s: 'USD/EGP', v: fx.EGP?.toFixed(2) || '48.6', c: '+0.2%', up: true },
    { s: 'USD/IQD', v: fx.IQD?.toLocaleString('en') || '1,310', c: '0.0%', up: true },
  ];
  const allItems = [...items, ...items];

  return (
    <div className="bg-[#1a1a1a] border-b border-gold/15 py-1.5 overflow-hidden whitespace-nowrap flex-shrink-0">
      <div className="inline-flex gap-6 ticker-scroll">
        {allItems.map((d, i) => (
          <span key={i} className="text-xs inline-flex items-center gap-1.5">
            <span className="text-gold font-bold">{d.s}</span>
            <span className="text-foreground">{d.v}</span>
            <span className={d.up ? 'text-emerald' : 'text-danger'}>{d.c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
