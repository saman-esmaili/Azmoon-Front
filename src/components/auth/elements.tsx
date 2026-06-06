import {C} from "./../../styles/theme";
import {useRef} from "react";
import '../../styles/auth_page.css';
export type Step = "phone" | "otp";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatPhone = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
};

// ─── Single OTP box ───────────────────────────────────────────────────────────
export interface OtpBoxProps {
  index: number;
  value: string;
  onValue: (i: number, v: string) => void;
  onBackspace: (i: number) => void;
  focusNext: (i: number) => void;
  focusPrev: (i: number) => void;
  boxRef: React.RefObject<HTMLInputElement | null>;
}

export const OtpBox: React.FC<OtpBoxProps> = ({ index, value, onValue, onBackspace, focusNext, focusPrev, boxRef }) => {
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
export const OtpInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
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
export const PrimaryBtn: React.FC<{
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
