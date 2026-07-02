"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();

  return (
    <div>
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
          <div className="text-sm font-bold">Pro Trader</div>
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
        <div className="text-xs font-bold text-gold tracking-widest mb-2">{t('settings.settingsTitle')}</div>

        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">{t('settings.language')}</div>
          <select value={lang} onChange={e => setLang(e.target.value)} className="w-full bg-[#1a1a1a] border border-gold/15 rounded-lg px-3 py-2.5 text-xs text-foreground">
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">{t('settings.currency')}</div>
          <select className="w-full bg-[#1a1a1a] border border-gold/15 rounded-lg px-3 py-2.5 text-xs text-foreground">
            <option>KWD - دينار كويتي</option>
            <option>USD - دولار</option>
            <option>SAR - ريال سعودي</option>
            <option>AED - درهم إماراتي</option>
          </select>
        </div>

        <div className="flex justify-between items-center py-2.5 border-b border-border/30">
          <div>
            <div className="text-xs font-semibold">{t('settings.priceNotifications')}</div>
          </div>
          <div className="w-9 h-5 rounded-full bg-gold relative cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-4.5" />
          </div>
        </div>

        <div className="flex justify-between items-center py-2.5">
          <div>
            <div className="text-xs font-semibold">{t('settings.autoUpdate')}</div>
            <div className="text-xs text-muted-foreground">{t('settings.every60s')}</div>
          </div>
          <div className="w-9 h-5 rounded-full bg-gold relative cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-4.5" />
          </div>
        </div>
      </div>

      <div className="text-center mt-4 pb-4">
        <div className="text-xs text-muted-foreground">TWQEET v2.0 • <span className="text-gold">Global Gold Intelligence</span></div>
        <div className="text-xs text-muted-foreground/50 mt-1">WADI1975</div>
      </div>
    </div>
  );
}
