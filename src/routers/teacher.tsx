import { useState, ReactNode } from "react";
import "./teacher.css";

// ─── Types ───────────────────────────────────────────────────────────────────
type Section = "classes" | "questions" | "exams" | "students" | "buy-plan" | "my-plan" | "transactions" | "profile" | "messages";
type MailFolder = "inbox" | "sent" | "drafts" | "trash";
type ProfileTab = "personal" | "contact" | "security";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const CLASSES = [
  { id:"c1", name:"ریاضی پایه دهم",  subject:"ریاضی",   grade:"دهم",  students:28, color:"#0D9488", bg:"var(--primary-lt)", icon:"📐", exams:5,  nextExam:"۱۴۰۳/۰۴/۱۵" },
  { id:"c2", name:"فیزیک یازدهم",    subject:"فیزیک",   grade:"یازدهم", students:22, color:"#0EA5E9", bg:"var(--sky-lt)",    icon:"⚡", exams:3,  nextExam:"۱۴۰۳/۰۴/۱۸" },
  { id:"c3", name:"شیمی دوازدهم",    subject:"شیمی",    grade:"دوازدهم", students:30, color:"#7C3AED", bg:"var(--violet-lt)", icon:"🧪", exams:7,  nextExam:"۱۴۰۳/۰۴/۲۰" },
  { id:"c4", name:"حساب و آمار",     subject:"ریاضی",   grade:"یازدهم", students:18, color:"#F97316", bg:"var(--accent-lt)", icon:"📊", exams:4,  nextExam:"ندارد" },
];

const QUESTIONS = [
  { id:"q1", text:"کدام گزینه مفهوم لیمیت را به درستی بیان می‌کند؟", type:"multiple", options:["مقدار تابع در نقطه","مقدار تابع در نزدیکی نقطه","شیب خط مماس","مشتق در نقطه"], correct:1, cat:"حساب", diff:"hard", used:12 },
  { id:"q2", text:"معادله خط عبوری از دو نقطه (۱,۲) و (۳,۶) چیست؟", type:"multiple", options:["y=2x","y=2x+1","y=x+1","y=3x-1"], correct:0, cat:"ریاضی", diff:"easy", used:24 },
  { id:"q3", text:"آیا مشتق توابع ثابت برابر صفر است؟", type:"truefalse", options:["درست","نادرست"], correct:0, cat:"حساب", diff:"easy", used:31 },
  { id:"q4", text:"چه نوع تابعی f(x)=x² را یک به یک نمی‌سازد؟", type:"multiple", options:["تابع زوج","تابع فرد","تابع پیوسته","تابع خطی"], correct:0, cat:"ریاضی", diff:"medium", used:8 },
];

const EXAMS = [
  { id:"e1", name:"آزمون میان‌ترم ریاضی", class:"ریاضی پایه دهم", date:"۱۴۰۳/۰۴/۱۵", time:"۰۹:۰۰", duration:90, qCount:25, status:"upcoming", icon:"📝" },
  { id:"e2", name:"آزمون فصل موج",         class:"فیزیک یازدهم",   date:"۱۴۰۳/۰۴/۱۸", time:"۱۰:۳۰", duration:60, qCount:20, status:"upcoming", icon:"📡" },
  { id:"e3", name:"آزمون ترکیبات آلی",     class:"شیمی دوازدهم",   date:"۱۴۰۳/۰۳/۲۵", time:"۰۸:۰۰", duration:120,qCount:40, status:"done",     icon:"🧪" },
  { id:"e4", name:"آزمون تشریحی آمار",     class:"حساب و آمار",    date:"۱۴۰۳/۰۳/۱۸", time:"۱۱:۰۰", duration:90, qCount:15, status:"done",     icon:"📊" },
];

const STUDENTS = [
  { id:"s1", name:"علی محمدی",    email:"ali@stu.ir",    class:"ریاضی پایه دهم",  avg:17.5, rank:2,  status:"active", bg:"linear-gradient(135deg,#0D9488,#0EA5E9)",   scores:[{exam:"میان‌ترم ریاضی",score:18,total:20,date:"۱۴۰۳/۰۳/۲۵"},{exam:"آزمون آمار",score:17,total:20,date:"۱۴۰۳/۰۳/۱۸"}] },
  { id:"s2", name:"فاطمه رضایی", email:"f.rezaei@stu.ir", class:"فیزیک یازدهم",   avg:15.8, rank:5,  status:"active", bg:"linear-gradient(135deg,#7C3AED,#0EA5E9)",   scores:[{exam:"آزمون موج",score:16,total:20,date:"۱۴۰۳/۰۴/۰۱"},{exam:"آزمون آمار",score:15,total:20,date:"۱۴۰۳/۰۳/۱۸"}] },
  { id:"s3", name:"محمد حسینی",  email:"m.h@stu.ir",    class:"شیمی دوازدهم",   avg:19.1, rank:1,  status:"active", bg:"linear-gradient(135deg,#059669,#0D9488)",   scores:[{exam:"ترکیبات آلی",score:19,total:20,date:"۱۴۰۳/۰۳/۲۵"},{exam:"آزمون آمار",score:20,total:20,date:"۱۴۰۳/۰۳/۱۸"}] },
  { id:"s4", name:"نرگس کریمی",  email:"narges@stu.ir", class:"ریاضی پایه دهم",  avg:12.3, rank:15, status:"inactive",bg:"linear-gradient(135deg,#F97316,#F43F5E)",  scores:[{exam:"میان‌ترم ریاضی",score:12,total:20,date:"۱۴۰۳/۰۳/۲۵"}] },
  { id:"s5", name:"رضا موسوی",   email:"reza@stu.ir",   class:"حساب و آمار",    avg:16.2, rank:7,  status:"active", bg:"linear-gradient(135deg,#FCD34D,#F97316)",   scores:[{exam:"آزمون آمار",score:16,total:20,date:"۱۴۰۳/۰۳/۱۸"},{exam:"میان‌ترم ریاضی",score:17,total:20,date:"۱۴۰۳/۰۳/۲۵"}] },
];

