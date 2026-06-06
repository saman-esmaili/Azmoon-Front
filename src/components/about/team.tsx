import '../../styles/about_page.css';
// ─── Team ─────────────────────────────────────────────────────────────────────
import {C} from "../../styles/theme";
import {FadeIn,Pill} from "../landing/details_component";
export const Team: React.FC = () => {
  const members = [
    { name: "علی محمدی",   role: "مدیرعامل و هم‌بنیان‌گذار",  avatar: "👨‍💼", color: C.primary,  bg: C.primaryLt },
    { name: "سارا احمدی",  role: "مدیر محصول",                  avatar: "👩‍💻", color: C.accent,   bg: C.accentLt  },
    { name: "رضا کریمی",   role: "مدیر فناوری",                 avatar: "👨‍🔬", color: C.violet,   bg: C.violetLt  },
    { name: "نیلوفر نصر",  role: "طراح تجربه کاربری",           avatar: "👩‍🎨", color: C.sky,      bg: C.skyLt     },
    { name: "محمد حسینی",  role: "مدیر فروش و مشارکت",          avatar: "👨‍💼", color: "#059669",  bg: "#D1FAE5"   },
    { name: "فاطمه موسوی", role: "مدیر پشتیبانی مشتریان",       avatar: "👩‍🏫", color: C.rose,     bg: C.roseLt    },
  ];
  return (
    <section className="team-section" style={{ background: C.bgSection }}>
      <div className="team-inner">
        <FadeIn>
          <div className="team-header">
            <Pill label="تیم ما" color={C.sky} bg={C.skyLt} />
            <h2 className="team-title" style={{ color: C.text }}>پشت آزمون‌گیر چه کسانی هستند؟</h2>
            <p className="team-subtitle" style={{ color: C.textSub }}>تیمی از متخصصان آموزش، فناوری و طراحی که برای ساده‌تر کردن آموزش کار می‌کنند.</p>
          </div>
        </FadeIn>
        <div className="team-grid">
          {members.map((m, i) => (
            <FadeIn key={m.name} delay={i * 0.08}>
              <div
                className="team-card"
                style={{ background: C.bgWhite, borderColor: C.border }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${m.color}45`;
                  el.style.boxShadow = `0 16px 44px ${m.color}14`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = C.border;
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  className="team-avatar"
                  style={{ background: m.bg, borderColor: `${m.color}30` }}
                >{m.avatar}</div>
                <h3 className="team-name" style={{ color: C.text }}>{m.name}</h3>
                <p className="team-role" style={{ color: m.color }}>{m.role}</p>
                <div className="team-divider" style={{ background: m.color }} />
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div
            className="team-hiring-banner"
            style={{ background: `linear-gradient(135deg,${C.primary},${C.primaryDk})` }}
          >
            <div>
              <h3 className="team-hiring-title">می‌خواهی به تیم ما بپیوندی؟</h3>
              <p className="team-hiring-desc">ما همیشه به دنبال افراد بااستعداد و علاقه‌مند به آموزش هستیم.</p>
            </div>
            <a
              href="#"
              className="btn-hiring"
              style={{ background: C.sun, color: C.text }}
            >مشاهده فرصت‌های شغلی ←</a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
