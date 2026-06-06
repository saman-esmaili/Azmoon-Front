import {Exam} from "./types";

interface ScoreModalProps{exam:Exam;answers:Record<string,string|number>;onClose:()=>void}

export const ScoreModalComp:React.FC<ScoreModalProps>=({exam,answers,onClose})=>{
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
