import '../../styles/about_page.css';
// ─── Timeline ─────────────────────────────────────────────────────────────────
import {C} from "../../styles/theme";
import {FadeIn,Pill} from "../landing/details_component";
export const Timeline: React.FC = () => {
  const milestones = [
    { year: "۱۴۰۰", title: "تأسیس آزمون‌گیر",         desc: "با یک تیم ۳ نفره و یک ایده ساده در تهران شروع کردیم.",                        color: C.primary  },
    { year: "۱۴۰۱", title: "اولین ۱۰۰ مشتری",        desc: "اولین دانشگاه‌های بزرگ به ما پیوستند. سیستم ضد تقلب راه‌اندازی شد.",            color: C.accent   },
    { year: "۱۴۰۲", title: "یک میلیون آزمون",         desc: "رکورد یک میلیون آزمون برگزار شده را رد کردیم. سرمایه‌گذاری Series A.",           color: C.violet   },
    { year: "۱۴۰۳", title: "هوش مصنوعی و گسترش ملی", desc: "موتور AI برای تحلیل سوال راه‌اندازی شد. بیش از ۵۰۰ موسسه فعال.",               color: "#059669"  },
  ];
  return (
    <section className="timeline-section" style={{ background: C.bgWhite }}>
      <div className="timeline-inner">
        <FadeIn>
          <div className="timeline-header">
            <Pill label="مسیر رشد" color={C.violet} bg={C.violetLt} />
            <h2 className="timeline-title" style={{ color: C.text }}>از ایده تا واقعیت</h2>
          </div>
        </FadeIn>
        <div className="timeline-track">
          <div className="timeline-line" />
          {milestones.map((m, i) => {
            const isRight = i % 2 === 0;
            return (
              <FadeIn key={m.year} delay={i * 0.12}>
                <div className={`timeline-row ${isRight ? "timeline-row-right" : "timeline-row-left"}`}>
                  <div
                    className={`timeline-card ${isRight ? "timeline-card-right" : "timeline-card-left"}`}
                    style={{ background: C.bg, borderColor: C.border }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = `${m.color}45`;
                      el.style.boxShadow = `0 12px 36px ${m.color}14`;
                      el.style.background = C.bgWhite;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.borderColor = C.border;
                      el.style.boxShadow = "none";
                      el.style.background = C.bg;
                    }}
                  >
                    <div>
                      <span className="timeline-year-badge" style={{ background: m.color }}>{m.year}</span>
                    </div>
                    <h3 className="timeline-card-title" style={{ color: C.text }}>{m.title}</h3>
                    <p className="timeline-card-desc" style={{ color: C.textSub }}>{m.desc}</p>
                  </div>
                  <div
                    className="timeline-dot"
                    style={{ background: m.color, boxShadow: `0 0 0 3px ${m.color}30` }}
                  />
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
