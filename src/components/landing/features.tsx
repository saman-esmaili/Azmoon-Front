import {Pill,Feature} from './../landing/details_component'
// ─── Features ─────────────────────────────────────────────────────────────────
import {C} from "../../styles/theme";
import './../../styles/azmon_landing.css'
export const Features: React.FC = () => {
  const features: Feature[] = [
    { icon:"🧠", title:"بانک سوال هوشمند",   desc:"طبقه‌بندی سوالات بر اساس موضوع، سطح و نوع. پشتیبانی از تستی، تشریحی و صحیح/غلط.", color:C.primary, bg:C.primaryLt },
    { icon:"🛡️", title:"ضد تقلب پیشرفته",   desc:"تشخیص چهره، قفل مرورگر، ثبت رفتار کاربر و هشدار فوری به استاد.", color:C.rose, bg:C.roseLt },
    { icon:"⚡", title:"تصحیح خودکار",       desc:"نمره‌دهی فوری با هوش مصنوعی. گزارش آنی نتایج به دانشجو و استاد.", color:"#059669", bg:"#D1FAE5" },
    { icon:"📊", title:"داشبورد تحلیلی",     desc:"نمودارهای تعاملی، تحلیل آماری عمیق، مقایسه عملکرد و پیشرفت تحصیلی.", color:C.accent, bg:C.accentLt },
    { icon:"📱", title:"پشتیبانی موبایل",    desc:"تجربه کامل روی موبایل و تبلت. اپ اختصاصی اندروید و iOS.", color:C.violet, bg:C.violetLt },
    { icon:"📄", title:"گزارش‌دهی پیشرفته", desc:"صدور کارنامه اتوماتیک، خروجی Excel و PDF، ارسال نتایج به ایمیل.", color:C.sky, bg:C.skyLt },
    { icon:"🌐", title:"چند زبانه",          desc:"پشتیبانی کامل از فارسی، عربی و انگلیسی با RTL/LTR هوشمند.", color:"#DB2777", bg:"#FCE7F3" },
    { icon:"🔐", title:"امنیت داده",         desc:"رمزنگاری end-to-end، بکاپ خودکار ابری، انطباق با GDPR.", color:C.lime, bg:C.limeLt },
  ];
  return (
    <section id="features" className='features-section'>
      <div className='features-inner'>
        <> {/* FadeIn */}
          <div className='section-header'>
            <Pill label="ویژگی‌ها" color={C.primary} bg={C.primaryLt} />
            <h2 className='section-title'>همه چیز در یک پلتفرم</h2>
            <p style={{ color:C.textSub, fontSize:18, maxWidth:500, margin:"0 auto" }}>ابزارهای کامل برای برگزاری، مدیریت و تحلیل آزمون‌های آنلاین</p>
          </div>
        </>
        <div className='features-grid'>
          {features.map((f, i) => (
            <> {/* FadeIn key={f.title} delay={i*0.07} */}
              <div className='feature-card'>
                <div className='feature-icon'>{f.icon}</div>
                <h3 className='feature-title'>{f.title}</h3>
                <p className='feature-desc'>{f.desc}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
};
