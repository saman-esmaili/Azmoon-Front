import {useState} from "react";
import {C} from "../../styles/theme";
import {FaqItem} from './../contact/types';
import '../../styles/contact_page.css';
export const MiniFaq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  const faqs: FaqItem[] = [
    { q: "چقدر طول می‌کشد پاسخ بگیرم؟", a: "تیم پشتیبانی ما در ساعات اداری معمولاً ظرف ۲ تا ۴ ساعت پاسخ می‌دهد. برای مشتریان پلن حرفه‌ای پاسخ‌دهی ۲۴/۷ است." },
    { q: "آیا امکان مشاوره تلفنی وجود دارد؟", a: "بله، برای سازمان‌ها و موسسات می‌توانید از طریق فرم تماس درخواست مشاوره تلفنی ثبت کنید تا یک متخصص با شما تماس بگیرد." },
    { q: "برای گزارش باگ با کجا تماس بگیریم؟", a: "لطفاً از همین فرم با موضوع «گزارش مشکل فنی» استفاده کنید یا مستقیماً به آدرس support@azmon.ir ایمیل بزنید." },
  ];
  return (
    <div>
      {faqs.map((f, i) => (
        <div
          key={i}
          className="mini-faq-item"
          style={{
            borderColor: open === i ? C.primary + "40" : C.border,
            boxShadow: open === i ? `0 4px 16px ${C.shadow}` : "none",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="mini-faq-btn"
            style={{ background: open === i ? C.primaryLt : C.bgWhite, color: C.text }}
          >
            <span>{f.q}</span>
            <span
              className={`mini-faq-icon ${open === i ? "mini-faq-icon-open" : "mini-faq-icon-closed"}`}
              style={{ color: C.primary }}
            >+</span>
          </button>
          {open === i && (
            <div className="mini-faq-answer" style={{ color: C.textSub }}>{f.a}</div>
          )}
        </div>
      ))}
    </div>
  );
};
