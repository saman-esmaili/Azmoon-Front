import { useState } from "react";
import "../styles/not-found.css";

/* ─── Props ───────────────────────────────────────────────────────────── */
interface NotFoundProps {
  path?: string;                 /* مسیر درخواست‌شده، اختیاری */
  onGoHome?: () => void;
  onGoBack?: () => void;
  onSearch?: (query: string) => void;
}

/* ─── Quick link config — می‌تونه بسته به نقش کاربر عوض بشه ─────────── */
interface QuickLink { label: string; icon: string; onClick?: () => void; }

const NotFound: React.FC<NotFoundProps> = ({
  path,
  onGoHome  = () => {},
  onGoBack  = () => { window.history.back(); },
  onSearch  = () => {},
}) => {
  return (
    <div className="nf-page" dir="rtl">

      {/* decorative floating shapes */}
      <span className="nf-blob nf-blob--1" />
      <span className="nf-blob nf-blob--2" />
      <span className="nf-blob nf-blob--3" />
      <span className="nf-blob nf-blob--4" />
      <span className="nf-qmark nf-qmark--1">؟</span>
      <span className="nf-qmark nf-qmark--2">؟</span>
      <span className="nf-qmark nf-qmark--3">؟</span>
      <span className="nf-qmark nf-qmark--4">؟</span>

      <div className="nf-content">

        {/* illustration */}
        <div className="nf-illust">
          <svg viewBox="0 0 220 220" width="100%" height="100%" fill="none">
            {/* magnifier circle */}
            <circle cx="95" cy="95" r="62" fill="var(--adm-card-bg)" stroke="var(--sky)" strokeWidth="6"/>
            <circle cx="95" cy="95" r="62" fill="none" stroke="var(--violet)" strokeWidth="2" strokeDasharray="6 10" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" from="0 95 95" to="360 95 95" dur="20s" repeatCount="indefinite"/>
            </circle>
            {/* handle */}
            <line x1="138" y1="138" x2="178" y2="178" stroke="var(--sky)" strokeWidth="10" strokeLinecap="round"/>
            <line x1="138" y1="138" x2="178" y2="178" stroke="var(--violet)" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
            {/* question mark inside lens */}
            <text x="95" y="112" fontSize="58" fontWeight="900" textAnchor="middle" fill="var(--primary)" opacity="0.85">؟</text>
            {/* small floating dots */}
            <circle cx="40" cy="50" r="4" fill="var(--sun)">
              <animate attributeName="cy" values="50;42;50" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="175" cy="55" r="5" fill="var(--accent)" opacity="0.7">
              <animate attributeName="cy" values="55;46;55" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="30" cy="150" r="3.5" fill="var(--green)" opacity="0.7">
              <animate attributeName="cy" values="150;142;150" dur="3.4s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>

        {/* big 404 */}
        <div className="nf-number">
          4<span className="nf-number__eye">0</span>4
        </div>

        <h1 className="nf-title">صفحه مورد نظر یافت نشد</h1>
        <p className="nf-desc">
          متأسفانه صفحه‌ای که دنبال آن می‌گردید وجود ندارد، حذف شده یا آدرس آن تغییر کرده است.
        </p>

        {path && (
          <div className="nf-path-chip">
            <span>🔗</span>
            <code>{path}</code>
          </div>
        )}

        {/* optional search */}
        {/*<div className="nf-search">*/}
        {/*  <span className="nf-search__icon">🔍</span>*/}
        {/*  <input*/}
        {/*    placeholder="جستجو در آزمون‌گیر..."*/}
        {/*    value={query}*/}
        {/*    onChange={e => setQuery(e.target.value)}*/}
        {/*    onKeyDown={handleKeyDown}*/}
        {/*  />*/}
        {/*  <button onClick={handleSearch}>جستجو</button>*/}
        {/*</div>*/}

        {/* actions */}
        {/*<div className="nf-actions">*/}
        {/*  <button className="nf-btn nf-btn--primary" onClick={onGoHome}>*/}
        {/*    🏠 بازگشت به صفحه اصلی*/}
        {/*  </button>*/}
        {/*  <button className="nf-btn nf-btn--ghost" onClick={onGoBack}>*/}
        {/*    ← صفحه قبل*/}
        {/*  </button>*/}
        {/*</div>*/}

        {/* quick links */}
        {/*<div className="nf-quick">*/}
        {/*  <span className="nf-quick__label">دسترسی سریع:</span>*/}
        {/*  {quickLinks.map(l => (*/}
        {/*    <button key={l.label} className="nf-quick-link" onClick={l.onClick}>*/}
        {/*      <span>{l.icon}</span>{l.label}*/}
        {/*    </button>*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/*<div className="nf-footnote">*/}
        {/*  اگر فکر می‌کنید این یک خطاست، با <a href="#">پشتیبانی آزمون‌گیر</a> تماس بگیرید.*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default NotFound;
