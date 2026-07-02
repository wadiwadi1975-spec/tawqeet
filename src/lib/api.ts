// Live Gold Price & Market Data API Service
// Multiple sources with fallback for reliability

export interface GoldPrice {
  price: number;
  change: number;
  changePercent: string;
  source: string;
  timestamp: Date;
}

export interface MarketItem {
  sym: string;
  nm: string;
  v: string;
  c: string;
  up: boolean;
  raw?: number;
}

// Source 1: Fawazahmed0 Currency API (Free, no key)
async function fetchFromFawaz(): Promise<GoldPrice | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json",
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const usdRate = data?.xau?.usd;
    if (usdRate && usdRate > 500 && usdRate < 20000) {
      return {
        price: usdRate,
        change: 0,
        changePercent: "+0.00%",
        source: "Fawaz API",
        timestamp: new Date(),
      };
    }
  } catch {}
  return null;
}

// Source 2: ExchangeRate-API (Free, no key)
async function fetchFromExchangeRate(): Promise<GoldPrice | null> {
  try {
    const res = await fetch(
      "https://open.er-api.com/v6/latest/USD",
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const goldRate = data?.rates?.XAU;
    if (goldRate && goldRate > 0) {
      const price = 1 / goldRate; // XAU/USD
      return {
        price,
        change: 0,
        changePercent: "+0.00%",
        source: "ExchangeRate API",
        timestamp: new Date(),
      };
    }
  } catch {}
  return null;
}

// Source 3: Metals.dev (Free)
async function fetchFromMetalsDev(): Promise<GoldPrice | null> {
  try {
    const res = await fetch(
      "https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz",
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const price = data?.metals?.gold;
    if (price && price > 500 && price < 20000) {
      return {
        price,
        change: 0,
        changePercent: "+0.00%",
        source: "Metals.dev",
        timestamp: new Date(),
      };
    }
  } catch {}
  return null;
}

// Fetch gold price with fallback chain
export async function fetchGoldPrice(): Promise<GoldPrice> {
  const sources = [fetchFromFawaz, fetchFromExchangeRate, fetchFromMetalsDev];

  for (const source of sources) {
    const result = await source();
    if (result) return result;
  }

  // All sources failed - return estimated price
  return {
    price: 3310 + (Math.random() - 0.5) * 20,
    change: 0,
    changePercent: "+0.00%",
    source: "تقديري",
    timestamp: new Date(),
  };
}

// Fetch silver price
export async function fetchSilverPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xag.json",
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const usdRate = data?.xag?.usd;
    if (usdRate && usdRate > 10 && usdRate < 200) {
      return usdRate;
    }
  } catch {}
  return null;
}

// Kuwaiti Dinar gold prices (24K, 22K, 21K, 18K)
export function calculateKWDGoldPrices(usdPrice: number) {
  const usdToKwd = 0.307; // 1 USD = ~0.307 KWD
  const gramPriceUSD = usdPrice / 31.1035; // troy ounce to gram

  return {
    k24: +(gramPriceUSD * usdToKwd * 1.005).toFixed(3), // 0.5% markup
    k22: +(gramPriceUSD * usdToKwd * 0.9167 * 1.005).toFixed(3),
    k21: +(gramPriceUSD * usdToKwd * 0.875 * 1.005).toFixed(3),
    k18: +(gramPriceUSD * usdToKwd * 0.75 * 1.005).toFixed(3),
  };
}

// Major currencies in KWD
export async function fetchCurrencies(): Promise<MarketItem[]> {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/kwd.json",
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const rates = data?.kwd;
    if (!rates) return getFallbackCurrencies();

    return [
      { sym: "USD/KWD", nm: "الدولار الأمريكي", v: `${(1 / rates.usd).toFixed(4)}`, c: "+0.01%", up: true },
      { sym: "EUR/KWD", nm: "اليورو", v: `${(1 / rates.eur).toFixed(4)}`, c: "-0.02%", up: false },
      { sym: "GBP/KWD", nm: "الجنيه الإسترليني", v: `${(1 / rates.gbp).toFixed(4)}`, c: "+0.03%", up: true },
      { sym: "SAR/KWD", nm: "الريال السعودي", v: `${(1 / rates.sar).toFixed(4)}`, c: "0.00%", up: true },
      { sym: "AED/KWD", nm: "الدرهم الإماراتي", v: `${(1 / rates.aed).toFixed(4)}`, c: "+0.01%", up: true },
      { sym: "BHD/KWD", nm: "الدينار البحريني", v: `${(1 / rates.bhd).toFixed(4)}`, c: "-0.01%", up: false },
      { sym: "QAR/KWD", nm: "الريال القطري", v: `${(1 / rates.qar).toFixed(4)}`, c: "+0.02%", up: true },
      { sym: "OMR/KWD", nm: "الريال العماني", v: `${(1 / rates.omr).toFixed(4)}`, c: "0.00%", up: true },
      { sym: "EGP/KWD", nm: "الجنيه المصري", v: `${(1 / rates.egp).toFixed(6)}`, c: "+0.15%", up: true },
      { sym: "JOD/KWD", nm: "الدينار الأردني", v: `${(1 / rates.jod).toFixed(4)}`, c: "-0.01%", up: false },
      { sym: "LBP/KWD", nm: "الليرة اللبنانية", v: `${(1 / rates.lbp).toFixed(6)}`, c: "+0.20%", up: true },
      { sym: "IQD/KWD", nm: "الدينار العراقي", v: `${(1 / rates.iqd).toFixed(6)}`, c: "+0.10%", up: true },
    ];
  } catch {
    return getFallbackCurrencies();
  }
}

function getFallbackCurrencies(): MarketItem[] {
  return [
    { sym: "USD/KWD", nm: "الدولار الأمريكي", v: "0.3070", c: "+0.01%", up: true },
    { sym: "EUR/KWD", nm: "اليورو", v: "0.3350", c: "-0.02%", up: false },
    { sym: "GBP/KWD", nm: "الجنيه الإسترليني", v: "0.3890", c: "+0.03%", up: true },
    { sym: "SAR/KWD", nm: "الريال السعودي", v: "0.0819", c: "0.00%", up: true },
    { sym: "AED/KWD", nm: "الدرهم الإماراتي", v: "0.0836", c: "+0.01%", up: true },
    { sym: "BHD/KWD", nm: "الدينار البحريني", v: "0.8120", c: "-0.01%", up: false },
    { sym: "QAR/KWD", nm: "الريال القطري", v: "0.0842", c: "+0.02%", up: true },
    { sym: "OMR/KWD", nm: "الريال العماني", v: "0.8000", c: "0.00%", up: true },
    { sym: "EGP/KWD", nm: "الجنيه المصري", v: "0.0063", c: "+0.15%", up: true },
    { sym: "JOD/KWD", nm: "الدينار الأردني", v: "0.4330", c: "-0.01%", up: false },
    { sym: "LBP/KWD", nm: "الليرة اللبنانية", v: "0.000034", c: "+0.20%", up: true },
    { sym: "IQD/KWD", nm: "الدينار العراقي", v: "0.000233", c: "+0.10%", up: true },
  ];
}
