import {useState} from "react";
import {Exam} from "./types";

interface ReviewModalProps{exam:Exam;answers:Record<string,string|number>;onClose:()=>void}

export const ReviewModal:React.FC<ReviewModalProps>=({exam,answers,onClose})=>{
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
