"use client";
import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Toggle */}
      <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-4 mb-4">
        <div className="text-xs font-bold text-gold tracking-widest mb-3">{t('settings.language')}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setLang('ar')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all min-h-[44px] ${
              lang === 'ar'
                ? 'bg-gold text-black border-2 border-gold'
                : 'bg-transparent border border-gold/30 text-gold'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all min-h-[44px] ${
              lang === 'en'
                ? 'bg-gold text-black border-2 border-gold'
                : 'bg-transparent border border-gold/30 text-gold'
            }`}
          >
            English
          </button>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-2">
          {t('settings.currentLang')}
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-gradient-to-br from-gold/5 to-gold/[0.02] border border-gold/30 rounded-xl p-4 mb-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-sm font-bold">{t('settings.subscription')}</div>
            <div className="text-xs text-gold mt-0.5">{t('settings.mostPopular')}</div>
          </div>
          <div className="text-sm font-bold text-gold">9.99 <span className="text-xs text-muted-foreground">{t('settings.kdMonth')}</span></div>
        </div>
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-emerald">✓</span> {t('settings.liveFx')}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-emerald">✓</span> {t('settings.alerts5')}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-emerald">✓</span> {t('settings.dailyAI')}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-muted-foreground">✗</span> {t('settings.proHeatmap')}</div>
        </div>
        <button className="w-full py-3 rounded-xl bg-gold text-black text-sm font-bold cursor-pointer active:opacity-85 min-h-[44px]">{t('settings.subscribeNow')}</button>
      </div>

      {/* Pro Plan */}
      <div className="bg-[#0f0f0f] border border-gold/15 rounded-xl p-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-bold">{t('settings.proTrader')}</div>
          <div className="text-sm font-bold text-gold">24.99 <span className="text-xs text-muted-foreground">{t('settings.kdMonth')}</span></div>
        </div>
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-emerald">✓</span> {t('settings.allInvestor')}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-emerald">✓</span> {t('settings.unlimitedAlerts')}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-emerald">✓</span> {t('settings.unlimitedAI')}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="text-emerald">✓</span> {t('settings.heatmapScore')}</div>
        </div>
        <button className="w-full py-3 rounded-xl bg-transparent border border-gold/30 text-gold text-sm font-bold cursor-pointer active:bg-gold/10 min-h-[44px]">{t('settings.upgrade')}</button>
      </div>

      {/* Settings */}
      <div className="bg-[#0f0f0f] border border-gold/15 rounded-xl p-3.5 mb-3">
        <div className="text-xs font-bold text-gold tracking-widest mb-3">{t('settings.settingsTitle')}</div>

        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">{t('settings.currency')}</div>
          <select className="w-full bg-[#1a1a1a] border border-gold/15 rounded-lg px-3 py-2.5 text-xs text-foreground">
            <option>{t('settings.kwKwd')}</option>
            <option>{t('settings.usdDollar')}</option>
            <option>{t('settings.sarRiyal')}</option>
            <option>{t('settings.aedDirham')}</option>
          </select>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-border/30">
          <div className="text-xs font-semibold">{t('settings.priceNotifications')}</div>
          <button
            onClick={() => setPriceAlerts(!priceAlerts)}
            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${priceAlerts ? 'bg-gold' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${priceAlerts ? 'left-5.5' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="flex justify-between items-center py-3">
          <div>
            <div className="text-xs font-semibold">{t('settings.autoUpdate')}</div>
            <div className="text-xs text-muted-foreground">{t('settings.every60s')}</div>
          </div>
          <button
            onClick={() => setAutoUpdate(!autoUpdate)}
            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${autoUpdate ? 'bg-gold' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${autoUpdate ? 'left-5.5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="text-center mt-4 pb-4">
        <div className="text-xs text-muted-foreground">TWQEET v3.0 • <span className="text-gold">{t('settings.globalGoldIntelligence')}</span></div>
        <div className="text-xs text-muted-foreground/50 mt-1">WADI1975</div>
      </div>
    </div>
  );
}
