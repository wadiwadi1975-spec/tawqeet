"use client";
import { useState, useEffect } from "react";

type Indicator = {
  id: string;
  name: string;
  icon: string;
  value: string;
  impact: number;
  explanation: string;
  source: string;
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
  return DECISIONS[Math.max(-5, Math.min(5, score))] || DECISIONS[0];
}

export default function TawqeetApp() {
  const [screen, setScreen] = useState<"splash" | "login" | "dashboard">("splash");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: "interest", name: "سعر الفائدة", icon: "🏦", value: "4.75%", impact: 0, explanation: "ثبات الفائدة — تأثير محدود", source: "FRED API" },
    { id: "dollar", name: "قوة الدولار", icon: "💵", value: "97.2", impact: 1, explanation: "دولار ضعيف — دعم للذهب", source: "DXY Index" },
    { id: "oil", name: "النفط والتضخم", icon: "🛢️", value: "$82.50", impact: 1, explanation: "نفط مرتفع — تحوّط إيجابي", source: "Brent Crude" },
    { id: "geopolitics", name: "المخاطر الجيوسياسية", icon: "🌍", value: "متوسطة", impact: 1, explanation: "توترات ملحوظة — طلب على الملاذ", source: "VIX + News" },
    { id: "sentiment", name: "سلوك السوق", icon: "📊", value: "خوف", impact: 1, explanation: "Fear Index مرتفع — فرصة شراء", source: "CNN Fear & Greed" },
  ]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailIndicator, setDetailIndicator] = useState<Indicator | null>(null);

  const score = indicators.reduce((sum, ind) => sum + ind.impact, 0);
  const decision = getDecision(score);

  useEffect(() => {
    const timer = setTimeout(() => setScreen("login"), 2500);
    return () => clearTimeout(timer);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setScreen("dashboard");
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

  // SPLASH
  if (screen === "splash") {
    return (
      <div style={{ height: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <style jsx>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } }
          @keyframes spin { to { transform: rotate(360deg); } }
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
          <p style={{ fontSize: 11, color: "var(--tx3)", letterSpacing: 2, marginTop: 4 }}>YOUR DECISION, AT THE RIGHT TIME</p>
        </div>
      </div>
    );
  }

  // LOGIN
  if (screen === "login") {
    return (
      <div style={{ height: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
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
        <p style={{ fontSize: 11, color: "var(--tx3)", letterSpacing: 1, marginBottom: 30 }}>قرارك في وقته الصحيح</p>

        <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--bg3)", background: "var(--bg2)", color: "var(--tx)", fontSize: 14, outline: "none" }}
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--bg3)", background: "var(--bg2)", color: "var(--tx)", fontSize: 14, outline: "none" }}
          />
          <button type="submit" style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", background: "#BA7517", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
            دخول
          </button>
        </form>

        <p style={{ fontSize: 12, color: "var(--tx3)", marginTop: 20 }}>
          ليس لديك حساب؟ <span style={{ color: "#BA7517", cursor: "pointer" }}>إنشاء حساب جديد</span>
        </p>

        <div style={{ position: "absolute", bottom: 40, fontSize: 10, color: "var(--tx3)", textAlign: "center", lineHeight: 1.8 }}>
          <span style={{ color: "#BA7517" }}>شروط الاستخدام</span> و <span style={{ color: "#BA7517" }}>سياسة الخصوصية</span>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ height: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .indicator-card { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "16px 16px 12px", background: "var(--bg2)", borderBottom: "1px solid var(--bg3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="55" stroke="#BA7517" strokeWidth="3" fill="none" />
              <path d="M45 25 L45 45 L35 75 Q35 85 60 85 Q85 85 85 75 L75 45 L75 25 Z" stroke="#BA7517" strokeWidth="3" fill="none" />
              <line x1="42" y1="25" x2="78" y2="25" stroke="#BA7517" strokeWidth="3" strokeLinecap="round" />
              <line x1="32" y1="85" x2="88" y2="85" stroke="#BA7517" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="60" r="4" fill="#BA7517" />
            </svg>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#BA7517" }}>توقيت</span>
          </div>
          <span style={{ fontSize: 10, color: "var(--tx3)" }}>{new Date().toLocaleDateString("ar", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Scroll Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Decision Card */}
        <div style={{ background: decision.bgColor, border: `1px solid ${decision.borderColor}`, borderRadius: 16, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${decision.color}, transparent)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--tx3)", letterSpacing: 1, marginBottom: 6 }}>قرار اليوم</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 28 }}>{decision.icon}</span>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: decision.color }}>{decision.label}</div>
                  <div style={{ fontSize: 12, color: "var(--tx2)", marginTop: 2 }}>{decision.action}</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: decision.color, lineHeight: 1 }}>{score > 0 ? "+" : ""}{score}</div>
              <div style={{ fontSize: 9, color: "var(--tx3)", marginTop: 4 }}>TWQEET Score</div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div style={{ fontSize: 10, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid var(--bg3)" }}>المؤشرات الخمسة</div>

        {indicators.map((ind, i) => (
          <div key={ind.id} className="indicator-card" style={{ background: "var(--bg2)", border: "1px solid var(--bg3)", borderRadius: 12, padding: 14, marginBottom: 10, animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{ind.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--tx)" }}>{ind.name}</div>
                  <div style={{ fontSize: 10, color: "var(--tx3)" }}>{ind.source}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => toggleImpact(ind.id, -1)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid var(--bg3)", background: "var(--bg)", color: ind.impact === -1 ? "#EF4444" : "var(--tx3)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: 14, fontWeight: 700, color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", minWidth: 24, textAlign: "center" }}>{ind.impact > 0 ? "+" : ""}{ind.impact}</span>
                <button onClick={() => toggleImpact(ind.id, 1)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid var(--bg3)", background: "var(--bg)", color: ind.impact === 1 ? "#22C55E" : "var(--tx3)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "var(--tx2)" }}>{ind.value}</div>
              <div style={{ fontSize: 11, color: ind.impact > 0 ? "#22C55E" : ind.impact < 0 ? "#EF4444" : "#F59E0B", fontWeight: 600 }}>{ind.explanation}</div>
            </div>
          </div>
        ))}

        {/* Execution Rule */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--bg3)", borderRadius: 12, padding: 14, marginTop: 6, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#BA7517", letterSpacing: 1, marginBottom: 8 }}>⚠️ قاعدة التنفيذ</div>
          <div style={{ fontSize: 11, color: "var(--tx2)", lineHeight: 2 }}>
            <div>• لا تدخل بكامل السيولة دفعة واحدة</div>
            <div>• قسّم أي قرار شراء أو بيع على 3-4 مراحل</div>
            <div>• احتفظ بسيولة احتياطية 20% إلى 30%</div>
          </div>
          <div style={{ fontSize: 11, color: "#BA7517", fontWeight: 700, marginTop: 8, padding: "8px 12px", background: "rgba(186,117,23,0.1)", borderRadius: 8 }}>
            💡 أنت لا تتوقع السوق، أنت تدير المخطط
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--bg3)", display: "flex", padding: "8px 0 20px" }}>
        {[
          { id: "home", label: "الرئيسية", icon: "🏠" },
          { id: "market", label: "السوق", icon: "📈" },
          { id: "analysis", label: "التحليل", icon: "📊" },
          { id: "timeline", label: "السجل", icon: "📋" },
          { id: "settings", label: "الإعدادات", icon: "⚙️" },
        ].map(tab => (
          <button key={tab.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", color: tab.id === "home" ? "#BA7517" : "var(--tx3)", fontSize: 9, cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetail && detailIndicator && (
        <div onClick={() => setShowDetail(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", border: "1px solid var(--bg3)", borderRadius: 16, padding: 24, width: "100%", maxWidth: 360 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>{detailIndicator.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{detailIndicator.name}</div>
                <div style={{ fontSize: 10, color: "var(--tx3)" }}>{detailIndicator.source}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: "var(--tx2)", lineHeight: 1.8, marginBottom: 16 }}>
              <p>{detailIndicator.explanation}</p>
              <p style={{ marginTop: 8 }}>القيمة الحالية: <strong style={{ color: "#BA7517" }}>{detailIndicator.value}</strong></p>
            </div>
            <button onClick={() => setShowDetail(false)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "#BA7517", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
}
