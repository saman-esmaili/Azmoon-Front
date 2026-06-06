import {C} from "../../styles/theme";
import '../../styles/about_page.css';
export const AboutHero: React.FC = () => (
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
