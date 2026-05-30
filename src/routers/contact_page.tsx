import { useState } from "react";
import { C } from "./theme";
import "./contact_page.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContactMethod {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

interface FaqItem {
  q: string;
  a: string;
}

// ─── Focus / Blur handlers ────────────────────────────────────────────────────
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = C.primary;
  e.target.style.background = C.bgWhite;
  e.target.style.boxShadow = `0 0 0 4px ${C.primaryLt}`;
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = C.border;
  e.target.style.background = C.bgSection;
  e.target.style.boxShadow = "none";
};

// ─── Label ────────────────────────────────────────────────────────────────────
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="form-label" style={{ color: C.text }}>{children}</label>
);

// ─── Nav ──────────────────────────────────────────────────────────────────────
const Nav: React.FC = () => (
  <nav className="contact-nav" style={{ borderBottomColor: C.border, boxShadow: `0 2px 16px ${C.shadow}` }}>
    <div className="contact-nav-inner">
      <a href="/" className="nav-logo-link">
        <div
          className="nav-logo-icon"
          style={{ background: `linear-gradient(135deg,${C.primary},${C.sky})`, boxShadow: `0 4px 12px ${C.shadow}` }}
        >
          <span>آ</span>
        </div>
        <span className="nav-logo-name" style={{ color: C.text }}>آزمون‌گیر</span>
      </a>

      <div className="nav-actions">
        <a href="/"
          className="nav-home-link"
          style={{ color: C.textSub }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.primary)}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textSub)}
        >صفحه اصلی</a>
        <a href="/auth"
          className="nav-panel-link"
          style={{
            background: `linear-gradient(135deg,${C.primary},${C.primaryDk})`,
            boxShadow: `0 4px 14px ${C.shadow}`,
          }}
          onMouseEnter={(e) => { const a = e.currentTarget; a.style.transform = "translateY(-1px)"; a.style.boxShadow = `0 8px 22px ${C.primary}40`; }}
          onMouseLeave={(e) => { const a = e.currentTarget; a.style.transform = "translateY(0)"; a.style.boxShadow = `0 4px 14px ${C.shadow}`; }}
        >ورود به پنل</a>
      </div>
    </div>
  </nav>
);

// ─── Contact Method Card ──────────────────────────────────────────────────────
const ContactCard: React.FC<ContactMethod> = ({ icon, label, value, sub, color, bg }) => (
  <div
    className="contact-card"
    style={{ borderColor: C.border }}
    onMouseEnter={(e) => {
      const el = e.currentTarget;
      el.style.borderColor = `${color}45`;
      el.style.boxShadow = `0 16px 40px ${color}14`;
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget;
      el.style.borderColor = C.border;
      el.style.boxShadow = "none";
    }}
  >
    <div className="contact-card-icon" style={{ background: bg }}>{icon}</div>
    <div className="contact-card-label" style={{ color: C.textLight }}>{label}</div>
    <div className="contact-card-value" style={{ color: C.text }}>{value}</div>
    <div className="contact-card-sub" style={{ color: C.textSub }}>{sub}</div>
  </div>
);

