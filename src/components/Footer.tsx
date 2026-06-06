import {C} from "../styles/theme";
import {FooterCol} from './landing/details_component';
import '../styles/azmon_landing.css';
export const Footer: React.FC = () => {
  const cols: FooterCol[] = [
    { title:"آزمون‌گیر", items:["درباره ما","تیم ما","وبلاگ","اخبار","مشاغل"] },
    { title:"محصول",     items:["ویژگی‌ها","امنیت","API","مستندات","تغییرات"] },
    { title:"پشتیبانی", items:["مرکز راهنما","تماس با ما","وضعیت سیستم","گزارش باگ","جامعه کاربران"] },
  ];
  return (
    <footer className='footer'>
      <div className='footer-inner'>
        <div className='footer-grid'>
          <div>
            <div className='footer-logo'>
              <div className='footer-logo-icon'>
                <span style={{ color:"#fff", fontSize:21, fontWeight:900 }}>آ</span>
              </div>
              <span className='footer-logo-name'>آزمون‌گیر</span>
            </div>
            <p className='footer-tagline'>سامانه هوشمند آزمون‌گیری آنلاین برای موسسات آموزشی ایران</p>
            <div className='footer-socials'>
              {["📘","📸","🐦","💼"].map((icon, i) => (
                <div className='footer-social-btn'
                >{icon}</div>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className='footer-col-title'>{col.title}</h4>
              {col.items.map((item) => (
                <a key={item} href="#" className='footer-col-link'>{item}</a>
              ))}
            </div>
          ))}
        </div>
        <div className='footer-bottom'>
          <span className='footer-copy'>© ۱۴۰۳ آزمون‌گیر. تمام حقوق محفوظ است.</span>
          <div className='footer-legal'>
            {["حریم خصوصی","شرایط استفاده","کوکی‌ها"].map((t) => (
              <a key={t} href="#" className='footer-legal-link'
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};