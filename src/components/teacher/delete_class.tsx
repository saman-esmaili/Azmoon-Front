import React, { useState, useEffect, useRef } from "react"; // useState و useEffect را import کنید
import "./../../styles/delete_popup.css";

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void; // اگر از این نام استفاده کنید
  ItemName?: string;
  name:string;
}
const DeleteModal:React.FC<DeleteModalProps>  = ({ isOpen, onConfirm, onCancel,name="", ItemName = "" }) => {
  const [visible, setVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);


  // پاکسازی تایمرها هنگام unmount شدن کامپوننت
  useEffect(() => {
    return () => {
      timerRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []); // این useEffect فقط یک بار هنگام mount و unmount اجرا می‌شود

  // مدیریت وضعیت نمایش و انیمیشن ورود مودال
  useEffect(() => {
    if (isOpen) {
      // وقتی مودال باز می‌شود، ابتدا انیمیشن خروج را غیرفعال می‌کنیم
      setAnimateOut(false);
      // سپس بعد از یک تأخیر کوتاه، مودال را قابل مشاهده می‌کنیم تا انیمیشن ورود اجرا شود
      const timer = setTimeout(() => {
        setVisible(true);
      }, 10); // تأخیر کم برای اطمینان از اعمال کلاس CSS
      timerRef.current.push(timer);
    } else {
      // اگر مودال بسته می‌شود، آن را قابل مشاهده نگه می‌داریم تا انیمیشن خروج اجرا شود
      // و زمانی که isOpen=false شد، visible را هم false می‌کنیم.
      // این کار باعث می‌شود که انیمیشن خروج کامل اجرا شود.
      setVisible(false); // مودال دیگر قابل مشاهده نیست
      setAnimateOut(false); // ریست کردن animateOut برای استفاده مجدد
    }
  }, [isOpen]); // این useEffect هر بار که isOpen تغییر کند اجرا می‌شود

  // تابع برای مدیریت انصراف
  const handleCancel = () => {
    setAnimateOut(true); // فعال کردن کلاس انیمیشن خروج
    // بعد از اتمام انیمیشن خروج (300 میلی‌ثانیه)، تابع onCancel را فراخوانی می‌کنیم
    const timer = setTimeout(() => {
      onCancel();
      // بعد از اتمام انیمیشن خروج و اجرای onCancel، state را ریست می‌کنیم
      // تا مودال برای باز شدن مجدد آماده باشد.
      setVisible(false);
      setAnimateOut(false);
    }, 300); // این زمان باید با duration انیمیشن خروج در CSS مطابقت داشته باشد
    timerRef.current.push(timer);
  };

  // تابع برای مدیریت تأیید حذف
  const handleConfirm = () => {
    setAnimateOut(true); // فعال کردن کلاس انیمیشن خروج
    // بعد از اتمام انیمیشن خروج (300 میلی‌ثانیه)، تابع onConfirm را فراخوانی می‌کنیم
    const timer = setTimeout(() => {
      onConfirm();
      // بعد از اتمام انیمیشن خروج و اجرای onConfirm، state را ریست می‌کنیم
      // تا مودال برای باز شدن مجدد آماده باشد.
      setVisible(false);
      setAnimateOut(false);
    }, 300); // این زمان باید با duration انیمیشن خروج در CSS مطابقت داشته باشد
    timerRef.current.push(timer);
  };

  // اگر مودال قرار نیست نمایش داده شود (نه isOpen و نه visible)، چیزی render نکن
  // این شرط باعث می‌شود که حتی در حین اجرای انیمیشن خروج (زمانی که visible هنوز true است اما isOpen false شده)،
  // مودال همچنان در DOM باقی بماند تا انیمیشن کامل شود.
  if (!isOpen && !visible) return null;

  return (
    <>
      {/* Overlay: پس‌زمینه مودال */}
      <div
        className={`dcm-overlay ${visible && !animateOut ? "dcm-overlay--visible" : "dcm-overlay--hidden"}`}
        onClick={handleCancel}
      >
        {/* Card: محتوای اصلی مودال */}
        <div
          className={`dcm-card ${animateOut ? "dcm-card--out" : ""}`}
          onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن مودال با کلیک روی خود کارت
        >
          <div className="dcm-glow" />

          <div className="dcm-icon-wrapper">
            <div className="dcm-icon-ring">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                  stroke="#ef4444"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 11v6M14 11v6"
                  stroke="#ef4444"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="dcm-title">حذف کلاس</h2>

          <p className="dcm-text">آیا از حذف {name}</p>
          {/* نمایش نام کلاس در صورتی که پاس داده شده باشد */}
          {ItemName && <p className="dcm-classname">«{ItemName}»</p>}
          <p className="dcm-warning">اطمینان دارید؟ این عمل قابل بازگشت نیست.</p>

          <div className="dcm-divider" />

          <div className="dcm-actions">
            <button className="dcm-btn-cancel" onClick={handleCancel}>
              انصراف
            </button>
            <button className="dcm-btn-delete" onClick={handleConfirm}>
              بله، حذف شود
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
