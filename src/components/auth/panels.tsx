import {useState, useEffect} from "react";
import {Step, formatPhone, PrimaryBtn, OtpInput} from './elements';
import '../../styles/auth_page.css';
import {C} from '../../styles/theme';
import Axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {CheckAuth} from '../../check_auth';
// ─── Left Panel — Form ────────────────────────────────────────────────────────
export const PanelLeft: React.FC = () => {
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [role, setRole] = useState<"student" | "teacher">("student");
    const [phoneError, setPhoneError] = useState<string>("");
    const [otpError, setOtpError] = useState<string>("");
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const check = async () =>{
        const is_auth = await CheckAuth()
        if (is_auth) {
            navigate('/')
        }
    }
    useEffect(() => {
        check()
    }, []);
    const admin = searchParams.get('Admin');
    const classUrl = searchParams.get('class_url');

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
        const data = {'mobile': phone.replace(/\s+/g, ''), 'type': role}

        Axios.post(`http://localhost:8000/send-otp?Admin=${admin}&class_url=${classUrl}`, data)
            .then((res) => {

            })
            .catch((err) => {
                setPhoneError('مشکلی در ارسال کد پیش آمده!')
            })
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep("otp");
            setCountdown(120);
        }, 900);
    };

    const handleOtpSubmit = () => {
        if (otp.trim().length < 5) return;
        const otp_data = {'code': otp, 'mobile': phone.replace(/\s+/g, '')}
        Axios.post('http://localhost:8000/verify-code', otp_data, {withCredentials: true})
            .then((res) => {
                const role = res.data.role;
                navigate(`/${role}`);
            })
            .catch((err) => {
                setOtpError('کد شما با کد ارسالی مطابقت ندارد!')
            })
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
    const steps = [{key: "phone", label: "شماره موبایل"}, {key: "otp", label: "تأیید کد"}];

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
                <span className="auth-logo-name" style={{color: C.text}}>آزمون‌گیر</span>
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
                                    style={{color: active ? C.primary : done ? C.primaryDk : C.textLight}}
                                >
                  {s.label}
                </span>
                            </div>
                            {i === 0 && (
                                <div
                                    className="step-connector"
                                    style={{background: stepIdx >= 1 ? C.primary : "rgba(13,148,136,0.15)"}}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── PHONE STEP ── */}
            {step === "phone" && (
                <div className="step-phone">
                    <h1 className="phone-step-title" style={{color: C.text}}>خوش اومدی 👋</h1>
                    <p className="phone-step-desc" style={{color: C.textSub}}>
                        شماره موبایلت رو وارد کن تا کد تأیید برات بفرستیم.
                    </p>

                    <label className="input-label" style={{color: C.text}}>شماره موبایل</label>
                    <div className="phone-input-wrap" style={{marginBottom: phoneError ? 6 : 28}}>
                        <div className="phone-flag" style={{color: C.textSub}}>
                            🇮🇷 <span className="phone-flag-sep" style={{color: C.textLight}}>|</span>
                        </div>
                        <input
                            placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                            value={phone}
                            onChange={(e) => {
                                setPhone(formatPhone(e.target.value));
                                setPhoneError("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                            className="input-base phone-input"
                            style={{borderColor: C.border, color: C.text}}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            autoFocus
                        />

                    </div>
                    {/* ROLE - INLINE CLEAN */}
                    <div style={{marginBottom: 16, marginTop: 8}}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: 6,
                                fontSize: 12,
                                color: C.textLight,
                                fontWeight: 500
                            }}
                        >
                            ورود به عنوان
                        </label>

                        <div style={{display: "flex", gap: 10}}>
                            {/* Student */}
                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    border: "1px solid",
                                    borderColor: role === "student" ? C.primary : C.border,
                                    background: role === "student" ? C.primaryLt : "transparent",
                                    color: role === "student" ? C.primary : C.textSub,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "0.2s"
                                }}
                            >
                                دانش‌آموز
                            </button>

                            {/* Teacher */}
                            <button
                                type="button"
                                onClick={() => setRole("teacher")}
                                style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    border: "1px solid",
                                    borderColor: role === "teacher" ? C.primary : C.border,
                                    background: role === "teacher" ? C.primaryLt : "transparent",
                                    color: role === "teacher" ? C.primary : C.textSub,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "0.2s"
                                }}
                            >
                                استاد
                            </button>
                        </div>
                    </div>
                    {phoneError && (
                        <p className="phone-error" style={{color: C.rose}}>
                            ⚠ {phoneError}
                        </p>
                    )}

                    <PrimaryBtn onClick={handlePhoneSubmit} disabled={phone.replace(/\s/g, "").length < 11}
                                loading={loading}>
                        دریافت کد تأیید ←
                    </PrimaryBtn>

                    <p className="phone-terms" style={{color: C.textLight}}>
                        با ورود، با{" "}
                        <a href="#" className="terms-link" style={{color: C.primary}}>شرایط استفاده</a>
                        {" "}و{" "}
                        <a href="#" className="terms-link" style={{color: C.primary}}>حریم خصوصی</a>
                        {" "}موافقت می‌کنی.
                    </p>
                </div>
            )}

            {/* ── OTP STEP ── */}
            {step === "otp" && (
                <div className="step-otp">
                    <button
                        onClick={() => {
                            setStep("phone");
                            setOtp("");
                        }}
                        className="btn-back"
                        style={{color: C.primary}}
                    >
                        ← بازگشت
                    </button>

                    <h1 className="otp-step-title" style={{color: C.text}}>کد تأیید را وارد کن 📱</h1>
                    <p className="otp-step-desc" style={{color: C.textSub}}>کد ۵ رقمی ارسال‌شده به</p>
                    <div className="otp-phone-display">
            <span
                className="otp-phone-badge"
                style={{background: C.primaryLt, color: C.primaryDk}}
                dir="ltr"
            >
              {phone}
            </span>
                        <button
                            onClick={() => setStep("phone")}
                            className="btn-edit"
                            style={{color: C.textLight}}
                        >
                            ویرایش
                        </button>
                    </div>

                    <OtpInput value={otp} onChange={setOtp}/>

                    {/* Resend */}
                    <div className="resend-wrap">
                        {countdown > 0 ? (
                            <span className="countdown-text" style={{color: C.textLight}}>
                ارسال مجدد تا{" "}
                                <span className="countdown-timer" style={{color: C.primary}} dir="ltr">
                  {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
                </span>
              </span>
                        ) : (
                            <button
                                onClick={() => {
                                    setCountdown(120);
                                    setOtp("");
                                    handlePhoneSubmit()
                                }}
                                className="btn-resend"
                                style={{borderColor: C.border, color: C.primary}}
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
                    {otpError && (
                        <p className="phone-error" style={{color: C.rose}}>
                            ⚠ {otpError}
                        </p>
                    )}
                    <PrimaryBtn onClick={handleOtpSubmit} disabled={otp.trim().length < 5} loading={loading}>
                        ورود به پنل ←
                    </PrimaryBtn>

                </div>
            )}
        </div>
    );
};

// ─── Right Panel — Branding ───────────────────────────────────────────────────
export const PanelRight: React.FC = () => (
    <div className="panel-right">
        <div className="panel-right-top">
            <a href="/" className="btn-back-to-site">
                ← بازگشت به سایت
            </a>
        </div>

        <div className="panel-right-body">
            <p className="panel-right-eyebrow">پلتفرم آزمون آنلاین</p>
            <h2 className="panel-right-h2">آزمون‌گیر</h2>
            <h3 className="panel-right-h3" style={{color: C.sun}}>
                برگزاری آزمون<br/>هوشمند و مطمئن
            </h3>
            <p className="panel-right-desc">
                به هزاران معلم و استاد بپیوندید که آزمون‌های خود را با آزمون‌گیر برگزار می‌کنند.
            </p>
            <div
                className="panel-right-divider"
                style={{background: `linear-gradient(90deg,${C.sun},${C.accent})`}}
            />
        </div>

        <div/>
    </div>
);
