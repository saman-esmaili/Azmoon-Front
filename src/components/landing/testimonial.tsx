import {Review,Pill} from './../landing/details_component'
import {C} from "../../styles/theme";
import './../../styles/azmon_landing.css'
export const Testimonials: React.FC = () => {
  const reviews: Review[] = [
    { name:"دکتر احمد رضایی",  role:"استاد دانشگاه تهران",     stars:5, text:"آزمون‌گیر کاملاً تجربه ما را در برگزاری آزمون‌های میان‌ترم و پایان‌ترم دگرگون کرد. سیستم ضد تقلب فوق‌العاده است.", avatar:"🎓", ac:C.primary },
    { name:"مریم حسینی",       role:"مدیر آموزشگاه زبان",      stars:5, text:"سادگی استفاده و قدرت تحلیل داده‌ها بی‌نظیر است. از روزی که شروع کردیم دیگر به هیچ ابزار دیگری نیاز نداشتیم.", avatar:"👩‍💼", ac:C.rose },
    { name:"محمد کریمی",       role:"رئیس اداره آموزش",        stars:5, text:"برای ارزیابی و استخدام کارکنان از این سامانه استفاده می‌کنیم. گزارش‌های آماری بسیار دقیق و مفید هستند.", avatar:"👨‍💼", ac:"#059669" },
    { name:"فاطمه موسوی",      role:"معلم دبیرستان",            stars:5, text:"دانش‌آموزانم عاشق آزمون‌های آنلاین شدند! رابط کاربری ساده و نتایج فوری باعث انگیزه بیشتر شده.", avatar:"👩‍🏫", ac:C.accent },
    { name:"علی اکبری",        role:"مسئول IT دانشگاه",         stars:5, text:"پیاده‌سازی ساده، API کامل و پشتیبانی فنی عالی. یکپارچگی با سیستم LMS موجود ما بدون مشکل انجام شد.", avatar:"👨‍💻", ac:C.violet },
    { name:"نرگس طاهری",       role:"استاد آموزشگاه کنکور",     stars:5, text:"بانک سوال هوشمند و امکان آزمون آزمایشی در همان شرایط کنکور، دقیقاً همان چیزی است که نیاز داشتیم.", avatar:"👩‍🎓", ac:C.sky },
  ];
  return (
    <section className='testimonials-section'>
      <div className='testimonials-inner'>
        <> {/*FadeIn*/}
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <Pill label="نظرات مشتریان" color={C.violet} bg={C.violetLt} />
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14 }}>مشتریان ما چه می‌گویند</h2>
            <p style={{ color:C.textSub, fontSize:18 }}>بیش از ۵۰۰ موسسه آموزشی به ما اعتماد کرده‌اند</p>
          </div>
        </>
        {/* grid with align-items:stretch so all cards same height */}
        <div className='reviews-grid'>
          {reviews.map((r, i) => (
            <> {/*FadeIn key={r.name} delay={i*0.08}*/}
              {/* wrapper fills full height */}
              <div className='review-cell'>
                <div className='review-card'
                >
                  {/* Stars */}
                  <div className='review-stars'>{"★".repeat(r.stars)}</div>
                  {/* Text grows to fill space */}
                  <p className='review-text'>"{r.text}"</p>
                  {/* Author pinned to bottom */}
                  <div className='review-author'>
                    <div style={{ width:44, height:44, background:`${r.ac}14`, border:`2px solid ${r.ac}28`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{r.avatar}</div>
                    <div>
                      <div className='review-name'>{r.name}</div>
                      <div className='review-role'>{r.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
};