const TRANSACTIONS = [
  { id:"t1", plan:"حرفه‌ای", amount:1200, billing:"سالانه",  status:"paid",    date:"۱۴۰۳/۰۱/۰۱", method:"ملی" },
  { id:"t2", plan:"پایه",    amount:500,  billing:"ماهانه", status:"paid",    date:"۱۴۰۲/۱۲/۰۱", method:"سامان" },
  { id:"t3", plan:"پایه",    amount:500,  billing:"ماهانه", status:"paid",    date:"۱۴۰۲/۱۱/۰۱", method:"سامان" },
  { id:"t4", plan:"حرفه‌ای", amount:1500, billing:"ماهانه", status:"failed",  date:"۱۴۰۲/۱۰/۲۸", method:"ملت" },
];

const MAILS = [
  { id:"m1", from:"علی محمدی",   fromEmail:"ali@stu.ir",     subject:"سوال درباره آزمون",       preview:"استاد درباره فرمول‌های فصل سوم...",      body:"استاد عزیز،\n\nدرباره فرمول‌های فصل سوم کتاب، آیا باید همه موارد را حفظ کنیم یا فقط موارد اصلی کافی است؟\n\nممنون", date:"۱۴۰۳/۰۴/۰۲", unread:true,  folder:"inbox" as MailFolder },
  { id:"m2", from:"فاطمه رضایی", fromEmail:"f.rezaei@stu.ir", subject:"درخواست تمدید آزمون",    preview:"به دلیل بیماری نتوانستم...",               body:"استاد محترم،\n\nبه دلیل بیماری نتوانستم در آزمون شرکت کنم. آیا امکان برگزاری آزمون جبرانی وجود دارد؟\n\nبا تشکر", date:"۱۴۰۳/۰۴/۰۱", unread:true,  folder:"inbox" as MailFolder },
  { id:"m3", from:"support@azmon.ir", fromEmail:"support@azmon.ir", subject:"تیکت شماره ۱۲۳۴",   preview:"تیکت شما بررسی شد...",                    body:"استاد عزیز،\n\nتیکت پشتیبانی شما بررسی و مشکل برطرف شد. لطفاً مجدداً تلاش کنید.", date:"۱۴۰۳/۰۳/۲۸", unread:false, folder:"inbox" as MailFolder },
  { id:"m4", from:"من",            fromEmail:"teacher@azmon.ir", subject:"نتایج آزمون میان‌ترم", preview:"دانش‌آموزان عزیز، نتایج منتشر شد...",     body:"دانش‌آموزان عزیز،\n\nنتایج آزمون میان‌ترم ریاضی منتشر شد. به پنل خود مراجعه کنید.\n\nموفق باشید", date:"۱۴۰۳/۰۳/۲۶", unread:false, folder:"sent" as MailFolder },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const scoreColor = (s: number, t: number) => {
  const p = s / t;
  if (p >= 0.85) return { bg: "var(--green-lt)", color: "var(--green)" };
  if (p >= 0.60) return { bg: "#FEF3C7",         color: "#92400E" };
  return                 { bg: "var(--rose-lt)",  color: "var(--rose)" };
};

const diffBadge = (d: string) => {
  if (d === "easy")   return "tch-badge--green";
  if (d === "medium") return "tch-badge--amber";
  return "tch-badge--rose";
};

const diffLabel = (d: string) => d === "easy" ? "آسان" : d === "medium" ? "متوسط" : "سخت";

// ════════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// ── 1. Classes ────────────────────────────────────────────────────────────────
const ClassesSection: React.FC = () => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <div className="tch-sec-header">
        <div className="tch-sec-header__left">
          <div className="tch-sec-title">کلاس‌های من</div>
          <div className="tch-sec-sub">{CLASSES.length} کلاس فعال</div>
        </div>
        <button className="tch-btn tch-btn--primary" onClick={() => setModal(true)}>+ ایجاد کلاس جدید</button>
      </div>

      <div className="tch-stats">
        {[
          { icon:"🏫", label:"کل کلاس‌ها",    value:`${CLASSES.length}`,                                    note:"فعال",           bg:"var(--primary-lt)", color:"var(--primary)" },
          { icon:"👥", label:"کل دانش‌آموزان", value:`${CLASSES.reduce((s,c)=>s+c.students,0)}`,             note:"در همه کلاس‌ها",  bg:"var(--sky-lt)",     color:"var(--sky)" },
          { icon:"📝", label:"کل آزمون‌ها",    value:`${CLASSES.reduce((s,c)=>s+c.exams,0)}`,               note:"تا الان",         bg:"var(--violet-lt)",  color:"var(--violet)" },
          { icon:"📅", label:"آزمون آینده",    value:"۱۴۰۳/۰۴/۱۵",                                          note:"ریاضی دهم",       bg:"var(--accent-lt)",  color:"var(--accent)" },
        ].map(s => (
          <div key={s.label} className="tch-stat">
            <div className="tch-stat__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="tch-stat__label">{s.label}</div>
              <div className="tch-stat__value" style={{ color: s.color }}>{s.value}</div>
              <div className="tch-stat__change tch-stat__up">{s.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="class-grid">
        {CLASSES.map(c => (
          <div key={c.id} className="class-card">
            <div className="class-card__stripe" style={{ background: c.color }} />
            <div className="class-card__head">
              <div className="class-card__icon" style={{ background: c.bg }}>{c.icon}</div>
              <span className="tch-badge tch-badge--gray">{c.grade}</span>
            </div>
            <div className="class-card__name">{c.name}</div>
            <div className="class-card__meta">{c.subject} • آزمون بعدی: {c.nextExam}</div>
            <div className="class-card__footer">
              <span className="class-card__stu">👥 {c.students} دانش‌آموز</span>
              <div style={{ display:"flex", gap:6 }}>
                <button className="tch-btn tch-btn--ghost tch-btn--sm">مشاهده</button>
                <button className="tch-btn tch-btn--primary tch-btn--sm">آزمون</button>
              </div>
            </div>
          </div>
        ))}
        <div className="class-card--new" onClick={() => setModal(true)}>
          <div className="class-card--new__icon">➕</div>
          <div className="class-card--new__label">کلاس جدید</div>
        </div>
      </div>

      {modal && (
        <div className="tch-modal-backdrop" onClick={() => setModal(false)}>
          <div className="tch-modal" onClick={e => e.stopPropagation()}>
            <div className="tch-modal__header">
              <span className="tch-modal__title">🏫 ایجاد کلاس جدید</span>
              <button className="tch-modal__close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="tch-modal__body">
              <div className="tch-form-row">
                <div><label className="tch-form-label">نام کلاس *</label><input className="tch-input" placeholder="مثلاً: ریاضی پایه دهم" /></div>
                <div><label className="tch-form-label">درس *</label><input className="tch-input" placeholder="مثلاً: ریاضی" /></div>
              </div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">پایه تحصیلی</label><select className="tch-select" style={{width:"100%"}}><option>دهم</option><option>یازدهم</option><option>دوازدهم</option><option>سایر</option></select></div>
                <div><label className="tch-form-label">ظرفیت (نفر)</label><input className="tch-input" type="number" placeholder="۳۰" /></div>
              </div>
              <div className="tch-form-full"><label className="tch-form-label">توضیحات</label><textarea className="tch-textarea" rows={3} placeholder="توضیحات کلاس..." /></div>
            </div>
            <div className="tch-modal__footer">
              <button className="tch-btn tch-btn--ghost" onClick={() => setModal(false)}>انصراف</button>
              <button className="tch-btn tch-btn--primary" onClick={() => setModal(false)}>✓ ایجاد کلاس</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── 2. Questions ──────────────────────────────────────────────────────────────
const QuestionsSection: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [editQ, setEditQ] = useState<typeof QUESTIONS[0] | null>(null);
  const [search, setSearch] = useState("");
  const LETTERS = ["الف","ب","پ","ت"];

  const open = (q: typeof QUESTIONS[0] | null) => { setEditQ(q); setModal(true); };
  const filtered = QUESTIONS.filter(q => q.text.includes(search) || q.cat.includes(search));

  return (
    <>
      <div className="tch-sec-header">
        <div className="tch-sec-header__left">
          <div className="tch-sec-title">بانک سوالات</div>
          <div className="tch-sec-sub">{QUESTIONS.length} سوال ذخیره شده</div>
        </div>
        <div className="tch-sec-header__right">
          <input className="tch-input" style={{width:200}} placeholder="🔍 جستجو..." value={search} onChange={e=>setSearch(e.target.value)} />
          <button className="tch-btn tch-btn--primary" onClick={() => open(null)}>+ سوال جدید</button>
        </div>
      </div>

      <div className="tch-stats">
        {[
          { icon:"❓", label:"کل سوالات", value:`${QUESTIONS.length}`, bg:"var(--violet-lt)", color:"var(--violet)" },
          { icon:"📋", label:"تستی",      value:`${QUESTIONS.filter(q=>q.type==="multiple").length}`, bg:"var(--sky-lt)", color:"var(--sky)" },
          { icon:"✅", label:"درست/نادرست",value:`${QUESTIONS.filter(q=>q.type==="truefalse").length}`,bg:"var(--green-lt)",color:"var(--green)" },
          { icon:"🎯", label:"بار استفاده",value:`${QUESTIONS.reduce((s,q)=>s+q.used,0)}`, bg:"var(--accent-lt)", color:"var(--accent)" },
        ].map(s=>(
          <div key={s.label} className="tch-stat">
            <div className="tch-stat__icon" style={{background:s.bg}}>{s.icon}</div>
            <div><div className="tch-stat__label">{s.label}</div><div className="tch-stat__value" style={{color:s.color}}>{s.value}</div></div>
          </div>
        ))}
      </div>

      {filtered.map(q => (
        <div key={q.id} className="q-card" onClick={() => open(q)}>
          <div className="q-card__top">
            <div className="q-card__text">{q.text}</div>
            <div className="q-card__meta">
              <span className={`tch-badge ${diffBadge(q.diff)}`}>{diffLabel(q.diff)}</span>
              <span className="tch-badge tch-badge--sky">{q.cat}</span>
              <span className="tch-badge tch-badge--gray">× {q.used}</span>
            </div>
          </div>
          {q.options.length > 0 && (
            <div className="q-card__opts">
              {q.options.map((opt,i) => (
                <div key={i} className={`q-card__opt ${i===q.correct?"q-card__opt--ok":""}`}>
                  <span className="q-card__opt-ltr">{q.type==="truefalse"?(i===0?"✓":"×"):LETTERS[i]}</span>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {modal && (
        <div className="tch-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="tch-modal" onClick={e=>e.stopPropagation()}>
            <div className="tch-modal__header">
              <span className="tch-modal__title">{editQ?"ویرایش سوال":"سوال جدید"}</span>
              <button className="tch-modal__close" onClick={()=>setModal(false)}>×</button>
            </div>
            <div className="tch-modal__body">
              <div className="tch-form-full"><label className="tch-form-label">متن سوال *</label><textarea className="tch-textarea" rows={3} defaultValue={editQ?.text} placeholder="متن سوال را بنویسید..." /></div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">نوع سوال</label><select className="tch-select" style={{width:"100%"}} defaultValue={editQ?.type}><option value="multiple">چهار گزینه‌ای</option><option value="truefalse">درست/نادرست</option><option value="short">کوتاه‌پاسخ</option></select></div>
                <div><label className="tch-form-label">دشواری</label><select className="tch-select" style={{width:"100%"}} defaultValue={editQ?.diff}><option value="easy">آسان</option><option value="medium">متوسط</option><option value="hard">سخت</option></select></div>
              </div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">دسته‌بندی</label><input className="tch-input" defaultValue={editQ?.cat} placeholder="مثلاً: ریاضی، فیزیک..." /></div>
                <div><label className="tch-form-label">کلاس مرتبط</label><select className="tch-select" style={{width:"100%"}}><option>ریاضی پایه دهم</option><option>فیزیک یازدهم</option><option>شیمی دوازدهم</option></select></div>
              </div>
              <div>
                <label className="tch-form-label">گزینه‌ها (گزینه صحیح را علامت بزنید)</label>
                {LETTERS.map((l,i) => (
                  <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <input type="radio" name="correct" defaultChecked={editQ?.correct===i} />
                    <span style={{color:"var(--adm-sub)",fontSize:12,fontWeight:700,minWidth:20}}>{l}</span>
                    <input className="tch-input" defaultValue={editQ?.options[i]} placeholder={`گزینه ${l}...`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="tch-modal__footer">
              <button className="tch-btn tch-btn--ghost" onClick={()=>setModal(false)}>انصراف</button>
              <button className="tch-btn tch-btn--primary" onClick={()=>setModal(false)}>💾 ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── 3. Exams ──────────────────────────────────────────────────────────────────
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

// ── 4. Students ───────────────────────────────────────────────────────────────
const StudentsSection: React.FC = () => {
  const [drawer, setDrawer] = useState<typeof STUDENTS[0] | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = STUDENTS.filter(s => s.name.includes(search) || s.class.includes(search));

  return (
    <>
      <div className="tch-sec-header">
        <div className="tch-sec-header__left">
          <div className="tch-sec-title">دانش‌آموزان</div>
          <div className="tch-sec-sub">{STUDENTS.length} دانش‌آموز</div>
        </div>
        <div className="tch-sec-header__right">
          <input className="tch-input" style={{width:200}} placeholder="🔍 جستجو..." value={search} onChange={e=>setSearch(e.target.value)} />
          <button className="tch-btn tch-btn--primary" onClick={()=>setAddModal(true)}>+ افزودن دانش‌آموز</button>
        </div>
      </div>

      <div className="tch-card">
        <div className="tch-table-wrap">
          <table className="tch-table">
            <thead>
              <tr>
                <th>دانش‌آموز</th><th>کلاس</th><th>میانگین</th><th>رتبه</th><th>وضعیت</th><th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const sc = scoreColor(s.avg, 20);
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="tch-table__avatar" style={{background:s.bg}}>{s.name[0]}</div>
                        <div>
                          <div className="tch-table__name">{s.name}</div>
                          <div className="tch-table__sub">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="tch-badge tch-badge--gray">{s.class}</span></td>
                    <td>
                      <div className="score-bar-wrap">
                        <div className="score-bar"><div className="score-bar__fill" style={{width:`${(s.avg/20)*100}%`,background:sc.color}} /></div>
                        <span className="score-val" style={{color:sc.color}}>{s.avg}</span>
                      </div>
                    </td>
                    <td style={{color:"var(--adm-sub)",fontWeight:700}}>#{s.rank}</td>
                    <td><span className={`tch-badge ${s.status==="active"?"tch-badge--green":"tch-badge--gray"}`}>{s.status==="active"?"فعال":"غیرفعال"}</span></td>
                    <td>
                      <div className="tch-table__acts">
                        <button className="tch-btn tch-btn--ghost tch-btn--sm" onClick={()=>setDrawer(s)}>نمرات</button>
                        <button className="tch-btn tch-btn--danger tch-btn--sm">حذف</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="tch-pagination">
          <span className="tch-pagination__info">نمایش ۱ تا {filtered.length}</span>
          <div className="tch-pagination__btns">
            {["«","۱","۲","»"].map(p=><button key={p} className={`tch-page-btn ${p==="۱"?"tch-page-btn--active":""}`}>{p}</button>)}
          </div>
        </div>
      </div>

      {/* Student drawer */}
      {drawer && (
        <>
          <div className="stu-drawer-backdrop" onClick={()=>setDrawer(null)} />
          <div className="stu-drawer">
            <div className="stu-drawer__header">
              <span className="stu-drawer__title">مشخصات دانش‌آموز</span>
              <button className="stu-drawer__close" onClick={()=>setDrawer(null)}>×</button>
            </div>
            <div className="stu-drawer__body">
              <div className="stu-drawer__hero">
                <div className="stu-drawer__avatar" style={{background:drawer.bg}}>{drawer.name[0]}</div>
                <div>
                  <div className="stu-drawer__name">{drawer.name}</div>
                  <div className="stu-drawer__email">{drawer.email}</div>
                  <div className="stu-drawer__cls">{drawer.class}</div>
                </div>
              </div>
              <div className="stu-drawer__grid">
                {[
                  ["میانگین نمرات", `${drawer.avg} از ۲۰`],
                  ["رتبه کلاسی",   `#${drawer.rank}`],
                  ["تعداد آزمون",  `${drawer.scores.length} آزمون`],
                  ["وضعیت",        drawer.status==="active"?"فعال":"غیرفعال"],
                ].map(([l,v])=>(
                  <div key={l} className="stu-drawer__info">
                    <div className="stu-drawer__info-label">{l}</div>
                    <div className="stu-drawer__info-val">{v}</div>
                  </div>
                ))}
              </div>
              <div className="stu-drawer__scores-title">📊 سابقه نمرات</div>
              {drawer.scores.map((sc,i)=>{
                const c = scoreColor(sc.score, sc.total);
                return (
                  <div key={i} className="stu-score-row">
                    <div>
                      <div className="stu-score-row__exam">{sc.exam}</div>
                      <div className="stu-score-row__date">{sc.date}</div>
                    </div>
                    <div className="stu-score-row__right">
                      <div className="score-bar" style={{width:80}}><div className="score-bar__fill" style={{width:`${(sc.score/sc.total)*100}%`,background:c.color}} /></div>
                      <span className="stu-score-chip" style={{background:c.bg,color:c.color}}>{sc.score}/{sc.total}</span>
                    </div>
                  </div>
                );
              })}
              <div style={{display:"flex",gap:8,marginTop:16}}>
                <button className="tch-btn tch-btn--primary" style={{flex:1}}>ارسال ایمیل</button>
                <button className="tch-btn tch-btn--ghost" style={{flex:1}}>گزارش کامل</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add student modal */}
      {addModal && (
        <div className="tch-modal-backdrop" onClick={()=>setAddModal(false)}>
          <div className="tch-modal" onClick={e=>e.stopPropagation()}>
            <div className="tch-modal__header">
              <span className="tch-modal__title">👤 افزودن دانش‌آموز</span>
              <button className="tch-modal__close" onClick={()=>setAddModal(false)}>×</button>
            </div>
            <div className="tch-modal__body">
              <div className="tch-form-row">
                <div><label className="tch-form-label">نام *</label><input className="tch-input" placeholder="نام" /></div>
                <div><label className="tch-form-label">نام خانوادگی *</label><input className="tch-input" placeholder="نام خانوادگی" /></div>
              </div>
              <div className="tch-form-full"><label className="tch-form-label">ایمیل *</label><input className="tch-input" type="email" placeholder="student@example.com" /></div>
              <div className="tch-form-full"><label className="tch-form-label">انتخاب کلاس</label><select className="tch-select" style={{width:"100%"}}>{CLASSES.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
            </div>
            <div className="tch-modal__footer">
              <button className="tch-btn tch-btn--ghost" onClick={()=>setAddModal(false)}>انصراف</button>
              <button className="tch-btn tch-btn--primary" onClick={()=>setAddModal(false)}>✓ افزودن</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── 5. Buy Plan ───────────────────────────────────────────────────────────────
const BuyPlanSection: React.FC = () => (
  <>
    <div className="tch-sec-header">
      <div className="tch-sec-header__left">
        <div className="tch-sec-title">خرید پلن</div>
        <div className="tch-sec-sub">پلن مناسب خود را انتخاب کنید</div>
      </div>
    </div>
    <div className="buy-plans-grid">
      {[
        { name:"پایه", en:"Basic", price:500, hl:false, feats:["تا ۱۰۰ دانش‌آموز","۱۰ آزمون در ماه","بانک ۵۰۰ سوال","پشتیبانی ایمیل"], hot:null },
        { name:"حرفه‌ای", en:"Pro", price:1500, hl:true, feats:["تا ۵۰۰ دانش‌آموز","آزمون نامحدود","بانک نامحدود","ضد تقلب پیشرفته","پشتیبانی ۲۴/۷"], hot:"محبوب‌ترین" },
        { name:"سازمانی", en:"Enterprise", price:null, hl:false, feats:["دانش‌آموز نامحدود","سرور اختصاصی","مدیر اختصاصی","SLA 99.9٪","آموزش تیم"], hot:null },
      ].map(p => (
        <div key={p.en} className={`buy-plan-card ${p.hl?"buy-plan-card--hl":""}`}>
          {p.hot && <div className="buy-plan-card__hot">{p.hot}</div>}
          <div className={`buy-plan-card__en ${p.hl?"buy-plan-card__en--w":"buy-plan-card__en--d"}`}>{p.en}</div>
          <div className={`buy-plan-card__name ${p.hl?"buy-plan-card__name--w":"buy-plan-card__name--d"}`}>{p.name}</div>
          <div className="buy-plan-card__price">
            {p.price ? <>
              <span className={`buy-plan-card__amount ${p.hl?"buy-plan-card__amount--w":"buy-plan-card__amount--d"}`}>{p.price.toLocaleString("fa-IR")}</span>
              <span className={`buy-plan-card__unit ${p.hl?"buy-plan-card__unit--w":"buy-plan-card__unit--d"}`}>هزار/ماه</span>
            </> : <span className="buy-plan-card__amount buy-plan-card__amount--d" style={{fontSize:22}}>تماس بگیرید</span>}
          </div>
          <ul className="buy-plan-card__feats">
            {p.feats.map(f=>(
              <li key={f} className={`buy-plan-card__feat ${p.hl?"buy-plan-card__feat--w":"buy-plan-card__feat--d"}`}>
                <span className={`buy-plan-card__dot ${p.hl?"buy-plan-card__dot--w":"buy-plan-card__dot--d"}`}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button className={`buy-plan-card__cta ${p.hl?"buy-plan-card__cta--w":"buy-plan-card__cta--d"}`}>
            {p.price ? "انتخاب این پلن" : "تماس بگیرید"}
          </button>
        </div>
      ))}
    </div>
  </>
);

// ── 6. My Plan ────────────────────────────────────────────────────────────────
const MyPlanSection: React.FC = () => (
  <>
    <div className="tch-sec-header">
      <div className="tch-sec-header__left">
        <div className="tch-sec-title">پلن من</div>
        <div className="tch-sec-sub">وضعیت اشتراک و مصرف</div>
      </div>
      <button className="tch-btn tch-btn--accent">ارتقاء پلن ↑</button>
    </div>

    <div className="plan-hero-card">
      <div>
        <div className="plan-hero-card__label">پلن فعال شما</div>
        <div className="plan-hero-card__name">حرفه‌ای</div>
        <div className="plan-hero-card__sub">تا ۱۴۰۳/۱۲/۲۹ فعال است — پرداخت سالانه</div>
      </div>
      <div className="plan-hero-card__right">
        {[
          { val:7,  total:10, label:"آزمون باقیمانده" },
          { val:380,total:500,label:"دانش‌آموز باقیمانده" },
          { val:5,  total:12, label:"ماه باقیمانده" },
        ].map(q=>(
          <div key={q.label} className="plan-quota">
            <div className="plan-quota__val">{q.val}</div>
            <div className="plan-quota__label">{q.label}</div>
            <div className="plan-quota__bar">
              <div className="plan-quota__fill" style={{width:`${(q.val/q.total)*100}%`}} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="plan-usage-grid">
      {[
        { icon:"📝", label:"آزمون‌های برگزار شده",  used:3,  total:10,  color:"var(--primary)" },
        { icon:"👥", label:"دانش‌آموزان ثبت‌شده",   used:98, total:500, color:"var(--sky)" },
        { icon:"❓", label:"سوالات ذخیره شده",       used:4,  total:null,color:"var(--violet)" },
        { icon:"💾", label:"فضای ذخیره‌سازی (MB)",   used:234,total:2048,color:"var(--accent)" },
        { icon:"📊", label:"گزارش‌های دانلود شده",   used:12, total:null,color:"var(--green)" },
        { icon:"📧", label:"ایمیل‌های ارسال شده",    used:45, total:200, color:"var(--rose)" },
      ].map(u=>(
        <div key={u.label} className="plan-usage-card">
          <div className="plan-usage-card__icon">{u.icon}</div>
          <div className="plan-usage-card__label">{u.label}</div>
          <div className="plan-usage-card__nums">
            <span className="plan-usage-card__used" style={{color:u.color}}>{u.used.toLocaleString("fa-IR")}</span>
            {u.total && <span className="plan-usage-card__total">/ {u.total.toLocaleString("fa-IR")}</span>}
          </div>
          {u.total && <div className="plan-usage-bar"><div className="plan-usage-fill" style={{width:`${(u.used/u.total)*100}%`,background:u.color}} /></div>}
        </div>
      ))}
    </div>
  </>
);

// ── 7. Transactions ───────────────────────────────────────────────────────────
const TransactionsSection: React.FC = () => {
  const statusMap: Record<string, [string,string]> = {
    paid:    ["tch-badge--green", "پرداخت شده"],
    failed:  ["tch-badge--rose",  "ناموفق"],
    pending: ["tch-badge--amber", "در انتظار"],
  };
  return (
    <>
      <div className="tch-sec-header">
        <div className="tch-sec-header__left">
          <div className="tch-sec-title">تراکنش‌ها</div>
          <div className="tch-sec-sub">سابقه پرداخت‌های شما</div>
        </div>
        <button className="tch-btn tch-btn--ghost">⬇ دانلود Excel</button>
      </div>

      <div className="tch-stats">
        {[
          { icon:"💰", label:"مجموع پرداختی",  value:`${TRANSACTIONS.filter(t=>t.status==="paid").reduce((s,t)=>s+t.amount,0).toLocaleString("fa-IR")} هزار`, bg:"var(--green-lt)", color:"var(--green)" },
          { icon:"📑", label:"تراکنش موفق",    value:`${TRANSACTIONS.filter(t=>t.status==="paid").length}`,   bg:"var(--primary-lt)", color:"var(--primary)" },
          { icon:"❌", label:"تراکنش ناموفق",  value:`${TRANSACTIONS.filter(t=>t.status==="failed").length}`, bg:"var(--rose-lt)",    color:"var(--rose)" },
          { icon:"📅", label:"پرداخت بعدی",    value:"۱۴۰۴/۰۱/۰۱",                                          bg:"var(--sky-lt)",    color:"var(--sky)" },
        ].map(s=>(
          <div key={s.label} className="tch-stat">
            <div className="tch-stat__icon" style={{background:s.bg}}>{s.icon}</div>
            <div><div className="tch-stat__label">{s.label}</div><div className="tch-stat__value" style={{color:s.color}}>{s.value}</div></div>
          </div>
        ))}
      </div>

      <div className="tch-card">
        <div className="tch-table-wrap">
          <table className="tch-table">
            <thead><tr><th>پلن</th><th>دوره</th><th>مبلغ</th><th>روش پرداخت</th><th>وضعیت</th><th>تاریخ</th><th>فاکتور</th></tr></thead>
            <tbody>
              {TRANSACTIONS.map(t=>{
                const [cls,label] = statusMap[t.status] ?? ["tch-badge--gray","نامشخص"];
                return (
                  <tr key={t.id}>
                    <td style={{fontWeight:700}}>{t.plan}</td>
                    <td><span className="tch-badge tch-badge--gray">{t.billing}</span></td>
                    <td style={{fontWeight:800,color:"var(--green)"}}>{t.amount.toLocaleString("fa-IR")} هزار</td>
                    <td style={{color:"var(--adm-sub)"}}>{t.method}</td>
                    <td><span className={`tch-badge ${cls}`}>{label}</span></td>
                    <td style={{color:"var(--adm-sub)",fontSize:12}}>{t.date}</td>
                    <td><button className="tch-btn tch-btn--ghost tch-btn--sm">دانلود</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// ── 8. Profile ────────────────────────────────────────────────────────────────
const ProfileSection: React.FC = () => {
  const [tab, setTab] = useState<ProfileTab>("personal");
  const [saved, setSaved] = useState(false);
  const completion = 72;

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <>
      <div className="tch-sec-header">
        <div className="tch-sec-header__left">
          <div className="tch-sec-title">پروفایل من</div>
          <div className="tch-sec-sub">مشخصات و اطلاعات حساب کاربری</div>
        </div>
      </div>

      <div className="profile-layout">
        {/* Side */}
        <div className="profile-side">
          <div className="profile-side__hero">
            <div className="profile-avatar">👨‍🏫</div>
            <div className="profile-side__name">دکتر محمد رضایی</div>
            <div className="profile-side__role">استاد ریاضی و فیزیک</div>
          </div>
          <div className="profile-complete">
            <div className="profile-complete__labels">
              <span>تکمیل پروفایل</span>
              <span style={{color:"var(--primary)",fontWeight:800}}>{completion}٪</span>
            </div>
            <div className="profile-complete__track">
              <div className="profile-complete__fill" style={{width:`${completion}%`}} />
            </div>
          </div>
          <div className="profile-side__links">
            {([
              ["personal","اطلاعات شخصی","👤"],
              ["contact","اطلاعات تماس","📞"],
              ["security","امنیت","🔒"],
            ] as [ProfileTab,string,string][]).map(([key,label,icon])=>(
              <button key={key} className={`profile-link ${tab===key?"profile-link--active":""}`} onClick={()=>setTab(key)}>
                <span className="profile-link__icon">{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="profile-form">
          <div className="profile-form__header">
            <div>
              <div className="profile-form__title">
                {tab==="personal"?"اطلاعات شخصی":tab==="contact"?"اطلاعات تماس":"امنیت حساب"}
              </div>
              <div className="profile-form__sub">لطفاً اطلاعات صحیح وارد کنید</div>
            </div>
          </div>
          <div className="profile-form__body">
            {tab === "personal" && <>
              <div className="profile-form__section-title">مشخصات هویتی</div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">نام *</label><input className="tch-input" defaultValue="محمد" /></div>
                <div><label className="tch-form-label">نام خانوادگی *</label><input className="tch-input" defaultValue="رضایی" /></div>
              </div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">کد ملی *</label><input className="tch-input" placeholder="۱۰-رقمی" maxLength={10} /></div>
                <div><label className="tch-form-label">تاریخ تولد</label><input className="tch-input" placeholder="۱۳۶۰/۰۵/۱۵" /></div>
              </div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">جنسیت</label><select className="tch-select" style={{width:"100%"}}><option>مرد</option><option>زن</option></select></div>
                <div><label className="tch-form-label">مدرک تحصیلی</label><select className="tch-select" style={{width:"100%"}}><option>کارشناسی</option><option>کارشناسی ارشد</option><option>دکتری</option></select></div>
              </div>
              <div className="tch-form-full"><label className="tch-form-label">رشته تخصصی</label><input className="tch-input" defaultValue="ریاضی کاربردی" /></div>
              <div className="tch-form-full"><label className="tch-form-label">درباره من</label><textarea className="tch-textarea" rows={3} placeholder="معرفی کوتاهی از خود بنویسید..." /></div>
            </>}

            {tab === "contact" && <>
              <div className="profile-form__section-title">اطلاعات تماس</div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">ایمیل *</label><input className="tch-input" defaultValue="m.rezaei@teacher.ir" /></div>
                <div><label className="tch-form-label">شماره موبایل *</label><input className="tch-input" placeholder="۰۹۱۲-XXX-XXXX" /></div>
              </div>
              <div className="tch-form-full"><label className="tch-form-label">تلفن ثابت</label><input className="tch-input" placeholder="۰۲۱-XXXXXXXX" /></div>
              <div className="profile-form__section-title" style={{marginTop:20}}>آدرس</div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">استان</label><select className="tch-select" style={{width:"100%"}}><option>تهران</option><option>اصفهان</option><option>مشهد</option><option>سایر</option></select></div>
                <div><label className="tch-form-label">شهر</label><input className="tch-input" placeholder="نام شهر" /></div>
              </div>
              <div className="tch-form-full"><label className="tch-form-label">آدرس کامل</label><textarea className="tch-textarea" rows={2} placeholder="خیابان، کوچه، پلاک، واحد..." /></div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">کد پستی</label><input className="tch-input" placeholder="XXXXXXXXXX" maxLength={10} /></div>
                <div><label className="tch-form-label">نام محل کار / آموزشگاه</label><input className="tch-input" placeholder="دبیرستان ..." /></div>
              </div>
            </>}

            {tab === "security" && <>
              <div className="profile-form__section-title">تغییر رمز عبور</div>
              <div className="tch-form-full"><label className="tch-form-label">رمز عبور فعلی</label><input className="tch-input" type="password" placeholder="••••••••" /></div>
              <div className="tch-form-row">
                <div><label className="tch-form-label">رمز جدید</label><input className="tch-input" type="password" placeholder="••••••••" /></div>
                <div><label className="tch-form-label">تکرار رمز جدید</label><input className="tch-input" type="password" placeholder="••••••••" /></div>
              </div>
              <div className="profile-form__section-title" style={{marginTop:20}}>احراز هویت دو مرحله‌ای</div>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:"1px solid var(--adm-border)"}}>
                <input type="checkbox" id="twofa" />
                <label htmlFor="twofa" style={{color:"var(--adm-text)",fontSize:14,fontWeight:600,cursor:"pointer"}}>فعال‌سازی احراز هویت دو مرحله‌ای از طریق SMS</label>
              </div>
            </>}
          </div>
          <div className="profile-form__footer">
            <button className="tch-btn tch-btn--ghost">انصراف</button>
            <button className="tch-btn tch-btn--primary" onClick={handleSave}>
              {saved ? "✓ ذخیره شد!" : "💾 ذخیره تغییرات"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Messages ──────────────────────────────────────────────────────────────────
const MessagesSection: React.FC = () => {
  const [folder, setFolder] = useState<MailFolder>("inbox");
  const [selected, setSelected] = useState<typeof MAILS[0] | null>(MAILS[0]);
  const [compose, setCompose] = useState(false);
  const [sending, setSending] = useState(false);

  const inboxCount = MAILS.filter(m=>m.folder==="inbox"&&m.unread).length;
  const folderMails = MAILS.filter(m=>m.folder===folder);

  const FOLDERS: {key:MailFolder;label:string;icon:string;count?:number}[] = [
    {key:"inbox", label:"صندوق ورودی", icon:"📥", count:inboxCount},
    {key:"sent",  label:"ارسال‌شده",   icon:"📤"},
    {key:"drafts",label:"پیش‌نویس",    icon:"📝"},
    {key:"trash", label:"حذف‌شده",     icon:"🗑"},
  ];

  const handleSend = () => { setSending(true); setTimeout(()=>{setSending(false);setCompose(false);},1200); };

  return (
    <>
      <div className="tch-sec-header">
        <div className="tch-sec-header__left">
          <div className="tch-sec-title">ایمیل‌ها</div>
          <div className="tch-sec-sub">{MAILS.length} پیام</div>
        </div>
        <button className="tch-btn tch-btn--primary" onClick={()=>setCompose(true)}>✉️ نوشتن ایمیل</button>
      </div>

      <div className="tch-mail-layout">
        {/* Mail sidebar */}
        <div className="tch-mail-side">
          <div className="tch-mail-side__top">
            <button className="tch-btn tch-btn--primary" style={{width:"100%"}} onClick={()=>setCompose(true)}>+ نوشتن</button>
          </div>
          <div className="tch-mail-side__nav">
            {FOLDERS.map(f=>(
              <button key={f.key} className={`tch-folder-btn ${folder===f.key?"tch-folder-btn--active":""}`} onClick={()=>setFolder(f.key)}>
                <span className="tch-folder-btn__icon">{f.icon}</span>
                {f.label}
                {f.count ? <span className="tch-folder-btn__count">{f.count}</span> : null}
              </button>
            ))}
          </div>
          <div className="tch-mail-list">
            {folderMails.length===0
              ? <div style={{padding:24,color:"var(--adm-light)",fontSize:13,textAlign:"center"}}>پیامی وجود ندارد</div>
              : folderMails.map(m=>(
                <div key={m.id} className={`tch-mail-item ${m.unread?"tch-mail-item--unread":""} ${selected?.id===m.id?"tch-mail-item--active":""}`} onClick={()=>setSelected(m)}>
                  <div className="tch-mail-item__from">{folder==="sent"?m.to:m.from}</div>
                  <div className="tch-mail-item__subject">{m.subject}</div>
                  <div className="tch-mail-item__preview">{m.preview}</div>
                  <div className="tch-mail-item__date">{m.date}</div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Mail detail */}
        {selected
          ? <div className="tch-mail-detail">
              <div className="tch-mail-detail__toolbar">
                <button className="tch-btn tch-btn--ghost tch-btn--sm">↩ پاسخ</button>
                <button className="tch-btn tch-btn--ghost tch-btn--sm">↪ فوروارد</button>
                <button className="tch-btn tch-btn--danger tch-btn--sm">🗑 حذف</button>
              </div>
              <div className="tch-mail-detail__header">
                <div className="tch-mail-detail__subject">{selected.subject}</div>
                <div className="tch-mail-detail__meta">
                  <div className="tch-mail-detail__from">از: <strong>{selected.from}</strong> &lt;{selected.fromEmail}&gt;</div>
                  <div className="tch-mail-detail__date">{selected.date}</div>
                </div>
              </div>
              <div className="tch-mail-detail__body">
                <div className="tch-mail-detail__text">{selected.body.split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}</div>
              </div>
            </div>
          : <div className="tch-mail-detail tch-mail-detail--empty"><div style={{fontSize:48}}>📭</div><div>یک ایمیل انتخاب کنید</div></div>
        }
      </div>

      {/* Compose */}
      {compose && (
        <div className="tch-compose">
          <div className="tch-compose__header">
            <span className="tch-compose__title">✉️ ایمیل جدید</span>
            <button className="tch-compose__close" onClick={()=>setCompose(false)}>×</button>
          </div>
          <div className="tch-compose__body">
            {[["به","دانش‌آموز یا ایمیل..."],["موضوع","موضوع ایمیل..."]].map(([l,ph])=>(
              <div key={l} className="tch-compose__field">
                <span className="tch-compose__label">{l}:</span>
                <input placeholder={ph} />
              </div>
            ))}
            <div className="tch-compose__editor">
              <textarea placeholder="متن ایمیل را اینجا بنویسید..." />
            </div>
          </div>
          <div className="tch-compose__footer">
            <div className="tch-compose__tools">
              {["B","I","U","🔗","📎"].map(t=><button key={t} className="tch-tool-btn">{t}</button>)}
            </div>
            <button className="tch-btn tch-btn--primary" onClick={handleSend} disabled={sending}>
              {sending ? <span className="tch-btn__spin"/> : "📤 ارسال"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN PANEL
// ════════════════════════════════════════════════════════════════════════════
const SECTION_TITLES: Record<Section, string> = {
  classes:      "کلاس‌های من",
  questions:    "بانک سوالات",
  exams:        "آزمون‌ها",
  students:     "دانش‌آموزان",
  "buy-plan":   "خرید پلن",
  "my-plan":    "پلن من",
  transactions: "تراکنش‌ها",
  profile:      "پروفایل من",
  messages:     "ایمیل‌ها",
};

interface NavItem { id: Section; label: string; icon: string; badge?: number }

const NAV_MAIN: NavItem[] = [
  { id:"classes",     label:"ایجاد کلاس",     icon:"🏫" },
  { id:"questions",   label:"ایجاد سوال",      icon:"❓" },
  { id:"exams",       label:"ایجاد آزمون",     icon:"📝" },
  { id:"students",    label:"افزودن دانش‌آموز", icon:"👥" },
  { id:"messages",    label:"ارسال و دریافت",  icon:"✉️", badge:2 },
];

const NAV_ACCOUNT: NavItem[] = [
  { id:"buy-plan",    label:"خرید پلن",         icon:"🛒" },
  { id:"my-plan",     label:"مشخصات پلن",        icon:"💎" },
  { id:"transactions",label:"تراکنش‌ها",         icon:"💳" },
  { id:"profile",     label:"تکمیل مشخصات",     icon:"👤" },
];

const TeacherPanel: React.FC = () => {
  const [active, setActive] = useState<Section>("classes");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = (): ReactNode => {
    if (active === "classes")      return <ClassesSection />;
    if (active === "questions")    return <QuestionsSection />;
    if (active === "exams")        return <ExamsSection />;
    if (active === "students")     return <StudentsSection />;
    if (active === "buy-plan")     return <BuyPlanSection />;
    if (active === "my-plan")      return <MyPlanSection />;
    if (active === "transactions") return <TransactionsSection />;
    if (active === "profile")      return <ProfileSection />;
    if (active === "messages")     return <MessagesSection />;
    return null;
  };

  return (
    <div className="tch-shell" dir="rtl">

      {/* ── Sidebar ── */}
      <aside className={`tch-sidebar ${collapsed?"tch-sidebar--collapsed":""}`}>
        <div className="tch-sidebar__brand">
          <div className="tch-sidebar__brand-icon">آ</div>
          {!collapsed && <>
            <span className="tch-sidebar__brand-name">آزمون‌گیر</span>
            <span className="tch-sidebar__brand-badge">استاد</span>
          </>}
        </div>

        <nav className="tch-sidebar__nav">
          {!collapsed && <div className="tch-sidebar__label">ابزار تدریس</div>}
          {NAV_MAIN.map(item=>(
            <button key={item.id} className={`tch-nav-item ${active===item.id?"tch-nav-item--active":""}`} onClick={()=>setActive(item.id)}>
              <div className="tch-nav-item__icon">{item.icon}</div>
              {!collapsed && <span className="tch-nav-item__label">{item.label}</span>}
              {!collapsed && item.badge && <span className="tch-nav-item__badge">{item.badge}</span>}
            </button>
          ))}

          {!collapsed && <div className="tch-sidebar__label" style={{marginTop:20}}>حساب کاربری</div>}
          {NAV_ACCOUNT.map(item=>(
            <button key={item.id} className={`tch-nav-item ${active===item.id?"tch-nav-item--active":""}`} onClick={()=>setActive(item.id)}>
              <div className="tch-nav-item__icon">{item.icon}</div>
              {!collapsed && <span className="tch-nav-item__label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="tch-sidebar__footer">
          <div className="tch-sidebar__user">
            <div className="tch-sidebar__user-avatar">👨‍🏫</div>
            {!collapsed && <div>
              <div className="tch-sidebar__user-name">دکتر محمد رضایی</div>
              <div className="tch-sidebar__user-role">استاد ریاضی</div>
            </div>}
          </div>
          <button className="tch-sidebar__toggle" onClick={()=>setCollapsed(p=>!p)}>
            {collapsed?"←":"→"}
          </button>
        </div>
      </aside>

      {/* ── Topbar ── */}
      <header className={`tch-topbar ${collapsed?"tch-topbar--collapsed":""}`}>
        <div className="tch-topbar__left">
          <span className="tch-topbar__title">{SECTION_TITLES[active]}</span>
          <div className="tch-topbar__bread">
            <a href="/">سایت</a><span>›</span>
            <span>پنل استاد</span><span>›</span>
            <span>{SECTION_TITLES[active]}</span>
          </div>
        </div>
        <div className="tch-topbar__right">
          <div className="tch-topbar__search">
            <span style={{color:"var(--adm-light)"}}>🔍</span>
            <input placeholder="جستجوی سریع..." />
          </div>
          <button className="tch-icon-btn" onClick={()=>setActive("messages")}>
            ✉️
            <span className="tch-icon-btn__dot" />
          </button>
          <button className="tch-icon-btn" onClick={()=>setActive("profile")}>👤</button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={`tch-content ${collapsed?"tch-content--collapsed":""}`} key={active}>
        {renderContent()}
      </main>
    </div>
  );
};

export default TeacherPanel;
