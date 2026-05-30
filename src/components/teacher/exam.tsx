import {useState} from "react";

const ExamsSection: React.FC = () => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <div className="tch-sec-header">
        <div className="tch-sec-header__left">
          <div className="tch-sec-title">آزمون‌ها</div>
          <div className="tch-sec-sub">{EXAMS.length} آزمون</div>
        </div>
        <button className="tch-btn tch-btn--primary" onClick={()=>setModal(true)}>+ ایجاد آزمون</button>
      </div>

      <div className="tch-stats">
        {[
          { icon:"📝", label:"کل آزمون‌ها",   value:`${EXAMS.length}`,                                   bg:"var(--primary-lt)", color:"var(--primary)" },
          { icon:"⏳", label:"پیش رو",         value:`${EXAMS.filter(e=>e.status==="upcoming").length}`,  bg:"var(--sky-lt)",    color:"var(--sky)" },
          { icon:"✅", label:"برگزار شده",     value:`${EXAMS.filter(e=>e.status==="done").length}`,      bg:"var(--green-lt)",  color:"var(--green)" },
          { icon:"📊", label:"میانگین سوال",   value:`${Math.round(EXAMS.reduce((s,e)=>s+e.qCount,0)/EXAMS.length)}`,bg:"var(--violet-lt)",color:"var(--violet)" },
        ].map(s=>(
          <div key={s.label} className="tch-stat">
            <div className="tch-stat__icon" style={{background:s.bg}}>{s.icon}</div>
            <div><div className="tch-stat__label">{s.label}</div><div className="tch-stat__value" style={{color:s.color}}>{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className="exam-grid">
        {EXAMS.map(e => (
          <div key={e.id} className="exam-card">
            <div className="exam-card__top">
              <span style={{fontSize:30}}>{e.icon}</span>
              <span className={`tch-badge ${e.status==="upcoming"?"tch-badge--sky":"tch-badge--green"}`}>{e.status==="upcoming"?"پیش رو":"برگزار شد"}</span>
            </div>
            <div className="exam-card__name">{e.name}</div>
            <div className="exam-card__class">{e.class}</div>
            <div className="exam-card__info">
              <div className="exam-card__info-item">📅 {e.date}</div>
              <div className="exam-card__info-item">⏱ {e.duration} دقیقه</div>
              <div className="exam-card__info-item">❓ {e.qCount} سوال</div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="tch-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="tch-modal tch-modal--wide" onClick={e=>e.stopPropagation()}>
            <div className="tch-modal__header">
              <span className="tch-modal__title">📝 ایجاد آزمون جدید</span>
              <button className="tch-modal__close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="tch-modal__body">
              <div className="tch-form-row">
                <div><label className="tch-form-label">نام آزمون *</label><input className="tch-input" placeholder="مثلاً: آزمون میان‌ترم فیزیک" /></div>
                <div><label className="tch-form-label">کلاس *</label><select className="tch-select" style={{width:"100%"}}>{CLASSES.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
              </div>
              <div className="tch-form-row-3">
                <div><label className="tch-form-label">تاریخ برگزاری</label><input className="tch-input" type="date" /></div>
                <div><label className="tch-form-label">ساعت شروع</label><input className="tch-input" type="time" /></div>
                <div><label className="tch-form-label">مدت زمان (دقیقه)</label><input className="tch-input" type="number" placeholder="۹۰" /></div>
              </div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">تعداد سوال</label><input className="tch-input" type="number" placeholder="۲۵" /></div>
                <div><label className="tch-form-label">نحوه نمایش سوالات</label><select className="tch-select" style={{width:"100%"}}><option>ترتیبی</option><option>تصادفی</option></select></div>
              </div>
              <div className="tch-form-full"><label className="tch-form-label">توضیحات آزمون</label><textarea className="tch-textarea" rows={3} placeholder="دستورالعمل‌ها و توضیحات..." /></div>
              <div className="tch-form-row">
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 0"}}>
                  <input type="checkbox" id="antiCheat" />
                  <label htmlFor="antiCheat" className="tch-form-label" style={{margin:0}}>فعال‌سازی ضد تقلب</label>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 0"}}>
                  <input type="checkbox" id="randomQ" />
                  <label htmlFor="randomQ" className="tch-form-label" style={{margin:0}}>ترتیب تصادفی گزینه‌ها</label>
                </div>
              </div>
            </div>
            <div className="tch-modal__footer">
              <button className="tch-btn tch-btn--ghost" onClick={()=>setModal(false)}>انصراف</button>
              <button className="tch-btn tch-btn--accent" onClick={()=>setModal(false)}>انتخاب سوالات ←</button>
              <button className="tch-btn tch-btn--primary" onClick={()=>setModal(false)}>✓ ذخیره آزمون</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
