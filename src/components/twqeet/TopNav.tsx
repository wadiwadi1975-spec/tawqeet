"use client";
import React, { useState, useEffect } from 'react';
import TwqeetLogo from './TwqeetLogo';
import { useI18n } from '@/lib/i18n';

export default function TopNav() {
  const { t, lang } = useI18n();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <div className="bg-[#0f0f0f] border-b border-gold/15 px-4 pb-2.5 flex items-center justify-between flex-shrink-0 pt-3">
      <div className="flex items-center gap-2">
        <TwqeetLogo size={30} />
        <span className="text-base font-bold text-gold tracking-widest">TWQEET</span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="text-xs text-emerald bg-emerald/10 border border-emerald/25 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald animate-blink" />
          {t('nav.live')}
        </div>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}
