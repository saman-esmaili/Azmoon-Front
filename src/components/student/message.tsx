import {useState} from "react";
import {MailFolder, MAILS} from "./types";

export const MessagesSection:React.FC=()=>{
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
