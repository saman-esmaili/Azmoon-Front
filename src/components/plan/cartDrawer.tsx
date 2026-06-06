import {CartItem} from "./plans";
import '../../styles/plan_detail.css';
export const CartDrawer: React.FC<{
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
