"use client";
import React, { useState } from 'react';
import { CURRENCIES, KARATS, GRAMS, formatPrice, L } from '@/lib/goldData';
import { useI18n } from '@/lib/i18n';

interface PricesPageProps {
  spot: number | null; pct: number | null; gram24: number;
  fx: Record<string, number>; fxSrc: string; isUp: boolean;
}

export default function PricesPage({ spot, pct, gram24, fx, fxSrc, isUp }: PricesPageProps) {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: t('prices.all') },
    { id: 'gulf', label: t('prices.gulf') },
    { id: 'levant', label: t('prices.levant') },
    { id: 'other', label: t('prices.other') },
  ];

  const list = filter === 'all' ? CURRENCIES : CURRENCIES.filter(c => c.group === filter);
  const fxSrcDisplay = fxSrc?.startsWith('fx.') ? t(fxSrc) : fxSrc;

  return (
    <div>
      <div className="mb-3">
        <div className="text-xs text-muted-foreground">{t('prices.title')}</div>
        <div className="text-lg font-bold text-gold">{spot ? `$${spot.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${t('prices.ounce')}` : '—'}</div>
        {spot && <div className={`text-xs ${isUp ? 'text-emerald' : 'text-danger'}`}>{isUp ? '▲' : '▼'} {isUp ? '+' : ''}{pct?.toFixed(2)}% — ${gram24.toFixed(3)}/{t('prices.gram24')}</div>}
        <div className="text-xs text-muted-foreground mt-0.5">{t('prices.exchangeRates')}: {fxSrcDisplay}</div>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`border px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors min-h-[44px] flex items-center ${filter === f.id ? 'bg-gold/30 text-gold border-gold/30' : 'bg-transparent border-gold/15 text-muted-foreground'}`}>{f.label}</button>
        ))}
      </div>
      {!spot ? (
        <div className="text-center text-muted-foreground py-5 text-xs">{t('prices.loading')}</div>
      ) : (
        <div className="space-y-2.5">
          {list.map(c => {
            const rate = fx[c.sym] || 1;
            const rg = gram24 * rate;
            return (
              <div key={c.id} className="bg-[#0f0f0f] border border-gold/15 rounded-[10px] overflow-hidden">
                <div className="bg-[#1a1a1a] px-3 py-2 flex items-center justify-between border-b border-gold/15">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <div className="text-sm font-bold">{L(c, 'name', lang)}</div>
                      <div className="text-xs text-muted-foreground">{c.sym}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gold font-semibold">1$={rate.toLocaleString('en')} {c.sym}</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="p-2 text-muted-foreground font-semibold text-right border-b border-gold/15">{t('prices.karat')}</th>
                        {GRAMS.map(g => (<th key={g} className="p-2 text-muted-foreground font-semibold text-right border-b border-gold/15">{g}غ</th>))}
                      </tr>
                    </thead>
                    <tbody>
                      {KARATS.map(k => (
                        <tr key={k.k}>
                          <td className="p-2 text-muted-foreground border-b border-border/30">{k.k}ق</td>
                          {GRAMS.map(g => (<td key={g} className={`p-2 font-bold border-b border-border/30 ${k.cls}`}>{formatPrice(rg * k.m * g)}</td>))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="h-3.5" />
    </div>
  );
}
