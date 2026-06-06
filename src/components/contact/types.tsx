
// ─── Types ────────────────────────────────────────────────────────────────────
import {C} from "../../styles/theme";

export interface ContactMethod {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// ─── Focus / Blur handlers ────────────────────────────────────────────────────
export const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = C.primary;
  e.target.style.background = C.bgWhite;
  e.target.style.boxShadow = `0 0 0 4px ${C.primaryLt}`;
};
export const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = C.border;
  e.target.style.background = C.bgSection;
  e.target.style.boxShadow = "none";
};

// ─── Label ────────────────────────────────────────────────────────────────────
export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="form-label" style={{ color: C.text }}>{children}</label>
);