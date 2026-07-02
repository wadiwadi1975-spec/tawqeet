"use client";
import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface MarketPageProps {
  spot: number | null; fx: Record<string, number>; isUp: boolean;
}

export default function MarketPage({ spot, fx, isUp }: MarketPageProps) {
  const { t, lang } = useI18n();
  const [activeSection, setActiveSection] = useState('currencies');

  const metals = [
    { name: t('market.gold'), sym: 'XAU/USD', val: spot ? `$${spot.toFixed(2)}` : '—', change: isUp ? '+0.45%' : '-0.45%', up: isUp },
    { name: t('market.silver'), sym: 'XAG/USD', val: '$28.40', change: '+0.85%', up: true },
    { name: t('market.platinum'), sym: 'XPT/USD', val: '$985.00', change: '+0.32%', up: true },
    { name: t('market.palladium'), sym: 'XPD/USD', val: '$1,020.00', change: '-0.15%', up: false },
  ];

  const globalMarkets = [
    { name: t('market.usStocks'), sym: 'S&P 500', val: '5,482', change: '+0.5%', up: true },
    { name: t('market.brentOil'), sym: 'BRENT', val: '$82.50', change: '+3.1%', up: true },
    { name: t('market.dollar'), sym: 'DXY', val: '97.2', change: '-0.8%', up: false },
    { name: t('market.volatility'), sym: 'VIX', val: '18.4', change: '+8.9%', up: true },
  ];

  const currenciesList = [
    { name: t('market.kwd'), sym: 'USD/KWD', val: fx.KWD?.toFixed(4) || '0.3071', flag: '🇰🇼' },
    { name: t('market.sar'), sym: 'USD/SAR', val: fx.SAR?.toFixed(4) || '3.75', flag: '🇸🇦' },
    { name: t('market.aed'), sym: 'USD/AED', val: fx.AED?.toFixed(4) || '3.6725', flag: '🇦🇪' },
    { name: t('market.qar'), sym: 'USD/QAR', val: fx.QAR?.toFixed(4) || '3.64', flag: '🇶🇦' },
    { name: t('market.bhd'), sym: 'USD/BHD', val: fx.BHD?.toFixed(4) || '0.376', flag: '🇧🇭' },
    { name: t('market.omr'), sym: 'USD/OMR', val: fx.OMR?.toFixed(4) || '0.385', flag: '🇴🇲' },
    { name: t('market.egp'), sym: 'USD/EGP', val: fx.EGP?.toFixed(2) || '48.6', flag: '🇪🇬' },
    { name: t('market.iqd'), sym: 'USD/IQD', val: fx.IQD?.toLocaleString('en') || '1,310', flag: '🇮🇶' },
    { name: t('market.jod'), sym: 'USD/JOD', val: fx.JOD?.toFixed(4) || '0.709', flag: '🇯🇴' },
    { name: t('market.lbp'), sym: 'USD/LBP', val: fx.LBP?.toLocaleString('en') || '89,500', flag: '🇱🇧' },
  ];

  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {[{ id: 'currencies', label: t('market.currenciesLive') }, { id: 'metals', label: t('market.preciousMetals') }, { id: 'global', label: t('market.globalMarkets') }].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`border px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors min-h-[44px] flex items-center ${activeSection === s.id ? 'bg-gold/30 text-gold border-gold/30' : 'bg-transparent border-gold/15 text-muted-foreground'}`}>{s.label}</button>
        ))}
      </div>

      {activeSection === 'currencies' && (
        <div className="space-y-2">
          {currenciesList.map((c, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-gold/15 rounded-[10px] p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">{c.flag}</span>
                <div>
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.sym}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-gold">{c.val}</div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'metals' && (
        <div className="space-y-2">
          {metals.map((m, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-gold/15 rounded-[10px] p-3 flex justify-between items-center">
              <div>
                <div className="text-sm font-bold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.sym}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{m.val}</div>
                <div className={`text-xs ${m.up ? 'text-emerald' : 'text-danger'}`}>{m.up ? '▲' : '▼'} {m.change}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'global' && (
        <div className="space-y-2">
          {globalMarkets.map((m, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-gold/15 rounded-[10px] p-3 flex justify-between items-center">
              <div>
                <div className="text-sm font-bold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.sym}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{m.val}</div>
                <div className={`text-xs ${m.up ? 'text-emerald' : 'text-danger'}`}>{m.up ? '▲' : '▼'} {m.change}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-3.5" />
    </div>
  );
}
