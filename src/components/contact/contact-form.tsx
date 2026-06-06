import {useState} from "react";
import {C} from "../../styles/theme";
import {Label, onBlur,onFocus} from "./types";
import '../../styles/contact_page.css';
export const ContactForm: React.FC = () => {
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
            className="input-base-contact"
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
            className="input-base-contact input-select"
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
          className="input-base-contact"
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
