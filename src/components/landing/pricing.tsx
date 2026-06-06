import {useState} from 'react';
import {Plan,Pill} from './../landing/details_component';
import {C} from '../../styles/theme'
import './../../styles/azmon_landing.css'
export const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState<boolean>(false);
  const plans: Plan[] = [
    {
      name:"پایه", name_en:"Basic", price:annual?400:500, color:C.primary, btnBg:`linear-gradient(135deg,${C.primary},${C.primaryDk})`,
      features:["تا ۱۰۰ دانشجو","۱۰ آزمون در ماه","بانک سوال ۵۰۰ سوال","تصحیح خودکار","پشتیبانی ایمیل"],
      badge:null, highlight:false,
    },
    {
      name:"حرفه‌ای", name_en:"Pro", price:annual?1200:1500, color:C.bgWhite, btnBg:`linear-gradient(135deg,${C.bgWhite},#EEF)`,
      features:["تا ۵۰۰ دانشجو","آزمون نامحدود","بانک سوال نامحدود","ضد تقلب پیشرفته","API دسترسی","پشتیبانی ۲۴/۷","داشبورد تحلیلی"],
      badge:"محبوب‌ترین", highlight:true,
    },
    {
      name:"سازمانی", name_en:"Enterprise", price:null, color:C.accent, btnBg:`linear-gradient(135deg,${C.accent},${C.accentDk})`,
      features:["دانشجو نامحدود","سرور اختصاصی","قابلیت‌های سفارشی","مدیر حساب اختصاصی","SLA ۹۹.۹٪","آموزش تیم","یکپارچگی با سیستم موجود"],
      badge:null, highlight:false,
    },
  ];
  return (
    <section id='plan' className='pricing-section'>
      <div className='pricing-inner'>
        <> {/*FadeIn */}
          <div className='pricing-header'>
            <Pill label="قیمت‌گذاری" color={C.accent} bg={C.accentLt} />
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14 }}>پلن مناسب خود را انتخاب کنید</h2>
            <p style={{ color:C.textSub, fontSize:18, marginBottom:32 }}>۱۴ روز رایگان، بدون نیاز به کارت اعتباری</p>
            <div style={{ display:"inline-flex", background:C.bgWhite, border:`1.5px solid ${C.border}`, borderRadius:14, padding:4, gap:4 }}>
              {["ماهانه","سالانه (۲۰٪ تخفیف)"].map((t, i) => (
                <button key={t} onClick={() => setAnnual(i===1)}
                  style={{ padding:"9px 22px", borderRadius:10, border:"none", cursor:"pointer", fontSize:14, fontWeight:700, background: annual===(i===1) ? `linear-gradient(135deg,${C.primary},${C.primaryDk})` : "transparent", color: annual===(i===1) ? "#fff" : C.textSub, transition:"all 0.25s", fontFamily:"inherit" }}
                >{t}</button>
              ))}
            </div>
          </div>
        </>
        <div className='plans-grid'>
          {plans.map((p, i) => (
            <> {/* FadeIn key={p.name} delay={i*0.1} */}
              <div style={{ position:"relative", background: p.highlight ? `linear-gradient(145deg,${C.primary},${C.primaryDk})` : C.bgWhite, border: p.highlight ? "none" : `1.5px solid ${C.border}`, borderRadius:24, padding:36, height:"100%", boxShadow: p.highlight ? `0 24px 64px ${C.primary}30` : "none" }}>
                {p.badge && <div style={{ position:"absolute", top:-15, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.sun},${C.sunDk})`, color:C.text, fontSize:12, fontWeight:900, padding:"5px 18px", borderRadius:100, whiteSpace:"nowrap", boxShadow:"0 4px 12px rgba(252,211,77,0.5)" }}>{p.badge}</div>}
                <span style={{ color: p.highlight ? "rgba(255,255,255,0.7)" : C.primary, fontSize:13, fontWeight:700 }}>{p.name_en}</span>
                <h3 style={{ color: p.highlight ? "#fff" : C.text, fontSize:24, fontWeight:900, marginBottom:24, marginTop:6 }}>{p.name}</h3>
                {p.price !== null
                  ? <div style={{ marginBottom:32 }}><span style={{ color: p.highlight ? "#fff" : C.text, fontSize:44, fontWeight:900 }}>{p.price.toLocaleString()}</span><span style={{ color: p.highlight ? "rgba(255,255,255,0.65)" : C.textSub, fontSize:15 }}> هزار تومان/ماه</span></div>
                  : <div style={{ color:C.accent, fontSize:28, fontWeight:900, marginBottom:32 }}>تماس بگیرید</div>
                }
                <div style={{ marginBottom:32 }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <div style={{ width:20, height:20, background: p.highlight ? "rgba(255,255,255,0.2)" : C.primaryLt, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color: p.highlight ? "#fff" : C.primary, fontWeight:900 }}>✓</div>
                      <span style={{ color: p.highlight ? "rgba(255,255,255,0.85)" : C.textSub, fontSize:14 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width:"100%", padding:"14px 0", borderRadius:12, border:"none", background: p.highlight ? C.bgWhite : `linear-gradient(135deg,${C.primary},${C.primaryDk})`, color: p.highlight ? C.primary : "#fff", fontSize:15, fontWeight:800, cursor:"pointer", transition:"all 0.2s", boxShadow: p.highlight ? "none" : `0 6px 18px ${C.shadow}`, fontFamily:"inherit" }}
                  onMouseEnter={(e) => { const b=e.target as HTMLButtonElement; b.style.transform="translateY(-1px)"; b.style.opacity="0.92"; }}
                  onMouseLeave={(e) => { const b=e.target as HTMLButtonElement; b.style.transform="translateY(0)"; b.style.opacity="1"; }}
                >{p.price !== null ? "شروع کنید" : "با ما تماس بگیرید"}</button>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
};
