import {useEffect, useRef, useState} from "react";
import {Exam, fmtTime, LETTERS, QStatus} from "./types";
interface ExamEnvProps { exam:Exam; onExit:(answers:Record<string,string|number>)=>void }
export const ExamEnv:React.FC<ExamEnvProps> = ({exam,onExit})=>{
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