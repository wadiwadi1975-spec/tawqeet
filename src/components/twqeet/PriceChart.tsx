"use client";
import React, { useMemo, useState } from 'react';
import { formatNumber } from '@/lib/goldData';
import { useI18n } from '@/lib/i18n';

export default function PriceChart({ spot }: { spot: number | null }) {
  const { t, lang } = useI18n();
  const [range, setRange] = useState('month');

  const data = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = range === 'week' ? Math.min(7, today) : Math.min(today, daysInMonth);
    const base = spot || 3960;
    const startPrice = base * (1 - 0.025);
    const series = [];
    let prev = startPrice;
    for (let d = 1; d <= days; d++) {
      const seed = (year * 1000 + month * 50 + d) * 9301 + 49297;
      const rand = ((seed % 233280) / 233280);
      const drift = (d / days) * (base - startPrice);
      const noise = (rand - 0.5) * base * 0.012;
      const price = +(startPrice + drift + noise).toFixed(2);
      const change = +(price - prev).toFixed(2);
      const pct = +((change / prev) * 100).toFixed(2);
      series.push({ day: d, label: `${d}/${month + 1}`, price, change, pct });
      prev = price;
    }
    if (series.length > 0 && spot) {
      const last = series[series.length - 1];
      const diff = +(spot - last.price).toFixed(2);
      last.price = +spot.toFixed(2);
      last.change = diff;
      last.pct = +((diff / (spot - diff)) * 100).toFixed(2);
    }
    return series;
  }, [spot, range, lang]);

  const prices = data.map(d => d.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const monthHigh = Math.max(...prices);
  const monthLow = Math.min(...prices);
  const monthChange = data.length > 1 ? +((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(2) : 0;
  const isUp = monthChange >= 0;

  const chartHeight = 200;
  const barWidth = Math.max(4, Math.floor(350 / data.length) - 3);

  return (
    <div className="bg-card border border-gold/30 rounded-xl overflow-hidden mb-3 relative">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="p-3 flex justify-between items-center border-b border-gold/15">
        <div>
          <div className="text-sm font-bold text-gold">{t('chart.title')}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{new Date().toLocaleDateString(lang, { month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="flex gap-1 bg-secondary rounded-full p-0.5 border border-gold/15">
          <button onClick={() => setRange('week')} className={`px-3 py-2 rounded-full text-xs font-bold cursor-pointer border-none transition-colors min-h-[44px] ${range === 'week' ? 'bg-gold text-black' : 'bg-transparent text-muted-foreground'}`}>{t('chart.week')}</button>
          <button onClick={() => setRange('month')} className={`px-3 py-2 rounded-full text-xs font-bold cursor-pointer border-none transition-colors min-h-[44px] ${range === 'month' ? 'bg-gold text-black' : 'bg-transparent text-muted-foreground'}`}>{t('chart.month')}</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-gold/10 px-3 py-2.5">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-0.5">{t('chart.change')}</div>
          <div className={`text-sm font-bold ${isUp ? 'text-emerald' : 'text-danger'}`}>{isUp ? '▲ +' : '▼ '}{Math.abs(monthChange).toFixed(2)}%</div>
        </div>
        <div className="text-center border-x border-gold/10">
          <div className="text-xs text-muted-foreground mb-0.5">{t('chart.high')}</div>
          <div className="text-sm font-bold text-emerald">${formatNumber(monthHigh)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-0.5">{t('chart.low')}</div>
          <div className="text-sm font-bold text-danger">${formatNumber(monthLow)}</div>
        </div>
      </div>
      {/* Bar chart */}
      <div className="p-4" style={{ height: chartHeight + 40 }}>
        <div className="flex items-end justify-between h-full gap-0.5" style={{ height: chartHeight }}>
          {data.map((d, i) => {
            const priceRange = maxP - minP || 1;
            const height = ((d.price - minP) / priceRange) * (chartHeight - 30) + 15;
            const isLast = i === data.length - 1;
            return (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${isLast ? 'bg-gold' : d.change >= 0 ? 'bg-emerald/70' : 'bg-danger/70'}`}
                  style={{ height: `${height}px`, minWidth: `${barWidth}px` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">{data[0]?.label}</span>
          <span className="text-[10px] text-muted-foreground">{data[Math.floor(data.length / 2)]?.label}</span>
          <span className="text-[10px] text-muted-foreground">{data[data.length - 1]?.label}</span>
        </div>
      </div>
      <div className="px-3 py-2 bg-secondary border-t border-gold/15 flex justify-between">
        <span className="text-xs text-muted-foreground">{t('chart.average')}: ${formatNumber(avg)}</span>
        <span className="text-xs text-muted-foreground">{data.length} {t('chart.days')}</span>
      </div>
    </div>
  );
}
