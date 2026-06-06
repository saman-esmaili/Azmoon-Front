import {useState} from "react";
import {C} from "../../styles/theme";
import {FaqItem} from './../landing/details_component'
import './../../styles/azmon_landing.css'
export const FAQ: React.FC = () => {
    const [open, setOpen] = useState<number | null>(null);
    const faqs: FaqItem[] = [
        {
            q: "آیا نسخه آزمایشی رایگان دارد؟",
            a: "بله، ۱۴ روز کامل رایگان، بدون نیاز به کارت اعتباری. تمام ویژگی‌های پلن حرفه‌ای در اختیار شماست."
        },
        {
            q: "چگونه می‌توانم شروع کنم؟",
            a: "کافیست روی 'شروع رایگان' کلیک کنید، ایمیل و نام سازمان خود را وارد کنید و ظرف ۵ دقیقه آماده برگزاری اولین آزمون هستید."
        },
        {
            q: "آیا اطلاعات دانشجویان امن است؟",
            a: "بله. تمام داده‌ها با رمزنگاری AES-256 ذخیره می‌شود. سرورها در داخل ایران قرار دارند و بکاپ روزانه انجام می‌شود."
        },
        {
            q: "پشتیبانی چگونه است؟",
            a: "پلن پایه: پشتیبانی ایمیل در ساعات اداری. پلن حرفه‌ای: پشتیبانی ۲۴/۷ تلفنی و چت. پلن سازمانی: مدیر حساب اختصاصی."
        },
        {
            q: "آیا آموزش داده می‌شود؟",
            a: "بله. ویدیوهای آموزشی کامل، مستندات دقیق و جلسه آموزش آنلاین رایگان برای تیم شما ارائه می‌دهیم."
        },
        {
            q: "آیا می‌توان با سیستم‌های موجود یکپارچه کرد؟",
            a: "بله. API کامل REST برای یکپارچگی با LMS، سیستم‌های دانشگاهی و ERP سازمان‌ها در دسترس است."
        },
    ];
    return (
        <section className='faq-section'>
            <div className='faq-inner'>
                <> {/*FadeIn*/}
                    <div className='faq-header'>
                        <h2 style={{color: C.text, fontSize: 42, fontWeight: 900, marginBottom: 14}}>سوالات متداول</h2>
                        <p style={{color: C.textSub, fontSize: 18}}>پاسخ سوالات رایج</p>
                    </div>
                </>
                {faqs.map((f, i) => (
                    <> {/*FadeIn key={f.q} delay={i * 0.06}*/}
                        <div className={`faq-item ${open === i ? 'faq-item-open' : ''}`}
                             style={{
                                 border: `1.5px solid ${open === i ? 'var(--primary)45' : 'var(--border)'}`,
                                 boxShadow: open === i ? '0 6px 20px var(--shadow)' : 'none'
                             }}>
                            <button onClick={() => setOpen(open === i ? null : i)}
                                   className='faq-btn'
                            >
                                <span>{f.q}</span>
                                <span className='faq-icon'>+</span>
                            </button>
                            {open === i && <div className='faq-answer'>{f.a}</div>}
                        </div>
                    </>
                ))}
            </div>
        </section>
    );
};
