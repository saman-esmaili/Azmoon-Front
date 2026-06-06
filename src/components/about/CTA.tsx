import {C} from "../../styles/theme";
import {FadeIn} from "../landing/details_component";
import '../../styles/about_page.css';
export const CTA: React.FC = () => (
  <section className="about-cta-section" style={{ background: C.bgSection }}>
    <div className="about-cta-inner">
      <FadeIn>
        <div
          className="about-cta-card"
          style={{ background: C.bgWhite, borderColor: C.border, boxShadow: `0 8px 40px ${C.shadow}` }}
        >
          <div
            className="about-cta-logo"
            style={{ background: `linear-gradient(135deg,${C.primary},${C.sky})` }}
          >آ</div>
          <h2 className="about-cta-title" style={{ color: C.text }}>آماده‌ای شروع کنی؟</h2>
          <p className="about-cta-desc" style={{ color: C.textSub }}>
            همین امروز به ۵۰۰ موسسه آموزشی بپیوند که با آزمون‌گیر کار خود را متحول کرده‌اند.
          </p>
          <div className="about-cta-buttons">
            <a href="/auth"
              className="btn-cta-primary"
              style={{ background: `linear-gradient(135deg,${C.primary},${C.primaryDk})`, boxShadow: `0 6px 22px ${C.shadow}` }}
              onMouseEnter={(e) => { const a = e.currentTarget; a.style.boxShadow = `0 12px 32px ${C.primary}40`; }}
              onMouseLeave={(e) => { const a = e.currentTarget; a.style.boxShadow = `0 6px 22px ${C.shadow}`; }}
            >🚀 ۱۴ روز رایگان شروع کن</a>
            <a href="/contact"
              className="btn-cta-ghost"
              style={{ borderColor: C.border, color: C.primary }}
              onMouseEnter={(e) => { const a = e.currentTarget; a.style.borderColor = C.primary; a.style.background = C.primaryLt; }}
              onMouseLeave={(e) => { const a = e.currentTarget; a.style.borderColor = C.border; a.style.background = "none"; }}
            >با ما صحبت کن</a>
          </div>
          <p className="about-cta-note" style={{ color: C.textLight }}>بدون نیاز به کارت اعتباری • هر زمان لغو کنید</p>
        </div>
      </FadeIn>
    </div>
  </section>
);
