import {Billing} from "../cart/types";
import '../../styles/plan_detail.css';
export interface Limit    { icon: string; label: string; value: string; }
export interface FeatRow  { label: string; included: boolean | string; }
export interface FeatCat  { category: string; items: FeatRow[]; }

export interface PlanConfig {
  id:           string;
  name:         string;
  nameEn:       string;
  tagline:      string;
  description:  string;
  monthlyPrice: number | null;
  annualPrice:  number | null;
  accentClass:  string;   // pill modifier class e.g. "primary"
  accentColor:  string;   // raw CSS var name for dynamic badge styles
  badge:        string | null;
  features:     { icon: string; title: string; desc: string; colorVar: string; bgVar: string; }[];
  limits:       Limit[];
  featureCats:  FeatCat[];
}

export interface CartItem { plan: PlanConfig; billing: Billing; }

export interface Review {
  name: string; role: string; plan: string; planColor: string; planBg: string;
  stars: number; text: string; avatar: string; avatarBg: string; avatarBorder: string;
  cardHoverBorder: string; cardHoverShadow: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────
export const PLANS: PlanConfig[] = [
  {
    id: "basic", name: "پایه", nameEn: "Basic",
    tagline: "برای شروع و آموزشگاه‌های کوچک",
    description: "پلن پایه برای آموزشگاه‌ها و معلمانی مناسب است که تازه شروع به برگزاری آزمون آنلاین می‌کنند. تمام ابزارهای ضروری را دارید بدون پیچیدگی اضافه.",
    monthlyPrice: 500, annualPrice: 400,
    accentClass: "sky", accentColor: "var(--sky)", badge: null,
    limits: [
      { icon: "👥", label: "دانشجو",          value: "تا ۱۰۰ نفر" },
      { icon: "📝", label: "آزمون ماهانه",    value: "۱۰ آزمون" },
      { icon: "💾", label: "بانک سوال",        value: "۵۰۰ سوال" },
      { icon: "🔧", label: "پشتیبانی",         value: "ایمیل" },
    ],
    features: [
      { icon: "📋", title: "انواع سوال",       desc: "سوال تستی، صحیح/غلط، کوتاه‌پاسخ و تشریحی.",             colorVar: "var(--sky)",    bgVar: "var(--sky-lt)"     },
      { icon: "⏱",  title: "زمان‌بندی",        desc: "تعیین زمان برای کل آزمون یا هر سوال به صورت جداگانه.", colorVar: "var(--primary)", bgVar: "var(--primary-lt)" },
      { icon: "✅", title: "تصحیح خودکار",     desc: "نمره‌دهی فوری پس از اتمام آزمون.",                     colorVar: "var(--green)",   bgVar: "var(--green-lt)"   },
      { icon: "📊", title: "گزارش پایه",       desc: "آمار کلی عملکرد دانشجویان و توزیع نمرات.",             colorVar: "var(--accent)",  bgVar: "var(--accent-lt)"  },
      { icon: "🔒", title: "قفل مرورگر",       desc: "جلوگیری از باز کردن تب جدید یا خروج از صفحه.",         colorVar: "var(--violet)",  bgVar: "var(--violet-lt)"  },
      { icon: "📄", title: "خروجی Excel/PDF",  desc: "صادرات نتایج آزمون به فرمت‌های استاندارد.",             colorVar: "var(--rose)",    bgVar: "var(--rose-lt)"    },
      { icon: "📱", title: "پشتیبانی موبایل",  desc: "تجربه کامل روی موبایل و تبلت بدون نصب اپ.",            colorVar: "var(--sky)",    bgVar: "var(--sky-lt)"     },
      { icon: "🌐", title: "چند زبانه",        desc: "پشتیبانی کامل فارسی، عربی و انگلیسی با RTL.",           colorVar: "var(--primary)", bgVar: "var(--primary-lt)" },
    ],
    featureCats: [
      { category: "آزمون", items: [{ label: "سوال تستی و تشریحی", included: true }, { label: "زمان‌بندی آزمون", included: true }, { label: "آزمون همزمان", included: "تا ۵۰ نفر" }, { label: "آزمون تطبیقی هوشمند", included: false }] },
      { category: "امنیت", items: [{ label: "قفل مرورگر", included: true }, { label: "تشخیص چهره", included: false }, { label: "ضبط صفحه", included: false }, { label: "هشدار فوری استاد", included: false }] },
      { category: "تحلیل", items: [{ label: "گزارش پایه", included: true }, { label: "نمودار عملکرد", included: true }, { label: "تحلیل عمیق آماری", included: false }, { label: "پیشنهاد هوشمند AI", included: false }] },
      { category: "یکپارچگی", items: [{ label: "خروجی Excel/PDF", included: true }, { label: "API دسترسی", included: false }, { label: "LMS Integration", included: false }, { label: "SSO سازمانی", included: false }] },
    ],
  },
  {
    id: "pro", name: "حرفه‌ای", nameEn: "Pro",
    tagline: "برای دانشگاه‌ها و موسسات متوسط",
    description: "پلن حرفه‌ای برای دانشگاه‌ها، آموزشگاه‌های کنکور و موسساتی که نیاز به آزمون همزمان برای صدها دانشجو و ابزارهای پیشرفته تحلیل و ضد تقلب دارند.",
    monthlyPrice: 1500, annualPrice: 1200,
    accentClass: "primary", accentColor: "var(--primary)", badge: "محبوب‌ترین",
    limits: [
      { icon: "👥", label: "دانشجو",          value: "تا ۵۰۰ نفر" },
      { icon: "📝", label: "آزمون ماهانه",    value: "نامحدود" },
      { icon: "💾", label: "بانک سوال",        value: "نامحدود" },
      { icon: "🔧", label: "پشتیبانی",         value: "۲۴/۷ چت و تلفن" },
    ],
    features: [
      { icon: "🛡️", title: "تشخیص چهره",      desc: "احراز هویت دانشجو با دوربین در حین آزمون.",             colorVar: "var(--rose)",    bgVar: "var(--rose-lt)"    },
      { icon: "📹", title: "ضبط صفحه",         desc: "ضبط جلسه برای بررسی احتمال تقلب پس از آزمون.",         colorVar: "var(--violet)",  bgVar: "var(--violet-lt)"  },
      { icon: "🧠", title: "تحلیل AI",          desc: "پیشنهاد بهبود سوالات بر اساس نتایج آماری.",             colorVar: "var(--primary)", bgVar: "var(--primary-lt)" },
      { icon: "📊", title: "داشبورد پیشرفته",   desc: "نمودارهای تعاملی، مقایسه کلاس‌ها، تحلیل فردی.",        colorVar: "var(--sky)",    bgVar: "var(--sky-lt)"     },
      { icon: "🔌", title: "API دسترسی",        desc: "یکپارچگی با سیستم‌های دانشگاهی و LMS.",                colorVar: "var(--green)",   bgVar: "var(--green-lt)"   },
      { icon: "⚡", title: "آزمون تطبیقی",     desc: "سطح سوالات بر اساس پاسخ‌های قبلی دانشجو تنظیم می‌شود.", colorVar: "var(--accent)",  bgVar: "var(--accent-lt)"  },
      { icon: "🏆", title: "رتبه‌بندی کلاس",   desc: "تابلوی رتبه‌بندی انگیزشی در زمان واقعی.",              colorVar: "var(--sun-dk)",  bgVar: "#FFF9E5"            },
      { icon: "📨", title: "گزارش خودکار",      desc: "ارسال کارنامه به ایمیل دانشجو بلافاصله بعد از آزمون.", colorVar: "var(--primary)", bgVar: "var(--primary-lt)" },
    ],
    featureCats: [
      { category: "آزمون", items: [{ label: "سوال تستی و تشریحی", included: true }, { label: "زمان‌بندی آزمون", included: true }, { label: "آزمون همزمان", included: "تا ۵۰۰ نفر" }, { label: "آزمون تطبیقی هوشمند", included: true }] },
      { category: "امنیت", items: [{ label: "قفل مرورگر", included: true }, { label: "تشخیص چهره", included: true }, { label: "ضبط صفحه", included: true }, { label: "هشدار فوری استاد", included: true }] },
      { category: "تحلیل", items: [{ label: "گزارش پایه", included: true }, { label: "نمودار عملکرد", included: true }, { label: "تحلیل عمیق آماری", included: true }, { label: "پیشنهاد هوشمند AI", included: true }] },
      { category: "یکپارچگی", items: [{ label: "خروجی Excel/PDF", included: true }, { label: "API دسترسی", included: true }, { label: "LMS Integration", included: true }, { label: "SSO سازمانی", included: false }] },
    ],
  },
  {
    id: "enterprise", name: "سازمانی", nameEn: "Enterprise",
    tagline: "برای سازمان‌های بزرگ و دولتی",
    description: "پلن سازمانی برای نهادهای دولتی، شرکت‌های بزرگ و دانشگاه‌هایی که نیاز به دانشجوی نامحدود، سرور اختصاصی، SSO سازمانی و SLA اختصاصی دارند.",
    monthlyPrice: null, annualPrice: null,
    accentClass: "violet", accentColor: "var(--violet)", badge: "سفارشی‌سازی کامل",
    limits: [
      { icon: "👥", label: "دانشجو",          value: "نامحدود" },
      { icon: "📝", label: "آزمون ماهانه",    value: "نامحدود" },
      { icon: "💾", label: "بانک سوال",        value: "نامحدود" },
      { icon: "🔧", label: "پشتیبانی",         value: "مدیر اختصاصی" },
    ],
    features: [
      { icon: "🖥", title: "سرور اختصاصی",    desc: "سرور On-Premise یا Cloud اختصاصی زیر برند شما.",         colorVar: "var(--violet)",  bgVar: "var(--violet-lt)"  },
      { icon: "🔑", title: "SSO سازمانی",     desc: "ورود یکپارچه با LDAP، Active Directory و SAML.",          colorVar: "var(--primary)", bgVar: "var(--primary-lt)" },
      { icon: "📜", title: "SLA ۹۹.۹٪",       desc: "قرارداد سطح سرویس با ضمانت آپتایم رسمی.",               colorVar: "var(--green)",   bgVar: "var(--green-lt)"   },
      { icon: "🎨", title: "برندینگ کامل",    desc: "لوگو، رنگ‌بندی و دامنه اختصاصی کاملاً سفارشی.",          colorVar: "var(--accent)",  bgVar: "var(--accent-lt)"  },
      { icon: "👩‍💼", title: "مدیر اختصاصی",   desc: "یک متخصص اختصاصی برای راه‌اندازی و پشتیبانی.",          colorVar: "var(--sky)",    bgVar: "var(--sky-lt)"     },
      { icon: "📦", title: "آموزش تیم",        desc: "جلسات آموزش آنلاین و آفلاین برای کارکنان.",              colorVar: "var(--rose)",    bgVar: "var(--rose-lt)"    },
      { icon: "🔄", title: "مهاجرت داده",     desc: "انتقال کامل داده‌های موجود از سیستم‌های قدیمی.",          colorVar: "var(--violet)",  bgVar: "var(--violet-lt)"  },
      { icon: "📋", title: "قرارداد سفارشی",  desc: "شرایط قرارداد متناسب با نیازهای حقوقی سازمان.",          colorVar: "var(--primary)", bgVar: "var(--primary-lt)" },
    ],
    featureCats: [
      { category: "آزمون", items: [{ label: "سوال تستی و تشریحی", included: true }, { label: "زمان‌بندی آزمون", included: true }, { label: "آزمون همزمان", included: "نامحدود" }, { label: "آزمون تطبیقی هوشمند", included: true }] },
      { category: "امنیت", items: [{ label: "قفل مرورگر", included: true }, { label: "تشخیص چهره", included: true }, { label: "ضبط صفحه", included: true }, { label: "هشدار فوری استاد", included: true }] },
      { category: "تحلیل", items: [{ label: "گزارش پایه", included: true }, { label: "نمودار عملکرد", included: true }, { label: "تحلیل عمیق آماری", included: true }, { label: "پیشنهاد هوشمند AI", included: true }] },
      { category: "یکپارچگی", items: [{ label: "خروجی Excel/PDF", included: true }, { label: "API دسترسی", included: true }, { label: "LMS Integration", included: true }, { label: "SSO سازمانی", included: true }] },
    ],
  },
];