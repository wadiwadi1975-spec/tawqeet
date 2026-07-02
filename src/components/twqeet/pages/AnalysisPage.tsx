"use client";
import React from 'react';
import { FACTORS, HEATMAP, L } from '@/lib/goldData';
import { useI18n } from '@/lib/i18n';

export default function AnalysisPage() {
  const { t, lang } = useI18n();
  return (
    <div>
      <div className="text-xs font-bold text-gold tracking-widest uppercase mb-2.5 pb-1 border-b border-gold/15">{t('analysis.factors')}</div>
      <div className="flex flex-col gap-2 mb-3">
        {FACTORS.map((f, i) => (
          <div key={i} className="bg-[#0f0f0f] border border-gold/15 rounded-[10px] p-3">
            <div className="flex justify-between items-center mb-1.5">
              <div className="text-xs text-muted-foreground font-semibold">{L(f, 'nm', lang)}</div>
              <div className={`text-xs px-2 py-0.5 rounded-[10px] font-bold ${f.positive ? 'bg-emerald/10 text-emerald' : 'bg-warn/10 text-warn'}`}>{L(f, 'imp', lang)}</div>
            </div>
            <div className="text-sm font-bold mb-0.5">{f.val}</div>
            <div className="text-xs text-muted-foreground">{t('analysis.previous')}: {f.pr} | {L(f, 'note', lang)}</div>
            <div className="h-[3px] bg-muted rounded-sm mt-2 overflow-hidden">
              <div className="h-full rounded-sm transition-all duration-1000" style={{ width: `${f.sc}%`, backgroundColor: f.positive ? '#00C853' : '#FFC107' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-bold text-gold tracking-widest uppercase mb-2.5 pb-1 border-b border-gold/15">{t('analysis.heatmap')}</div>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {HEATMAP.map((h, i) => {
          const intensity = (h.sc / 100) * 0.8 + 0.1;
          const isHigh = h.sc > 55;
          const bgColor = isHigh ? `rgba(0, 200, 83, ${intensity.toFixed(2)})` : `rgba(255, 193, 7, ${intensity.toFixed(2)})`;
          return (
            <div key={i} className="rounded-[9px] p-2.5 text-center" style={{ backgroundColor: bgColor }}>
              <div className={`text-xs font-bold mb-0.5 ${isHigh ? 'text-black/85' : 'text-white/85'}`}>{L(h, 'nm', lang)}</div>
              <div className={`text-sm font-bold ${isHigh ? 'text-black' : 'text-white'}`}>{h.val}</div>
              <div className={`text-xs mt-0.5 ${isHigh ? 'text-black/60' : 'text-white/60'}`}>{h.sc}pts</div>
            </div>
          );
        })}
      </div>
      <div className="h-3.5" />
    </div>
  );
}
