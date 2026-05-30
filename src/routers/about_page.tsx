import { useState, useRef, useEffect, ReactNode } from "react";
import { C } from "./theme";
import "./about_page.css";

// ─── useInView ────────────────────────────────────────────────────────────────
const useInView = (threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const FadeIn: React.FC<{ children: ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={inView ? "fade-visible" : "fade-hidden"}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

const Pill: React.FC<{ label: string; color: string; bg: string }> = ({ label, color, bg }) => (
  <div className="pill" style={{ background: bg, borderColor: `${color}30` }}>
    <span style={{ color }}>{label}</span>
  </div>
);

// ─── Nav ──────────────────────────────────────────────────────────────────────
const Nav: React.FC = () => (
  <nav className="about-nav" style={{ borderBottomColor: C.border, boxShadow: `0 2px 16px ${C.shadow}` }}>
    <div className="about-nav-inner">
      <a href="/" className="nav-logo-link">
        <div
          className="nav-logo-icon"
          style={{ background: `linear-gradient(135deg,${C.primary},${C.sky})`, boxShadow: `0 4px 12px ${C.shadow}` }}
        >
          <span>آ</span>
        </div>
        <span className="nav-logo-name" style={{ color: C.text }}>آزمون‌گیر</span>
      </a>
      <div className="nav-links">
        {[["صفحه اصلی", "/"], ["ویژگی‌ها", "#"], ["قیمت‌گذاری", "#"], ["تماس با ما", "/contact"]].map(([label, href]) => (
          <a key={label} href={href}
            className="nav-link"
            style={{ color: C.textSub }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.primary)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textSub)}
          >{label}</a>
        ))}
        <a href="/auth"
          className="nav-cta"
          style={{ background: `linear-gradient(135deg,${C.primary},${C.primaryDk})`, boxShadow: `0 4px 14px ${C.shadow}` }}
          onMouseEnter={(e) => { const a = e.currentTarget; a.style.transform = "translateY(-1px)"; a.style.boxShadow = `0 8px 22px ${C.primary}40`; }}
          onMouseLeave={(e) => { const a = e.currentTarget; a.style.transform = "translateY(0)"; a.style.boxShadow = `0 4px 14px ${C.shadow}`; }}
        >ورود به پنل</a>
      </div>
    </div>
  </nav>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero: React.FC = () => (
  <section className="about-hero">
    <svg className="hero-lines-svg">
      <defs>
        <pattern id="lines" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1="0" y1="0" x2="0" y2="48" stroke="#fff" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lines)" />
    </svg>

    <div className="hero-inner">
      <div className="hero-copy">
        <div className="hero-pill"><span>داستان ما</span></div>
        <h1 className="hero-h1">
          ما آموزش را<br />
          <span style={{ color: C.sun }}>هوشمندتر می‌کنیم</span>
        </h1>
        <p className="hero-desc">
          آزمون‌گیر در سال ۱۴۰۰ با یک ایده ساده شروع شد: برگزاری آزمون آنلاین نباید پیچیده باشد. امروز بیش از ۵۰۰ موسسه آموزشی به ما اعتماد کرده‌اند.
        </p>
        <div className="hero-buttons">
          <a href="/auth" className="btn-hero-primary">🚀 شروع رایگان</a>
          <a href="/contact" className="btn-hero-ghost">تماس با ما</a>
        </div>
      </div>
    </div>

    <div className="hero-wave">
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 40 1080 36C1200 32 1320 20 1380 14L1440 8V60H0Z" fill={C.bg} />
      </svg>
    </div>
  </section>
);

// ─── Stats ────────────────────────────────────────────────────────────────────
const Stats: React.FC = () => {
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

// ─── Mission ──────────────────────────────────────────────────────────────────
const Mission: React.FC = () => {
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

// ─── Timeline ─────────────────────────────────────────────────────────────────
const Timeline: React.FC = () => {
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

// ─── Team ─────────────────────────────────────────────────────────────────────
const Team: React.FC = () => {
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

// ─── Values ───────────────────────────────────────────────────────────────────
const Values: React.FC = () => {
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

// ─── CTA ──────────────────────────────────────────────────────────────────────
const CTA: React.FC = () => (
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

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const cols = [
    { title: "آزمون‌گیر", items: ["درباره ما", "تیم ما", "وبلاگ", "اخبار", "فرصت‌های شغلی"] },
    { title: "محصول",     items: ["ویژگی‌ها", "امنیت", "API", "مستندات", "تغییرات"] },
    { title: "پشتیبانی", items: ["مرکز راهنما", "تماس با ما", "وضعیت سیستم", "گزارش باگ", "جامعه کاربران"] },
  ];
  return (
    <footer className="about-footer" style={{ background: C.text }}>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div
                className="footer-logo-icon"
                style={{ background: `linear-gradient(135deg,${C.primary},${C.sky})` }}
              >
                <span>آ</span>
              </div>
              <span className="footer-logo-name">آزمون‌گیر</span>
            </div>
            <p className="footer-tagline">سامانه هوشمند آزمون‌گیری آنلاین برای موسسات آموزشی ایران</p>
            <div className="footer-socials">
              {["📘", "📸", "🐦", "💼"].map((icon, i) => (
                <div key={i}
                  className="footer-social-btn"
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = `${C.primary}50`; el.style.borderColor = `${C.primary}70`; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.07)"; el.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >{icon}</div>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="footer-col-title">{col.title}</h4>
              {col.items.map((item) => (
                <a key={item} href="#"
                  className="footer-col-link"
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.sun)}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.42)")}
                >{item}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© ۱۴۰۳ آزمون‌گیر. تمام حقوق محفوظ است.</span>
          <div className="footer-legal">
            {["حریم خصوصی", "شرایط استفاده", "کوکی‌ها"].map((t) => (
              <a key={t} href="#"
                className="footer-legal-link"
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const AboutPage: React.FC = () => (
  <div className="about-page">
    <Nav />
    <Hero />
    <Stats />
    <Mission />
    <Timeline />
    <Team />
    <Values />
    <CTA />
    <Footer />
  </div>
);

export default AboutPage;