// ─── Mini FAQ ─────────────────────────────────────────────────────────────────
const MiniFaq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const faqs: FaqItem[] = [
    { q: "چقدر طول می‌کشد پاسخ بگیرم؟", a: "تیم پشتیبانی ما در ساعات اداری معمولاً ظرف ۲ تا ۴ ساعت پاسخ می‌دهد. برای مشتریان پلن حرفه‌ای پاسخ‌دهی ۲۴/۷ است." },
    { q: "آیا امکان مشاوره تلفنی وجود دارد؟", a: "بله، برای سازمان‌ها و موسسات می‌توانید از طریق فرم تماس درخواست مشاوره تلفنی ثبت کنید تا یک متخصص با شما تماس بگیرد." },
    { q: "برای گزارش باگ با کجا تماس بگیریم؟", a: "لطفاً از همین فرم با موضوع «گزارش مشکل فنی» استفاده کنید یا مستقیماً به آدرس support@azmon.ir ایمیل بزنید." },
  ];
  return (
    <div>
      {faqs.map((f, i) => (
        <div
          key={i}
          className="mini-faq-item"
          style={{
            borderColor: open === i ? C.primary + "40" : C.border,
            boxShadow: open === i ? `0 4px 16px ${C.shadow}` : "none",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="mini-faq-btn"
            style={{ background: open === i ? C.primaryLt : C.bgWhite, color: C.text }}
          >
            <span>{f.q}</span>
            <span
              className={`mini-faq-icon ${open === i ? "mini-faq-icon-open" : "mini-faq-icon-closed"}`}
              style={{ color: C.primary }}
            >+</span>
          </button>
          {open === i && (
            <div className="mini-faq-answer" style={{ color: C.textSub }}>{f.a}</div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Contact Form ─────────────────────────────────────────────────────────────
const ContactForm: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const canSubmit = form.name.trim() && form.email.trim() && form.subject && form.message.trim().length >= 10;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  const isDisabled = !canSubmit || loading;

  if (sent) {
    return (
      <div className="form-success-wrap" style={{ borderColor: C.border }}>
        <div className="form-success-icon" style={{ background: C.primaryLt }}>✅</div>
        <h3 className="form-success-title" style={{ color: C.text }}>پیام شما ارسال شد!</h3>
        <p className="form-success-desc" style={{ color: C.textSub }}>
          تیم ما پیام شما را دریافت کرد و به زودی پاسخ خواهد داد.
        </p>
        <button
          onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
          className="btn-new-message"
          style={{ borderColor: C.border, color: C.primary }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryLt; e.currentTarget.style.borderColor = C.primary; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = C.border; }}
        >ارسال پیام جدید</button>
      </div>
    );
  }

  return (
    <div className="contact-form-wrap" style={{ borderColor: C.border, boxShadow: `0 8px 32px ${C.shadow}` }}>
      <h2 className="contact-form-title" style={{ color: C.text }}>برای ما پیام بفرستید</h2>
      <p className="contact-form-subtitle" style={{ color: C.textSub }}>معمولاً ظرف چند ساعت پاسخ می‌دهیم.</p>

      <div className="form-grid">
        {/* Name */}
        <div>
          <Label>نام و نام خانوادگی <span style={{ color: C.rose }}>*</span></Label>
          <input
            placeholder="علی محمدی"
            value={form.name}
            onChange={set("name")}
            className="input-base"
            style={{ borderColor: C.border, color: C.text, background: C.bgSection }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        {/* Email */}
        <div>
          <Label>آدرس ایمیل <span style={{ color: C.rose }}>*</span></Label>
          <input
            placeholder="ali@example.com"
            value={form.email}
            onChange={set("email")}
            className="input-base input-email"
            style={{ borderColor: C.border, color: C.text, background: C.bgSection }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        {/* Phone */}
        <div>
          <Label>شماره تماس</Label>
          <input
            placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
            value={form.phone}
            onChange={set("phone")}
            className="input-base"
            style={{ borderColor: C.border, color: C.text, background: C.bgSection }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        {/* Subject */}
        <div>
          <Label>موضوع <span style={{ color: C.rose }}>*</span></Label>
          <select
            value={form.subject}
            onChange={set("subject")}
            className="input-base input-select"
            style={{ borderColor: C.border, color: C.text, background: C.bgSection }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="" disabled>انتخاب کنید...</option>
            <option value="support">پشتیبانی فنی</option>
            <option value="sales">خرید و قیمت‌گذاری</option>
            <option value="demo">درخواست دمو</option>
            <option value="partnership">همکاری و مشارکت</option>
            <option value="bug">گزارش مشکل فنی</option>
            <option value="other">سایر</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="form-message-wrap">
        <Label>متن پیام <span style={{ color: C.rose }}>*</span></Label>
        <textarea
          rows={5}
          placeholder="سوال یا درخواست خود را اینجا بنویسید..."
          value={form.message}
          onChange={set("message")}
          className="input-base"
          style={{ borderColor: C.border, color: C.text, background: C.bgSection }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <div
          className="char-counter"
          style={{ color: form.message.length < 10 ? C.textLight : C.primary }}
        >
          {form.message.length} / حداقل ۱۰ کاراکتر
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className="btn-submit"
        style={{
          background: isDisabled ? "#E5E7EB" : `linear-gradient(135deg,${C.primary},${C.primaryDk})`,
          color: isDisabled ? "#9CA3AF" : "#fff",
          cursor: isDisabled ? "not-allowed" : "pointer",
          boxShadow: isDisabled ? "none" : `0 6px 20px ${C.shadow}`,
        }}
        onMouseEnter={(e) => {
          if (canSubmit && !loading) {
            e.currentTarget.style.boxShadow = `0 10px 28px ${C.primary}40`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = isDisabled ? "none" : `0 6px 20px ${C.shadow}`;
        }}
      >
        {loading ? <span className="btn-spinner" /> : "ارسال پیام ←"}
      </button>
    </div>
  );
};

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
      <Nav />

      {/* Hero */}
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
