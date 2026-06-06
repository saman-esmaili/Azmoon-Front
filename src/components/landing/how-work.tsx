import {Step,Pill} from './../landing/details_component'
// ─── How It Works ─────────────────────────────────────────────────────────────
import {C} from "../../styles/theme";
import './../../styles/azmon_landing.css'
export const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    { n:"۰۱", title:"ثبت‌نام سازمان",   desc:"در ۵ دقیقه حساب سازمانی بسازید و تیم خود را اضافه کنید.",                 icon:"🏢" },
    { n:"۰۲", title:"ساخت بانک سوال",   desc:"سوالات را آپلود یا مستقیم وارد کنید. دسته‌بندی خودکار با هوش مصنوعی.",     icon:"📝" },
    { n:"۰۳", title:"طراحی آزمون",      desc:"زمان‌بندی، محدودیت‌ها و تنظیمات ضد تقلب را تعیین کنید.",                   icon:"⚙️" },
    { n:"۰۴", title:"دعوت دانشجویان",   desc:"لینک اشتراک‌گذاری یا import از Excel. ایمیل خودکار ارسال می‌شود.",          icon:"📨" },
    { n:"۰۵", title:"برگزاری آزمون",    desc:"مانیتورینگ زنده، هشدار تقلب، آمار لحظه‌ای.",                               icon:"🎯" },
    { n:"۰۶", title:"دریافت گزارش",     desc:"گزارش کامل با نمودار، کارنامه خودکار، صادرات داده.",                        icon:"📈" },
  ];
  return (
    <section id='methods' className='how-section'>
      <div className='how-inner'>
        <> {/* FadeIn */}
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <Pill label="نحوه کار" color="#059669" bg="#D1FAE5" />
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14 }}>در ۶ گام شروع کنید</h2>
            <p style={{ color:C.textSub, fontSize:18 }}>از ثبت‌نام تا برگزاری اولین آزمون، کمتر از ۳۰ دقیقه</p>
          </div>
        </>
        <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 28,
  }}>
          {steps.map((s, i) => (
            <>  {/* FadeIn key={s.n} delay={i*0.1} */}
              <div className='step-card'>
                <div style={{ position:"absolute", top:-6, right:8, color:`${C.primary}0E`, fontSize:80, fontWeight:900, lineHeight:1, fontFamily:"monospace", userSelect:"none" }}>{s.n}</div>
                <div className='step-content'>
                  <div className='step-icon'>{s.icon}</div>
                  <h3 className='step-title'>{s.title}</h3>
                  <p className='step-desc'>{s.desc}</p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
};
