import {useState} from "react";
import {Folder, Mail, MAILS} from "./types";
import '../../styles/admin.css';
export const MessagesSection: React.FC = () => {
  const [folder, setFolder] = useState<Folder>("inbox");
  const [selected, setSelected] = useState<Mail | null>(MAILS[0]);
  const [compose, setCompose] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const inboxCount = MAILS.filter((m) => m.folder === "inbox" && m.unread).length;
  const folderMails = MAILS.filter((m) => m.folder === folder);

  const FOLDERS: { key: Folder; label: string; icon: string; count?: number }[] = [
    { key: "inbox",  label: "صندوق ورودی",  icon: "📥", count: inboxCount },
    { key: "sent",   label: "ارسال‌شده",     icon: "📤" },
    { key: "drafts", label: "پیش‌نویس",      icon: "📝" },
    { key: "trash",  label: "حذف‌شده",       icon: "🗑" },
  ];

  const handleSend = () => {
    setSendLoading(true);
    setTimeout(() => { setSendLoading(false); setCompose(false); }, 1200);
  };

  return (
    <>
      <div className="adm-section-header" style={{ marginBottom: 16 }}>
        <div className="adm-section-header__left">
          <div className="adm-section-title">ایمیل‌ها</div>
          <div className="adm-section-sub">{MAILS.length} پیام</div>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => setCompose(true)}>✉️ نوشتن ایمیل</button>
      </div>

      <div className="mail-layout">
        {/* Mail sidebar */}
        <div className="mail-sidebar">
          <div className="mail-sidebar__compose">
            <button className="adm-btn adm-btn--primary" style={{ width: "100%" }} onClick={() => setCompose(true)}>+ نوشتن</button>
          </div>
          <div className="mail-sidebar__nav">
            {FOLDERS.map((f) => (
              <button key={f.key} className={`mail-folder-btn ${folder === f.key ? "mail-folder-btn--active" : ""}`} onClick={() => setFolder(f.key)}>
                <span className="mail-folder-btn__icon">{f.icon}</span>
                {f.label}
                {f.count ? <span className="mail-folder-btn__count">{f.count}</span> : null}
              </button>
            ))}
          </div>

          {/* Mail list */}
          <div className="mail-list">
            {folderMails.length === 0 ? (
              <div style={{ padding: 24, color: "var(--adm-light)", fontSize: 13, textAlign: "center" }}>پیامی وجود ندارد</div>
            ) : folderMails.map((m) => (
              <div key={m.id}
                className={`mail-item ${m.unread ? "mail-item--unread" : ""} ${selected?.id === m.id ? "mail-item--active" : ""}`}
                onClick={() => setSelected(m)}
              >
                <div className="mail-item__from">{folder === "sent" ? m.to : m.from}</div>
                <div className="mail-item__subject">{m.subject}</div>
                <div className="mail-item__preview">{m.preview}</div>
                <div className="mail-item__date">{m.date.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mail detail */}
        {selected ? (
          <div className="mail-detail">
            <div className="mail-detail__toolbar">
              <button className="adm-btn adm-btn--ghost adm-btn--sm">↩ پاسخ</button>
              <button className="adm-btn adm-btn--ghost adm-btn--sm">↪ فوروارد</button>
              <button className="adm-btn adm-btn--danger adm-btn--sm">🗑 حذف</button>
              <button className="adm-btn adm-btn--ghost adm-btn--sm">⭐ ستاره</button>
            </div>
            <div className="mail-detail__header">
              <div className="mail-detail__subject">{selected.subject}</div>
              <div className="mail-detail__meta">
                <div className="mail-detail__from">از: <strong>{selected.from}</strong> &lt;{selected.fromEmail}&gt;</div>
                <div className="mail-detail__from">به: <strong>{selected.to}</strong></div>
                <div className="mail-detail__date">{selected.date}</div>
              </div>
            </div>
            <div className="mail-detail__body">
              <div className="mail-detail__body-text">{selected.body.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</div>
            </div>
            {selected.attachments && (
              <div className="mail-detail__attachments">
                <div className="mail-detail__att-title">پیوست‌ها ({selected.attachments.length})</div>
                {selected.attachments.map((a) => (
                  <span key={a.name} className="mail-detail__att-item">📎 {a.name} <span style={{ color: "var(--adm-light)" }}>{a.size}</span></span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mail-detail mail-detail--empty">
            <div className="mail-detail--empty-icon">📭</div>
            <div>یک ایمیل انتخاب کنید</div>
          </div>
        )}
      </div>

      {/* Compose modal */}
      {compose && (
        <div className="compose-modal">
          <div className="compose-modal__header">
            <span className="compose-modal__title">✉️ نوشتن ایمیل جدید</span>
            <button className="compose-modal__close" onClick={() => setCompose(false)}>×</button>
          </div>
          <div className="compose-modal__body">
            {[["به", "user@example.com"], ["موضوع", "موضوع ایمیل..."]].map(([label, ph]) => (
              <div key={label} className="compose-modal__field">
                <span className="compose-modal__field-label">{label}:</span>
                <input placeholder={ph} />
              </div>
            ))}
            <div className="compose-modal__editor">
              <textarea placeholder="متن ایمیل را اینجا بنویسید..." />
            </div>
          </div>
          <div className="compose-modal__footer">
            <div className="compose-modal__tools">
              {["B", "I", "U", "🔗", "📎"].map((t) => (
                <button key={t} className="compose-tool-btn">{t}</button>
              ))}
            </div>
            <button className="adm-btn adm-btn--primary" onClick={handleSend} disabled={sendLoading}>
              {sendLoading ? <span className="adm-btn__spinner" /> : "📤 ارسال"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
