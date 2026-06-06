import {C} from "../../styles/theme";
import '../../styles/about_page.css';
import {FadeIn,Pill} from "../landing/details_component";
export const Values: React.FC = () => {
  const vals = [
    { icon: "🌱", title: "رشد مداوم",       desc: "ما یاد می‌گیریم، تکرار می‌کنیم و بهتر می‌شویم. هر روز نسخه بهتری از خود هستیم.", color: "#059669", bg: "#D1FAE5" },
    { icon: "🔍", title: "شفافیت",           desc: "با مشتریان، سرمایه‌گذاران و تیم کاملاً صادق هستیم. هیچ چیز پنهانی نداریم.",       color: C.sky,     bg: C.skyLt   },
    { icon: "💪", title: "مسئولیت‌پذیری",   desc: "هر نفر از تیم صاحب کار خودش است و نتایج را به عهده می‌گیرد.",                     color: C.primary, bg: C.primaryLt },
    { icon: "❤️", title: "علاقه به آموزش", desc: "ما فقط یک شرکت نیستیم؛ به آموزش اعتقاد داریم و این را در هر خطی از کد می‌بینید.", color: C.rose,    bg: C.roseLt  },
  ];
  return (
    <section className="values-section" style={{ background: C.bgWhite }}>
      <div className="values-inner">
        <FadeIn>
          <div className="values-header">
            <Pill label="ارزش‌های ما" color={C.accent} bg={C.accentLt} />
            <h2 className="values-title" style={{ color: C.text }}>چه چیزی ما را هدایت می‌کند؟</h2>
          </div>
        </FadeIn>
        <div className="values-grid">
          {vals.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div
                className="value-card"
                style={{ background: C.bg, borderColor: C.border }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${v.color}45`;
                  el.style.boxShadow = `0 16px 40px ${v.color}14`;
                  el.style.background = C.bgWhite;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = C.border;
                  el.style.boxShadow = "none";
                  el.style.background = C.bg;
                }}
              >
                <div className="value-icon" style={{ background: v.bg }}>{v.icon}</div>
                <h3 className="value-title" style={{ color: C.text }}>{v.title}</h3>
                <p className="value-desc" style={{ color: C.textSub }}>{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
