"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const translations: Record<string, any> = {
  ar: {
    common: { loading: 'جارٍ التحميل...', liveData: 'بيانات حية', live: 'حي', cancel: 'إلغاء', terms: 'شروط الاستخدام', privacy: 'سياسة الخصوصية', agree: 'بالمتابعة أنت توافق على' },
    splash: { tagline: 'منصة الذهب الذكية للمنطقة العربية', features: 'تحليل حي • توصيات ذكية • أسعار فورية', xauNow: 'XAU / USD الآن', loading: 'جارٍ...', startNow: 'ابدأ الآن', login: 'تسجيل الدخول' },
    nav: { live: 'مباشر', home: 'الرئيسية', prices: 'الأسعار', analysis: 'التحليل', timeline: 'التايملاين', market: 'السوق', settings: 'الإعدادات' },
    liveCard: { title: 'XAU / USD — سعر الذهب الفوري', source: 'مصدر', update: 'تحديث' },
    gauge: { title: 'مقياس TWQEET', outOf: 'نقطة من 100', strongBuy: 'شراء قوي', confidence: 'الثقة', bullish: 'صاعد', trend: 'الاتجاه' },
    stats: { dxy: 'DXY الدولار', cpi: 'CPI التضخم', brent: 'نفط برنت', vix: 'VIX التقلب' },
    kuwait: { title: 'الكويت — دينار كويتي / غرام (حي)', k24: '24 قيراط', k22: '22 قيراط', k21: '21 قيراط', k18: '18 قيراط' },
    ai: { title: 'تحليل الذكاء الاصطناعي', basedOnLive: 'يعتمد على السعر الحي', lastAnalysis: 'آخر تحليل', newAnalysis: 'تحليل جديد', analyzeNow: 'تحليل الآن', connecting: 'يتصل بالذكاء الاصطناعي...', press: 'اضغط', pressFor: 'للحصول على توصية ذكية فورية', local: 'تحليل ذكي محلي', ready: 'جاهز', analysisNum: 'تحليل', hold: '🟡 انتظار', strongBuy: '🟢 شراء قوي', buy: '🟢 شراء', sell: '🔴 بيع' },
    chart: { title: 'أداء الذهب — الشهر الحالي', week: 'أسبوع', month: 'شهر', change: 'التغيّر', high: 'أعلى', low: 'أدنى', average: 'المتوسط', days: 'يوم' },
    prices: { title: 'أسعار غرامات الذهب — بيانات حية', ounce: 'أوقية', gram24: 'غ 24ق', exchangeRates: 'أسعار الصرف', all: 'الكل', gulf: 'الخليج', levant: 'الشام', other: 'مصر والعراق', karat: 'العيار', loading: 'جارٍ تحميل سعر الذهب...', gramAbbrev: 'غ', karatAbbrev: 'ق', exchangeFormat: '1$={rate} {sym}' },
    analysis: { factors: 'العوامل المؤثرة في الذهب', heatmap: 'Heat Map — خريطة الحرارة', previous: 'السابق', points: 'نقطة' },
    timeline: { today: 'اليوم', week: 'الأسبوع', month: 'الشهر', history: 'السجل', buy: 'شراء', sell: 'بيع', hold: 'انتظار' },
    market: { preciousMetals: 'المعادن النفيسة', globalMarkets: 'الأسواق العالمية', currenciesLive: 'العملات — حية', smartAlerts: 'التنبيهات الذكية', add: 'إضافة', noAlerts: 'لا توجد تنبيهات', above: 'فوق', below: 'تحت', current: 'الحالي', triggered: '✓ تم تفعيل التنبيه' },
    settings: { subscription: 'الاشتراك', mostPopular: 'الأكثر شيوعاً', kdMonth: 'دينار/شهر', liveFx: 'أسعار عملات المنطقة الحية', alerts5: '5 تنبيهات', dailyAI: 'تحليل AI يومي', proHeatmap: 'Heat Map احترافية', subscribeNow: 'اشترك الآن', settingsTitle: 'الإعدادات', currency: 'العملة', displayCurrency: 'عملة عرض الأسعار', language: 'اللغة', autoUpdate: 'تحديث تلقائي', every60s: 'كل 60 ثانية', allInvestor: 'كل مزايا Investor', unlimitedAlerts: 'تنبيهات غير محدودة', unlimitedAI: 'تحليل AI غير محدود', heatmapScore: 'Heat Map + Score', upgrade: 'ترقية', proTrader: 'المتداول المحترف', currentLang: 'اللغة الحالية: العربية', kwKwd: 'KWD - دينار كويتي', usdDollar: 'USD - دولار', sarRiyal: 'SAR - ريال سعودي', aedDirham: 'AED - درهم إماراتي', priceNotifications: 'تنبيهات الأسعار', globalGoldIntelligence: 'منصة ذكاء الذهب العالمية' },
    countries: { kw: 'الكويت', sa: 'السعودية', ae: 'الإمارات', eg: 'مصر', iq: 'العراق' },
  },
  en: {
    common: { loading: 'Loading...', liveData: 'Live Data', live: 'Live', cancel: 'Cancel', terms: 'Terms of Use', privacy: 'Privacy Policy', agree: 'By continuing you agree to the' },
    splash: { tagline: 'Smart Gold Platform for the Arab Region', features: 'Live Analysis • Smart Signals • Instant Prices', xauNow: 'XAU / USD Now', loading: 'Loading...', startNow: 'Get Started', login: 'Login' },
    nav: { live: 'LIVE', home: 'Home', prices: 'Prices', analysis: 'Analysis', timeline: 'Timeline', market: 'Market', settings: 'Settings' },
    liveCard: { title: 'XAU / USD — Live Gold Price', source: 'Source', update: 'Updated' },
    gauge: { title: 'TWQEET Gauge', outOf: 'out of 100', strongBuy: 'Strong Buy', confidence: 'Confidence', bullish: 'Bullish', trend: 'Trend' },
    stats: { dxy: 'DXY Dollar', cpi: 'CPI Inflation', brent: 'Brent Oil', vix: 'VIX Volatility' },
    kuwait: { title: 'Kuwait — Kuwaiti Dinar / Gram (Live)', k24: '24 Karat', k22: '22 Karat', k21: '21 Karat', k18: '18 Karat' },
    ai: { title: 'AI Analysis', basedOnLive: 'Based on live price', lastAnalysis: 'Last analysis', newAnalysis: 'New Analysis', analyzeNow: 'Analyze Now', connecting: 'Connecting to AI...', press: 'Press', pressFor: 'for an instant smart recommendation', local: 'Local smart analysis', ready: 'Ready', analysisNum: 'Analysis', hold: '🟡 Hold', strongBuy: '🟢 Strong Buy', buy: '🟢 Buy', sell: '🔴 Sell' },
    chart: { title: 'Gold Performance — Current Month', week: 'Week', month: 'Month', change: 'Change', high: 'High', low: 'Low', average: 'Average', days: 'days' },
    prices: { title: 'Gold Gram Prices — Live Data', ounce: 'oz', gram24: 'g 24K', exchangeRates: 'Exchange rates', all: 'All', gulf: 'Gulf', levant: 'Levant', other: 'Egypt & Iraq', karat: 'Karat', loading: 'Loading gold price...', gramAbbrev: 'g', karatAbbrev: 'K', exchangeFormat: '$1={rate} {sym}' },
    analysis: { factors: 'Factors Affecting Gold', heatmap: 'Heat Map', previous: 'Previous', points: 'pts' },
    timeline: { today: 'Today', week: 'Week', month: 'Month', history: 'History', buy: 'Buy', sell: 'Sell', hold: 'Hold' },
    market: { preciousMetals: 'Precious Metals', globalMarkets: 'Global Markets', currenciesLive: 'Currencies — Live', smartAlerts: 'Smart Alerts', add: 'Add', noAlerts: 'No alerts', above: 'above', below: 'below', current: 'Current', triggered: '✓ Alert triggered' },
    settings: { subscription: 'Subscription', mostPopular: 'Most Popular', kdMonth: 'KD/mo', liveFx: 'Live regional currency rates', alerts5: '5 alerts', dailyAI: 'Daily AI analysis', proHeatmap: 'Professional Heat Map', subscribeNow: 'Subscribe Now', settingsTitle: 'Settings', currency: 'Currency', displayCurrency: 'Price display currency', language: 'Language', autoUpdate: 'Auto Update', every60s: 'Every 60 seconds', allInvestor: 'All Investor features', unlimitedAlerts: 'Unlimited alerts', unlimitedAI: 'Unlimited AI analysis', heatmapScore: 'Heat Map + Score', upgrade: 'Upgrade', proTrader: 'Pro Trader', currentLang: 'Current Language: English', kwKwd: 'KWD - Kuwaiti Dinar', usdDollar: 'USD - US Dollar', sarRiyal: 'SAR - Saudi Riyal', aedDirham: 'AED - UAE Dirham', priceNotifications: 'Price Notifications', globalGoldIntelligence: 'Global Gold Intelligence' },
    countries: { kw: 'Kuwait', sa: 'Saudi Arabia', ae: 'UAE', eg: 'Egypt', iq: 'Iraq' },
  }
};

function resolve(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc: any, key: string) => (acc == null ? acc : acc[key]), obj);
}

interface I18nContextType {
  t: (key: string) => string;
  lang: string;
  setLang: (l: string) => void;
  dir: string;
}

const I18nContext = createContext<I18nContextType>({ t: (k: string) => k, lang: 'ar', setLang: () => {}, dir: 'rtl' });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<string>('ar');
  const [mounted, setMounted] = useState(false);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('twqeet_lang');
      if (saved && (saved === 'ar' || saved === 'en')) {
        setLangState(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.style.direction = dir;
    document.body.style.textAlign = dir === 'rtl' ? 'right' : 'left';
    try { localStorage.setItem('twqeet_lang', lang); } catch {}
  }, [lang, dir, mounted]);

  const setLang = useCallback((l: string) => {
    setLangState(l);
  }, []);

  const t = useCallback((key: string): string => {
    const val = resolve(translations[lang], key);
    if (val != null) return val;
    const fallback = resolve(translations.ar, key);
    return fallback != null ? fallback : key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ t, lang, setLang, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  return ctx;
}
