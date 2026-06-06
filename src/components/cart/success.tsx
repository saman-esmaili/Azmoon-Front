import {CartItem,formatPrice} from "./types";
import '../../styles/cart.css';
export const SuccessOverlay: React.FC<{
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
