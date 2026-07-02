"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';

export default function KuwaitCard({ gram24, fxKWD }: { gram24: number; fxKWD: number }) {
  const { t } = useI18n();
  const calc = (m: number) => (gram24 * m * fxKWD).toFixed(3) + ' KD';
  const rows = [
    { label: t('kuwait.k24'), val: calc(1) },
    { label: t('kuwait.k22'), val: calc(22 / 24) },
    { label: t('kuwait.k21'), val: calc(21 / 24) },
    { label: t('kuwait.k18'), val: calc(18 / 24) },
  ];
  return (
    <div className="bg-[#0f0f0f] border border-gold/15 rounded-xl p-3.5 mb-3">
      <div className="text-xs text-muted-foreground tracking-widest mb-2">{t('kuwait.title')}</div>
      {rows.map((row, i) => (
        <div key={i} className="flex justify-between py-2 border-b border-border/30 last:border-b-0">
          <span className="text-xs text-muted-foreground">{row.label}</span>
          <span className="text-sm font-bold text-gold">{gram24 ? row.val : '—'}</span>
        </div>
      ))}
    </div>
  );
}
