export const MyPlanSection: React.FC = () => (
  <>
    <div className="tch-sec-header">
      <div className="tch-sec-header__left">
        <div className="tch-sec-title">پلن من</div>
        <div className="tch-sec-sub">وضعیت اشتراک و مصرف</div>
      </div>
      <button className="tch-btn tch-btn--accent">ارتقاء پلن ↑</button>
    </div>

    <div className="plan-hero-card">
      <div>
        <div className="plan-hero-card__label">پلن فعال شما</div>
        <div className="plan-hero-card__name">حرفه‌ای</div>
        <div className="plan-hero-card__sub">تا ۱۴۰۳/۱۲/۲۹ فعال است — پرداخت سالانه</div>
      </div>
      <div className="plan-hero-card__right">
        {[
          { val:7,  total:10, label:"آزمون باقیمانده" },
          { val:380,total:500,label:"دانش‌آموز باقیمانده" },
          { val:5,  total:12, label:"ماه باقیمانده" },
        ].map(q=>(
          <div key={q.label} className="plan-quota">
            <div className="plan-quota__val">{q.val}</div>
            <div className="plan-quota__label">{q.label}</div>
            <div className="plan-quota__bar">
              <div className="plan-quota__fill" style={{width:`${(q.val/q.total)*100}%`}} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="plan-usage-grid">
      {[
        { icon:"📝", label:"آزمون‌های برگزار شده",  used:3,  total:10,  color:"var(--primary)" },
        { icon:"👥", label:"دانش‌آموزان ثبت‌شده",   used:98, total:500, color:"var(--sky)" },
        { icon:"❓", label:"سوالات ذخیره شده",       used:4,  total:null,color:"var(--violet)" },
        { icon:"💾", label:"فضای ذخیره‌سازی (MB)",   used:234,total:2048,color:"var(--accent)" },
        { icon:"📊", label:"گزارش‌های دانلود شده",   used:12, total:null,color:"var(--green)" },
        { icon:"📧", label:"ایمیل‌های ارسال شده",    used:45, total:200, color:"var(--rose)" },
      ].map(u=>(
        <div key={u.label} className="plan-usage-card">
          <div className="plan-usage-card__icon">{u.icon}</div>
          <div className="plan-usage-card__label">{u.label}</div>
          <div className="plan-usage-card__nums">
            <span className="plan-usage-card__used" style={{color:u.color}}>{u.used.toLocaleString("fa-IR")}</span>
            {u.total && <span className="plan-usage-card__total">/ {u.total.toLocaleString("fa-IR")}</span>}
          </div>
          {u.total && <div className="plan-usage-bar"><div className="plan-usage-fill" style={{width:`${(u.used/u.total)*100}%`,background:u.color}} /></div>}
        </div>
      ))}
    </div>
  </>
);