import { useState, useEffect, useRef } from "react";
import { C } from "./theme";
import "./auth_page.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "phone" | "otp";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatPhone = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
};

// ─── Single OTP box ───────────────────────────────────────────────────────────
interface OtpBoxProps {
  index: number;
  value: string;
  onValue: (i: number, v: string) => void;
  onBackspace: (i: number) => void;
  focusNext: (i: number) => void;
  focusPrev: (i: number) => void;
  boxRef: React.RefObject<HTMLInputElement | null>;
}

const OtpBox: React.FC<OtpBoxProps> = ({ index, value, onValue, onBackspace, focusNext, focusPrev, boxRef }) => {
  const filled = value.trim() !== "";
  return (
    <input
      ref={boxRef}
      maxLength={1}
      value={value.trim()}
      className={`otp-box ${filled ? "otp-box-filled" : "otp-box-empty"}`}
      style={{
        background: filled ? C.primaryLt : "#FAFAF9",
        border: `2px solid ${filled ? C.primary : C.border}`,
        color: C.text,
        caretColor: C.primary,
      }}
      onChange={(e) => {
        const d = e.target.value.replace(/\D/g, "").slice(-1);
        onValue(index, d);
        if (d) focusNext(index);
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          onBackspace(index);
          if (!filled) focusPrev(index);
        }
      }}
      onFocus={(e) => {
        e.target.style.borderColor = C.primary;
        e.target.style.boxShadow = `0 0 0 4px ${C.primaryLt}`;
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = "none";
        if (!filled) e.target.style.borderColor = C.border;
      }}
    />
  );
};

// ─── OTP Input row ────────────────────────────────────────────────────────────
const OtpInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const ref0 = useRef<HTMLInputElement>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const refs = [ref0, ref1, ref2, ref3, ref4];

  const digits: string[] = Array.from({ length: 5 }, (_, i) => value[i] ?? " ");

  const focusNext = (i: number) => { if (i < 4) refs[i + 1].current?.focus(); };
  const focusPrev = (i: number) => { if (i > 0) refs[i - 1].current?.focus(); };

  const handleValue = (i: number, d: string) => {
    const arr = digits.map((c, idx) => (idx === i ? (d || " ") : c));
    onChange(arr.join("").trimEnd());
  };

  const handleBackspace = (i: number) => {
    const arr = digits.map((c, idx) => (idx === i ? " " : c));
    onChange(arr.join("").trimEnd());
  };

  return (
    <div className="otp-row">
      {refs.map((r, i) => (
        <OtpBox
          key={i}
          index={i}
          value={digits[i]}
          onValue={handleValue}
          onBackspace={handleBackspace}
          focusNext={focusNext}
          focusPrev={focusPrev}
          boxRef={r}
        />
      ))}
    </div>
  );
};

// ─── Primary Button ───────────────────────────────────────────────────────────
const PrimaryBtn: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, loading, children }) => {
  const isDisabled = disabled || loading;
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="btn-primary-auth"
      style={{
        background: isDisabled ? "#E5E7EB" : `linear-gradient(135deg,${C.primary},${C.primaryDk})`,
        color: isDisabled ? "#9CA3AF" : "#fff",
        cursor: isDisabled ? "not-allowed" : "pointer",
        boxShadow: isDisabled ? "none" : `0 6px 20px ${C.shadow}`,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.boxShadow = `0 10px 28px ${C.primary}40`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = isDisabled ? "none" : `0 6px 20px ${C.shadow}`;
      }}
    >
      {loading ? <span className="btn-spinner" /> : children}
    </button>
  );
};

