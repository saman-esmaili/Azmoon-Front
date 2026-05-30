import { useState, useEffect } from "react";
import "./cart.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Billing = "monthly" | "annual";

interface PlanLimit {
  icon: string;
  label: string;
  value: string;
}

interface Plan {
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

interface CartItem {
  plan: Plan;
  billing: Billing;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_PLANS: Plan[] = [
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

const COUPON_CODES: Record<string, number> = {
  "AZMON20": 20,
  "WELCOME10": 10,
  "EDU30": 30,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPrice = (n: number) => n.toLocaleString("fa-IR");

// ─── Nav ──────────────────────────────────────────────────────────────────────
const Nav: React.FC = () => (
  <nav className="nav">
    <div className="nav__inner">
      <a href="/" className="nav__logo">
        <div className="nav__logo-icon">آ</div>
        <span className="nav__logo-text">آزمون‌گیر</span>
      </a>

      <div className="nav__breadcrumb">
        <a href="/">خانه</a>
        <span className="nav__breadcrumb-sep">›</span>
        <a href="/#pricing">قیمت‌گذاری</a>
        <span className="nav__breadcrumb-sep">›</span>
        <span className="nav__breadcrumb-cur">سبد خرید</span>
      </div>

      <a href="/#pricing" className="nav__back">
        ← ادامه خرید
      </a>
    </div>
  </nav>
);

// ─── Progress Steps ───────────────────────────────────────────────────────────
const STEPS = ["سبد خرید", "پرداخت", "فعال‌سازی"];

const ProgressSteps: React.FC<{ current: number }> = ({ current }) => (
  <div className="cart-steps">
    {STEPS.map((label, i) => {
      const done   = i < current;
      const active = i === current;
      return (
        <div key={label} className="cart-step">
          <div className={`cart-step__bubble ${done ? "cart-step__bubble--done" : active ? "cart-step__bubble--active" : "cart-step__bubble--pending"}`}>
            {done ? "✓" : i + 1}
          </div>
          <span className={`cart-step__label ${active || done ? "cart-step__label--active" : "cart-step__label--pending"}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`cart-step__line ${done ? "cart-step__line--done" : "cart-step__line--pending"}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Single Cart Item ─────────────────────────────────────────────────────────
const CartItemCard: React.FC<{
  item: CartItem;
  index: number;
  onBillingChange: (id: string, billing: Billing) => void;
  onRemove: (id: string) => void;
}> = ({ item, index, onBillingChange, onRemove }) => {
  const { plan, billing } = item;
  const price    = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const original = plan.monthlyPrice;
  const isAnnual = billing === "annual";

  return (
    <div className="cart-item" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="cart-item__inner">

        {/* Top row */}
        <div className="cart-item__top">
          <div className="cart-item__plan-icon" style={{ background: plan.bgVar }}>
            {plan.icon}
          </div>
          <div className="cart-item__meta">
            <div className="cart-item__plan-en" style={{ color: plan.colorVar }}>{plan.nameEn}</div>
            <div className="cart-item__plan-name">پلن {plan.name}</div>
            <div className="cart-item__tagline">{plan.tagline}</div>
          </div>
          <button className="cart-item__remove" onClick={() => onRemove(plan.id)} aria-label="حذف">
            ×
          </button>
        </div>

        {/* Billing toggle */}
        <div className="cart-item__billing">
          <div className="cart-item__billing-label">دوره پرداخت</div>
          <div className="cart-item__billing-toggle">
            <button
              className={`cart-item__billing-btn ${billing === "monthly" ? "cart-item__billing-btn--active" : "cart-item__billing-btn--inactive"}`}
              onClick={() => onBillingChange(plan.id, "monthly")}
            >
              ماهانه
            </button>
            <button
              className={`cart-item__billing-btn ${billing === "annual" ? "cart-item__billing-btn--active" : "cart-item__billing-btn--inactive"}`}
              onClick={() => onBillingChange(plan.id, "annual")}
            >
              سالانه — ۲۰٪ تخفیف
            </button>
          </div>
        </div>

        {/* Limits grid */}
        <div className="cart-item__limits">
          {plan.limits.map((l) => (
            <div key={l.label} className="cart-item__limit">
              <span className="cart-item__limit-icon">{l.icon}</span>
              <span className="cart-item__limit-label">{l.label}</span>
              <span className="cart-item__limit-val">{l.value}</span>
            </div>
          ))}
        </div>

        {/* Price row */}
        <div className="cart-item__price-row">
          <div className="cart-item__price-left">
            {isAnnual && (
              <div className="cart-item__price-original">{formatPrice(original)} هزار</div>
            )}
            <div>
              <span className="cart-item__price-main">{formatPrice(price)}</span>
              <span className="cart-item__price-unit">هزار تومان / ماه</span>
            </div>
          </div>
          {isAnnual && (
            <div className="cart-item__price-badge" style={{ background: "var(--green-lt)", color: "var(--green)" }}>
              ۲۰٪ صرفه‌جویی
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Recommended Plans ────────────────────────────────────────────────────────
const RecommendedPlans: React.FC<{
  currentIds: string[];
  onAdd: (plan: Plan) => void;
}> = ({ currentIds, onAdd }) => {
  const available = ALL_PLANS.filter((p) => !currentIds.includes(p.id));
  if (available.length === 0) return null;

  return (
    <div className="recommended">
      <div className="recommended__title">پلن‌های دیگر را هم ببینید</div>
      <div className="recommended__grid">
        {available.map((p) => (
          <div key={p.id} className="recommended__card">
            <div className="recommended__card-icon">{p.icon}</div>
            <div className="recommended__card-name">پلن {p.name}</div>
            <div className="recommended__card-price" style={{ color: p.colorVar }}>
              {formatPrice(p.monthlyPrice)} هزار / ماه
            </div>
            <button
              className="recommended__card-btn"
              style={{ background: p.bgVar, color: p.colorVar }}
              onClick={() => onAdd(p)}
            >
              + افزودن به سبد
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard: React.FC<{
  items: CartItem[];
  onCheckout: () => void;
}> = ({ items, onCheckout }) => {
  const [coupon, setCoupon]       = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError, setCouponError]     = useState(false);
  const [loading, setLoading]     = useState(false);

  const subtotal = items.reduce((s, i) => {
    return s + (i.billing === "annual" ? i.plan.annualPrice : i.plan.monthlyPrice);
  }, 0);

  const annualSaving = items.reduce((s, i) => {
    if (i.billing !== "annual") return s;
    return s + (i.plan.monthlyPrice - i.plan.annualPrice);
  }, 0);

  const couponDiscount = couponApplied ? Math.round(subtotal * (COUPON_CODES[couponApplied] / 100)) : 0;
  const total = subtotal - couponDiscount;

  const handleCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPON_CODES[code]) {
      setCouponApplied(code);
      setCouponError(false);
      setCoupon("");
    } else {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 2000);
    }
  };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCheckout();
    }, 1400);
  };

  return (
    <div className="cart-summary">
      <div className="summary-card">

        {/* Header */}
        <div className="summary-card__header">
          <div className="summary-card__header-title">خلاصه سفارش</div>
          <div className="summary-card__header-sub">{items.length} پلن انتخاب شده</div>
        </div>

        <div className="summary-card__body">

          {/* Line items */}
          {items.map((item) => {
            const price = item.billing === "annual" ? item.plan.annualPrice : item.plan.monthlyPrice;
            return (
              <div key={item.plan.id} className="summary-line">
                <span className="summary-line__label">پلن {item.plan.name}</span>
                <span className="summary-line__val">{formatPrice(price)} هزار</span>
              </div>
            );
          })}

          {annualSaving > 0 && (
            <div className="summary-line">
              <span className="summary-line__label">تخفیف سالانه</span>
              <span className="summary-line__val summary-line__val--green">− {formatPrice(annualSaving)} هزار</span>
            </div>
          )}

          {couponApplied && (
            <div className="summary-line">
              <span className="summary-line__label">کد تخفیف ({couponApplied})</span>
              <span className="summary-line__val summary-line__val--accent">− {formatPrice(couponDiscount)} هزار</span>
            </div>
          )}

          <hr className="summary-divider" />

          {/* Total */}
          <div className="summary-total">
            <div className="summary-total__row">
              <span className="summary-total__label">مجموع ماهانه</span>
              <div>
                <span className="summary-total__amount">{formatPrice(total)}</span>
                <span className="summary-total__unit">هزار</span>
              </div>
            </div>
            <div className="summary-total__sub">مبلغ اول ماه آینده دریافت می‌شود</div>
          </div>

          {/* Trust */}
          <div className="summary-trust">
            {[
              { icon: "🎁", text: "۱۴ روز اول کاملاً رایگان" },
              { icon: "🔒", text: "پرداخت امن از طریق شاپرک" },
              { icon: "↩", text: "ضمانت بازگشت وجه ۱۴ روزه" },
            ].map((t) => (
              <div key={t.text} className="summary-trust__item">
                <span className="summary-trust__icon">{t.icon}</span>
                <span className="summary-trust__text">{t.text}</span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          {!couponApplied ? (
            <div className="coupon-row">
              <input
                className="coupon-input"
                placeholder="کد تخفیف دارید؟"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                style={couponError ? { borderColor: "var(--rose)" } : undefined}
              />
              <button className="coupon-btn" onClick={handleCoupon}>اعمال</button>
            </div>
          ) : (
            <div className="coupon-success">
              ✅ کد «{couponApplied}» اعمال شد — {COUPON_CODES[couponApplied]}٪ تخفیف
            </div>
          )}
          {couponError && (
            <p style={{ color: "var(--rose)", fontSize: "12px", marginBottom: "12px", fontWeight: 700 }}>
              ⚠ کد تخفیف معتبر نیست
            </p>
          )}

          {/* Checkout */}
          <button
            className="checkout-btn"
            disabled={items.length === 0 || loading}
            onClick={handleCheckout}
          >
            {loading
              ? <span className="checkout-btn__spinner" />
              : <>پرداخت و فعال‌سازی ←</>
            }
          </button>

          {/* Payment logos */}
          <div className="payment-methods">
            {["شاپرک", "ملی", "شتاب", "پارسیان", "سامان"].map((m) => (
              <span key={m} className="payment-method">{m}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Success Overlay ──────────────────────────────────────────────────────────
const SuccessOverlay: React.FC<{
  items: CartItem[];
  total: number;
  onClose: () => void;
}> = ({ items, total, onClose }) => (
  <div className="success-overlay">
    <div className="success-card">
      <div className="success-card__header">
        <div className="success-card__check">🎉</div>
        <div className="success-card__title">پرداخت موفق!</div>
        <div className="success-card__sub">اشتراک شما با موفقیت فعال شد</div>
      </div>
      <div className="success-card__body">
        <div className="success-card__items">
          {items.map((item) => (
            <div key={item.plan.id} className="success-card__item-row">
              <div className="success-card__item-icon" style={{ background: item.plan.bgVar }}>
                {item.plan.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="success-card__item-name">پلن {item.plan.name}</div>
                <span
                  className="success-card__item-badge"
                  style={{ background: item.plan.bgVar, color: item.plan.colorVar }}
                >
                  {item.billing === "annual" ? "سالانه" : "ماهانه"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="success-card__total-row">
          <span className="success-card__total-label">مبلغ پرداخت شده</span>
          <span className="success-card__total-val">{formatPrice(total)} هزار تومان</span>
        </div>

        <a href="/dashboard" className="success-card__btn">ورود به پنل مدیریت ←</a>
        <button className="success-card__close" onClick={onClose}>بستن</button>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
interface CartPageProps {
  initialItems?: CartItem[];
}

const CartPage: React.FC<CartPageProps> = ({
  initialItems = [
    { plan: ALL_PLANS[1], billing: "monthly" },
  ],
}) => {
  const [items, setItems]         = useState<CartItem[]>(initialItems);
  const [success, setSuccess]     = useState(false);
  const [paidItems, setPaidItems] = useState<CartItem[]>([]);
  const [paidTotal, setPaidTotal] = useState(0);

  const updateBilling = (id: string, billing: Billing) => {
    setItems((prev) => prev.map((i) => i.plan.id === id ? { ...i, billing } : i));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.plan.id !== id));
  };

  const addPlan = (plan: Plan) => {
    if (!items.find((i) => i.plan.id === plan.id)) {
      setItems((prev) => [...prev, { plan, billing: "monthly" }]);
    }
  };

  const clearAll = () => setItems([]);

  const handleCheckout = () => {
    const total = items.reduce((s, i) =>
      s + (i.billing === "annual" ? i.plan.annualPrice : i.plan.monthlyPrice), 0
    );
    setPaidItems([...items]);
    setPaidTotal(total);
    setSuccess(true);
    setItems([]);
  };

  const currentIds = items.map((i) => i.plan.id);

  return (
    <div className="cart-page" dir="rtl">
      <Nav />

      {/* Savings bar */}
      {items.some((i) => i.billing === "monthly") && (
        <div className="savings-bar">
          <span className="savings-bar__text">
            با تغییر به پلن سالانه{" "}
            <span className="savings-bar__highlight">۲۰٪ صرفه‌جویی</span>
            {" "}کنید 🎁
          </span>
        </div>
      )}

      {/* Page header */}
      <div className="cart-header">
        <div className="cart-header__inner">
          <div className="cart-header__title-row">
            <div className="cart-header__icon">🛒</div>
            <div>
              <div className="cart-header__title">سبد خرید</div>
              <div className="cart-header__count">
                {items.length > 0
                  ? `${items.length} پلن انتخاب شده`
                  : "سبد خالی است"}
              </div>
            </div>
          </div>
          <ProgressSteps current={0} />
        </div>
      </div>

      {/* Main layout */}
      <div className="cart-layout">

        {/* Left: items */}
        <div className="cart-items-col">
          {items.length > 0 ? (
            <>
              <div className="cart-items-header">
                <span className="cart-items-title">پلن‌های انتخاب شده</span>
                <button className="cart-clear-btn" onClick={clearAll}>حذف همه</button>
              </div>

              {items.map((item, i) => (
                <CartItemCard
                  key={item.plan.id}
                  item={item}
                  index={i}
                  onBillingChange={updateBilling}
                  onRemove={removeItem}
                />
              ))}
            </>
          ) : (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <div className="cart-empty__title">سبد خرید شما خالی است</div>
              <div className="cart-empty__sub">
                پلن مناسب خود را انتخاب کنید و ۱۴ روز رایگان امتحان کنید.
              </div>
              <a href="/#pricing" className="cart-empty__btn">مشاهده پلن‌ها ←</a>
            </div>
          )}

          <RecommendedPlans currentIds={currentIds} onAdd={addPlan} />
        </div>

        {/* Right: summary */}
        <SummaryCard items={items} onCheckout={handleCheckout} />
      </div>

      {/* Success overlay */}
      {success && (
        <SuccessOverlay
          items={paidItems}
          total={paidTotal}
          onClose={() => setSuccess(false)}
        />
      )}
    </div>
  );
};

export default CartPage;
