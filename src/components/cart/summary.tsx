import {useState} from "react";
import {CartItem,COUPON_CODES,formatPrice} from "./types";
import '../../styles/cart.css';
export const SummaryCard: React.FC<{
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
