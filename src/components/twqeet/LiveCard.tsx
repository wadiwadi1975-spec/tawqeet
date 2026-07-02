"use client";
import React, { useState, useEffect } from 'react';
import { formatNumber } from '@/lib/goldData';
import { useI18n } from '@/lib/i18n';

export default function LiveCard({ spot, change, pct, provider, updateTime, countdown, isUp }: {
  spot: number | null; change: number | null; pct: number | null; provider: string | null;
  updateTime: Date | null; countdown: number; isUp: boolean;
}) {
  const { t, lang } = useI18n();
  const [flash, setFlash] = useState('');

  useEffect(() => {
    if (!spot) return;
    setFlash(isUp ? 'text-emerald' : 'text-danger');
    const tm = setTimeout(() => setFlash(''), 1600);
    return () => clearTimeout(tm);
  }, [spot, isUp]);

  if (!spot) {
    return (
      <div className="bg-gradient-to-br from-gold/5 to-gold/[0.02] border border-gold/30 rounded-xl p-4 mb-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="text-center py-4 text-muted-foreground text-sm">{t('common.loading')}</div>
      </div>
    );
  }

  const chgText = (isUp ? '▲ +' : '▼ ') + Math.abs(change || 0).toFixed(2) + ' (' + (isUp ? '+' : '') + (pct || 0).toFixed(2) + '%)';
  const time = updateTime?.toLocaleTimeString(lang) || '';
  const progress = (countdown / 60) * 100;

  return (
    <div className="bg-gradient-to-br from-gold/5 to-gold/[0.02] border border-gold/30 rounded-xl p-4 mb-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="text-xs text-muted-foreground tracking-widest mb-1.5">{t('liveCard.title')}</div>
      <div className={`text-3xl font-bold transition-colors duration-500 ${flash || 'text-foreground'}`}>${formatNumber(spot)}</div>
      <div className="flex justify-between items-center mt-1.5">
        <div className={`text-sm font-semibold ${isUp ? 'text-emerald' : 'text-danger'}`}>{chgText}</div>
        <div className="text-xs text-muted-foreground text-left leading-relaxed">
          <div>{t('liveCard.source')}: {provider}</div>
          <div>{t('liveCard.update')}: {time}</div>
        </div>
      </div>
      <div className="h-0.5 bg-muted rounded-sm mt-2 overflow-hidden">
        <div className="h-full bg-gold rounded-sm transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
