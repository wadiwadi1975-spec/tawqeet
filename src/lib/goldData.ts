export function L(obj: any, field: string, lang: string): string {
  if (lang === 'en' && obj[`${field}_en`]) return obj[`${field}_en`];
  return obj[field] || '';
}

export const CURRENCIES = [
  { id: 'kwd', name: 'الكويت', name_en: 'Kuwait', sym: 'KWD', flag: '🇰🇼', group: 'gulf' },
  { id: 'sar', name: 'السعودية', name_en: 'Saudi Arabia', sym: 'SAR', flag: '🇸🇦', group: 'gulf' },
  { id: 'aed', name: 'الإمارات', name_en: 'UAE', sym: 'AED', flag: '🇦🇪', group: 'gulf' },
  { id: 'qar', name: 'قطر', name_en: 'Qatar', sym: 'QAR', flag: '🇶🇦', group: 'gulf' },
  { id: 'bhd', name: 'البحرين', name_en: 'Bahrain', sym: 'BHD', flag: '🇧🇭', group: 'gulf' },
  { id: 'omr', name: 'عُمان', name_en: 'Oman', sym: 'OMR', flag: '🇴🇲', group: 'gulf' },
  { id: 'syp', name: 'سوريا', name_en: 'Syria', sym: 'SYP', flag: '🇸🇾', group: 'levant' },
  { id: 'lbp', name: 'لبنان', name_en: 'Lebanon', sym: 'LBP', flag: '🇱🇧', group: 'levant' },
  { id: 'jod', name: 'الأردن', name_en: 'Jordan', sym: 'JOD', flag: '🇯🇴', group: 'levant' },
  { id: 'egp', name: 'مصر', name_en: 'Egypt', sym: 'EGP', flag: '🇪🇬', group: 'other' },
  { id: 'iqd', name: 'العراق', name_en: 'Iraq', sym: 'IQD', flag: '🇮🇶', group: 'other' },
];

export const KARATS = [
  { k: '24', m: 1, cls: 'text-gold' },
  { k: '22', m: 22 / 24, cls: 'text-yellow-600' },
  { k: '21', m: 21 / 24, cls: 'text-yellow-700' },
  { k: '18', m: 18 / 24, cls: 'text-yellow-800' },
];

export const GRAMS = [1, 2, 5, 10, 25, 50];

export const FACTORS = [
  { nm: 'مؤشر الدولار DXY', nm_en: 'Dollar Index DXY', val: '97.2', imp: 'إيجابي', imp_en: 'Positive', positive: true, sc: 82, pr: '98.1', note: 'انخفاض الدولار يدعم الذهب', note_en: 'Weak dollar supports gold' },
  { nm: 'التضخم CPI', nm_en: 'Inflation CPI', val: '3.1%', imp: 'إيجابي', imp_en: 'Positive', positive: true, sc: 75, pr: '2.9%', note: 'تضخم مرتفع = طلب على الذهب', note_en: 'High inflation = gold demand' },
  { nm: 'الفائدة الأمريكية', nm_en: 'US Interest Rate', val: '4.75%', imp: 'محايد', imp_en: 'Neutral', positive: false, sc: 50, pr: '4.75%', note: 'ثبات الفائدة تأثير محدود', note_en: 'Stable rate, limited impact' },
  { nm: 'PMI التصنيع', nm_en: 'Manufacturing PMI', val: '48.3', imp: 'إيجابي', imp_en: 'Positive', positive: true, sc: 65, pr: '49.1', note: 'تراجع PMI يعزز الملاذ الآمن', note_en: 'PMI decline boosts safe haven' },
  { nm: 'NFP الوظائف', nm_en: 'NFP Jobs', val: '187K', imp: 'محايد', imp_en: 'Neutral', positive: false, sc: 55, pr: '203K', note: 'ضعف الوظائف يُضعف الدولار', note_en: 'Weak jobs weaken dollar' },
  { nm: 'تدفقات ETF', nm_en: 'ETF Flows', val: '+12.4T', imp: 'إيجابي', imp_en: 'Positive', positive: true, sc: 78, pr: '+8.1T', note: 'تدفقات إيجابية قوية', note_en: 'Strong positive inflows' },
  { nm: 'أسعار النفط', nm_en: 'Oil Prices', val: '$82.50', imp: 'إيجابي', imp_en: 'Positive', positive: true, sc: 68, pr: '$80', note: 'ارتفاع النفط = توترات جيوسياسية', note_en: 'High oil = geopolitical tension' },
  { nm: 'VIX التقلب', nm_en: 'VIX Volatility', val: '18.4', imp: 'إيجابي', imp_en: 'Positive', positive: true, sc: 72, pr: '16.9', note: 'طلب مرتفع على الملاذ الآمن', note_en: 'High safe haven demand' },
];

