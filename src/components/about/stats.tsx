import {C} from "../../styles/theme";
import {FadeIn,Pill} from "../landing/details_component";
import '../../styles/about_page.css';
export const Stats: React.FC = () => {
  const items = [
    { val: "+۵۰۰",  label: "موسسه آموزشی",     icon: "🏫", color: C.primary,  bg: C.primaryLt },
    { val: "+۱M",   label: "آزمون برگزار شده",  icon: "📝", color: C.accent,   bg: C.accentLt  },
    { val: "۹۹.۹٪", label: "آپتایم سیستم",      icon: "⚡", color: C.violet,   bg: C.violetLt  },
    { val: "+۲M",   label: "دانشجو در سیستم",   icon: "👨‍🎓", color: C.sky,   bg: C.skyLt     },
    { val: "۴ سال", label: "تجربه در بازار",    icon: "🏆", color: "#059669",  bg: "#D1FAE5"   },
    { val: "<۳۰s",  label: "زمان تصحیح آزمون", icon: "⏱",  color: C.rose,    bg: C.roseLt    },
  ];
  return (
    <section className="stats-section" style={{ background: C.bgWhite }}>
      <div className="stats-inner">
        <FadeIn>
          <div className="stats-header">
            <Pill label="آزمون‌گیر در اعداد" color={C.primary} bg={C.primaryLt} />
            <h2 className="stats-title" style={{ color: C.text }}>تأثیر واقعی، اعداد واقعی</h2>
          </div>
        </FadeIn>
        <div className="stats-grid">
          {items.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.07}>
              <div
                className="stat-card"
                style={{ background: C.bg, borderColor: C.border }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${s.color}45`;
                  el.style.boxShadow = `0 14px 36px ${s.color}14`;
                  el.style.background = C.bgWhite;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = C.border;
                  el.style.boxShadow = "none";
                  el.style.background = C.bg;
                }}
              >
                <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="stat-label" style={{ color: C.textSub }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};