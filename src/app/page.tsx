"use client";
import { useState, useEffect, useCallback } from "react";
import {
  fetchGoldPrice, fetchSilverPrice, fetchCurrencies,
  calculateKWDGoldPrices, getEconomicCalendar, generateAIAnalysis,
  getPremiumMonitor, type GoldPrice, type MarketItem, type EconomicEvent, type AIAnalysis, type PremiumData,
} from "../lib/api";

// ==================== TYPES ====================
type Screen = "splash" | "login" | "register" | "forgot" | "reset" | "app";
type Tab = "home" | "market" | "analysis" | "calendar" | "alerts" | "portfolio" | "premium" | "ai" | "settings";

interface Indicator {
  id: string; name: string; icon: string; value: string; impact: number;
  explanation: string; source: string; detail: string;
  category: "fundamental" | "technical" | "sentiment";
  weight: number; // from document section 4
}

interface Alert { id: string; type: "price" | "signal" | "news"; title: string; desc: string; time: string; read: boolean; }

// ==================== CONSTANTS ====================
const INDICATOR_WEIGHTS: Record<string, number> = {
  interest: 20, dollar: 20, inflation: 15, oil: 10, pmi: 10, nfp: 10, etf: 5, vix: 5, geopolitics: 3, sentiment: 2,
};

