import {useState} from "react";
import {MailFolder, MAILS} from "./types";

export const MessagesSection: React.FC = () => {
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
