export const BuyPlanSection: React.FC = () => (
  <>
    <div className="tch-sec-header">
      <div className="tch-sec-header__left">
        <div className="tch-sec-title">خرید پلن</div>
        <div className="tch-sec-sub">پلن مناسب خود را انتخاب کنید</div>
      </div>
    </div>
    <div className="buy-plans-grid">
      {[
        { name:"پایه", en:"Basic", price:500, hl:false, feats:["تا ۱۰۰ دانش‌آموز","۱۰ آزمون در ماه","بانک ۵۰۰ سوال","پشتیبانی ایمیل"], hot:null },
        { name:"حرفه‌ای", en:"Pro", price:1500, hl:true, feats:["تا ۵۰۰ دانش‌آموز","آزمون نامحدود","بانک نامحدود","ضد تقلب پیشرفته","پشتیبانی ۲۴/۷"], hot:"محبوب‌ترین" },
        { name:"سازمانی", en:"Enterprise", price:null, hl:false, feats:["دانش‌آموز نامحدود","سرور اختصاصی","مدیر اختصاصی","SLA 99.9٪","آموزش تیم"], hot:null },
      ].map(p => (
        <div key={p.en} className={`buy-plan-card ${p.hl?"buy-plan-card--hl":""}`}>
          {p.hot && <div className="buy-plan-card__hot">{p.hot}</div>}
          <div className={`buy-plan-card__en ${p.hl?"buy-plan-card__en--w":"buy-plan-card__en--d"}`}>{p.en}</div>
          <div className={`buy-plan-card__name ${p.hl?"buy-plan-card__name--w":"buy-plan-card__name--d"}`}>{p.name}</div>
          <div className="buy-plan-card__price">
            {p.price ? <>
              <span className={`buy-plan-card__amount ${p.hl?"buy-plan-card__amount--w":"buy-plan-card__amount--d"}`}>{p.price.toLocaleString("fa-IR")}</span>
              <span className={`buy-plan-card__unit ${p.hl?"buy-plan-card__unit--w":"buy-plan-card__unit--d"}`}>هزار/ماه</span>
            </> : <span className="buy-plan-card__amount buy-plan-card__amount--d" style={{fontSize:22}}>تماس بگیرید</span>}
          </div>
          <ul className="buy-plan-card__feats">
            {p.feats.map(f=>(
              <li key={f} className={`buy-plan-card__feat ${p.hl?"buy-plan-card__feat--w":"buy-plan-card__feat--d"}`}>
                <span className={`buy-plan-card__dot ${p.hl?"buy-plan-card__dot--w":"buy-plan-card__dot--d"}`}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button className={`buy-plan-card__cta ${p.hl?"buy-plan-card__cta--w":"buy-plan-card__cta--d"}`}>
            {p.price ? "انتخاب این پلن" : "تماس بگیرید"}
          </button>
        </div>
      ))}
    </div>
  </>
);