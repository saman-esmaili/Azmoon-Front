import { C } from "../styles/theme";
import "./../styles/contact_page.css";
import {ContactMethod} from '../components/contact/types'
import {MiniFaq} from "../components/contact/mini-faq";
import {ContactForm} from "../components/contact/contact-form";
import {ContactCard} from "../components/contact/contact-card";
// ─── Page ─────────────────────────────────────────────────────────────────────
const ContactPage: React.FC = () => {
  const methods: ContactMethod[] = [
    { icon: "📧", label: "ایمیل",     value: "support@azmon.ir",   sub: "پاسخ ظرف ۴ ساعت",            color: C.primary, bg: C.primaryLt },
    { icon: "📞", label: "تلفن",      value: "۰۲۱-۱۲۳۴-۵۶۷۸",    sub: "شنبه تا چهارشنبه ۹–۱۷",       color: C.accent,  bg: C.accentLt  },
    { icon: "💬", label: "چت آنلاین", value: "گفتگوی زنده",        sub: "ساعات اداری در دسترس",        color: C.violet,  bg: C.violetLt  },
    { icon: "📍", label: "آدرس",      value: "تهران، ولیعصر",      sub: "برج آزمون، طبقه ۸",           color: C.sky,     bg: C.skyLt     },
  ];

  const hours = [
    { day: "شنبه تا چهارشنبه", time: "۹:۰۰ تا ۱۷:۰۰", active: true },
    { day: "پنجشنبه",           time: "۹:۰۰ تا ۱۳:۰۰", active: true },
    { day: "جمعه",              time: "تعطیل",           active: false },
  ];

  const responseTimes = [
    { channel: "چت آنلاین", time: "< ۵ دقیقه",  color: C.primary, pct: 95 },
    { channel: "ایمیل",     time: "< ۴ ساعت",   color: C.accent,  pct: 75 },
    { channel: "تلفن",      time: "< ۲ دقیقه",  color: C.violet,  pct: 98 },
  ];

  return (
    <div className="contact-page" style={{ background: C.bg }}>
      <section
        className="contact-hero"
        style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%,${C.primary}12 0%,transparent 60%), ${C.bg}` }}
      >
        <div className="contact-hero-inner">
          <div
            className="contact-hero-pill"
            style={{ background: C.primaryLt, borderColor: `${C.primary}28` }}
          >
            <span style={{ color: C.primary }}>تماس با ما</span>
          </div>
          <h1 className="contact-hero-h1" style={{ color: C.text }}>چطور می‌تونیم کمک کنیم؟</h1>
          <p className="contact-hero-desc" style={{ color: C.textSub }}>
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست. از طریق فرم، ایمیل یا تلفن با ما در تماس باشید.
          </p>
        </div>
      </section>

      {/* Contact method cards */}
      <section className="contact-methods-section">
        <div className="contact-methods-inner">
          <div className="contact-methods-grid">
            {methods.map((m) => <ContactCard key={m.label} {...m} />)}
          </div>
        </div>
      </section>

      {/* Main content: form + sidebar */}
      <section className="contact-main-section">
        <div className="contact-main-inner">
          <ContactForm />

          {/* Sidebar */}
          <div className="sidebar">

            {/* Working hours */}
            <div className="sidebar-card" style={{ borderColor: C.border }}>
              <div className="sidebar-card-header">
                <div className="sidebar-card-icon" style={{ background: C.accentLt }}>🕐</div>
                <h3 className="sidebar-card-title" style={{ color: C.text }}>ساعات پشتیبانی</h3>
              </div>
              {hours.map((r) => (
                <div key={r.day} className="hours-row" style={{ borderBottomColor: C.border }}>
                  <span className="hours-day" style={{ color: C.textSub }}>{r.day}</span>
                  <span className="hours-time" style={{ color: r.active ? C.primary : C.rose }}>{r.time}</span>
                </div>
              ))}
              <div className="hours-pro-badge" style={{ background: C.primaryLt }}>
                <div className="hours-pro-dot" style={{ background: C.primary }} />
                <span className="hours-pro-text" style={{ color: C.primaryDk }}>پشتیبانی پلن حرفه‌ای ۲۴/۷ است</span>
              </div>
            </div>

            {/* Response time */}
            <div className="sidebar-card" style={{ borderColor: C.border }}>
              <div className="sidebar-card-header">
                <div className="sidebar-card-icon" style={{ background: C.skyLt }}>⚡</div>
                <h3 className="sidebar-card-title" style={{ color: C.text }}>میانگین زمان پاسخ</h3>
              </div>
              {responseTimes.map((r) => (
                <div key={r.channel} className="response-row">
                  <div className="response-row-header">
                    <span className="response-channel" style={{ color: C.textSub }}>{r.channel}</span>
                    <span className="response-time" style={{ color: r.color }}>{r.time}</span>
                  </div>
                  <div className="response-track" style={{ background: `${r.color}15` }}>
                    <div className="response-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="sidebar-card" style={{ borderColor: C.border }}>
              <div className="sidebar-card-header">
                <div className="sidebar-card-icon" style={{ background: C.violetLt }}>❓</div>
                <h3 className="sidebar-card-title" style={{ color: C.text }}>سوالات متداول</h3>
              </div>
              <MiniFaq />
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="map-section">
        <div className="map-inner">
          <div className="map-card" style={{ borderColor: C.border }}>
            <div className="map-header" style={{ borderBottomColor: C.border }}>
              <div className="map-header-left">
                <div className="map-header-icon" style={{ background: C.primaryLt }}>📍</div>
                <div>
                  <div className="map-header-title" style={{ color: C.text }}>دفتر مرکزی آزمون‌گیر</div>
                  <div className="map-header-address" style={{ color: C.textLight }}>تهران، خیابان ولیعصر، برج آزمون، طبقه ۸</div>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="map-directions-link"
                style={{
                  background: `linear-gradient(135deg,${C.primary},${C.primaryDk})`,
                  boxShadow: `0 4px 12px ${C.shadow}`,
                }}
              >مسیریابی ←</a>
            </div>
            <div
              className="map-area"
              style={{ background: `linear-gradient(135deg,${C.primaryLt},${C.skyLt})` }}
            >
              <div className="map-emoji">🗺️</div>
              <span className="map-area-title" style={{ color: C.primary }}>نقشه محل دفتر</span>
              <span className="map-area-sub" style={{ color: C.textSub }}>تهران، ولیعصر، برج آزمون</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