// ─── Left Panel — Form ────────────────────────────────────────────────────────
const PanelLeft: React.FC = () => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const validatePhone = (): boolean => {
    const raw = phone.replace(/\s/g, "");
    if (raw.length !== 11 || !raw.startsWith("09")) {
      setPhoneError("شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneSubmit = () => {
    if (!validatePhone()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); setCountdown(120); }, 900);
  };

  const handleOtpSubmit = () => {
    if (otp.trim().length < 5) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); alert("ورود موفق 🎉"); }, 900);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = C.primary;
    e.target.style.background = C.bgWhite;
    e.target.style.boxShadow = `0 0 0 4px ${C.primaryLt}`;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = C.border;
    e.target.style.background = "#FAFAF9";
    e.target.style.boxShadow = "none";
  };

  const stepIdx = step === "phone" ? 0 : 1;
  const steps = [{ key: "phone", label: "شماره موبایل" }, { key: "otp", label: "تأیید کد" }];

  return (
    <div className="panel-left">
      {/* Logo */}
      <div className="auth-logo">
        <div
          className="auth-logo-icon"
          style={{
            background: `linear-gradient(135deg,${C.primary},${C.sky})`,
            boxShadow: `0 4px 14px ${C.shadow}`,
          }}
        >
          <span>آ</span>
        </div>
        <span className="auth-logo-name" style={{ color: C.text }}>آزمون‌گیر</span>
      </div>

      {/* Step indicator */}
      <div className="step-indicator">
        {steps.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <div key={s.key} className={`step-item ${i === 0 ? "step-item-grow" : "step-item-shrink"}`}>
              <div className="step-bubble-wrap">
                <div
                  className="step-bubble"
                  style={{
                    background: done || active ? C.primary : "rgba(13,148,136,0.12)",
                    color: done || active ? "#fff" : C.textLight,
                    boxShadow: active ? `0 0 0 5px ${C.primaryLt}` : "none",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className="step-label"
                  style={{ color: active ? C.primary : done ? C.primaryDk : C.textLight }}
                >
                  {s.label}
                </span>
              </div>
              {i === 0 && (
                <div
                  className="step-connector"
                  style={{ background: stepIdx >= 1 ? C.primary : "rgba(13,148,136,0.15)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── PHONE STEP ── */}
      {step === "phone" && (
        <div className="step-phone">
          <h1 className="phone-step-title" style={{ color: C.text }}>خوش اومدی 👋</h1>
          <p className="phone-step-desc" style={{ color: C.textSub }}>
            شماره موبایلت رو وارد کن تا کد تأیید برات بفرستیم.
          </p>

          <label className="input-label" style={{ color: C.text }}>شماره موبایل</label>
          <div className="phone-input-wrap" style={{ marginBottom: phoneError ? 6 : 28 }}>
            <div className="phone-flag" style={{ color: C.textSub }}>
              🇮🇷 <span className="phone-flag-sep" style={{ color: C.textLight }}>|</span>
            </div>
            <input
              placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
              value={phone}
              onChange={(e) => { setPhone(formatPhone(e.target.value)); setPhoneError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
              className="input-base phone-input"
              style={{ borderColor: C.border, color: C.text }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
            />
          </div>
          {phoneError && (
            <p className="phone-error" style={{ color: C.rose }}>
              ⚠ {phoneError}
            </p>
          )}

          <PrimaryBtn onClick={handlePhoneSubmit} disabled={phone.replace(/\s/g, "").length < 11} loading={loading}>
            دریافت کد تأیید ←
          </PrimaryBtn>

          <p className="phone-terms" style={{ color: C.textLight }}>
            با ورود، با{" "}
            <a href="#" className="terms-link" style={{ color: C.primary }}>شرایط استفاده</a>
            {" "}و{" "}
            <a href="#" className="terms-link" style={{ color: C.primary }}>حریم خصوصی</a>
            {" "}موافقت می‌کنی.
          </p>
        </div>
      )}

      {/* ── OTP STEP ── */}
      {step === "otp" && (
        <div className="step-otp">
          <button
            onClick={() => { setStep("phone"); setOtp(""); }}
            className="btn-back"
            style={{ color: C.primary }}
          >
            ← بازگشت
          </button>

          <h1 className="otp-step-title" style={{ color: C.text }}>کد تأیید را وارد کن 📱</h1>
          <p className="otp-step-desc" style={{ color: C.textSub }}>کد ۵ رقمی ارسال‌شده به</p>
          <div className="otp-phone-display">
            <span
              className="otp-phone-badge"
              style={{ background: C.primaryLt, color: C.primaryDk }}
              dir="ltr"
            >
              {phone}
            </span>
            <button
              onClick={() => setStep("phone")}
              className="btn-edit"
              style={{ color: C.textLight }}
            >
              ویرایش
            </button>
          </div>

          <OtpInput value={otp} onChange={setOtp} />

          {/* Resend */}
          <div className="resend-wrap">
            {countdown > 0 ? (
              <span className="countdown-text" style={{ color: C.textLight }}>
                ارسال مجدد تا{" "}
                <span className="countdown-timer" style={{ color: C.primary }} dir="ltr">
                  {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
                </span>
              </span>
            ) : (
              <button
                onClick={() => { setCountdown(120); setOtp(""); }}
                className="btn-resend"
                style={{ borderColor: C.border, color: C.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.primaryLt;
                  e.currentTarget.style.borderColor = C.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                🔁 ارسال مجدد کد
              </button>
            )}
          </div>

          <PrimaryBtn onClick={handleOtpSubmit} disabled={otp.trim().length < 5} loading={loading}>
            ورود به پنل ←
          </PrimaryBtn>

          <div
            className="otp-hint"
            style={{ background: C.accentLt, borderColor: `${C.accent}28` }}
          >
            <span className="otp-hint-icon">💡</span>
            <p className="otp-hint-text" style={{ color: C.textSub }}>
              در محیط آزمایشی کد تأیید <strong style={{ color: C.accent }}>1 2 3 4 5</strong> را وارد کن.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Right Panel — Branding ───────────────────────────────────────────────────
const PanelRight: React.FC = () => (
  <div className="panel-right">
    <div className="panel-right-top">
      <a href="/" className="btn-back-to-site">
        ← بازگشت به سایت
      </a>
    </div>

    <div className="panel-right-body">
      <p className="panel-right-eyebrow">پلتفرم آزمون آنلاین</p>
      <h2 className="panel-right-h2">آزمون‌گیر</h2>
      <h3 className="panel-right-h3" style={{ color: C.sun }}>
        برگزاری آزمون<br />هوشمند و مطمئن
      </h3>
      <p className="panel-right-desc">
        به هزاران معلم و استاد بپیوندید که آزمون‌های خود را با آزمون‌گیر برگزار می‌کنند.
      </p>
      <div
        className="panel-right-divider"
        style={{ background: `linear-gradient(90deg,${C.sun},${C.accent})` }}
      />
    </div>

    <div />
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const AuthPage: React.FC = () => (
  <div className="auth-page">
    <PanelLeft />
    <PanelRight />
  </div>
);

export default AuthPage;