export const HEATMAP = [
  { nm: 'DXY', val: '-0.8%', sc: 82 },
  { nm: 'CPI', val: '+0.2%', sc: 75 },
  { nm: 'فائدة', nm_en: 'Rate', val: '4.75%', sc: 50 },
  { nm: 'PMI', val: '48.3', sc: 65 },
  { nm: 'NFP', val: '187K', sc: 55 },
  { nm: 'ETF', val: '+12.4T', sc: 78 },
  { nm: 'نفط', nm_en: 'Oil', val: '+3.1%', sc: 68 },
  { nm: 'VIX', val: '+8.9%', sc: 72 },
];

export const TIMELINE_DATA: Record<string, any[]> = {
  today: [
    { time: '14:30', title: 'توصية: شراء قوي', title_en: 'Signal: Strong Buy', desc: 'CPI أعلى التوقعات — الذهب يرتفع.', desc_en: 'CPI above expectations — gold rises.', sig: 'buy', dot: '#00C853' },
    { time: '11:00', title: 'اختراق مستوى رئيسي', title_en: 'Key Level Breakout', desc: 'كسر مقاومة بحجم تداول مرتفع.', desc_en: 'Broke resistance with high volume.', sig: 'buy', dot: '#D4AF37' },
    { time: '09:15', title: 'NFP: 187K وظيفة', title_en: 'NFP: 187K jobs', desc: 'أقل من التوقعات — دعم إضافي.', desc_en: 'Below expectations — additional support.', sig: 'hold', dot: '#FFC107' },
  ],
  week: [
    { time: 'الاثنين', time_en: 'Monday', title: 'انتظار', title_en: 'Hold', desc: 'ترقب بيانات التضخم.', desc_en: 'Awaiting inflation data.', sig: 'hold', dot: '#FFC107' },
    { time: 'الأربعاء', time_en: 'Wednesday', title: 'CPI أعلى التوقعات', title_en: 'CPI above expectations', desc: 'إيجابي للذهب.', desc_en: 'Bullish for gold.', sig: 'buy', dot: '#00C853' },
    { time: 'الخميس', time_en: 'Thursday', title: 'شراء قوي 87/100', title_en: 'Strong Buy 87/100', desc: 'تضافر عوامل متعددة.', desc_en: 'Multiple factors aligning.', sig: 'buy', dot: '#D4AF37' },
  ],
  month: [
    { time: '1 يونيو', time_en: 'Jun 1', title: '87 نقطة', title_en: '87 points', desc: 'بداية شهر قوية.', desc_en: 'Strong month start.', sig: 'buy', dot: '#00C853' },
    { time: '5 يونيو', time_en: 'Jun 5', title: '72 نقطة', title_en: '72 points', desc: 'تراجع مؤقت.', desc_en: 'Temporary pullback.', sig: 'hold', dot: '#FFC107' },
    { time: '21 يونيو', time_en: 'Jun 21', title: '87 نقطة', title_en: '87 points', desc: 'ذروة الشهر.', desc_en: 'Monthly peak.', sig: 'buy', dot: '#D4AF37' },
  ],
  history: [
    { time: 'يونيو 2025', time_en: 'Jun 2025', title: 'متوسط 81', title_en: 'Avg 81', desc: '11 شراء، 4 انتظار.', desc_en: '11 buys, 4 holds.', sig: 'buy', dot: '#00C853' },
    { time: 'مايو 2025', time_en: 'May 2025', title: 'متوسط 74', title_en: 'Avg 74', desc: '8 شراء، 6 انتظار.', desc_en: '8 buys, 6 holds.', sig: 'hold', dot: '#FFC107' },
    { time: 'مارس 2025', time_en: 'Mar 2025', title: 'متوسط 79', title_en: 'Avg 79', desc: '10 شراء، 3 انتظار.', desc_en: '10 buys, 3 holds.', sig: 'buy', dot: '#00C853' },
  ]
};

export const DEFAULT_FX: Record<string, number> = {
  KWD: 0.3071, SAR: 3.75, AED: 3.6725, QAR: 3.64, BHD: 0.376,
  OMR: 0.385, SYP: 12900, LBP: 89500, JOD: 0.709, EGP: 48.6, IQD: 1310
};

export function formatPrice(v: number): string {
  if (v >= 100000) return v.toLocaleString('en', { maximumFractionDigits: 0 });
  if (v >= 1000) return v.toLocaleString('en', { maximumFractionDigits: 0 });
  if (v >= 10) return v.toFixed(2);
  return v.toFixed(3);
}

export function formatNumber(v: number): string {
  return v.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
