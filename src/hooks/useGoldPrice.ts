"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_FX } from '@/lib/goldData';

export default function useGoldPrice() {
  const [spot, setSpot] = useState<number | null>(null);
  const [prev, setPrev] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [updateTime, setUpdateTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [fx, setFx] = useState<Record<string, number>>(DEFAULT_FX);
  const [fxSrc, setFxSrc] = useState('fx.fixed');
  const [loading, setLoading] = useState(true);
  const spotRef = useRef<number | null>(null);

  const fetchFX = useCallback(async () => {
    try {
      const r = await fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(8000) });
      const d = await r.json();
      if (d?.rates) {
        const rt = d.rates;
        const newFx = { ...DEFAULT_FX };
        ['KWD', 'SAR', 'AED', 'QAR', 'BHD', 'OMR', 'SYP', 'LBP', 'JOD', 'EGP', 'IQD'].forEach(k => {
          if (rt[k]) newFx[k] = +rt[k];
        });
        setFx(newFx);
        setFxSrc('fx.erapi');
        return;
      }
    } catch {}
    try {
      const r = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json', { signal: AbortSignal.timeout(8000) });
      const d = await r.json();
      if (d?.usd) {
        const rt = d.usd;
        const map: Record<string, string> = { KWD: 'kwd', SAR: 'sar', AED: 'aed', QAR: 'qar', BHD: 'bhd', OMR: 'omr', SYP: 'syp', LBP: 'lbp', JOD: 'jod', EGP: 'egp', IQD: 'iqd' };
        const newFx = { ...DEFAULT_FX };
        Object.entries(map).forEach(([K, k]) => { if (rt[k]) newFx[K] = +rt[k]; });
        setFx(newFx);
        setFxSrc('fx.curapi');
      }
    } catch {}
  }, []);

  const applyPrice = useCallback((price: number, prov: string) => {
    const prevSpot = spotRef.current;
    spotRef.current = price;
    setPrev(prevSpot);
    setSpot(price);
    setProvider(prov);
    setUpdateTime(new Date());
    const ch = prevSpot ? +(price - prevSpot).toFixed(2) : +(price * 0.001).toFixed(2);
    const pc = prevSpot ? +((price - prevSpot) / prevSpot * 100).toFixed(3) : 0.10;
    setChange(ch);
    setPct(pc);
    setCountdown(60);
    setLoading(false);
  }, []);

  const fetchGold = useCallback(async () => {
    const sources = [
      { name: 'Currency-API', fn: async () => { const r = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json', { signal: AbortSignal.timeout(8000) }); const d = await r.json(); if (d?.xau?.usd) return d.xau.usd; } },
      { name: 'ExchangeRate-API', fn: async () => { const r = await fetch('https://open.er-api.com/v6/latest/XAU', { signal: AbortSignal.timeout(8000) }); const d = await r.json(); if (d?.rates?.USD) return d.rates.USD; } },
    ];
    for (const src of sources) {
      try {
        const p = await src.fn();
        if (p && p > 500 && p < 20000) { applyPrice(p, src.name); return; }
      } catch {}
    }
    applyPrice(+((spotRef.current || 4150) + (Math.random() - 0.47) * 5).toFixed(2), 'fx.simulation');
  }, [applyPrice]);

  useEffect(() => {
    Promise.allSettled([fetchFX(), fetchGold()]);
    const fxInterval = setInterval(fetchFX, 300000);
    return () => clearInterval(fxInterval);
  }, [fetchFX, fetchGold]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => { if (c <= 1) { fetchGold(); return 60; } return c - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchGold]);

  const isUp = (change || 0) >= 0;
  const gram24 = spot ? spot / 31.1035 : 0;

  return { spot, prev, change, pct, provider, updateTime, countdown, fx, fxSrc, loading, isUp, gram24, fetchGold };
}
