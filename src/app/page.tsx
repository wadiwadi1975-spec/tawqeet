"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "@/components/twqeet/TopNav";
import Ticker from "@/components/twqeet/Ticker";
import BottomNav from "@/components/twqeet/BottomNav";
import TwqeetLogo from "@/components/twqeet/TwqeetLogo";
import DashboardPage from "@/components/twqeet/pages/DashboardPage";
import PricesPage from "@/components/twqeet/pages/PricesPage";
import AnalysisPage from "@/components/twqeet/pages/AnalysisPage";
import TimelinePage from "@/components/twqeet/pages/TimelinePage";
import MarketPage from "@/components/twqeet/pages/MarketPage";
import SettingsPage from "@/components/twqeet/pages/SettingsPage";
import useGoldPrice from "@/hooks/useGoldPrice";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/goldData";

function Splash({ onEnter }: { onEnter: () => void }) {
  const gold = useGoldPrice();
  const { t, lang } = useI18n();

  const particles = React.useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
    })), []);

  return (
    <div className="h-[100dvh] flex flex-col bg-[#090909] max-w-[430px] mx-auto relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 35%, rgba(212,175,55,0.10) 0%, transparent 65%)' }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full bg-gold animate-sparkle"
            style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, opacity: 0 }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center w-full relative z-10 flex-1 overflow-y-auto px-7 pt-16 pb-8">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="relative flex items-center justify-center my-5">
          <div className="absolute w-[200px] h-[200px] rounded-full animate-glow" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)' }} />
          <div className="absolute w-[180px] h-[180px] rounded-full border border-gold/10 animate-rotate" />
          <div className="absolute w-[215px] h-[215px] rounded-full border border-gold/10 animate-rotate-reverse" />
          <div className="w-[158px] h-[158px] rounded-full bg-black/25 border-2 border-gold/20 flex items-center justify-center relative z-10">
            <TwqeetLogo size={128} />
          </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="text-center mb-2.5">
          <h1 className="text-4xl font-black text-gold tracking-[5px] leading-none">TWQEET</h1>
          <p className="text-sm text-muted-foreground tracking-[3px] mt-1.5 uppercase">Global Gold Intelligence</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-center mb-5 text-sm text-muted-foreground leading-relaxed">
          {t('splash.tagline')}<br />
          <strong className="text-gold font-bold">{t('splash.features')}</strong>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="bg-gold/5 border border-gold/30 rounded-xl px-4 py-3.5 w-full mb-5 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground tracking-wider">{t('splash.xauNow')}</div>
            <div className="text-2xl font-bold">{gold.spot ? '$' + formatNumber(gold.spot) : t('splash.loading')}</div>
            <div className="text-sm text-emerald bg-emerald/10 border border-emerald/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-blink" />
              {t('common.liveData')}
            </div>
          </div>
          <div className="text-left">
            <div className={`text-sm font-bold ${gold.isUp ? 'text-emerald' : 'text-danger'}`}>
              {gold.spot ? (gold.isUp ? '▲ +' : '▼ ') + Math.abs(gold.pct || 0).toFixed(2) + '%' : '—'}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{gold.provider || '—'}</div>
          </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="w-full">
          <button onClick={onEnter} className="w-full py-4 rounded-[22px] border-none bg-gold text-black text-sm font-bold cursor-pointer mb-2.5 tracking-wide active:opacity-85 min-h-[44px]">{t('splash.startNow')}</button>
          <button onClick={onEnter} className="w-full py-3.5 rounded-[22px] bg-transparent border border-gold/30 text-gold text-sm font-semibold cursor-pointer mb-4 active:bg-gold/10 min-h-[44px]">{t('splash.login')}</button>
          <div className="text-sm text-muted-foreground text-center leading-relaxed">
            بالاستمرار أنت توافق على <span className="text-gold">شروط الاستخدام</span> و <span className="text-gold">سياسة الخصوصية</span>
          </div>
          <div className="text-sm text-gold/30 text-center mt-2.5 tracking-widest font-semibold">WADI1975</div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TawqeetApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const gold = useGoldPrice();

  if (showSplash) {
    return <Splash onEnter={() => setShowSplash(false)} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case "home": return <DashboardPage {...gold} />;
      case "prices": return <PricesPage {...gold} />;
      case "analysis": return <AnalysisPage />;
      case "timeline": return <TimelinePage />;
      case "market": return <MarketPage spot={gold.spot} fx={gold.fx} isUp={gold.isUp} />;
      case "settings": return <SettingsPage />;
      default: return <DashboardPage {...gold} />;
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#090909] max-w-[430px] mx-auto relative overflow-hidden">
      <TopNav />
      <Ticker spot={gold.spot} pct={gold.pct} fx={gold.fx} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-3.5 pt-3.5">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
