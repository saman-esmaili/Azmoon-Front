import {PlanConfig} from "./plans";
import {Billing} from "../cart/types";
import '../../styles/plan_detail.css';
export const HeroPriceCard: React.FC<{
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
