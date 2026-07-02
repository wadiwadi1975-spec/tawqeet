"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useI18n();
  const tabs = [
    { id: 'home', label: t('nav.home'), icon: '🏠' },
    { id: 'prices', label: t('nav.prices'), icon: '💰' },
    { id: 'analysis', label: t('nav.analysis'), icon: '📊' },
    { id: 'timeline', label: t('nav.timeline'), icon: '⏱️' },
    { id: 'market', label: t('nav.market'), icon: '🌍' },
    { id: 'settings', label: t('nav.settings'), icon: '⚙️' },
  ];

  return (
    <div className="bg-[#0f0f0f] border-t border-gold/15 flex pt-2 px-0.5 flex-shrink-0 pb-2">
      {tabs.map(({ id, label, icon }) => {
        const isActive = activeTab === id;
        return (
          <button key={id} onClick={() => onTabChange(id)}
            className="flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer py-2 px-0.5 relative min-h-[44px] justify-center">
            {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-gold rounded-b-sm" />}
            <span className="text-lg">{icon}</span>
            <span className={`text-xs transition-colors ${isActive ? 'text-gold' : 'text-muted-foreground'}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
