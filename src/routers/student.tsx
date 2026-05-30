import { useState, useEffect, useRef, ReactNode } from "react";
import "./student.css";

/* ─── Types ─────────────────────────────────────────────────────────── */
type Section = "dashboard" | "exams" | "messages" | "profile";
type MailFolder = "inbox" | "sent" | "drafts";
type QType = "multiple" | "truefalse" | "descriptive";
type QStatus = "unseen" | "answered" | "skipped";
type ScoreModal = "score" | "review" | null;

/* ─── Exam data ──────────────────────────────────────────────────────── */
interface ExamQuestion {
  id: string; type: QType; text: string;
  options?: string[]; correct?: number; correctText?: string;
}
interface Exam {
  id: string; name: string; subject: string; date: string;
  duration: number; qCount: number; icon: string;
  status: "upcoming" | "active" | "done";
  score?: number; totalScore?: number;
  questions: ExamQuestion[];
}

const EXAMS: Exam[] = [
  {
    id:"e1", name:"آزمون میان‌ترم ریاضی", subject:"ریاضی پایه دهم",
    date:"۱۴۰۳/۰۴/۱۵", duration:90, qCount:5, icon:"📐",
    status:"active",
    questions:[
      {id:"q1",type:"multiple",text:"مشتق تابع f(x)=x³−3x+2 در نقطه x=1 برابر است با:",options:["0","1","−3","3"],correct:0},
      {id:"q2",type:"multiple",text:"معادله خط عبوری از دو نقطه (۱,۲) و (۳,۶) کدام است؟",options:["y=2x","y=2x+1","y=x+1","y=3x−1"],correct:0},
      {id:"q3",type:"truefalse",text:"مشتق توابع ثابت همواره برابر صفر است.",options:["درست","نادرست"],correct:0},
      {id:"q4",type:"descriptive",text:"تعریف لیمیت را بنویسید و یک مثال بزنید.",correctText:"لیمیت تابع f در نقطه a برابر L است اگر به ازای هر ε>0 یک δ>0 وجود داشته باشد که ..."},
      {id:"q5",type:"multiple",text:"انتگرال ∫(2x)dx برابر است با:",options:["x²+C","2x²+C","x+C","2+C"],correct:0},
    ]
  },
  {
    id:"e2", name:"آزمون فیزیک موج", subject:"فیزیک یازدهم",
    date:"۱۴۰۳/۰۴/۱۸", duration:60, qCount:4, icon:"⚡",
    status:"upcoming",
    questions:[
      {id:"q1",type:"multiple",text:"سرعت نور در خلأ تقریباً چقدر است؟",options:["3×10⁸ m/s","3×10⁶ m/s","9×10⁸ m/s","3×10⁴ m/s"],correct:0},
      {id:"q2",type:"truefalse",text:"امواج صوتی امواج طولی هستند.",options:["درست","نادرست"],correct:0},
      {id:"q3",type:"multiple",text:"فرکانس موجی با دوره T=0.5s چقدر است؟",options:["0.5 Hz","1 Hz","2 Hz","4 Hz"],correct:2},
      {id:"q4",type:"descriptive",text:"پدیده تشدید را توضیح دهید.",correctText:"تشدید زمانی اتفاق می‌افتد که فرکانس نیروی محرک برابر فرکانس طبیعی سیستم شود."},
    ]
  },
  {
    id:"e3", name:"آزمون شیمی آلی", subject:"شیمی دوازدهم",
    date:"۱۴۰۳/۰۳/۲۵", duration:120, qCount:4, icon:"🧪",
    status:"done", score:17, totalScore:20,
    questions:[
      {id:"q1",type:"multiple",text:"فرمول مولکولی گلوکز کدام است؟",options:["C₆H₁₂O₆","C₁₂H₂₂O₁₁","CH₂O","C₆H₆"],correct:0},
      {id:"q2",type:"truefalse",text:"آلکان‌ها فرمول عمومی CₙH₂ₙ دارند.",options:["درست","نادرست"],correct:1},
      {id:"q3",type:"multiple",text:"در واکنش احتراق کامل متان، محصولات کدامند؟",options:["CO₂+H₂O","CO+H₂O","CO₂+H₂","CO+H₂"],correct:0},
      {id:"q4",type:"descriptive",text:"پیوند هیدروژنی را تعریف کنید.",correctText:"پیوند هیدروژنی یک برهم‌کنش الکترواستاتیک بین اتم هیدروژن متصل به اتم الکترونگاتیو ..."},
    ]
  },
];

