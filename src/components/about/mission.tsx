import {C} from "../../styles/theme";
import '../../styles/about_page.css';
import {FadeIn,Pill} from "../landing/details_component";
export const Mission: React.FC = () => {
  const cards = [
    { icon: "🎯", title: "هدف‌محور",    desc: "هر ویژگی با هدف بهبود یادگیری طراحی شده",  color: C.primary,  bg: C.primaryLt },
    { icon: "🔒", title: "قابل‌اعتماد", desc: "امنیت و آپتایم در اولویت اول ماست",         color: C.violet,   bg: C.violetLt  },
    { icon: "💡", title: "نوآورانه",    desc: "هر روز بهتر از دیروز با AI و داده",          color: C.accent,   bg: C.accentLt  },
    { icon: "🤝", title: "مشتری‌محور", desc: "پشتیبانی واقعی از انسان‌های واقعی",           color: "#059669",  bg: "#D1FAE5"   },
  ];
  return (
    <section className="mission-section" style={{ background: C.bgSection }}>
      <div className="mission-inner">
        <FadeIn>
          <div>
            <Pill label="مأموریت ما" color={C.accent} bg={C.accentLt} />
            <h2 className="mission-title" style={{ color: C.text }}>
              آزمون‌گیری را برای همه<br />
              <span className="mission-title-gradient">ساده‌تر می‌کنیم</span>
            </h2>
            <p className="mission-desc" style={{ color: C.textSub }}>
              ما معتقدیم که هر معلم و استادی باید بتواند بدون دانش فنی، آزمون‌های حرفه‌ای برگزار کند. از ابتدایی‌ترین مدرسه تا بزرگ‌ترین دانشگاه، آزمون‌گیر برای همه ساخته شده است.
            </p>
            <p className="mission-desc" style={{ color: C.textSub }}>
              با استفاده از هوش مصنوعی، ضد تقلب پیشرفته و تحلیل داده‌های عمیق، به مربیان کمک می‌کنیم تصمیمات بهتری بگیرند و دانشجویان بیشتری موفق شوند.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mission-cards">
            {cards.map((v) => (
              <div
                key={v.title}
                className="mission-card"
                style={{ background: C.bgWhite, borderColor: C.border }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${v.color}45`;
                  el.style.boxShadow = `0 12px 32px ${v.color}14`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = C.border;
                  el.style.boxShadow = "none";
                }}
              >
                <div className="mission-card-icon" style={{ background: v.bg }}>{v.icon}</div>
                <div className="mission-card-title" style={{ color: C.text }}>{v.title}</div>
                <div className="mission-card-desc" style={{ color: C.textSub }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};