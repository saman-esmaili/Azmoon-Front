import {C} from "../../styles/theme";
// import {CSSProperties} from "react";
// import {FadeIn} from '../landing/details_component'
import './../../styles/azmon_landing.css'
export const CTA: React.FC = () => {
  const fields = [
    { p:"نام و نام خانوادگی" },
    { p:"آدرس ایمیل" },
    { p:"نام سازمان/دانشگاه", col:2 },
  ];
  return (
    <section className='cta-section'>
      {/* Decorations */}
      <div className='cta-deco-1' />
      <div className='cta-deco-2' />
      <div className='cta-deco-3' />
      <div className='cta-deco-4' />

      <div className='cta-inner'>
        <> {/*FadeIn*/}
          <div className='cta-pill'>
            <span className='cta-pill-text'>✨ همین امروز شروع کنید</span>
          </div>
          <h2 className='cta-h2'>
            برگزاری اولین آزمون<br />
            <span style={{ color:C.sun }}>کمتر از ۳۰ دقیقه</span>
          </h2>
          <p className='cta-desc'>۱۴ روز رایگان، بدون نیاز به کارت اعتباری، بدون تعهد</p>

          {/* Form */}
          <div className='cta-form-wrap'>
            <div className='cta-form-grid'>
              {fields.map((inp, i) => (
                <input key={i} placeholder={inp.p}
                  className={`cta-input ${inp.col ? 'cta-input-full' : ''}`}
                />
              ))}
            </div>
            <button className='btn-cta-submit'
            >🚀 دریافت دموی رایگان</button>
          </div>
          <p className='cta-terms'>با ثبت‌نام، با شرایط استفاده و حریم خصوصی موافقت می‌کنید</p>
        </>
      </div>
    </section>
  );
};