/* ─── Mail data ──────────────────────────────────────────────────────── */
const MAILS = [
  {id:"m1",from:"دکتر رضایی",fromEmail:"teacher@azmon.ir",subject:"نتایج آزمون ریاضی",preview:"نتایج آزمون میان‌ترم منتشر شد...",body:"دانش‌آموز عزیز،\n\nنتایج آزمون میان‌ترم ریاضی منتشر شد. لطفاً به بخش آزمون‌ها مراجعه کنید.\n\nموفق باشید\nدکتر رضایی",date:"۱۴۰۳/۰۴/۰۲",unread:true,folder:"inbox" as MailFolder},
  {id:"m2",from:"پشتیبانی",fromEmail:"support@azmon.ir",subject:"خوش‌آمدگویی به آزمون‌گیر",preview:"حساب شما فعال شد...",body:"دانش‌آموز گرامی،\n\nحساب کاربری شما در سامانه آزمون‌گیر فعال شد. هم‌اکنون می‌توانید در آزمون‌ها شرکت کنید.\n\nموفق باشید",date:"۱۴۰۳/۰۳/۲۸",unread:false,folder:"inbox" as MailFolder},
  {id:"m3",from:"من",fromEmail:"student@azmon.ir",subject:"سوال درباره آزمون فیزیک",preview:"استاد عزیز، درباره فصل موج...",body:"استاد عزیز،\n\nدرباره مباحث فصل موج سوالاتی داشتم. آیا امکان تنظیم وقت دارید؟\n\nبا تشکر",date:"۱۴۰۳/۰۴/۰۱",unread:false,folder:"sent" as MailFolder},
];

const LETTERS = ["الف","ب","پ","ت"];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const scoreColor = (s:number,t:number)=>{
  const p=s/t;
  if(p>=.85)return{bg:"var(--green-lt)",color:"var(--green)"};
  if(p>=.6 )return{bg:"#FEF3C7",       color:"#92400E"};
  return          {bg:"var(--rose-lt)", color:"var(--rose)"};
};
const fmtTime=(s:number)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

/* ══════════════════════════════════════════════════════════════════════
   EXAM ENVIRONMENT
══════════════════════════════════════════════════════════════════════ */
interface ExamEnvProps { exam:Exam; onExit:(answers:Record<string,string|number>)=>void }

