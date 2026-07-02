"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';

export default function GaugeCard() {
  const { t } = useI18n();
  return (
    <div className="bg-[#0f0f0f] border border-gold/15 rounded-xl p-4 mb-3 flex gap-3.5 items-center">
      <svg width="108" height="108" viewBox="0 0 110 110">
        <path d="M8 90 A52 52 0 0 1 102 90" fill="none" stroke="#1a1a1a" strokeWidth="10" strokeLinecap="round" />
        <path d="M8 90 A52 52 0 0 1 102 90" fill="none" stroke="#D4AF37" strokeWidth="10" strokeLinecap="round" strokeDasharray="163" strokeDashoffset="20" opacity=".2" />
        <path d="M8 90 A52 52 0 0 1 102 90" fill="none" stroke="#00C853" strokeWidth="10" strokeLinecap="round" strokeDasharray="163" strokeDashoffset="34" />
        <line x1="55" y1="90" x2="55" y2="44" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" transform="rotate(60,55,90)" />
        <circle cx="55" cy="90" r="4" fill="#D4AF37" />
      </svg>
      <div>
        <div className="text-xs text-muted-foreground tracking-wider mb-1">{t('gauge.title')}</div>
        <div className="text-4xl font-bold text-emerald leading-none">87</div>
        <div className="text-xs text-muted-foreground mt-0.5">{t('gauge.outOf')}</div>
        <div className="inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald/10 text-emerald border border-emerald/25">{t('gauge.strongBuy')}</div>
        <div className="flex gap-3 mt-2">
          <div>
            <div className="text-xs font-semibold text-gold">91%</div>
            <div className="text-xs text-muted-foreground">{t('gauge.confidence')}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gold">{t('gauge.bullish')}</div>
            <div className="text-xs text-muted-foreground">{t('gauge.trend')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
