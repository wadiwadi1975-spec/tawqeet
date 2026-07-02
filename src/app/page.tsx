"use client";
import { useState, useEffect } from "react";
import {
  fetchGoldPrice,
  fetchSilverPrice,
  fetchCurrencies,
  calculateKWDGoldPrices,
  type GoldPrice,
  type MarketItem,
} from "../lib/api";

type Indicator = {
  id: string;
  name: string;
  icon: string;
  value: string;
  impact: number;
  explanation: string;
  source: string;
  detail: string;
};

type Decision = {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  action: string;
};

const DECISIONS: Record<number, Decision> = {
  5: { label: "زيادة المخزون", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "📈", action: "شراء قوي على مراحل" },
  4: { label: "زيادة المخزون", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "📈", action: "شراء على مراحل" },
  3: { label: "زيادة المخزون", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "📈", action: "شراء تدريجي" },
  2: { label: "زيادة المخزون", color: "#22C55E", bgColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", icon: "📈", action: "شراء خفيف" },
  1: { label: "تثبيت", color: "#F59E0B", bgColor: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", icon: "⏸️", action: "انتظار ومراقبة" },
  0: { label: "تثبيت مع مراقبة", color: "#F59E0B", bgColor: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", icon: "👀", action: "مراقبة يومية" },
  [-1]: { label: "تخفيف المخزون", color: "#F97316", bgColor: "rgba(249,115,22,0.1)", borderColor: "rgba(249,115,22,0.3)", icon: "📉", action: "بيع جزئي" },
  [-2]: { label: "تصفية جزئية", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "بيع على مراحل" },
  [-3]: { label: "تصفية جزئية", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "تصفية قوية" },
  [-4]: { label: "تصفية جزئية", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "تصفية كاملة تقريباً" },
  [-5]: { label: "تصفية جزئية", color: "#EF4444", bgColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", icon: "🔻", action: "تصفية فورية" },
};

function getDecision(score: number): Decision {
  const clamped = Math.max(-5, Math.min(5, score));
  return DECISIONS[clamped] || DECISIONS[0];
}

const initialIndicators: Indicator[] = [
  { id: "interest", name: "سعر الفائدة", icon: "🏦", value: "4.75%", impact: 0, explanation: "ثبات الفائدة — تأثير محدود", source: "FRED API", detail: "سعر الفائدة الأمريكي (Federal Funds Rate) هو أحد أهم العوامل المؤثرة في سعر الذهب. عندما تنخفض الفائدة، يصبح الذهب أكثر جاذبية لأنه لا يُhasil فائدة. وعندما ترتفع، يقل الطلب على الذهب لصالح الأصول ذات العائد." },
  { id: "dollar", name: "قوة الدولار", icon: "💵", value: "97.2", impact: 1, explanation: "دولار ضعيف — دعم للذهب", source: "DXY Index", detail: "مؤشر الدولار الأمريكي (DXY) يقيس قوة الدولار مقابل سلة عملات. هناك علاقة عكسية بين الدولار والذهب: عندما يضعف الدولار، يرتفع سعر الذهب والعكس." },
  { id: "oil", name: "النفط والتضخم", icon: "🛢️", value: "$82.50", impact: 1, explanation: "نفط مرتفع — تحوّط إيجابي", source: "Brent Crude", detail: "ارتفاع أسعار النفط يعزز الطلب على الذهب كتحوّط ضد التضخم. عندما ترتفع تكاليف الطاقة، يرتفع التضخم فيزيد الطلب على الذهب كحصن ضد فقدان القيمة الشرائية." },
  { id: "geopolitics", name: "المخاطر الجيوسياسية", icon: "🌍", value: "متوسطة", impact: 1, explanation: "توترات ملحوظة — طلب على الملاذ", source: "VIX + News", detail: "التوترات الجيوسياسية (حروب، عقوبات، أزمات) تدفع المستثمرين للبحث عن الملاذات الآمنة مثل الذهب. نستخدم مؤشر VIX وتحليل عناوين الأخبار لقياس التوتر." },
  { id: "sentiment", name: "سلوك السوق", icon: "📊", value: "خوف", impact: 1, explanation: "Fear Index مرتفع — فرصة شراء", source: "CNN Fear & Greed", detail: "سلوك السوق يقيس مشاعر المستثمرين (طمع vs خوف). عندما يسود الخوف،往往 يكون فرصة شراء جيدة. نستخدم CNN Fear & Greed Index كمؤشر تقريبي." },
];

const TIMELINE_DATA = [
  { date: "اليوم", score: 4, decision: "شراء", price: "$3,310", color: "#22C55E" },
  { date: "أمس", score: 3, decision: "شراء", price: "$3,295", color: "#22C55E" },
  { date: "منذ يومين", score: 1, decision: "تثبيت", price: "$3,280", color: "#F59E0B" },
  { date: "منذ 3 أيام", score: -1, decision: "تخفيف", price: "$3,320", color: "#EF4444" },
  { date: "منذ 4 أيام", score: 2, decision: "شراء", price: "$3,260", color: "#22C55E" },
];

export default function TawqeetApp() {
  const [screen, setScreen] = useState<"splash" | "login" | "app">("splash");
  const [activeTab, setActiveTab] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators);
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndicator, setDetailIndicator] = useState<Indicator | null>(null);

  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [goldChange, setGoldChange] = useState(0);
  const [goldChangePercent, setGoldChangePercent] = useState("+0.00%");
  const [goldSource, setGoldSource] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const [silverPrice, setSilverPrice] = useState<number | null>(null);
  const [kwdPrices, setKwdPrices] = useState({ k24: 0, k22: 0, k21: 0, k18: 0 });
  const [currencies, setCurrencies] = useState<MarketItem[]>([]);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const score = indicators.reduce((sum, ind) => sum + ind.impact, 0);
  const decision = getDecision(score);

  // Splash screen
  useEffect(() => {
    const timer = setTimeout(() => setScreen("login"), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  async function fetchAllData() {
    try {
      // Fetch gold price
      const goldData = await fetchGoldPrice();
      setGoldPrice(goldData.price);
      setGoldChange(goldData.change);
      setGoldChangePercent(goldData.changePercent);
      setGoldSource(goldData.source);
      setLastUpdate(new Date());

      // Track price history
      setPriceHistory(prev => {
        const newHistory = [...prev, goldData.price];
        return newHistory.slice(-10); // Keep last 10 prices
      });

      // Calculate KWD prices
      const kwd = calculateKWDGoldPrices(goldData.price);
      setKwdPrices(kwd);

      // Fetch silver price
      const silver = await fetchSilverPrice();
      setSilverPrice(silver);

      // Fetch currencies
      const curr = await fetchCurrencies();
      setCurrencies(curr);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setScreen("app");
  }

  function toggleImpact(id: string, direction: 1 | -1) {
    setIndicators(prev => prev.map(ind => {
      if (ind.id !== id) return ind;
      const newImpact = Math.max(-1, Math.min(1, ind.impact + direction));
      return { ...ind, impact: newImpact };
    }));
  }

  function showIndicatorDetail(indicator: Indicator) {
    setDetailIndicator(indicator);
    setShowDetail(true);
  }

  // SPLASH SCREEN
  if (screen === "splash") {
    return (
      <div style={{ height: "100vh", background: "#1A1612", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <style jsx>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } }
        `}</style>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(186,117,23,0.15) 0%, transparent 70%)", animation: "pulse 3s ease-in-out infinite" }} />
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ position: "relative", zIndex: 1 }}>
            <circle cx="60" cy="60" r="55" stroke="#BA7517" strokeWidth="2" fill="none" opacity="0.3" />
            <circle cx="60" cy="60" r="45" stroke="#BA7517" strokeWidth="1.5" fill="none" opacity="0.2" />
            <path d="M45 25 L45 45 L35 75 Q35 85 60 85 Q85 85 85 75 L75 45 L75 25 Z" stroke="#BA7517" strokeWidth="2.5" fill="none" />
            <line x1="42" y1="25" x2="78" y2="25" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="85" x2="88" y2="85" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M48 48 L60 68 L72 48" stroke="#FAC775" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="60" cy="60" r="3" fill="#BA7517" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#BA7517", letterSpacing: 3 }}>توقيت</h1>
          <p style={{ fontSize: 11, color: "#6B5D4D", letterSpacing: 2, marginTop: 4 }}>YOUR DECISION, AT THE RIGHT TIME</p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (screen === "login") {
    return (
      <div style={{ height: "100vh", background: "#1A1612", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ position: "relative", width: 80, height: 80, marginBottom: 20 }}>
          <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" stroke="#BA7517" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M45 25 L45 45 L35 75 Q35 85 60 85 Q85 85 85 75 L75 45 L75 25 Z" stroke="#BA7517" strokeWidth="2.5" fill="none" />
            <line x1="42" y1="25" x2="78" y2="25" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="85" x2="88" y2="85" stroke="#BA7517" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="60" cy="60" r="3" fill="#BA7517" />
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#BA7517", marginBottom: 4 }}>توقيت</h1>
        <p style={{ fontSize: 11, color: "#6B5D4D", letterSpacing: 1, marginBottom: 30 }}>قرارك في وقته الصحيح</p>
        <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#231E19", color: "#F5F0E8", fontSize: 14, outline: "none" }} />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #2D2620", background: "#231E19", color: "#F5F0E8", fontSize: 14, outline: "none" }} />
          <button type="submit" style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", background: "#BA7517", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>دخول</button>
        </form>
        <p style={{ fontSize: 12, color: "#6B5D4D", marginTop: 20 }}>ليس لديك حساب؟ <span style={{ color: "#BA7517", cursor: "pointer" }}>إنشاء حساب جديد</span></p>
        <div style={{ position: "absolute", bottom: 40, fontSize: 10, color: "#6B5D4D", textAlign: "center" }}><span style={{ color: "#BA7517" }}>شروط الاستخدام</span> و <span style={{ color: "#BA7517" }}>سياسة الخصوصية</span></div>
      </div>
    );
  }

  // APP SCREENS
  return (
    <div style={{ height: "100vh", background: "#1A1612", display: "flex", flexDirection: "column", overflow: "hidden", maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "#231E19", borderBottom: "1px solid #2D2620", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="26" height="26" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" stroke="#BA7517" strokeWidth="3" fill="none" />
            <path d="M45 25 L45 45 L35 75 Q35 85 60 85 Q85 85 85 75 L75 45 L75 25 Z" stroke="#BA7517" strokeWidth="3" fill="none" />
            <line x1="42" y1="25" x2="78" y2="25" stroke="#BA7517" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="85" x2="88" y2="85" stroke="#BA7517" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="60" r="4" fill="#BA7517" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#BA7517" }}>توقيت</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 9, color: "#6B5D4D" }}>مباشر</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {/* HOME TAB */}
        {activeTab === "home" && (
          <>
            {/* Decision Card */}
            <div style={{ background: decision.bgColor, border: `1px solid ${decision.borderColor}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, color: "#6B5D4D", letterSpacing: 1, marginBottom: 4 }}>قرار اليوم</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{decision.icon}</span>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: decision.color }}>{decision.label}</div>
                      <div style={{ fontSize: 11, color: "#A89880", marginTop: 2 }}>{decision.action}</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 38, fontWeight: 900, color: decision.color, lineHeight: 1 }}>{score > 0 ? "+" : ""}{score}</div>
                  <div style={{ fontSize: 8, color: "#6B5D4D", marginTop: 4 }}>TWQEET Score</div>
                </div>
              </div>
            </div>

            {/* Gold Price - LIVE */}
            {goldPrice && (
              <div style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#6B5D4D", letterSpacing: 1 }}>XAU / USD</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#FAC775" }}>
                      ${goldPrice.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, color: goldChange >= 0 ? "#22C55E" : "#EF4444", fontWeight: 700 }}>
                      {goldChange >= 0 ? "▲" : "▼"} {goldChangePercent}
                    </div>
                    <div style={{ fontSize: 9, color: "#6B5D4D", marginTop: 2 }}>آخر تحديث: {lastUpdate?.toLocaleTimeString("ar")}</div>
                  </div>
                </div>

                {/* Mini chart */}
                {priceHistory.length > 1 && (
                  <div style={{ height: 40, display: "flex", alignItems: "flex-end", gap: 2, marginBottom: 8 }}>
                    {priceHistory.map((price, i) => {
                      const min = Math.min(...priceHistory);
                      const max = Math.max(...priceHistory);
                      const range = max - min || 1;
                      const height = ((price - min) / range) * 35 + 5;
                      const isLast = i === priceHistory.length - 1;
                      return (
                        <div key={i} style={{
                          flex: 1,
                          height: `${height}px`,
                          background: isLast ? "#BA7517" : price >= (priceHistory[i-1] || price) ? "#22C55E" : "#EF4444",
                          borderRadius: 2,
                          opacity: isLast ? 1 : 0.6,
                        }} />
                      );
                    })}
                  </div>
                )}

                {/* KWD Gold Prices */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div style={{ background: "#1A1612", borderRadius: 8, padding: 8, border: "1px solid #2D2620" }}>
                    <div style={{ fontSize: 8, color: "#6B5D4D" }}>24 قيراط</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FAC775" }}>{kwdPrices.k24} د.ك</div>
                  </div>
                  <div style={{ background: "#1A1612", borderRadius: 8, padding: 8, border: "1px solid #2D2620" }}>
                    <div style={{ fontSize: 8, color: "#6B5D4D" }}>22 قيراط</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FAC775" }}>{kwdPrices.k22} د.ك</div>
                  </div>
                  <div style={{ background: "#1A1612", borderRadius: 8, padding: 8, border: "1px solid #2D2620" }}>
                    <div style={{ fontSize: 8, color: "#6B5D4D" }}>21 قيراط</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FAC775" }}>{kwdPrices.k21} د.ك</div>
                  </div>
                  <div style={{ background: "#1A1612", borderRadius: 8, padding: 8, border: "1px solid #2D2620" }}>
                    <div style={{ fontSize: 8, color: "#6B5D4D" }}>18 قيراط</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FAC775" }}>{kwdPrices.k18} د.ك</div>
                  </div>
                </div>

                {silverPrice && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#6B5D4D" }}>🪙 XAG/USD:</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#A89880" }}>${silverPrice.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Indicators */}
            <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid #2D2620" }}>المؤشرات الخمسة</div>

            {indicators.map((ind) => (
              <div key={ind.id} style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 10, padding: 12, marginBottom: 8, cursor: "pointer" }} onClick={() => showIndicatorDetail(ind)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{ind.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{ind.name}</div>
                      <div style={{ fontSize: 9, color: "#6B5D4D" }}>{ind.source}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleImpact(ind.id, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #2D2620", background: "#1A1612", color: ind.impact === -1 ? "#EF4444" : "#6B5D4D", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 700, color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", minWidth: 22, textAlign: "center" }}>{ind.impact > 0 ? "+" : ""}{ind.impact}</span>
                    <button onClick={() => toggleImpact(ind.id, 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #2D2620", background: "#1A1612", color: ind.impact === 1 ? "#22C55E" : "#6B5D4D", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "#A89880" }}>{ind.value}</div>
                  <div style={{ fontSize: 10, color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", fontWeight: 600 }}>{ind.explanation}</div>
                </div>
              </div>
            ))}

            {/* Execution Rule */}
            <div style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 10, padding: 12, marginTop: 6, marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 6 }}>⚠️ قاعدة التنفيذ</div>
              <div style={{ fontSize: 10, color: "#A89880", lineHeight: 2 }}>
                <div>• لا تدخل بكامل السيولة دفعة واحدة</div>
                <div>• قسّم أي قرار على 3-4 مراحل</div>
                <div>• احتفظ بسيولة احتياطية 20% إلى 30%</div>
              </div>
              <div style={{ fontSize: 10, color: "#BA7517", fontWeight: 700, marginTop: 6, padding: "6px 10px", background: "rgba(186,117,23,0.1)", borderRadius: 6 }}>💡 أنت لا تتوقع السوق، أنت تدير المخطط</div>
            </div>
          </>
        )}

        {/* MARKET TAB */}
        {activeTab === "market" && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 10 }}>السوق — أسعار مباشرة</div>

            {/* Gold highlight */}
            {goldPrice && (
              <div style={{ background: "#231E19", border: "1px solid #BA7517", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 9, color: "#BA7517", letterSpacing: 1 }}>🪙 XAU/USD — الذهب</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#FAC775" }}>
                      ${goldPrice.toLocaleString("en", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, color: goldChange >= 0 ? "#22C55E" : "#EF4444", fontWeight: 700 }}>
                      {goldChange >= 0 ? "▲" : "▼"} {goldChangePercent}
                    </div>
                    <div style={{ fontSize: 9, color: "#6B5D4D" }}>ال来源: {goldSource}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Currencies */}
            {currencies.map((m, i) => (
              <div key={i} style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 10, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#BA7517", fontWeight: 700 }}>{m.sym}</div>
                  <div style={{ fontSize: 10, color: "#A89880" }}>{m.nm}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#F5F0E8" }}>{m.v}</div>
                  <div style={{ fontSize: 9, color: m.up ? "#22C55E" : "#EF4444" }}>{m.up ? "▲" : "▼"} {m.c}</div>
                </div>
              </div>
            ))}

            {currencies.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#6B5D4D" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                <div>جاري تحميل الأسعار...</div>
              </div>
            )}
          </>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === "analysis" && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 10 }}>التحليل — شرح تفصيلي</div>

            {/* Score Summary */}
            <div style={{ background: decision.bgColor, border: `1px solid ${decision.borderColor}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "#A89880" }}>النتيجة الإجمالية</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: decision.color }}>{score > 0 ? "+" : ""}{score}</div>
              </div>
              <div style={{ fontSize: 11, color: decision.color, fontWeight: 700, marginTop: 4 }}>{decision.label}</div>
            </div>

            {indicators.map((ind) => (
              <div key={ind.id} style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{ind.icon}</span> {ind.name}
                  </div>
                  <div style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: ind.impact > 0 ? "rgba(34,197,94,0.1)" : ind.impact < 0 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", fontWeight: 700 }}>
                    {ind.impact > 0 ? "إيجابي +" : ind.impact < 0 ? "سلبي -" : "محايد"}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#A89880", lineHeight: 1.8 }}>{ind.detail}</div>
                <div style={{ height: 4, background: "#2D2620", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.abs(ind.impact) * 50 + 30}%`, background: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", borderRadius: 2, transition: "width 0.3s" }} />
                </div>
                <div style={{ fontSize: 10, color: "#A89880", marginTop: 6 }}>
                  <strong style={{ color: "#BA7517" }}>{ind.name}:</strong> {ind.explanation}
                </div>
              </div>
            ))}
          </>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 10 }}>سجل القرارات</div>
            {TIMELINE_DATA.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #2D2620" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color }} />
                  {i < TIMELINE_DATA.length - 1 && <div style={{ width: 2, flex: 1, background: "#2D2620", marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ fontSize: 9, color: "#6B5D4D" }}>{t.date}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, margin: "4px 0", color: t.color }}>Score: {t.score > 0 ? "+" : ""}{t.score}</div>
                  <div style={{ fontSize: 11, color: "#A89880" }}>القرار: <strong>{t.decision}</strong> | السعر: <strong>{t.price}</strong></div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 10 }}>الإعدادات</div>

            {/* Subscription */}
            <div style={{ background: "#231E19", border: "1px solid #BA7517", borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Investor Plan</div>
                  <div style={{ fontSize: 9, color: "#BA7517", marginTop: 2 }}>الأكثر شيوعاً</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#BA7517" }}>9.99 <span style={{ fontSize: 9, color: "#6B5D4D" }}>$ / شهر</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                {["تحليل يومي", "سجل القرارات", "تنبيهات الأسعار", "Heat Map"].map((f, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#A89880", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: i < 3 ? "#22C55E" : "#6B5D4D" }}>{i < 3 ? "✓" : "✗"}</span> {f}
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: "#BA7517", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>اشترك الآن</button>
            </div>

            {/* Settings */}
            <div style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>العملة</div>
              <div style={{ marginTop: 6 }}>
                <select style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #2D2620", background: "#1A1612", color: "#F5F0E8", fontSize: 11 }}>
                  <option>USD - دولار</option>
                  <option>KWD - دينار كويتي</option>
                  <option>SAR - ريال سعودي</option>
                  <option>AED - درهم إماراتي</option>
                </select>
              </div>
            </div>

            <div style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>الإشعارات</div>
                  <div style={{ fontSize: 9, color: "#6B5D4D" }}>تنبيهات الأسعار</div>
                </div>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: "#BA7517", position: "relative", cursor: "pointer" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: 18 }} />
                </div>
              </div>
            </div>

            <div style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>تحديث تلقائي</div>
                  <div style={{ fontSize: 9, color: "#6B5D4D" }}>كل 60 ثانية</div>
                </div>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: "#BA7517", position: "relative", cursor: "pointer" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: 18 }} />
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 16, paddingBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#6B5D4D" }}>TWQEET v1.0 • <span style={{ color: "#BA7517" }}>قرارك في وقته الصحيح</span></div>
              <div style={{ fontSize: 9, color: "#6B5D4D", marginTop: 4 }}>WADI1975</div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "#231E19", borderTop: "1px solid #2D2620", display: "flex", padding: "6px 0 16px" }}>
        {[
          { id: "home", label: "الرئيسية", icon: "🏠" },
          { id: "market", label: "السوق", icon: "📈" },
          { id: "analysis", label: "التحليل", icon: "📊" },
          { id: "timeline", label: "السجل", icon: "📋" },
          { id: "settings", label: "الإعدادات", icon: "⚙️" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", color: activeTab === tab.id ? "#BA7517" : "#6B5D4D", fontSize: 9, cursor: "pointer", transition: "color 0.2s" }}>
            <span style={{ fontSize: 16 }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && <div style={{ width: 20, height: 2, background: "#BA7517", borderRadius: 1, marginTop: 2 }} />}
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetail && detailIndicator && (
        <div onClick={() => setShowDetail(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#231E19", border: "1px solid #2D2620", borderRadius: 14, padding: 20, width: "100%", maxWidth: 340, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{detailIndicator.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{detailIndicator.name}</div>
                <div style={{ fontSize: 9, color: "#6B5D4D" }}>{detailIndicator.source}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#A89880", lineHeight: 1.8, marginBottom: 14 }}>
              <p>{detailIndicator.detail}</p>
              <p style={{ marginTop: 8 }}>القيمة الحالية: <strong style={{ color: "#BA7517" }}>{detailIndicator.value}</strong></p>
            </div>
            <button onClick={() => setShowDetail(false)} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: "#BA7517", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}