const ExamEnv:React.FC<ExamEnvProps> = ({exam,onExit})=>{
  const [cur,setCur]=useState(0);
  const [answers,setAnswers]=useState<Record<string,string|number>>({});
  const [skipped,setSkipped]=useState<string[]>([]);
  const [timeLeft,setTimeLeft]=useState(exam.duration*60);
  const [confirmEnd,setConfirmEnd]=useState(false);
  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(()=>{
    timerRef.current=setInterval(()=>setTimeLeft(t=>{
      if(t<=1){clearInterval(timerRef.current!);onExit(answers);return 0;}
      return t-1;
    }),1000);
    return()=>clearInterval(timerRef.current!);
  },[]);

  const q=exam.questions[cur];
  const answered=(id:string)=>id in answers;
  const skippedQ=(id:string)=>skipped.includes(id);

  const statusOf=(id:string):QStatus=>{
    if(answered(id))return"answered";
    if(skippedQ(id))return"skipped";
    return"unseen";
  };

  const answeredCount=Object.keys(answers).length;
  const progress=Math.round((answeredCount/exam.questions.length)*100);

  const go=(n:number)=>{
    if(n>=0&&n<exam.questions.length)setCur(n);
  };

  const handleSkip=()=>{
    if(!skipped.includes(q.id))setSkipped(p=>[...p,q.id]);
    if(cur<exam.questions.length-1)go(cur+1);
  };

  const handleAnswer=(val:string|number)=>{
    setAnswers(p=>({...p,[q.id]:val}));
    setSkipped(p=>p.filter(x=>x!==q.id));
  };

  const handleEnd=()=>{
    clearInterval(timerRef.current!);
    onExit(answers);
  };

  const warn=timeLeft<300;

  return(
    <div className="env-shell" dir="rtl">
      {/* topbar */}
      <div className="env-topbar">
        <div>
          <div className="env-topbar__name">{exam.name}</div>
          <div className="env-topbar__class">{exam.subject}</div>
        </div>
        <div className={`env-timer ${warn?"env-timer--warn":""}`}>
          <span className="env-timer__icon">⏱</span>
          <span className="env-timer__val">{fmtTime(timeLeft)}</span>
        </div>
        <div className="env-topbar__right">
          <button className="std-btn std-btn--rose" onClick={()=>setConfirmEnd(true)}>پایان آزمون</button>
        </div>
      </div>

      {/* body */}
      <div className="env-body">
        {/* question area */}
        <div className="env-q-area">
          <div className="env-q-header">
            <div className="env-q-num">
              <div className="env-q-num__badge">{cur+1}</div>
              <div className="env-q-num__text">سوال <strong>{cur+1}</strong> از <strong>{exam.questions.length}</strong></div>
            </div>
            <div className="env-q-type-badge">
              {q.type==="multiple"   && <span className="std-badge std-badge--sky">چهار گزینه</span>}
              {q.type==="truefalse"  && <span className="std-badge std-badge--violet">صحیح/غلط</span>}
              {q.type==="descriptive"&& <span className="std-badge std-badge--amber">تشریحی</span>}
            </div>
          </div>

          <div className="env-q-scroll">
            <div className="env-q-text">{q.text}</div>

            {q.type==="multiple" && q.options && (
              <div className="env-options">
                {q.options.map((opt,i)=>(
                  <div key={i}
                    className={`env-option ${answers[q.id]===i?"env-option--sel":""}`}
                    onClick={()=>handleAnswer(i)}
                  >
                    <div className="env-option__letter">{LETTERS[i]}</div>
                    <div className="env-option__text">{opt}</div>
                  </div>
                ))}
              </div>
            )}

            {q.type==="truefalse" && (
              <div className="env-tf">
                <button
                  className={`env-tf-btn env-tf-btn--true ${answers[q.id]===0?"env-tf-btn--sel":""}`}
                  onClick={()=>handleAnswer(0)}
                >
                  <span className="env-tf-btn__icon">✓</span>درست
                </button>
                <button
                  className={`env-tf-btn env-tf-btn--false ${answers[q.id]===1?"env-tf-btn--sel":""}`}
                  onClick={()=>handleAnswer(1)}
                >
                  <span className="env-tf-btn__icon">✗</span>نادرست
                </button>
              </div>
            )}

            {q.type==="descriptive" && (
              <div className="env-desc-wrap">
                <div className="env-desc-label">پاسخ خود را بنویسید:</div>
                <textarea
                  className="env-desc-area"
                  placeholder="پاسخ تشریحی خود را اینجا بنویسید..."
                  value={(answers[q.id] as string)||""}
                  onChange={e=>handleAnswer(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* nav footer */}
          <div className="env-nav">
            <button className="std-btn std-btn--ghost" disabled={cur===0} onClick={()=>go(cur-1)}>← قبلی</button>
            <div className="env-nav__center">
              <button className="env-skip-btn" onClick={handleSkip}>رد کردن ↷</button>
            </div>
            {cur<exam.questions.length-1
              ? <button className="std-btn std-btn--primary" onClick={()=>go(cur+1)}>بعدی ←</button>
              : <button className="std-btn std-btn--green"  onClick={()=>setConfirmEnd(true)}>✓ اتمام</button>
            }
          </div>
        </div>

        {/* right: question nav panel */}
        <div className="env-nav-panel">
          <div className="env-nav-panel__header">
            <div className="env-nav-panel__title">راهنمای سوالات</div>
            <div className="env-nav-legend">
              {([["env-nav-dot--answered","پاسخ داده"],["env-nav-dot--skipped","رد شده"],["env-nav-dot--unseen","پاسخ نداده"],["env-nav-dot--current","جاری"]] as [string,string][]).map(([cls,lbl])=>(
                <div key={lbl} className="env-nav-legend-item">
                  <span className={`env-nav-dot ${cls}`}/>
                  {lbl}
                </div>
              ))}
            </div>
          </div>

          <div className="env-nav-grid">
            {exam.questions.map((qq,i)=>{
              const st=statusOf(qq.id);
              const isCur=i===cur;
              return(
                <button key={qq.id}
                  className={`env-q-btn ${isCur?"env-q-btn--current":st==="answered"?"env-q-btn--answered":st==="skipped"?"env-q-btn--skipped":"env-q-btn--unseen"}`}
                  onClick={()=>setCur(i)}
                >{i+1}</button>
              );
            })}
          </div>

          <div className="env-nav-panel__footer">
            <div className="env-progress-bar">
              <div className="env-progress-fill" style={{width:`${progress}%`}}/>
            </div>
            <div className="env-progress-txt">
              <span>پاسخ داده‌شده</span>
              <span style={{color:"var(--sky)",fontWeight:800}}>{answeredCount}/{exam.questions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* confirm end modal */}
      {confirmEnd&&(
        <div className="std-modal-backdrop">
          <div className="std-modal">
            <div className="std-modal__header">
              <span className="std-modal__title">⚠ پایان آزمون</span>
              <button className="std-modal__close" onClick={()=>setConfirmEnd(false)}>×</button>
            </div>
            <div className="std-modal__body" style={{textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:16}}>🏁</div>
              <p style={{color:"var(--adm-text)",fontSize:16,fontWeight:700,marginBottom:8}}>
                آیا مطمئنید می‌خواهید آزمون را پایان دهید؟
              </p>
              <p style={{color:"var(--adm-sub)",fontSize:13,marginBottom:24}}>
                {exam.questions.length - answeredCount} سوال پاسخ داده نشده باقی مانده است.
              </p>
              <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                <button className="std-btn std-btn--ghost" onClick={()=>setConfirmEnd(false)}>ادامه آزمون</button>
                <button className="std-btn std-btn--green" onClick={handleEnd}>✓ پایان دادن</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   SCORE MODAL
══════════════════════════════════════════════════════════════════════ */
interface ScoreModalProps{exam:Exam;answers:Record<string,string|number>;onClose:()=>void}

const ScoreModalComp:React.FC<ScoreModalProps>=({exam,answers,onClose})=>{
  const scored=exam.questions.filter(q=>q.type!=="descriptive");
  const correct=scored.filter(q=>answers[q.id]===q.correct).length;
  const wrong  =scored.filter(q=>q.id in answers && answers[q.id]!==q.correct).length;
  const skipped=exam.questions.filter(q=>!(q.id in answers)).length;
  const total  =scored.length;
  const score  =Math.round((correct/Math.max(total,1))*20*10)/10;

  return(
    <div className="std-modal-backdrop" onClick={onClose}>
      <div className="std-modal" onClick={e=>e.stopPropagation()}>
        <div className="std-modal__header">
          <span className="std-modal__title">📊 نتیجه آزمون</span>
          <button className="std-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="std-modal__body">
          <div className="score-hero">
            <div className="score-hero__val">{exam.score ?? score}</div>
            <div className="score-hero__total">از ۲۰</div>
            <div className="score-hero__label">{exam.name}</div>
          </div>
          <div className="score-breakdown">
            <div className="score-item">
              <div className="score-item__val" style={{color:"var(--green)"}}>{correct}</div>
              <div className="score-item__lbl">درست</div>
            </div>
            <div className="score-item">
              <div className="score-item__val" style={{color:"var(--rose)"}}>{wrong}</div>
              <div className="score-item__lbl">نادرست</div>
            </div>
            <div className="score-item">
              <div className="score-item__val" style={{color:"var(--sky)"}}>{skipped}</div>
              <div className="score-item__lbl">پاسخ نداده</div>
            </div>
          </div>
          <button className="std-btn std-btn--primary" style={{width:"100%",justifyContent:"center"}} onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   REVIEW MODAL
══════════════════════════════════════════════════════════════════════ */
interface ReviewModalProps{exam:Exam;answers:Record<string,string|number>;onClose:()=>void}

const ReviewModal:React.FC<ReviewModalProps>=({exam,answers,onClose})=>{
  const [filter,setFilter]=useState<"all"|"correct"|"wrong"|"skipped">("all");

  const items=exam.questions.map(q=>{
    if(!(q.id in answers))return{q,status:"skipped" as const};
    if(q.type==="descriptive")return{q,status:"descriptive" as const};
    if(answers[q.id]===q.correct)return{q,status:"correct" as const};
    return{q,status:"wrong" as const};
  });

  const filtered=items.filter(it=>{
    if(filter==="all")return true;
    if(filter==="skipped")return it.status==="skipped";
    if(filter==="correct")return it.status==="correct";
    if(filter==="wrong")  return it.status==="wrong"||it.status==="descriptive";
    return true;
  });

  return(
    <div className="std-modal-backdrop" onClick={onClose}>
      <div className="std-modal std-modal--wide" onClick={e=>e.stopPropagation()}>
        <div className="std-modal__header">
          <span className="std-modal__title">🔍 مرور سوالات</span>
          <button className="std-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="std-modal__body">
          {/* filter chips */}
          <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
            {([["all","همه"],["correct","درست"],["wrong","نادرست"],["skipped","پاسخ نداده"]] as [typeof filter,string][]).map(([k,lbl])=>(
              <button key={k}
                onClick={()=>setFilter(k)}
                className="std-btn std-btn--sm"
                style={filter===k?{background:"var(--sky)",color:"#fff",border:"none"}:{background:"var(--adm-bg)",border:"1px solid var(--adm-border)",color:"var(--adm-sub)"}}
              >{lbl}</button>
            ))}
          </div>

          {filtered.map(({q,status},idx)=>(
            <div key={q.id} className={`review-item review-item--${status==="descriptive"?"skipped":status}`}>
              <div className={`review-item__num review-item__num--${status==="correct"?"correct":status==="skipped"||status==="descriptive"?"skipped":"wrong"}`}>
                {idx+1}
              </div>
              <div style={{flex:1}}>
                <div className="review-item__text">{q.text}</div>
                {q.type==="multiple"&&q.options&&(
                  <div className="review-item__answer" style={{marginTop:8}}>
                    {status==="correct"&&<div className="review-item__correct-ans">✓ پاسخ شما: {q.options[answers[q.id] as number]} — درست!</div>}
                    {status==="wrong"&&<>
                      <div className="review-item__your-ans">✗ پاسخ شما: {q.options[answers[q.id] as number]}</div>
                      <div className="review-item__correct-ans">✓ پاسخ صحیح: {q.options[q.correct!]}</div>
                    </>}
                    {status==="skipped"&&<div style={{color:"var(--sky)",fontWeight:700,fontSize:12}}>↷ پاسخ داده نشد | صحیح: {q.options[q.correct!]}</div>}
                  </div>
                )}
                {q.type==="truefalse"&&q.options&&(
                  <div className="review-item__answer" style={{marginTop:6}}>
                    {status==="correct"&&<div className="review-item__correct-ans">✓ پاسخ شما: {q.options[answers[q.id] as number]}</div>}
                    {status==="wrong"&&<>
                      <div className="review-item__your-ans">✗ پاسخ شما: {q.options[answers[q.id] as number]}</div>
                      <div className="review-item__correct-ans">✓ صحیح: {q.options[q.correct!]}</div>
                    </>}
                    {status==="skipped"&&<div style={{color:"var(--sky)",fontWeight:700,fontSize:12}}>↷ پاسخ داده نشد</div>}
                  </div>
                )}
                {q.type==="descriptive"&&(
                  <div style={{marginTop:6}}>
                    <div style={{color:"var(--adm-sub)",fontSize:12,fontWeight:700}}>پاسخ تشریحی:</div>
                    {answers[q.id]
                      ?<div style={{color:"var(--adm-text)",fontSize:12,marginTop:4,background:"var(--adm-bg)",borderRadius:8,padding:"8px 12px"}}>{answers[q.id]}</div>
                      :<div style={{color:"var(--adm-light)",fontSize:12}}>پاسخی ثبت نشده</div>
                    }
                    <div style={{color:"var(--green)",fontSize:12,fontWeight:700,marginTop:6}}>نمونه پاسخ: {q.correctText}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   EXAMS SECTION
══════════════════════════════════════════════════════════════════════ */
interface ExamsSectionProps{onStartExam:(e:Exam)=>void}

const ExamsSection:React.FC<ExamsSectionProps>=({onStartExam})=>{
  const [scoreModal,setScoreModal]=useState<{exam:Exam;answers:Record<string,string|number>}|null>(null);
  const [reviewModal,setReviewModal]=useState<{exam:Exam;answers:Record<string,string|number>}|null>(null);
  const [tab,setTab]=useState<"upcoming"|"done">("upcoming");

  const demoAnswers:Record<string,string|number>={q1:0,q3:0,q4:"لیمیت عبارت است از..."};

  const shown=EXAMS.filter(e=>tab==="upcoming"?e.status!=="done":e.status==="done");

  return(
    <>
      <div className="std-sec-header">
        <div className="std-sec-header__left">
          <div className="std-sec-title">آزمون‌ها</div>
          <div className="std-sec-sub">{EXAMS.length} آزمون</div>
        </div>
        <div className="std-sec-header__right">
          {(["upcoming","done"] as const).map(t=>(
            <button key={t} className={`std-btn ${tab===t?"std-btn--primary":"std-btn--ghost"}`} onClick={()=>setTab(t)}>
              {t==="upcoming"?"پیش رو":"برگزار شده"}
            </button>
          ))}
        </div>
      </div>

      <div className="std-stats">
        {[
          {icon:"📝",label:"کل آزمون‌ها",  val:EXAMS.length,         bg:"var(--sky-lt)",   color:"var(--sky)"},
          {icon:"⏳",label:"پیش رو",        val:EXAMS.filter(e=>e.status!=="done").length, bg:"var(--violet-lt)",color:"var(--violet)"},
          {icon:"✅",label:"شرکت کرده",     val:EXAMS.filter(e=>e.status==="done").length, bg:"var(--green-lt)", color:"var(--green)"},
          {icon:"⭐",label:"میانگین نمره",  val:"۱۷.۵",              bg:"#FEF3C7",          color:"#92400E"},
        ].map(s=>(
          <div key={s.label} className="std-stat">
            <div className="std-stat__icon" style={{background:s.bg}}>{s.icon}</div>
            <div><div className="std-stat__label">{s.label}</div><div className="std-stat__value" style={{color:s.color}}>{s.val}</div></div>
          </div>
        ))}
      </div>

      {shown.map(exam=>(
        <div key={exam.id} className="exm-card">
          <div className="exm-card__left">
            <div className="exm-card__icon" style={{background:exam.status==="done"?"var(--green-lt)":exam.status==="active"?"var(--sky-lt)":"var(--violet-lt)"}}>
              {exam.icon}
            </div>
            <div>
              <div className="exm-card__name">{exam.name}</div>
              <div className="exm-card__meta">
                <span className="exm-card__meta-item">📚 {exam.subject}</span>
                <span className="exm-card__meta-item">📅 {exam.date}</span>
                <span className="exm-card__meta-item">⏱ {exam.duration} دقیقه</span>
                <span className="exm-card__meta-item">❓ {exam.qCount} سوال</span>
                {exam.status==="done"&&exam.score!=null&&(
                  <span className="std-badge std-badge--green">نمره: {exam.score}/{exam.totalScore}</span>
                )}
                <span className={`std-badge ${exam.status==="done"?"std-badge--green":exam.status==="active"?"std-badge--sky":"std-badge--violet"}`}>
                  {exam.status==="done"?"برگزار شد":exam.status==="active"?"در دسترس":"پیش رو"}
                </span>
              </div>
            </div>
          </div>
          <div className="exm-card__actions">
            {exam.status!=="done"&&(
              <button className="std-btn std-btn--primary" onClick={()=>onStartExam(exam)}>
                شرکت در آزمون ←
              </button>
            )}
            {exam.status==="done"&&<>
              <button className="std-btn std-btn--green std-btn--sm" onClick={()=>setScoreModal({exam,answers:demoAnswers})}>
                📊 مشاهده نمره
              </button>
              <button className="std-btn std-btn--violet std-btn--sm" onClick={()=>setReviewModal({exam,answers:demoAnswers})}>
                🔍 مرور سوالات
              </button>
            </>}
          </div>
        </div>
      ))}

      {scoreModal&&<ScoreModalComp exam={scoreModal.exam} answers={scoreModal.answers} onClose={()=>setScoreModal(null)}/>}
      {reviewModal&&<ReviewModal exam={reviewModal.exam} answers={reviewModal.answers} onClose={()=>setReviewModal(null)}/>}
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   MESSAGES SECTION
══════════════════════════════════════════════════════════════════════ */
const MessagesSection:React.FC=()=>{
  const [folder,setFolder]=useState<MailFolder>("inbox");
  const [selected,setSelected]=useState(MAILS[0]);
  const [compose,setCompose]=useState(false);

  const folders:[MailFolder,string,string,number?][]=[
    ["inbox","صندوق ورودی","📥",MAILS.filter(m=>m.folder==="inbox"&&m.unread).length],
    ["sent","ارسال‌شده","📤"],
    ["drafts","پیش‌نویس","📝"],
  ];
  const shown=MAILS.filter(m=>m.folder===folder);

  return(
    <>
      <div className="std-sec-header">
        <div className="std-sec-header__left">
          <div className="std-sec-title">پیام‌ها</div>
          <div className="std-sec-sub">{MAILS.length} پیام</div>
        </div>
        <button className="std-btn std-btn--primary" onClick={()=>setCompose(true)}>✉️ نوشتن پیام</button>
      </div>

      <div className="std-mail-layout">
        <div className="std-mail-side">
          <div className="std-mail-side__top">
            <button className="std-btn std-btn--primary" style={{width:"100%"}} onClick={()=>setCompose(true)}>+ نوشتن</button>
          </div>
          <div className="std-mail-side__nav">
            {folders.map(([key,lbl,icon,cnt])=>(
              <button key={key} className={`std-folder-btn ${folder===key?"std-folder-btn--active":""}`} onClick={()=>setFolder(key)}>
                <span>{icon}</span>{lbl}
                {cnt?<span className="std-folder-btn__count">{cnt}</span>:null}
              </button>
            ))}
          </div>
          <div className="std-mail-list">
            {shown.length===0
              ?<div style={{padding:24,color:"var(--adm-light)",fontSize:13,textAlign:"center"}}>پیامی وجود ندارد</div>
              :shown.map(m=>(
                <div key={m.id}
                  className={`std-mail-item ${m.unread?"std-mail-item--unread":""} ${selected?.id===m.id?"std-mail-item--active":""}`}
                  onClick={()=>setSelected(m)}
                >
                  <div className="std-mail-item__from">{m.from}</div>
                  <div className="std-mail-item__subject">{m.subject}</div>
                  <div className="std-mail-item__preview">{m.preview}</div>
                  <div className="std-mail-item__date">{m.date}</div>
                </div>
              ))
            }
          </div>
        </div>
        {selected
          ?<div className="std-mail-detail">
            <div className="std-mail-detail__toolbar">
              <button className="std-btn std-btn--ghost std-btn--sm">↩ پاسخ</button>
              <button className="std-btn std-btn--rose std-btn--sm">🗑 حذف</button>
            </div>
            <div className="std-mail-detail__header">
              <div className="std-mail-detail__subject">{selected.subject}</div>
              <div className="std-mail-detail__meta">
                <div className="std-mail-detail__from">از: <strong>{selected.from}</strong></div>
                <div className="std-mail-detail__date">{selected.date}</div>
              </div>
            </div>
            <div className="std-mail-detail__body">
              <div className="std-mail-detail__text">
                {selected.body.split("\n").map((l,i)=><span key={i}>{l}<br/></span>)}
              </div>
            </div>
          </div>
          :<div className="std-mail-detail std-mail-detail--empty"><div style={{fontSize:48}}>📭</div><div>یک پیام انتخاب کنید</div></div>
        }
      </div>

      {compose&&(
        <div className="std-compose">
          <div className="std-compose__header">
            <span className="std-compose__title">✉️ پیام جدید</span>
            <button className="std-compose__close" onClick={()=>setCompose(false)}>×</button>
          </div>
          <div className="std-compose__body">
            {[["به","نام استاد یا ایمیل..."],["موضوع","موضوع پیام..."]].map(([l,ph])=>(
              <div key={l} className="std-compose__field">
                <span className="std-compose__label">{l}:</span>
                <input placeholder={ph}/>
              </div>
            ))}
            <div className="std-compose__editor"><textarea placeholder="متن پیام..."/></div>
          </div>
          <div className="std-compose__footer">
            <div/>
            <button className="std-btn std-btn--primary" onClick={()=>setCompose(false)}>📤 ارسال</button>
          </div>
        </div>
      )}
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════ */
const Dashboard:React.FC=()=>(
  <>
    <div className="dash-hero">
      <div className="dash-hero__avatar">🎓</div>
      <div>
        <div className="dash-hero__name">علی محمدی</div>
        <div className="dash-hero__class">دانش‌آموز — ریاضی پایه دهم</div>
      </div>
      <div className="dash-hero__right">
        {[["۳","آزمون پیش رو"],["۱۷.۵","میانگین نمره"],["#2","رتبه کلاس"]].map(([v,l])=>(
          <div key={l} className="dash-hero-stat"><div className="dash-hero-stat__val">{v}</div><div className="dash-hero-stat__lbl">{l}</div></div>
        ))}
      </div>
    </div>

    <div className="std-stats">
      {[
        {icon:"📝",label:"کل آزمون‌ها",val:"۵",bg:"var(--sky-lt)",color:"var(--sky)"},
        {icon:"✅",label:"شرکت کرده", val:"۲",bg:"var(--green-lt)",color:"var(--green)"},
        {icon:"⭐",label:"بهترین نمره",val:"۱۹",bg:"#FEF3C7",color:"#92400E"},
        {icon:"📨",label:"پیام جدید",  val:"۲",bg:"var(--violet-lt)",color:"var(--violet)"},
      ].map(s=>(
        <div key={s.label} className="std-stat">
          <div className="std-stat__icon" style={{background:s.bg}}>{s.icon}</div>
          <div><div className="std-stat__label">{s.label}</div><div className="std-stat__value" style={{color:s.color}}>{s.val}</div></div>
        </div>
      ))}
    </div>

    <div className="std-card">
      <div className="std-card__header"><div className="std-card__title">📊 آخرین نمرات</div></div>
      <div className="std-card__body">
        {[{exam:"آزمون شیمی آلی",score:17,total:20},{exam:"آزمون آمار",score:15,total:20}].map(({exam,score,total})=>{
          const c=scoreColor(score,total);
          return(
            <div key={exam} className="score-bar-row">
              <div className="score-bar-row__exam">{exam}</div>
              <div className="score-bar-row__bar"><div className="score-bar-row__fill" style={{width:`${(score/total)*100}%`,background:c.color}}/></div>
              <div className="score-bar-row__val" style={{color:c.color}}>{score}/{total}</div>
            </div>
          );
        })}
      </div>
    </div>
  </>
);

/* ══════════════════════════════════════════════════════════════════════
   PROFILE SECTION
══════════════════════════════════════════════════════════════════════ */
const ProfileSection:React.FC=()=>{
  const [saved,setSaved]=useState(false);
  return(
    <>
      <div className="std-sec-header">
        <div className="std-sec-header__left">
          <div className="std-sec-title">پروفایل من</div>
          <div className="std-sec-sub">مشخصات و اطلاعات حساب</div>
        </div>
      </div>
      <div className="std-card">
        <div className="std-card__header"><div className="std-card__title">👤 اطلاعات شخصی</div></div>
        <div className="std-card__body">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label className="std-form-label">نام *</label><input className="std-input" defaultValue="علی"/></div>
            <div><label className="std-form-label">نام خانوادگی *</label><input className="std-input" defaultValue="محمدی"/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label className="std-form-label">کد ملی *</label><input className="std-input" placeholder="۱۰ رقمی"/></div>
            <div><label className="std-form-label">شماره موبایل</label><input className="std-input" placeholder="۰۹۱۲-XXXXXXX"/></div>
          </div>
          <div style={{marginBottom:14}}><label className="std-form-label">آدرس</label><textarea className="std-textarea" rows={2} placeholder="شهر، خیابان، کوچه..."/></div>
          <div style={{textAlign:"left"}}>
            <button className="std-btn std-btn--primary" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}}>
              {saved?"✓ ذخیره شد":"💾 ذخیره"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN PANEL
══════════════════════════════════════════════════════════════════════ */
const TITLES:Record<Section,string>={dashboard:"داشبورد",exams:"آزمون‌ها",messages:"پیام‌ها",profile:"پروفایل من"};

const NAV_ITEMS:[Section,string,string,number?][]=[
  ["dashboard","داشبورد","🏠"],
  ["exams","آزمون‌ها","📝",3],
  ["messages","پیام‌ها","✉️",2],
  ["profile","پروفایل من","👤"],
];

const StudentPanel:React.FC=()=>{
  const [section,setSection]=useState<Section>("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const [activeExam,setActiveExam]=useState<Exam|null>(null);
  const [examAnswers,setExamAnswers]=useState<Record<string,string|number>>({});
  const [scoreModal,setScoreModal]=useState<Exam|null>(null);
  const [reviewModal,setReviewModal]=useState<Exam|null>(null);

  const handleStartExam=(e:Exam)=>{setActiveExam(e)};
  const handleExitExam=(answers:Record<string,string|number>)=>{
    setExamAnswers(answers);
    setActiveExam(null);
    setScoreModal(EXAMS.find(e=>e.id===activeExam?.id)!);
  };

  const renderContent=():ReactNode=>{
    if(section==="dashboard")return<Dashboard/>;
    if(section==="exams")    return<ExamsSection onStartExam={handleStartExam}/>;
    if(section==="messages") return<MessagesSection/>;
    if(section==="profile")  return<ProfileSection/>;
    return null;
  };

  if(activeExam){
    return<ExamEnv exam={activeExam} onExit={handleExitExam}/>;
  }

  return(
    <div className="std-shell" dir="rtl">
      {/* Sidebar */}
      <aside className={`std-sidebar ${collapsed?"std-sidebar--col":""}`}>
        <div className="std-sidebar__brand">
          <div className="std-sidebar__brand-icon">آ</div>
          {!collapsed&&<>
            <span className="std-sidebar__brand-name">آزمون‌گیر</span>
            <span className="std-sidebar__brand-badge">دانش‌آموز</span>
          </>}
        </div>

        <nav className="std-sidebar__nav">
          {!collapsed&&<div className="std-sidebar__label">منو اصلی</div>}
          {NAV_ITEMS.map(([id,lbl,icon,badge])=>(
            <button key={id}
              className={`std-nav-item ${section===id?"std-nav-item--active":""}`}
              onClick={()=>setSection(id)}
            >
              <div className="std-nav-item__icon">{icon}</div>
              {!collapsed&&<span className="std-nav-item__label">{lbl}</span>}
              {!collapsed&&badge&&<span className="std-nav-item__badge">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="std-sidebar__footer">
          <div className="std-sidebar__user">
            <div className="std-sidebar__user-avatar">🎓</div>
            {!collapsed&&<div>
              <div className="std-sidebar__user-name">علی محمدی</div>
              <div className="std-sidebar__user-role">دانش‌آموز دهم</div>
            </div>}
          </div>
          <button className="std-sidebar__toggle" onClick={()=>setCollapsed(p=>!p)}>
            {collapsed?"←":"→"}
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <header className={`std-topbar ${collapsed?"std-topbar--col":""}`}>
        <div className="std-topbar__left">
          <span className="std-topbar__title">{TITLES[section]}</span>
          <div className="std-topbar__bread">
            <a href="/">سایت</a><span>›</span>
            <span>پنل دانش‌آموز</span><span>›</span>
            <span>{TITLES[section]}</span>
          </div>
        </div>
        <div className="std-topbar__right">
          <button className="std-icon-btn" onClick={()=>setSection("messages")}>
            ✉️<span className="std-icon-btn__dot"/>
          </button>
          <button className="std-icon-btn" onClick={()=>setSection("profile")}>👤</button>
        </div>
      </header>

      {/* Content */}
      <main className={`std-content ${collapsed?"std-content--col":""}`} key={section}>
        {renderContent()}
      </main>

      {/* Post-exam score modal */}
      {scoreModal&&<ScoreModalComp exam={scoreModal} answers={examAnswers} onClose={()=>setScoreModal(null)}/>}
    </div>
  );
};

export default StudentPanel;
