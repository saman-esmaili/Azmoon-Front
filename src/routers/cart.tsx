import { useState } from "react";
import "./../styles/cart.css";
import {CartItem,ALL_PLANS,Billing,Plan} from "../components/cart/types";
import {ProgressSteps} from "../components/cart/progress";
import {CartItemCard} from "../components/cart/cartItem";
import {RecommendedPlans} from "../components/cart/recomendation";
import {SummaryCard} from "../components/cart/summary";
import {SuccessOverlay} from "../components/cart/success";

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