const DECISIONS: Record<number, { label: string; color: string; bgColor: string; borderColor: string; icon: string; action: string }> = {
  5: { label: "شراء قوي", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "🚀", action: "شراء قوي على مراحل" },
  4: { label: "شراء قوي", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "📈", action: "شراء على مراحل" },
  3: { label: "شراء", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "📈", action: "شراء تدريجي" },
  2: { label: "شراء خفيف", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "📈", action: "شراء خفيف" },
  1: { label: "تثبيت", color: "#F59E0B", bgColor: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", icon: "⏸️", action: "انتظار ومراقبة" },
  0: { label: "مراقبة", color: "#F59E0B", bgColor: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", icon: "👀", action: "مراقبة يومية" },
  [-1]: { label: "تخفيف", color: "#F97316", bgColor: "rgba(249,115,22,0.1)", borderColor: "rgba(249,115,22,0.3)", icon: "📉", action: "بيع جزئي" },
  [-2]: { label: "تصفية", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "بيع على مراحل" },
  [-3]: { label: "تصفية قوية", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "تصفية قوية" },
  [-4]: { label: "تصفية كاملة", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "تصفية كاملة تقريباً" },
  [-5]: { label: "تصفية فورية", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "تصفية فورية" },
};

const INITIAL_INDICATORS: Indicator[] = [
  { id: "interest", name: "سعر الفائدة", icon: "🏦", value: "4.75%", impact: 0, explanation: "ثبات الفائدة", source: "FRED", detail: "سعر الفائدة الأمريكي — أهم العوامل المؤثرة في الذهب. علاقة عكسية: الفائدة ترتفع = الذهب ينخفض.", category: "fundamental", weight: 20 },
  { id: "dollar", name: "قوة الدولار (DXY)", icon: "💵", value: "97.2", impact: 1, explanation: "دولار ضعيف — دعم للذهب", source: "DXY Index", detail: "مؤشر الدولار يقيس قوة الدولار مقابل سلة عملات. علاقة عكسية مع الذهب.", category: "fundamental", weight: 20 },
  { id: "inflation", name: "التضخم (CPI)", icon: "📊", value: "3.2%", impact: 1, explanation: "تضخم مرتفع — طلب على الذهب", source: "BLS", detail: "مؤشر أسعار المستهلك — الذهب حصن ضد التضخم. التضخم المرتفع يزيد الطلب على الذهب.", category: "fundamental", weight: 15 },
  { id: "oil", name: "النفط", icon: "🛢️", value: "$82.50", impact: 1, explanation: "نفط مرتفع — تحوط إيجابي", source: "Brent", detail: "ارتفاع النفط يعزز التحوط ضد التضخم، مما يزيد الطلب على الذهب.", category: "fundamental", weight: 10 },
  { id: "pmi", name: "PMI الصناعي", icon: "🏭", value: "50.2", impact: 1, explanation: "توسع صناعي — إيجابي", source: "ISM", detail: "مؤشر مديري المشتريات — يقيس النشاط الصناعي. >50 = توسع، <50 = انكماش.", category: "fundamental", weight: 10 },
  { id: "nfp", name: "NFP الوظائف", icon: "👷", value: "180K", impact: 0, explanation: "وظائف مستقرة — تأثير محدود", source: "BLS", detail: "الوظائف غير الزراعية — مؤشر قوي لصحة الاقتصاد الأمريكي.", category: "fundamental", weight: 10 },
  { id: "etf", name: "صندوق ETF", icon: "📦", value: "3,200 طن", impact: 1, explanation: "الاحتياطيات ترتفع — دعم", source: "GLD/IAU", detail: "احتياطيات صناديق الذهب — مؤشر للطلب المؤسسي على الذهب.", category: "technical", weight: 5 },
  { id: "vix", name: "مؤشر VIX", icon: "😱", value: "18.4", impact: 1, explanation: "خوف متوسط — طلب على الملاذ", source: "CBOE", detail: "مؤشر الخوف — يقيس تقلب السوق. ارتفاع VIX = طلب على الملاذات الآمنة.", category: "sentiment", weight: 5 },
  { id: "geopolitics", name: "المخاطر الجيوسياسية", icon: "🌍", value: "متوسطة", impact: 1, explanation: "توترات ملحوظة", source: "News", detail: "التوترات الجيوسياسية تدفع المستثمرين للبحث عن الملاذات الآمنة.", category: "sentiment", weight: 3 },
  { id: "sentiment", name: "سلوك السوق", icon: "📊", value: "خوف", impact: 1, explanation: "Fear مرتفع — فرصة شراء", source: "CNN", detail: "سلوك السوق يقيس طمع vs خوف. الخوف往往 يكون فرصة شراء.", category: "sentiment", weight: 2 },
];

const SAMPLE_ALERTS: Alert[] = [
  { id: "1", type: "price", title: "الذهب كسر $3,350", desc: "الذهب وصل مستوى مقاومة جديد — يُنصح بالمراقبة", time: "منذ 5 دقائق", read: false },
  { id: "2", type: "signal", title: "إشارة شراء — Score +3", desc: "المؤشرات تدعم ارتفاع السعر — فرصة شراء على مراحل", time: "منذ 15 دقيقة", read: false },
  { id: "3", type: "news", title: "Fed يثبت الفائدة", desc: "البنك المركزي أبقى الفائدة عند 4.75% — تأثير محدود", time: "منذ ساعة", read: true },
  { id: "4", type: "price", title: "الذهب وصل $3,280", desc: "انخفاض 0.5% عن آخر إغلاق", time: "منذ 3 ساعات", read: true },
];

// ==================== MAIN APP ====================
export default function TawqeetApp() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [indicators, setIndicators] = useState<Indicator[]>(INITIAL_INDICATORS);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [silverPrice, setSilverPrice] = useState<number | null>(null);
  const [kwdPrices, setKwdPrices] = useState({ k24: 0, k22: 0, k21: 0, k18: 0 });
  const [currencies, setCurrencies] = useState<MarketItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndicator, setDetailIndicator] = useState<Indicator | null>(null);
  const [calendar, setCalendar] = useState<EconomicEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);
  const [premium, setPremium] = useState<PremiumData | null>(null);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const score = indicators.reduce((sum, ind) => sum + ind.impact, 0);
  const decision = DECISIONS[Math.max(-5, Math.min(5, score))] || DECISIONS[0];
  const aiAnalysis = goldPrice ? generateAIAnalysis(score, goldPrice) : null;

  // Splash
  useEffect(() => { const t = setTimeout(() => setScreen("login"), 2500); return () => clearTimeout(t); }, []);

  // Fetch data
  const fetchAll = useCallback(async () => {
    try {
      const [gold, silver, curr] = await Promise.all([fetchGoldPrice(), fetchSilverPrice(), fetchCurrencies()]);
      setGoldPrice(gold.price);
      setSilverPrice(silver);
      setCurrencies(curr);
      setLastUpdate(new Date());
      setKwdPrices(calculateKWDGoldPrices(gold.price));
      setPriceHistory(prev => [...prev.slice(-10), gold.price]);
      setCalendar(getEconomicCalendar());
      setPremium(getPremiumMonitor(gold.price));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchAll(); const i = setInterval(fetchAll, 60000); return () => clearInterval(i); }, [fetchAll]);

  function toggleImpact(id: string, dir: 1 | -1) {
    setIndicators(prev => prev.map(ind => ind.id === id ? { ...ind, impact: Math.max(-1, Math.min(1, ind.impact + dir)) } : ind));
  }

  // ====== SPLASH ======
  if (screen === "splash") return (
    <div style={{ height: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1510 50%, #0a0a0a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <style jsx>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.1);opacity:1}}@keyframes glow{0%,100%{filter:drop-shadow(0 0 8px rgba(186,117,23,.3))}50%{filter:drop-shadow(0 0 20px rgba(186,117,23,.6))}}`}</style>
      <div style={{ position: "relative", width: 140, height: 140, animation: "glow 2s ease-in-out infinite" }}>
        <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" stroke="#BA7517" strokeWidth="1.5" fill="none" opacity=".2" />
          <circle cx="60" cy="60" r="48" stroke="#BA7517" strokeWidth="1" fill="none" opacity=".15" />
          <circle cx="60" cy="60" r="40" stroke="#BA7517" strokeWidth="0.5" fill="none" opacity=".1" />
          <path d="M45 20 L45 42 L33 78 Q33 90 60 90 Q87 90 87 78 L75 42 L75 20 Z" stroke="#BA7517" strokeWidth="2" fill="none" />
          <line x1="40" y1="20" x2="80" y2="20" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="90" x2="90" y2="90" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 45 L60 70 L70 45" stroke="#FAC775" strokeWidth="1.5" fill="none" opacity=".5" />
          <circle cx="60" cy="58" r="3" fill="#BA7517" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: "#BA7517", letterSpacing: 6, fontFamily: "Cairo, sans-serif" }}>TWQEET</h1>
        <p style={{ fontSize: 10, color: "#6B5D4D", letterSpacing: 3, marginTop: 4 }}>GOLD INTELLIGENCE</p>
        <p style={{ fontSize: 9, color: "#4A3F35", letterSpacing: 2, marginTop: 8 }}>توقيت — قرارك في وقته الصحيح</p>
      </div>
    </div>
  );

  // ====== AUTH SCREENS ======
  if (screen === "login" || screen === "register" || screen === "forgot" || screen === "reset") return (
    <div style={{ height: "100vh", background: "linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ marginBottom: 30 }}>
        <svg width="60" height="60" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" stroke="#BA7517" strokeWidth="1.5" fill="none" opacity=".2" />
          <path d="M45 20 L45 42 L33 78 Q33 90 60 90 Q87 90 87 78 L75 42 L75 20 Z" stroke="#BA7517" strokeWidth="2" fill="none" />
          <line x1="40" y1="20" x2="80" y2="20" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="90" x2="90" y2="90" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="58" r="3" fill="#BA7517" />
        </svg>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#BA7517", marginBottom: 4 }}>TWQEET</h1>
      <p style={{ fontSize: 10, color: "#6B5D4D", letterSpacing: 2, marginBottom: 30 }}>
        {screen === "login" ? "تسجيل الدخول" : screen === "register" ? "حساب جديد" : screen === "forgot" ? "استعادة كلمة المرور" : "إعادة التعيين"}
      </p>
      <form onSubmit={e => { e.preventDefault(); setScreen("app"); }} style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 12 }}>
        {screen === "register" && <input placeholder="الاسم الكامل" value={name} onChange={e => setName(e.target.value)} style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#151210", color: "#F5F0E8", fontSize: 13, outline: "none" }} />}
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#151210", color: "#F5F0E8", fontSize: 13, outline: "none" }} />
        {screen !== "forgot" && screen !== "reset" && <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#151210", color: "#F5F0E8", fontSize: 13, outline: "none" }} />}
        {screen === "register" && <input type="password" placeholder="تأكيد كلمة المرور" style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#151210", color: "#F5F0E8", fontSize: 13, outline: "none" }} />}
        {screen === "reset" && <input type="password" placeholder="كلمة المرور الجديدة" style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#151210", color: "#F5F0E8", fontSize: 13, outline: "none" }} />}
        {screen === "reset" && <input type="password" placeholder="تأكيد كلمة المرور الجديدة" style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#151210", color: "#F5F0E8", fontSize: 13, outline: "none" }} />}
        <button type="submit" style={{ padding: "15px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #BA7517 0%, #D4AF37 100%)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
          {screen === "login" ? "دخول" : screen === "register" ? "إنشاء حساب" : screen === "forgot" ? "إرسال رابط الاستعادة" : "إعادة التعيين"}
        </button>
      </form>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {screen === "login" && <>
          <span style={{ fontSize: 10, color: "#6B5D4D", cursor: "pointer" }} onClick={() => setScreen("forgot")}>نسيت كلمة المرور؟</span>
          <span style={{ fontSize: 11, color: "#6B5D4D" }}>ليس لديك حساب؟ <span style={{ color: "#BA7517", cursor: "pointer" }} onClick={() => setScreen("register")}>سجل الآن</span></span>
        </>}
        {(screen === "register" || screen === "forgot" || screen === "reset") && <span style={{ fontSize: 11, color: "#6B5D4D" }}>لديك حساب؟ <span style={{ color: "#BA7517", cursor: "pointer" }} onClick={() => setScreen("login")}>دخول</span></span>}
      </div>
    </div>
  );

  // ====== MAIN APP ======
  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", overflow: "hidden", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "10px 16px", background: "#111110", borderBottom: "1px solid #1e1b18", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="24" height="24" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" stroke="#BA7517" strokeWidth="3" fill="none" />
            <path d="M45 20 L45 42 L33 78 Q33 90 60 90 Q87 90 87 78 L75 42 L75 20 Z" stroke="#BA7517" strokeWidth="3" fill="none" />
            <circle cx="60" cy="58" r="4" fill="#BA7517" />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#BA7517", letterSpacing: 1 }}>TWQEET</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 16, cursor: "pointer" }} onClick={() => setActiveTab("alerts")}>🔔</span>
            {alerts.filter(a => !a.read).length > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />}
          </div>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14, paddingBottom: 80 }}>

        {/* ====== HOME TAB ====== */}
        {activeTab === "home" && <>
          {/* Decision Card */}
          <div style={{ background: decision.bgColor, border: `1px solid ${decision.borderColor}`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 8, color: "#6B5D4D", letterSpacing: 2, marginBottom: 4 }}>TODAY&apos;S DECISION</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 28 }}>{decision.icon}</span>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: decision.color }}>{decision.label}</div>
                    <div style={{ fontSize: 10, color: "#A89880", marginTop: 2 }}>{decision.action}</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center", background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "8px 12px" }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: decision.color, lineHeight: 1 }}>{score > 0 ? "+" : ""}{score}</div>
                <div style={{ fontSize: 7, color: "#6B5D4D", marginTop: 4, letterSpacing: 1 }}>SCORE</div>
              </div>
            </div>
          </div>

          {/* Gold Price */}
          {goldPrice && (
            <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 8, color: "#6B5D4D", letterSpacing: 2 }}>XAU / USD</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#FAC775", lineHeight: 1.2 }}>${goldPrice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 700 }}>+0.45%</div>
                  <div style={{ fontSize: 8, color: "#6B5D4D", marginTop: 2 }}>{lastUpdate?.toLocaleTimeString("ar")}</div>
                </div>
              </div>
              {/* Mini chart */}
              {priceHistory.length > 1 && (
                <div style={{ height: 50, display: "flex", alignItems: "flex-end", gap: 2, marginBottom: 10, background: "#0a0a0a", borderRadius: 8, padding: 8 }}>
                  {priceHistory.map((p, i) => {
                    const mn = Math.min(...priceHistory), mx = Math.max(...priceHistory), rng = mx - mn || 1;
                    const h = ((p - mn) / rng) * 35 + 5;
                    return <div key={i} style={{ flex: 1, height: `${h}px`, background: i === priceHistory.length - 1 ? "#BA7517" : p >= (priceHistory[i - 1] || p) ? "#22C55E" : "#EF4444", borderRadius: 2, opacity: i === priceHistory.length - 1 ? 1 : 0.5 }} />;
                  })}
                </div>
              )}
              {/* KWD Prices */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[["24K", kwdPrices.k24], ["22K", kwdPrices.k22], ["21K", kwdPrices.k21], ["18K", kwdPrices.k18]].map(([k, v]) => (
                  <div key={k} style={{ background: "#0a0a0a", borderRadius: 8, padding: "6px 10px", border: "1px solid #1e1b18" }}>
                    <div style={{ fontSize: 7, color: "#6B5D4D" }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#FAC775" }}>{v} د.ك</div>
                  </div>
                ))}
              </div>
              {silverPrice && <div style={{ marginTop: 8, fontSize: 9, color: "#6B5D4D" }}>🪙 XAG/USD: <span style={{ color: "#A89880" }}>${silverPrice.toFixed(2)}</span></div>}
            </div>
          )}

          {/* Heat Map Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2 }}>المؤشرات العشرة</div>
            <button onClick={() => setShowHeatMap(!showHeatMap)} style={{ fontSize: 9, color: "#BA7517", background: "rgba(186,117,23,0.1)", border: "1px solid rgba(186,117,23,0.3)", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>
              {showHeatMap ? "📋 قائمة" : "🗺️ Heat Map"}
            </button>
          </div>

          {/* Heat Map View */}
          {showHeatMap && (
            <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 12, padding: 12, marginBottom: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
                {indicators.map(ind => (
                  <div key={ind.id} onClick={() => { setDetailIndicator(ind); setShowDetail(true); }} style={{ background: ind.impact > 0 ? "rgba(34,197,94,0.15)" : ind.impact < 0 ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", border: `1px solid ${ind.impact > 0 ? "rgba(34,197,94,0.3)" : ind.impact < 0 ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: 8, padding: 8, textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 16 }}>{ind.icon}</div>
                    <div style={{ fontSize: 7, color: "#A89880", marginTop: 2 }}>{ind.name.split(" ")[0]}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", marginTop: 2 }}>{ind.impact > 0 ? "+" : ""}{ind.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indicators List */}
          {indicators.map(ind => (
            <div key={ind.id} onClick={() => { setDetailIndicator(ind); setShowDetail(true); }} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 12, padding: 12, marginBottom: 8, cursor: "pointer", transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{ind.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{ind.name}</div>
                    <div style={{ fontSize: 8, color: "#6B5D4D" }}>{ind.source} • وزن {ind.weight}%</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => toggleImpact(ind.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #2D2620", background: "#0a0a0a", color: ind.impact === -1 ? "#EF4444" : "#6B5D4D", fontSize: 12, cursor: "pointer" }}>−</button>
                  <span style={{ fontSize: 12, fontWeight: 900, color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", minWidth: 20, textAlign: "center" }}>{ind.impact > 0 ? "+" : ""}{ind.impact}</span>
                  <button onClick={() => toggleImpact(ind.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #2D2620", background: "#0a0a0a", color: ind.impact === 1 ? "#22C55E" : "#6B5D4D", fontSize: 12, cursor: "pointer" }}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 10, color: "#A89880" }}>{ind.value}</div>
                <div style={{ fontSize: 9, color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", fontWeight: 600 }}>{ind.explanation}</div>
              </div>
            </div>
          ))}

          {/* Execution Rule */}
          <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 12, padding: 12, marginTop: 8 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 6 }}>⚠️ قاعدة التنفيذ</div>
            <div style={{ fontSize: 10, color: "#A89880", lineHeight: 2 }}>
              <div>• لا تدخل بكامل السيولة دفعة واحدة</div>
              <div>• قسّم أي قرار على 3-4 مراحل</div>
              <div>• احتفظ بسيولة احتياطية 20% إلى 30%</div>
            </div>
            <div style={{ fontSize: 9, color: "#BA7517", fontWeight: 700, marginTop: 6, padding: "6px 10px", background: "rgba(186,117,23,0.1)", borderRadius: 6 }}>💡 أنت لا تتوقع السوق، أنت تدير المخطط</div>
          </div>
        </>}

        {/* ====== MARKET TAB ====== */}
        {activeTab === "market" && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>السوق — أسعار مباشرة</div>
          {goldPrice && (
            <div style={{ background: "linear-gradient(135deg, rgba(186,117,23,0.1) 0%, rgba(250,199,117,0.05) 100%)", border: "1px solid rgba(186,117,23,0.3)", borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontSize: 8, color: "#BA7517", letterSpacing: 2 }}>🪙 XAU/USD</div><div style={{ fontSize: 36, fontWeight: 900, color: "#FAC775" }}>${goldPrice.toLocaleString("en", { minimumFractionDigits: 2 })}</div></div>
                <div style={{ textAlign: "left" }}><div style={{ fontSize: 14, color: "#22C55E", fontWeight: 700 }}>▲ +0.45%</div><div style={{ fontSize: 8, color: "#6B5D4D" }}>آخر تحديث: {lastUpdate?.toLocaleTimeString("ar")}</div></div>
              </div>
            </div>
          )}
          {currencies.map((m, i) => (
            <div key={i} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 12, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 10, color: "#BA7517", fontWeight: 700 }}>{m.sym}</div><div style={{ fontSize: 9, color: "#A89880" }}>{m.nm}</div></div>
              <div style={{ textAlign: "left" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#F5F0E8" }}>{m.v}</div><div style={{ fontSize: 8, color: m.up ? "#22C55E" : "#EF4444" }}>{m.up ? "▲" : "▼"} {m.c}</div></div>
            </div>
          ))}
        </>}

        {/* ====== ANALYSIS TAB ====== */}
        {activeTab === "analysis" && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>التحليل — شرح تفصيلي</div>
          <div style={{ background: decision.bgColor, border: `1px solid ${decision.borderColor}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 10, color: "#A89880" }}>النتيجة الإجمالية</div><div style={{ fontSize: 11, color: decision.color, fontWeight: 700, marginTop: 2 }}>{decision.label}</div></div>
              <div style={{ fontSize: 36, fontWeight: 900, color: decision.color }}>{score > 0 ? "+" : ""}{score}</div>
            </div>
          </div>
          {indicators.map(ind => (
            <div key={ind.id} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><span>{ind.icon}</span> {ind.name}</div>
                <div style={{ fontSize: 9, padding: "2px 8px", borderRadius: 8, background: ind.impact > 0 ? "rgba(34,197,94,0.1)" : ind.impact < 0 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", fontWeight: 700 }}>
                  {ind.impact > 0 ? "إيجابي +" : ind.impact < 0 ? "سلبي -" : "محايد"}
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#A89880", lineHeight: 1.8 }}>{ind.detail}</div>
              <div style={{ height: 4, background: "#1e1b18", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.abs(ind.impact) * 50 + 30}%`, background: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 8, color: "#6B5D4D", marginTop: 6 }}>وزن المؤشر: {ind.weight}%</div>
            </div>
          ))}
        </>}

        {/* ====== CALENDAR TAB ====== */}
        {activeTab === "calendar" && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>التقويم الاقتصادي</div>
          {calendar.map((ev, i) => (
            <div key={i} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 12, marginBottom: 8, borderRight: `3px solid ${ev.impact === "high" ? "#EF4444" : ev.impact === "medium" ? "#F59E0B" : "#22C55E"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12 }}>{ev.country}</span>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{ev.event}</span>
                </div>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 4, background: ev.impact === "high" ? "rgba(239,68,68,0.15)" : ev.impact === "medium" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)", color: ev.impact === "high" ? "#EF4444" : ev.impact === "medium" ? "#F59E0B" : "#22C55E", fontWeight: 700 }}>
                  {ev.impact === "high" ? "مهم جداً" : ev.impact === "medium" ? "متوسط" : "منخفض"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#6B5D4D" }}>
                <span>{ev.date} • {ev.time}</span>
                <span>التوقع: {ev.forecast} | السابق: {ev.previous}</span>
              </div>
            </div>
          ))}
        </>}

        {/* ====== ALERTS TAB ====== */}
        {activeTab === "alerts" && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>التنبيهات</div>
          {alerts.map(al => (
            <div key={al.id} style={{ background: al.read ? "#111110" : "rgba(186,117,23,0.05)", border: "1px solid #1e1b18", borderRadius: 10, padding: 12, marginBottom: 8, borderRight: `3px solid ${al.read ? "#2D2620" : "#BA7517"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{al.type === "price" ? "💰" : al.type === "signal" ? "📊" : "📰"}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: al.read ? "#A89880" : "#F5F0E8" }}>{al.title}</span>
                </div>
                {!al.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#BA7517" }} />}
              </div>
              <div style={{ fontSize: 10, color: "#6B5D4D", lineHeight: 1.6 }}>{al.desc}</div>
              <div style={{ fontSize: 8, color: "#4A3F35", marginTop: 4 }}>{al.time}</div>
            </div>
          ))}
        </>}

        {/* ====== PORTFOLIO TAB ====== */}
        {activeTab === "portfolio" && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>المحفظة</div>
          <div style={{ background: "linear-gradient(135deg, rgba(186,117,23,0.1) 0%, rgba(250,199,117,0.05) 100%)", border: "1px solid rgba(186,117,23,0.3)", borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 8, color: "#6B5D4D", letterSpacing: 2 }}>إجمالي المحفظة</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FAC775", marginTop: 4 }}>125.500 د.ك</div>
            <div style={{ fontSize: 10, color: "#22C55E", marginTop: 4 }}>+2.3% هذا الشهر</div>
          </div>
          {[{ name: "ذهب 24K", qty: "50 جرام", val: "75.000 د.ك", pct: "+3.2%", up: true }, { name: "ذهب 22K", qty: "30 جرام", val: "30.000 د.ك", pct: "+1.8%", up: true }, { name: "ذهب 21K", qty: "20 جرام", val: "20.500 د.ك", pct: "-0.5%", up: false }].map((item, i) => (
            <div key={i} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 11, fontWeight: 700 }}>{item.name}</div><div style={{ fontSize: 9, color: "#6B5D4D" }}>{item.qty}</div></div>
              <div style={{ textAlign: "left" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#F5F0E8" }}>{item.val}</div><div style={{ fontSize: 9, color: item.up ? "#22C55E" : "#EF4444" }}>{item.up ? "▲" : "▼"} {item.pct}</div></div>
            </div>
          ))}
        </>}

        {/* ====== PREMIUM TAB ====== */}
        {activeTab === "premium" && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>المراقب المتقدم</div>
          {premium && <>
            {/* Support/Resistance */}
            <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 12, padding: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", marginBottom: 8 }}>📊 مستويات الدعم والمقاومة</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: "#22C55E", marginBottom: 4 }}>ال Resistance</div>
                  {premium.resistanceLevels.map((r, i) => <div key={i} style={{ fontSize: 9, color: "#A89880", marginBottom: 2 }}>${r.price.toFixed(0)} <span style={{ color: "#6B5D4D" }}>({r.strength})</span></div>)}
                </div>
                <div style={{ width: 1, background: "#1e1b18" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, color: "#EF4444", marginBottom: 4 }}>ال Support</div>
                  {premium.supportLevels.map((s, i) => <div key={i} style={{ fontSize: 9, color: "#A89880", marginBottom: 2 }}>${s.price.toFixed(0)} <span style={{ color: "#6B5D4D" }}>({s.strength})</span></div>)}
                </div>
              </div>
            </div>
            {/* Moving Averages */}
            <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 12, padding: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", marginBottom: 8 }}>📈 المتوسطات المتحركة</div>
              {premium.movingAverages.map((ma, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: "#A89880" }}>{ma.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700 }}>${ma.value.toFixed(0)}</span>
                  <span style={{ fontSize: 9, color: ma.signal === "شراء" ? "#22C55E" : "#EF4444" }}>{ma.signal}</span>
                </div>
              ))}
            </div>
          </>}
        </>}

        {/* ====== AI TAB ====== */}
        {activeTab === "ai" && aiAnalysis && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>🤖 محلل الذكاء الاصطناعي</div>
          <div style={{ background: "linear-gradient(135deg, rgba(186,117,23,0.1) 0%, rgba(250,199,117,0.05) 100%)", border: "1px solid rgba(186,117,23,0.3)", borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>AI Analyst</div>
                <div style={{ fontSize: 8, color: "#6B5D4D" }}>محلل TWQEET الذكي</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#F5F0E8", lineHeight: 1.8 }}>{aiAnalysis.summary}</div>
          </div>
          <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", marginBottom: 6 }}>📈 AI Forecast</div>
            <div style={{ fontSize: 10, color: "#A89880", lineHeight: 1.8 }}>{aiAnalysis.forecast}</div>
          </div>
          <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", marginBottom: 6 }}>💬 AI Commentary</div>
            <div style={{ fontSize: 10, color: "#A89880", lineHeight: 1.8 }}>{aiAnalysis.commentary}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 8, color: "#6B5D4D" }}>الثقة</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: aiAnalysis.confidence === "عالي" ? "#22C55E" : aiAnalysis.confidence === "متوسط" ? "#F59E0B" : "#EF4444" }}>{aiAnalysis.confidence}</div>
            </div>
            <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 8, color: "#6B5D4D" }}>الاتجاه</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: aiAnalysis.trend === "صاعد" ? "#22C55E" : aiAnalysis.trend === "هابط" ? "#EF4444" : "#F59E0B" }}>{aiAnalysis.trend}</div>
            </div>
            <div style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 8, color: "#6B5D4D" }}>المخاطر</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: aiAnalysis.riskLevel === "منخفض" ? "#22C55E" : aiAnalysis.riskLevel === "متوسط" ? "#F59E0B" : "#EF4444" }}>{aiAnalysis.riskLevel}</div>
            </div>
          </div>
        </>}

        {/* ====== SETTINGS TAB ====== */}
        {activeTab === "settings" && <>
          <div style={{ fontSize: 8, fontWeight: 700, color: "#BA7517", letterSpacing: 2, marginBottom: 10 }}>الإعدادات</div>
          <div style={{ background: "linear-gradient(135deg, rgba(186,117,23,0.1) 0%, rgba(250,199,117,0.05) 100%)", border: "1px solid rgba(186,117,23,0.3)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>Investor Plan</div><div style={{ fontSize: 9, color: "#BA7517", marginTop: 2 }}>الأكثر شيوعاً</div></div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#BA7517" }}>9.99<span style={{ fontSize: 8, color: "#6B5D4D" }}> $/mo</span></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
              {["تحليل يومي", "سجل القرارات", "تنبيهات الأسعار", "Heat Map", "AI Analyst", "Economic Calendar"].map((f, i) => (
                <div key={i} style={{ fontSize: 10, color: "#A89880", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: i < 4 ? "#22C55E" : "#6B5D4D" }}>{i < 4 ? "✓" : "✗"}</span> {f}
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #BA7517 0%, #D4AF37 100%)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>اشترك الآن</button>
          </div>
          {[{ label: "العملة", options: ["USD - دولار", "KWD - دينار كويتي", "SAR - ريال سعودي", "AED - درهم إماراتي"] }, { label: "اللغة", options: ["العربية", "English"] }].map((s, i) => (
            <div key={i} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{s.label}</div>
              <select style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #1e1b18", background: "#0a0a0a", color: "#F5F0E8", fontSize: 10, marginTop: 6 }}>
                {s.options.map((o, j) => <option key={j}>{o}</option>)}
              </select>
            </div>
          ))}
          {[{ label: "الإشعارات", desc: "تنبيهات الأسعار" }, { label: "تحديث تلقائي", desc: "كل 60 ثانية" }].map((s, i) => (
            <div key={i} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 10, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 11, fontWeight: 600 }}>{s.label}</div><div style={{ fontSize: 9, color: "#6B5D4D" }}>{s.desc}</div></div>
              <div style={{ width: 36, height: 20, borderRadius: 10, background: "#BA7517", position: "relative", cursor: "pointer" }}><div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: 18 }} /></div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 16, paddingBottom: 14 }}>
            <div style={{ fontSize: 9, color: "#4A3F35" }}>TWQEET v2.0 • <span style={{ color: "#BA7517" }}>Gold Intelligence</span></div>
            <div style={{ fontSize: 8, color: "#3A3530", marginTop: 4 }}>WADI1975 • قرارك في وقته الصحيح</div>
          </div>
        </>}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "#111110", borderTop: "1px solid #1e1b18", display: "flex", padding: "6px 0 16px", position: "absolute", bottom: 0, left: 0, right: 0 }}>
        {[
          { id: "home", icon: "🏠", label: "الرئيسية" },
          { id: "market", icon: "📈", label: "السوق" },
          { id: "analysis", icon: "📊", label: "التحليل" },
          { id: "calendar", icon: "📅", label: "التقويم" },
          { id: "ai", icon: "🤖", label: "AI" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as Tab)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, background: "none", border: "none", color: activeTab === t.id ? "#BA7517" : "#4A3F35", fontSize: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span>{t.label}</span>
            {activeTab === t.id && <div style={{ width: 16, height: 2, background: "#BA7517", borderRadius: 1, marginTop: 1 }} />}
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetail && detailIndicator && (
        <div onClick={() => setShowDetail(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#111110", border: "1px solid #1e1b18", borderRadius: 16, padding: 20, width: "100%", maxWidth: 380, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{detailIndicator.icon}</span>
              <div><div style={{ fontSize: 14, fontWeight: 700 }}>{detailIndicator.name}</div><div style={{ fontSize: 8, color: "#6B5D4D" }}>{detailIndicator.source} • وزن {detailIndicator.weight}%</div></div>
            </div>
            <div style={{ fontSize: 11, color: "#A89880", lineHeight: 1.8, marginBottom: 14 }}>
              <p>{detailIndicator.detail}</p>
              <p style={{ marginTop: 8 }}>القيمة الحالية: <strong style={{ color: "#BA7517" }}>{detailIndicator.value}</strong></p>
              <p>التأثير: <strong style={{ color: detailIndicator.impact > 0 ? "#22C55E" : detailIndicator.impact < 0 ? "#EF4444" : "#F59E0B" }}>{detailIndicator.impact > 0 ? "إيجابي" : detailIndicator.impact < 0 ? "سلبي" : "محايد"}</strong></p>
            </div>
            <button onClick={() => setShowDetail(false)} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #BA7517 0%, #D4AF37 100%)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}
