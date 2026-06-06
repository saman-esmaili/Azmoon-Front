import {useState} from "react";
import {Exam, EXAMS} from "./types";
import {ScoreModalComp} from "./azmoon-score";
import {ReviewModal} from "./review";

interface ExamsSectionProps{onStartExam:(e:Exam)=>void}

export const ExamsSection:React.FC<ExamsSectionProps>=({onStartExam})=>{
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
