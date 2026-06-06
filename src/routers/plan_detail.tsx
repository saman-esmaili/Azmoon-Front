import { useState} from "react";
import "../styles/plan_detail.css";
import {CartItem, PLANS} from "../components/plan/plans";
import {Billing} from "../components/cart/types";
import {CartDrawer} from "../components/plan/cartDrawer";
import {HeroPriceCard} from "../components/plan/hero-price";
import {FadeIn} from "../components/landing/details_component";
import {CompareTable} from "../components/plan/compare-table";
import {REVIEWS} from "../components/plan/review";

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

    </div>
  );
};

export default PlanDetailPage;
