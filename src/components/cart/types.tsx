
// ─── Types ────────────────────────────────────────────────────────────────────
export type Billing = "monthly" | "annual";

export interface PlanLimit {
  icon: string;
  label: string;
  value: string;
}

export interface Plan {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  colorVar: string;
  bgVar: string;
  icon: string;
  limits: PlanLimit[];
}

export interface CartItem {
  plan: Plan;
  billing: Billing;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export const ALL_PLANS: Plan[] = [
  {
    id: "basic",
    name: "پایه",
    nameEn: "Basic",
    tagline: "برای شروع و آموزشگاه‌های کوچک",
    monthlyPrice: 500,
    annualPrice: 400,
    colorVar: "var(--sky)",
    bgVar: "var(--sky-lt)",
    icon: "🔹",
    limits: [
      { icon: "👥", label: "دانشجو",       value: "تا ۱۰۰ نفر" },
      { icon: "📝", label: "آزمون/ماه",   value: "۱۰ آزمون" },
      { icon: "💾", label: "بانک سوال",    value: "۵۰۰ سوال" },
      { icon: "🔧", label: "پشتیبانی",    value: "ایمیل" },
    ],
  },
  {
    id: "pro",
    name: "حرفه‌ای",
    nameEn: "Pro",
    tagline: "برای دانشگاه‌ها و موسسات متوسط",
    monthlyPrice: 1500,
    annualPrice: 1200,
    colorVar: "var(--primary)",
    bgVar: "var(--primary-lt)",
    icon: "⭐",
    limits: [
      { icon: "👥", label: "دانشجو",       value: "تا ۵۰۰ نفر" },
      { icon: "📝", label: "آزمون/ماه",   value: "نامحدود" },
      { icon: "💾", label: "بانک سوال",    value: "نامحدود" },
      { icon: "🔧", label: "پشتیبانی",    value: "۲۴/۷ چت" },
    ],
  },
  {
    id: "enterprise",
    name: "سازمانی",
    nameEn: "Enterprise",
    tagline: "برای سازمان‌های بزرگ و دولتی",
    monthlyPrice: 4500,
    annualPrice: 3600,
    colorVar: "var(--violet)",
    bgVar: "var(--violet-lt)",
    icon: "🏛️",
    limits: [
      { icon: "👥", label: "دانشجو",       value: "نامحدود" },
      { icon: "📝", label: "آزمون/ماه",   value: "نامحدود" },
      { icon: "💾", label: "بانک سوال",    value: "نامحدود" },
      { icon: "🔧", label: "پشتیبانی",    value: "مدیر اختصاصی" },
    ],
  },
];

export const COUPON_CODES: Record<string, number> = {
  "AZMON20": 20,
  "WELCOME10": 10,
  "EDU30": 30,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatPrice = (n: number) => n.toLocaleString("fa-IR");

// ─── Progress Steps ───────────────────────────────────────────────────────────
export const STEPS = ["سبد خرید", "پرداخت", "فعال‌سازی"];
