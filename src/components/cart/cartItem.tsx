import {CartItem,Billing,formatPrice} from "./types";
import '../../styles/cart.css';
export const CartItemCard: React.FC<{
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
