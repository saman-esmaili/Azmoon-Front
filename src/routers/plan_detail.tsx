import { useState, useRef, useEffect, ReactNode } from "react";
import "./plan_detail.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Billing = "monthly" | "annual";

interface Limit    { icon: string; label: string; value: string; }
interface FeatRow  { label: string; included: boolean | string; }
interface FeatCat  { category: string; items: FeatRow[]; }

interface PlanConfig {
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

interface CartItem { plan: PlanConfig; billing: Billing; }

interface Review {
  name: string; role: string; plan: string; planColor: string; planBg: string;
  stars: number; text: string; avatar: string; avatarBg: string; avatarBorder: string;
  cardHoverBorder: string; cardHoverShadow: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────
const PLANS: PlanConfig[] = [
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

const REVIEWS: Review[] = [
  { name: "دکتر احمد رضایی",  role: "استاد دانشگاه تهران",    plan: "حرفه‌ای", planColor: "var(--primary)",  planBg: "rgba(13,148,136,0.12)",  stars: 5, text: "پلن حرفه‌ای دقیقاً همان چیزی بود که نیاز داشتیم. تشخیص چهره باعث شد دیگر نگران تقلب نباشیم و گزارش‌های تحلیلی فوق‌العاده هستند.", avatar: "🎓", avatarBg: "rgba(13,148,136,0.12)", avatarBorder: "rgba(13,148,136,0.25)", cardHoverBorder: "rgba(13,148,136,0.35)", cardHoverShadow: "rgba(13,148,136,0.1)" },
  { name: "مریم حسینی",        role: "مدیر آموزشگاه زبان",     plan: "پایه",    planColor: "var(--sky)",      planBg: "rgba(14,165,233,0.12)",  stars: 5, text: "با پلن پایه شروع کردیم. برای تعداد دانشجویان ما کاملاً کافی است و قیمتش منصفانه. رابط کاربری بسیار ساده و روان است.", avatar: "👩‍💼", avatarBg: "rgba(14,165,233,0.12)", avatarBorder: "rgba(14,165,233,0.25)", cardHoverBorder: "rgba(14,165,233,0.35)", cardHoverShadow: "rgba(14,165,233,0.1)" },
  { name: "محمد کریمی",        role: "رئیس اداره آموزش",       plan: "سازمانی", planColor: "var(--violet)",   planBg: "rgba(124,58,237,0.12)", stars: 5, text: "پلن سازمانی برای ما سفارشی شد. SSO با Active Directory بدون هیچ مشکلی کار کرد. تیم پشتیبانی واقعاً حرفه‌ای است.", avatar: "👨‍💼", avatarBg: "rgba(124,58,237,0.12)", avatarBorder: "rgba(124,58,237,0.25)", cardHoverBorder: "rgba(124,58,237,0.35)", cardHoverShadow: "rgba(124,58,237,0.1)" },
  { name: "فاطمه موسوی",       role: "معلم دبیرستان",          plan: "پایه",    planColor: "var(--sky)",      planBg: "rgba(14,165,233,0.12)",  stars: 4, text: "برای ۸۰ دانش‌آموز پلن پایه عالی است. دانش‌آموزانم راحت‌تر آزمون می‌دهند و نتایج فوری است.", avatar: "👩‍🏫", avatarBg: "rgba(14,165,233,0.12)", avatarBorder: "rgba(14,165,233,0.25)", cardHoverBorder: "rgba(14,165,233,0.35)", cardHoverShadow: "rgba(14,165,233,0.1)" },
  { name: "علی اکبری",         role: "مسئول IT دانشگاه",        plan: "حرفه‌ای", planColor: "var(--primary)",  planBg: "rgba(13,148,136,0.12)",  stars: 5, text: "API مستندسازی شده و یکپارچگی با LMS موجود ما در کمتر از یک روز انجام شد. پشتیبانی فنی بسیار سریع پاسخ می‌دهد.", avatar: "👨‍💻", avatarBg: "rgba(13,148,136,0.12)", avatarBorder: "rgba(13,148,136,0.25)", cardHoverBorder: "rgba(13,148,136,0.35)", cardHoverShadow: "rgba(13,148,136,0.1)" },
  { name: "نرگس طاهری",        role: "مدیر آموزشگاه کنکور",    plan: "حرفه‌ای", planColor: "var(--primary)",  planBg: "rgba(13,148,136,0.12)",  stars: 5, text: "برگزاری آزمون با ۴۵۰ نفر همزمان بدون هیچ مشکلی انجام شد. آزمون تطبیقی هوشمند عملکرد دانش‌آموزان را به شکل قابل‌توجهی بهبود داده.", avatar: "👩‍🎓", avatarBg: "rgba(13,148,136,0.12)", avatarBorder: "rgba(13,148,136,0.25)", cardHoverBorder: "rgba(13,148,136,0.35)", cardHoverShadow: "rgba(13,148,136,0.1)" },
];

// ─── useInView ────────────────────────────────────────────────────────────────
const useInView = (): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const FadeIn: React.FC<{ children: ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s` }}>
      {children}
    </div>
  );
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
const Nav: React.FC<{ cartCount: number; onCartOpen: () => void }> = ({ cartCount, onCartOpen }) => (
  <nav className="nav">
    <div className="nav__inner">
      <a href="/" className="nav__logo">
        <div className="nav__logo-icon">آ</div>
        <span className="nav__logo-text">آزمون‌گیر</span>
      </a>
      <div className="nav__links">
        {[["صفحه اصلی", "/"], ["ویژگی‌ها", "#"], ["قیمت‌گذاری", "#"], ["تماس با ما", "/contact"]].map(([l, h]) => (
          <a key={l} href={h} className="nav__link">{l}</a>
        ))}
      </div>
      <div className="nav__actions">
        <button className="nav__cart-btn" onClick={onCartOpen}>
          🛒 سبد خرید
          {cartCount > 0 && <span className="nav__cart-badge">{cartCount}</span>}
        </button>
        <a href="/auth" className="nav__cta-btn">ورود به پنل</a>
      </div>
    </div>
  </nav>
);

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
const CartDrawer: React.FC<{
  cart: CartItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onCheckout: () => void;
}> = ({ cart, onRemove, onClose, onCheckout }) => {
  const total = cart.reduce((s, i) => {
    const p = i.billing === "annual" ? (i.plan.annualPrice ?? 0) : (i.plan.monthlyPrice ?? 0);
    return s + p;
  }, 0);

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <span className="cart-drawer__title">🛒 سبد خرید</span>
          <button className="cart-drawer__close" onClick={onClose}>×</button>
        </div>
        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">🛒</div>
              <p>سبد خرید شما خالی است</p>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.billing === "annual" ? item.plan.annualPrice : item.plan.monthlyPrice;
              return (
                <div key={item.plan.id} className="cart-item">
                  <div className="cart-item__top">
                    <div>
                      <div className="cart-item__name">پلن {item.plan.name}</div>
                      <span className="cart-item__badge" style={{ background: `color-mix(in srgb, ${item.plan.accentColor} 15%, transparent)`, color: item.plan.accentColor }}>
                        {item.billing === "annual" ? "سالانه (۲۰٪ تخفیف)" : "ماهانه"}
                      </span>
                    </div>
                    <button className="cart-item__remove" onClick={() => onRemove(item.plan.id)}>×</button>
                  </div>
                  <div className="cart-item__price-row">
                    <span className="cart-item__label">قیمت ماهانه</span>
                    <span className="cart-item__price">{price?.toLocaleString()} هزار تومان</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total-row">
              <span className="cart-total-label">جمع کل ماهانه</span>
              <span className="cart-total-value">{total.toLocaleString()} هزار</span>
            </div>
            <div className="cart-free-badge">
              <span>🎁</span>
              <span>۱۴ روز اول کاملاً رایگان</span>
            </div>
            <button className="cart-checkout-btn" onClick={onCheckout}>پرداخت و فعال‌سازی ←</button>
          </div>
        )}
      </div>
    </>
  );
};

// ─── Hero Price Card ──────────────────────────────────────────────────────────
const HeroPriceCard: React.FC<{
  plan: PlanConfig;
  billing: Billing;
  setBilling: (b: Billing) => void;
  inCart: boolean;
  onAdd: () => void;
  onRemove: () => void;
}> = ({ plan, billing, setBilling, inCart, onAdd, onRemove }) => {
  const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
  return (
    <div className="hero-price-card">
      {/* Billing toggle */}
      <div className="hero-price-card__toggle">
        {(["monthly", "annual"] as Billing[]).map((b) => (
          <button key={b} onClick={() => setBilling(b)}
            className={`hero-price-card__toggle-btn ${billing === b ? "hero-price-card__toggle-btn--active" : "hero-price-card__toggle-btn--inactive"}`}
          >
            {b === "monthly" ? "ماهانه" : "سالانه"}
          </button>
        ))}
      </div>

      {/* Price */}
      {price !== null ? (
        <>
          <div className="hero-price-card__price-row">
            <span className="hero-price-card__amount">{price.toLocaleString()}</span>
            <span className="hero-price-card__unit">هزار تومان/ماه</span>
          </div>
          {billing === "annual" && (
            <div className="hero-price-card__discount">۲۰٪ تخفیف سالانه اعمال شد ✓</div>
          )}
        </>
      ) : (
        <div style={{ color: "var(--sun)", fontSize: "28px", fontWeight: 900, marginBottom: "20px" }}>تماس بگیرید</div>
      )}

      {/* Limits */}
      <div className="hero-price-card__limits">
        {plan.limits.map((l) => (
          <div key={l.label} className="hero-price-card__limit-row">
            <span className="hero-price-card__limit-icon">{l.icon}</span>
            <div>
              <div className="hero-price-card__limit-label">{l.label}</div>
              <div className="hero-price-card__limit-val">{l.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {price !== null ? (
        inCart ? (
          <button className="hero-price-card__add-btn hero-price-card__add-btn--remove" onClick={onRemove}>
            × حذف از سبد خرید
          </button>
        ) : (
          <button className="hero-price-card__add-btn hero-price-card__add-btn--add" onClick={onAdd}>
            🛒 افزودن به سبد خرید
          </button>
        )
      ) : (
        <a href="/contact" className="hero-price-card__contact">با ما تماس بگیرید</a>
      )}
      <p className="hero-price-card__note">۱۴ روز رایگان • بدون کارت اعتباری</p>
    </div>
  );
};

// ─── Comparison Table ─────────────────────────────────────────────────────────
const CompareTable: React.FC<{ plan: PlanConfig }> = ({ plan }) => (
  <div className="compare-table-wrap">
    <table className="compare-table" dir="rtl">
      <thead>
        <tr>
          <th><span className="compare-th-label">ویژگی</span></th>
          {PLANS.map((p) => (
            <th key={p.id}>
              <div className="compare-th-name" style={{ color: p.id === plan.id ? "var(--primary)" : "var(--text)" }}>{p.name}</div>
              <div className="compare-th-sub" style={{ color: `var(--${p.accentClass})` }}>{p.nameEn}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {plan.featureCats.map((cat, ci) => (
          <>
            <tr key={`cat-${ci}`} className="compare-cat-row">
              <td colSpan={4}><span className="compare-cat-label">{cat.category}</span></td>
            </tr>
            {cat.items.map((item, ii) => (
              <tr key={`row-${ci}-${ii}`} className="compare-feat-row">
                <td className="compare-feat-name">{item.label}</td>
                {PLANS.map((p) => {
                  const feat = p.featureCats[ci]?.items[ii];
                  return (
                    <td key={p.id} style={{ textAlign: "center" }}>
                      {!feat ? null : feat.included === true ? (
                        <span className="compare-check">✓</span>
                      ) : feat.included === false ? (
                        <span className="compare-dash">—</span>
                      ) : (
                        <span className="compare-partial" style={{ background: `var(--${p.accentClass}-lt, var(--primary-lt))`, color: `var(--${p.accentClass}, var(--primary))` }}>{feat.included}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
interface PlanDetailPageProps {
  planId?: string; // "basic" | "pro" | "enterprise" — from route params
}

const PlanDetailPage: React.FC<PlanDetailPageProps> = ({ planId = "pro" }) => {
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
  const [billing, setBilling] = useState<Billing>("monthly");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const inCart = cart.some((i) => i.plan.id === plan.id);
  const addToCart = () => setCart((p) => p.find((i) => i.plan.id === plan.id) ? p : [...p, { plan, billing }]);
  const removeFromCart = (id: string) => setCart((p) => p.filter((i) => i.plan.id !== id));

  const faqs = [
    { q: "آیا می‌توانم پلن را تغییر دهم؟",     a: "بله، در هر زمان می‌توانید ارتقا یا تنزل دهید. تفاوت قیمت محاسبه می‌شود." },
    { q: "آیا قرارداد بلندمدت دارد؟",          a: "خیر. ماهانه هر زمان لغو کنید. سالانه ۲۰٪ تخفیف دارد." },
    { q: "پرداخت چگونه انجام می‌شود؟",         a: "از طریق درگاه امن شاپرک. تمام کارت‌های شتاب پذیرفته می‌شود." },
    { q: "آیا فاکتور رسمی صادر می‌شود؟",       a: "بله، فاکتور رسمی برای اشخاص حقیقی و حقوقی صادر می‌شود." },
    { q: "ضمانت بازگشت وجه دارید؟",            a: "۱۴ روز اول بدون هیچ سوالی مبلغ کامل برگشت داده می‌شود." },
    { q: "برای مدارس دولتی تخفیف دارید؟",     a: "بله، تا ۵۰٪ تخفیف برای مدارس دولتی و NGOها. با تیم فروش تماس بگیرید." },
  ];

  return (
    <div dir="rtl">
      <Nav cartCount={cart.length} onCartOpen={() => setCartOpen(true)} />
      {cartOpen && <CartDrawer cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} onCheckout={() => { setCheckoutDone(true); setCartOpen(false); setCart([]); }} />}

      {/* Checkout success modal */}
      {checkoutDone && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal__icon">🎉</div>
            <h2 className="modal__title">خرید موفق!</h2>
            <p className="modal__desc">اشتراک شما فعال شد. به پنل وارد شوید و شروع کنید.</p>
            <a href="/auth" className="modal__btn">ورود به پنل ←</a>
            <button className="modal__close" onClick={() => setCheckoutDone(false)}>بستن</button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="plan-hero">
        <svg className="plan-hero__lines">
          <defs><pattern id="lines" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <line x1="0" y1="0" x2="0" y2="48" stroke="#fff" strokeWidth="1" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>

        <div className="plan-hero__inner">
          <div>
            {/* Breadcrumb */}
            <div className="plan-hero__breadcrumb">
              <a href="/">خانه</a>
              <span className="plan-hero__breadcrumb-sep">›</span>
              <a href="/#pricing">قیمت‌گذاری</a>
              <span className="plan-hero__breadcrumb-sep">›</span>
              <span className="plan-hero__breadcrumb-current">پلن {plan.name}</span>
            </div>

            {plan.badge && (
              <div className="plan-hero__eyebrow">
                <div className="plan-hero__dot" />
                {plan.badge}
              </div>
            )}

            <h1 className="plan-hero__title">
              پلن <span className="plan-hero__title-accent">{plan.name}</span>
            </h1>
            <p className="plan-hero__tagline">{plan.description}</p>

            <div className="plan-hero__actions">
              {plan.monthlyPrice !== null ? (
                inCart ? (
                  <button className="plan-hero__btn-ghost" onClick={() => removeFromCart(plan.id)}>× حذف از سبد</button>
                ) : (
                  <button className="plan-hero__btn-primary" onClick={addToCart}>🛒 افزودن به سبد خرید</button>
                )
              ) : (
                <a href="/contact" className="plan-hero__btn-primary">با ما تماس بگیرید</a>
              )}
              <a href="/#pricing" className="plan-hero__btn-ghost">مقایسه پلن‌ها</a>
            </div>
          </div>

          <HeroPriceCard plan={plan} billing={billing} setBilling={setBilling} inCart={inCart} onAdd={addToCart} onRemove={() => removeFromCart(plan.id)} />
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
            <path d="M0 56L60 46C120 36 240 18 360 13C480 8 600 18 720 25C840 33 960 37 1080 33C1200 29 1320 18 1380 12L1440 6V56H0Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section section--cream">
        <div className="section__inner">
          <FadeIn>
            <div className="section__header">
              <div className={`pill pill--${plan.accentClass}`}>ویژگی‌های پلن {plan.name}</div>
              <h2 className="section-title">همه چیزی که نیاز دارید</h2>
              <p className="section-sub">{plan.tagline}</p>
            </div>
          </FadeIn>
          <div className="features-grid">
            {plan.features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <div className="feature-card" style={{ ["--hover-border" as string]: f.colorVar, ["--hover-shadow" as string]: `${f.colorVar}20` }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = f.colorVar; el.style.boxShadow = `0 16px 40px ${f.bgVar}`; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--border)"; el.style.boxShadow = "none"; }}
                >
                  <div className="feature-card__icon" style={{ background: f.bgVar }}>{f.icon}</div>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Trust badges */}
          <FadeIn delay={0.3}>
            <div className="trust-bar">
              {[["🔒", "پرداخت امن شاپرک"], ["🎁", "۱۴ روز رایگان"], ["↩", "ضمانت بازگشت وجه"], ["📞", "پشتیبانی فارسی ۲۴/۷"]].map(([icon, label]) => (
                <div key={label} className="trust-bar__item">
                  <span className="trust-bar__icon">{icon}</span> {label}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="section section--white">
        <div className="section__inner">
          <FadeIn>
            <div className="section__header">
              <div className="pill pill--sky">مقایسه پلن‌ها</div>
              <h2 className="section-title">چه فرقی با سایر پلن‌ها دارد؟</h2>
              <div className="compare-toggle-wrap">
                <button className="compare-toggle-btn" onClick={() => setShowCompare((p) => !p)}>
                  {showCompare ? "بستن جدول ▲" : "مشاهده جدول مقایسه ▼"}
                </button>
              </div>
            </div>
          </FadeIn>
          {showCompare && (
            <FadeIn>
              <CompareTable plan={plan} />
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="section section--peach">
        <div className="section__inner">
          <FadeIn>
            <div className="section__header">
              <div className="pill pill--violet">نظرات مشتریان</div>
              <h2 className="section-title">کسانی که این پلن را خریدند چه می‌گویند؟</h2>
              <p className="section-sub">بیش از ۵۰۰ موسسه آموزشی به ما اعتماد کرده‌اند</p>
            </div>
          </FadeIn>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <FadeIn key={r.name} delay={i * 0.08}>
                <div className="review-card-wrap">
                  <div className="review-card"
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = r.cardHoverBorder; el.style.boxShadow = `0 10px 36px ${r.cardHoverShadow}`; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--border)"; el.style.boxShadow = "none"; }}
                  >
                    <div className="review-card__top">
                      <div className="review-card__stars">{"★".repeat(r.stars)}</div>
                      <span className="review-card__plan-badge" style={{ background: r.planBg, color: r.planColor }}>
                        پلن {r.plan}
                      </span>
                    </div>
                    <p className="review-card__text">"{r.text}"</p>
                    <div className="review-card__author">
                      <div className="review-card__avatar" style={{ background: r.avatarBg, border: `2px solid ${r.avatarBorder}` }}>
                        {r.avatar}
                      </div>
                      <div>
                        <div className="review-card__name">{r.name}</div>
                        <div className="review-card__role">{r.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section--white">
        <div className="section__inner--narrow">
          <FadeIn>
            <div className="section__header">
              <div className="pill pill--accent">سوالات متداول</div>
              <h2 className="section-title">سوال دارید؟</h2>
            </div>
          </FadeIn>
          {faqs.map((f, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}>
                <button className={`faq-btn ${openFaq === i ? "faq-btn--open" : "faq-btn--closed"}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <span className={`faq-icon ${openFaq === i ? "faq-icon--open" : "faq-icon--closed"}`}>+</span>
                </button>
                {openFaq === i && <div className="faq-answer">{f.a}</div>}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="section section--teal">
        <div className="bottom-cta__inner">
          <FadeIn>
            <h2 className="bottom-cta__title">آماده‌ای شروع کنی؟</h2>
            <p className="bottom-cta__sub">۱۴ روز رایگان امتحان کن. هیچ کارت اعتباری لازم نیست.</p>
            <div className="bottom-cta__actions">
              {plan.monthlyPrice !== null ? (
                inCart ? (
                  <button className="plan-hero__btn-ghost" onClick={() => removeFromCart(plan.id)}>× حذف از سبد</button>
                ) : (
                  <button className="plan-hero__btn-primary" onClick={addToCart}>🛒 افزودن به سبد خرید</button>
                )
              ) : (
                <a href="/contact" className="plan-hero__btn-primary">با ما تماس بگیرید</a>
              )}
              <a href="/contact" className="plan-hero__btn-ghost">با فروش صحبت کن</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__logo">
            <div className="footer__logo-icon">آ</div>
            <span className="footer__logo-text">آزمون‌گیر</span>
          </div>
          <span className="footer__copy">© ۱۴۰۳ آزمون‌گیر. تمام حقوق محفوظ است.</span>
          <div className="footer__links">
            {["حریم خصوصی", "شرایط استفاده"].map((t) => (
              <a key={t} href="#" className="footer__link">{t}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlanDetailPage;
