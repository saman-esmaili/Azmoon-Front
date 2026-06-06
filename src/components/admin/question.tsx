import {useState} from "react";
import {diffBadge, Question, QUESTIONS} from "./types";
import '../../styles/admin.css';
export const QuestionsSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editQ, setEditQ] = useState<Question | null>(null);
  const [search, setSearch] = useState("");

  const filtered = QUESTIONS.filter((q) => q.text.includes(search) || q.category.includes(search));

  const openEditor = (q: Question | null) => { setEditQ(q); setModalOpen(true); };

  const LETTERS = ["الف", "ب", "پ", "ت"];

  return (
    <>
      <div className="adm-stats">
        {[
          { icon:"❓", label:"کل سوالات",    value:`${QUESTIONS.length}`, change:"+۳ این هفته", up:true, bg:"var(--violet-lt)", color:"var(--violet)" },
          { icon:"📚", label:"تستی",          value:"۳",  change:"۶۰٪ از کل",   up:true, bg:"var(--sky-lt)",    color:"var(--sky)" },
          { icon:"✍️",label:"تشریحی/کوتاه", value:"۲",  change:"۴۰٪ از کل",  up:true, bg:"var(--accent-lt)", color:"var(--accent)" },
          { icon:"🎯", label:"استفاده‌شده",  value:"۸۱", change:"در آزمون‌ها",  up:true, bg:"var(--green-lt)",  color:"var(--green)" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-card__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="adm-stat-card__label">{s.label}</div>
              <div className="adm-stat-card__value">{s.value}</div>
              <div className="adm-stat-card__change adm-stat-card__change--up">{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-section-header">
        <div className="adm-section-header__left">
          <div className="adm-section-title">بانک سوالات</div>
          <div className="adm-section-sub">{filtered.length} سوال</div>
        </div>
        <div className="adm-section-header__right">
          <input className="adm-input" style={{ width: 220 }} placeholder="🔍 جستجو در سوالات..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="adm-btn adm-btn--primary" onClick={() => openEditor(null)}>+ سوال جدید</button>
        </div>
      </div>

      {filtered.map((q) => {
        const diff = diffBadge(q.difficulty);
        return (
          <div key={q.id} className="question-card" onClick={() => openEditor(q)}>
            <div className="question-card__top">
              <div className="question-card__text">{q.text}</div>
              <div className="question-card__meta">
                <span className={`adm-badge ${diff.cls}`}>{diff.label}</span>
                <span className="adm-badge adm-badge--sky">{q.category}</span>
                <span className="adm-badge adm-badge--gray">استفاده: {q.usedIn}</span>
              </div>
            </div>
            {q.type === "multiple" && (
              <div className="question-card__options">
                {q.options.map((opt, i) => (
                  <div key={i} className={`question-card__option ${i === q.correct ? "question-card__option--correct" : ""}`}>
                    <span className="question-card__option-letter">{LETTERS[i]}</span>
                    {opt}
                  </div>
                ))}
              </div>
            )}
            {q.type === "truefalse" && (
              <div className="question-card__options">
                {q.options.map((opt, i) => (
                  <div key={i} className={`question-card__option ${i === q.correct ? "question-card__option--correct" : ""}`}>
                    <span className="question-card__option-letter">{i === 0 ? "✓" : "×"}</span>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Question editor modal */}
      {modalOpen && (
        <div className="q-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="q-modal" onClick={(e) => e.stopPropagation()}>
            <div className="q-modal__header">
              <span className="q-modal__title">{editQ ? "ویرایش سوال" : "سوال جدید"}</span>
              <button className="user-drawer__close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="q-modal__body">
              <div className="adm-form-full">
                <label className="adm-form-label">متن سوال *</label>
                <textarea className="adm-textarea" rows={3} defaultValue={editQ?.text} placeholder="متن سوال را وارد کنید..." />
              </div>
              <div className="adm-form-row">
                <div>
                  <label className="adm-form-label">نوع سوال</label>
                  <select className="adm-select" style={{ width: "100%" }} defaultValue={editQ?.type}>
                    <option value="multiple">چهار گزینه‌ای</option>
                    <option value="truefalse">درست / نادرست</option>
                    <option value="short">کوتاه‌پاسخ</option>
                  </select>
                </div>
                <div>
                  <label className="adm-form-label">سطح دشواری</label>
                  <select className="adm-select" style={{ width: "100%" }} defaultValue={editQ?.difficulty}>
                    <option value="easy">آسان</option>
                    <option value="medium">متوسط</option>
                    <option value="hard">سخت</option>
                  </select>
                </div>
              </div>
              <div className="adm-form-full">
                <label className="adm-form-label">دسته‌بندی</label>
                <input className="adm-input" defaultValue={editQ?.category} placeholder="مثلاً: ریاضی، علوم، فناوری..." />
              </div>
              {(!editQ || editQ.type === "multiple") && (
                <div>
                  <label className="adm-form-label">گزینه‌ها (گزینه صحیح را مشخص کنید)</label>
                  {["الف", "ب", "پ", "ت"].map((l, i) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <input type="radio" name="correct" defaultChecked={editQ?.correct === i} />
                      <span style={{ color: "var(--adm-sub)", fontSize: 12, fontWeight: 700, minWidth: 20 }}>{l}</span>
                      <input className="adm-input" defaultValue={editQ?.options[i]} placeholder={`گزینه ${l}...`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="q-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={() => setModalOpen(false)}>انصراف</button>
              <button className="adm-btn adm-btn--primary" onClick={() => setModalOpen(false)}>💾 ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
