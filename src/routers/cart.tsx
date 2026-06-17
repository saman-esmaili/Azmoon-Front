import {useEffect, useState} from "react";
import "./../styles/cart.css";
import {Billing, Plan} from "../components/cart/types";
import {ProgressSteps} from "../components/cart/progress";
import {CartItemCard} from "../components/cart/cartItem";
import {RecommendedPlans} from "../components/cart/recomendation";
import {SummaryCard} from "../components/cart/summary";
import {SuccessOverlay} from "../components/cart/success";
import Axios from "axios";
import {CheckAuth, revoke} from "../check_auth";

interface CartItem {
    cart_id: number;
    plan_name: string;
    plan_price: string;
    plan_student_number: number;
    plan_question_number: number;
    plan_exam_number: number;
    tagline: string;
}

const CartPage = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [success, setSuccess] = useState(false);
    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => String(i.cart_id) !== id));
    };

    const clearAll = () => {
        Axios.delete(`http://localhost:8000/cart`, {withCredentials: true})
            .then((res) => {
                setItems([])
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return clearAll();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    };

    const handleCheckout = () => {
        setSuccess(true);
        setItems([]);
    };


    const cartItem = () => {
        Axios.get('http://localhost:8000/cart', {withCredentials: true})
            .then((res) => {
                console.log(res.data.plan_cart)
                setItems(res.data.plan_cart);

            }).catch(async (err) => {
            if (err.response.status === 401) {
                const is_successful = await CheckAuth();
                if (is_successful) {
                    return cartItem();
                }
            }
            // revoke()
            // navigate('/auth');
        })
    }
    useEffect(() => {
        cartItem()
    }, []);
    return (
        <div className="cart-page" dir="rtl">

            {/* Savings bar */}
            {/*  {items.some((i) => i.billing === "monthly") && (*/}
            {/*      <div className="savings-bar">*/}
            {/*<span className="savings-bar__text">*/}
            {/*  با تغییر به پلن سالانه{" "}*/}
            {/*    <span className="savings-bar__highlight">۲۰٪ صرفه‌جویی</span>*/}
            {/*    {" "}کنید 🎁*/}
            {/*</span>*/}
            {/*      </div>*/}
            {/*  )}*/}

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
                    <ProgressSteps current={0}/>
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
                                <button className="cart-clear-btn" onClick={clearAll}>حذف</button>
                            </div>

                            {items.map((item, i) => (
                                <CartItemCard
                                    key={item.cart_id}
                                    item={item}
                                    index={i}
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
                </div>

                <SummaryCard items={items}/>
            </div>

        </div>
    );
};

export default CartPage;
