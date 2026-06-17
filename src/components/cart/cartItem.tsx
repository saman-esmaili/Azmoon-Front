import {Billing, formatPrice} from "./types";
import '../../styles/cart.css';

interface CartItem {
    cart_id: number;
    plan_name: string;
    plan_price: string;
    plan_student_number: number;
    plan_question_number: number;
    plan_exam_number: number;
    tagline: string;
}

export const CartItemCard: React.FC<{
    item: CartItem;
    index: number;
    onRemove: (id: string) => void;
}> = ({item, index, onRemove}) => {

    return (
        <div className="cart-item" style={{animationDelay: `${index * 0.08}s`}}>
            <div className="cart-item__inner">

                {/* Top row */}
                <div className="cart-item__top">
                    <div className="cart-item__plan-icon" style={{background: 'var(--sky-lt)'}}>
                        ⭐
                    </div>
                    <div className="cart-item__meta">
                        <div className="cart-item__plan-en" style={{color: 'var(--primary)'}}>{item.plan_name}</div>
                        <div className="cart-item__plan-name">پلن {item.plan_name}</div>
                        <div className="cart-item__tagline">{item.tagline}</div>
                    </div>
                    {/*<button className="cart-item__remove" onClick={() => onRemove(String(item.cart_id))}*/}
                    {/*        aria-label="حذف">*/}
                    {/*    ×*/}
                    {/*</button>*/}
                </div>

                {/* Billing toggle */}
                {/*<div className="cart-item__billing">*/}
                {/*  <div className="cart-item__billing-label">دوره پرداخت</div>*/}
                {/*  <div className="cart-item__billing-toggle">*/}
                {/*    <button*/}
                {/*      className={`cart-item__billing-btn ${billing === "monthly" ? "cart-item__billing-btn--active" : "cart-item__billing-btn--inactive"}`}*/}
                {/*      onClick={() => onBillingChange(plan.id, "monthly")}*/}
                {/*    >*/}
                {/*      ماهانه*/}
                {/*    </button>*/}
                {/*    <button*/}
                {/*      className={`cart-item__billing-btn ${billing === "annual" ? "cart-item__billing-btn--active" : "cart-item__billing-btn--inactive"}`}*/}
                {/*      onClick={() => onBillingChange(plan.id, "annual")}*/}
                {/*    >*/}
                {/*      سالانه — ۲۰٪ تخفیف*/}
                {/*    </button>*/}
                {/*  </div>*/}
                {/*</div>*/}

                <div className="cart-item__limits">

                    <div className="cart-item__limit">
                        <span className="cart-item__limit-icon">👨‍🎓</span>
                        <span className="cart-item__limit-label">تعداد دانش‌آموز</span>
                        <span className="cart-item__limit-val">
      {item.plan_student_number}
    </span>
                    </div>

                    <div className="cart-item__limit">
                        <span className="cart-item__limit-icon">📝</span>
                        <span className="cart-item__limit-label">تعداد سوالات</span>
                        <span className="cart-item__limit-val">
      {item.plan_question_number}
    </span>
                    </div>

                    <div className="cart-item__limit">
                        <span className="cart-item__limit-icon">📚</span>
                        <span className="cart-item__limit-label">تعداد آزمون</span>
                        <span className="cart-item__limit-val">
      {item.plan_exam_number}
    </span>
                    </div>

                </div>
                {/* Price row */}
                {/*<div className="cart-item__price-row">*/}
                {/*    <div className="cart-item__price-left">*/}
                {/*        {isAnnual && (*/}
                {/*            <div className="cart-item__price-original">{formatPrice(original)} هزار</div>*/}
                {/*        )}*/}
                {/*        <div>*/}
                {/*            <span className="cart-item__price-main">{formatPrice(price)}</span>*/}
                {/*            <span className="cart-item__price-unit">هزار تومان / ماه</span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    {isAnnual && (*/}
                {/*        <div className="cart-item__price-badge"*/}
                {/*             style={{background: "var(--green-lt)", color: "var(--green)"}}>*/}
                {/*            ۲۰٪ صرفه‌جویی*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}
                <div className="cart-item__price-row">
                    <div className="cart-item__price-left">
                        <div>
                            <span className="cart-item__price-main">{formatPrice(Number(item.plan_price))}</span>
                            <span className="cart-item__price-unit">هزار تومان / ماه</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
