import { useState, useMemo, useCallback } from "react";
import "./question-selector.css";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Diff = "easy" | "mid" | "hard";
type QType = "multiple" | "truefalse" | "short";

interface Question {
  id: string;
  text: string;
  type: QType;
  diff: Diff;
  cat: string;
  subCat: string;
  options: string[];
  correct: number;
  used: number;
}

interface ExamMeta {
  name: string;
  class: string;
  duration: number;   /* minutes */
  targetCount: number;
}

/* ─── Mock data bank (30 questions) ─────────────────────────────────────── */
const QUESTIONS: Question[] = [
  {id:"q01",text:"مشتق تابع f(x) = x³ − 3x² + 2 در نقطه x = 2 برابر است با:",type:"multiple",diff:"mid",cat:"ریاضی",subCat:"حساب",options:["0","6","−6","2"],correct:0,used:14},
  {id:"q02",text:"لیمیت تابع f(x) = sin(x)/x وقتی x به سمت صفر میل می‌کند برابر است با:",type:"multiple",diff:"hard",cat:"ریاضی",subCat:"حساب",options:["0","1","∞","وجود ندارد"],correct:1,used:22},
  {id:"q03",text:"آیا تابع f(x) = |x| در x = 0 مشتق‌پذیر است؟",type:"truefalse",diff:"easy",cat:"ریاضی",subCat:"حساب",options:["درست","نادرست"],correct:1,used:30},
  {id:"q04",text:"انتگرال ∫2x dx برابر است با:",type:"multiple",diff:"easy",cat:"ریاضی",subCat:"انتگرال",options:["x² + C","2x² + C","x + C","2 + C"],correct:0,used:19},
  {id:"q05",text:"ماتریس ۲×۲ دارای چند درایه است؟",type:"multiple",diff:"easy",cat:"ریاضی",subCat:"جبر",options:["2","4","8","3"],correct:1,used:11},
  {id:"q06",text:"سرعت نور در خلأ تقریباً چقدر است؟",type:"multiple",diff:"easy",cat:"فیزیک",subCat:"الکترومغناطیس",options:["3×10⁸ m/s","3×10⁶ m/s","3×10⁴ m/s","9×10⁸ m/s"],correct:0,used:28},
  {id:"q07",text:"قانون اول نیوتن به چه موضوعی می‌پردازد؟",type:"multiple",diff:"easy",cat:"فیزیک",subCat:"مکانیک",options:["لختی","کار","انرژی","شتاب"],correct:0,used:35},
  {id:"q08",text:"آیا انرژی در برخورد کاملاً کشسان حفظ می‌شود؟",type:"truefalse",diff:"mid",cat:"فیزیک",subCat:"مکانیک",options:["درست","نادرست"],correct:0,used:17},
  {id:"q09",text:"مقاومت معادل دو مقاومت موازی R₁ = 4Ω و R₂ = 4Ω چقدر است؟",type:"multiple",diff:"mid",cat:"فیزیک",subCat:"الکتریسیته",options:["8Ω","2Ω","4Ω","1Ω"],correct:1,used:13},
  {id:"q10",text:"در حرکت پرتابی، شتاب افقی چقدر است؟",type:"multiple",diff:"easy",cat:"فیزیک",subCat:"مکانیک",options:["g","0","−g","بستگی به زاویه دارد"],correct:1,used:24},
  {id:"q11",text:"فرمول شیمیایی آب چیست؟",type:"multiple",diff:"easy",cat:"شیمی",subCat:"پایه",options:["H₂O","HO₂","H₂O₂","H₃O"],correct:0,used:40},
  {id:"q12",text:"اتم کربن چند الکترون لایه آخر دارد؟",type:"multiple",diff:"easy",cat:"شیمی",subCat:"ساختار اتمی",options:["2","4","6","8"],correct:1,used:33},
  {id:"q13",text:"pH محلول خنثی در دمای ۲۵ درجه سانتیگراد چقدر است؟",type:"multiple",diff:"easy",cat:"شیمی",subCat:"اسید و باز",options:["0","7","14","3.5"],correct:1,used:27},
  {id:"q14",text:"آیا واکنش احتراق کامل متان CO₂ تولید می‌کند؟",type:"truefalse",diff:"easy",cat:"شیمی",subCat:"واکنش‌ها",options:["درست","نادرست"],correct:0,used:22},
  {id:"q15",text:"فرمول مولکولی گلوکز کدام است؟",type:"multiple",diff:"mid",cat:"شیمی",subCat:"آلی",options:["C₆H₁₂O₆","C₁₂H₂₂O₁₁","CH₂O","C₆H₆"],correct:0,used:18},
  {id:"q16",text:"کدام گزینه یک نمونه از اپیتل سنگفرشی ساده است؟",type:"multiple",diff:"hard",cat:"زیست",subCat:"بافت",options:["پوشش داخل رگ","کبد","عضله","استخوان"],correct:0,used:8},
  {id:"q17",text:"DNA دو رشته مارپیچی دارد، آیا این درست است؟",type:"truefalse",diff:"easy",cat:"زیست",subCat:"ژنتیک",options:["درست","نادرست"],correct:0,used:32},
  {id:"q18",text:"کدام اندامک مسئول تنفس سلولی است؟",type:"multiple",diff:"easy",cat:"زیست",subCat:"سلول",options:["هسته","میتوکندری","ریبوزوم","واکوئل"],correct:1,used:38},
  {id:"q19",text:"تعداد کروموزوم‌های انسان چند تا است؟",type:"multiple",diff:"mid",cat:"زیست",subCat:"ژنتیک",options:["23","44","46","48"],correct:2,used:29},
  {id:"q20",text:"گیاهان از طریق فتوسنتز انرژی نور را به انرژی شیمیایی تبدیل می‌کنند.",type:"truefalse",diff:"easy",cat:"زیست",subCat:"فیزیولوژی",options:["درست","نادرست"],correct:0,used:45},
  {id:"q21",text:"بردار جابجایی چه ماهیتی دارد؟",type:"multiple",diff:"easy",cat:"فیزیک",subCat:"مکانیک",options:["اسکالر","برداری","مختلط","وابسته به مسیر"],correct:1,used:20},
  {id:"q22",text:"دما یک کمیت برداری است.",type:"truefalse",diff:"easy",cat:"فیزیک",subCat:"گرما",options:["درست","نادرست"],correct:1,used:15},
  {id:"q23",text:"مشتق تابع f(x) = e^x برابر است با:",type:"multiple",diff:"easy",cat:"ریاضی",subCat:"حساب",options:["e^x","xe^(x-1)","e^(x-1)","1"],correct:0,used:26},
  {id:"q24",text:"معادله خط موازی با محور x که از نقطه (0,3) می‌گذرد چیست؟",type:"multiple",diff:"easy",cat:"ریاضی",subCat:"هندسه",options:["y = 3","x = 3","y = x + 3","x + y = 3"],correct:0,used:18},
  {id:"q25",text:"عدد مول چیست؟",type:"multiple",diff:"mid",cat:"شیمی",subCat:"مول",options:["6.022×10²³ ذره","6.022×10²¹","6.022×10²⁵","عدد آووگادرو/۱۰"],correct:0,used:21},
  {id:"q26",text:"در الکترولیز، اکسایش در کدام الکترود رخ می‌دهد؟",type:"multiple",diff:"hard",cat:"شیمی",subCat:"الکتروشیمی",options:["آند","کاتد","هر دو","هیچ‌کدام"],correct:0,used:10},
  {id:"q27",text:"کدام هورمون قند خون را کاهش می‌دهد؟",type:"multiple",diff:"mid",cat:"زیست",subCat:"فیزیولوژی",options:["گلوکاگون","انسولین","آدرنالین","کورتیزول"],correct:1,used:23},
  {id:"q28",text:"تعداد سطوح هرم مربع‌القاعده چند تا است؟",type:"multiple",diff:"easy",cat:"ریاضی",subCat:"هندسه",options:["4","5","6","3"],correct:1,used:12},
  {id:"q29",text:"آیا نیروی مغناطیسی به سرعت ذره باردار بستگی دارد؟",type:"truefalse",diff:"mid",cat:"فیزیک",subCat:"الکترومغناطیس",options:["درست","نادرست"],correct:0,used:16},
  {id:"q30",text:"فرمول سرعت متوسط کدام است؟",type:"multiple",diff:"easy",cat:"فیزیک",subCat:"مکانیک",options:["v = d/t","v = d×t","v = t/d","v = d²/t"],correct:0,used:36},
];

const LETTERS = ["الف","ب","پ","ت"];

const DIFF_META: Record<Diff, {label:string; cls:string; chipCls:string}> = {
  easy: { label:"آسان",   cls:"qs-badge--green",  chipCls:"qs-chip--easy" },
  mid:  { label:"متوسط",  cls:"qs-badge--amber",  chipCls:"qs-chip--mid"  },
  hard: { label:"سخت",    cls:"qs-badge--rose",   chipCls:"qs-chip--hard" },
};

const TYPE_META: Record<QType, {label:string; cls:string}> = {
  multiple:  { label:"چهار گزینه", cls:"qs-badge--sky"    },
  truefalse: { label:"صحیح/غلط",  cls:"qs-badge--violet" },
  short:     { label:"کوتاه‌پاسخ", cls:"qs-badge--gray"   },
};

const PER_PAGE = 8;

/* ─── Exam meta (props in real usage) ───────────────────────────────────── */
const EXAM: ExamMeta = {
  name: "آزمون میان‌ترم ریاضی",
  class: "ریاضی پایه دهم",
  duration: 90,
  targetCount: 20,
};

/* categories derived from data */
const buildCatTree = (qs: Question[]) => {
  const map: Record<string, Record<string, number>> = {};
  qs.forEach(q => {
    if (!map[q.cat]) map[q.cat] = {};
    map[q.cat][q.subCat] = (map[q.cat][q.subCat] || 0) + 1;
  });
  return map;
};

/* ════════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════════ */
interface QuestionSelectorProps {
  exam?: ExamMeta;
  onBack?: () => void;
  onDone?: (selected: string[]) => void;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  exam = EXAM,
  onBack = () => {},
  onDone = () => {},
}) => {
  /* filter state */
  const [search, setSearch]       = useState("");
  const [diffFilter, setDiff]     = useState<Diff[]>([]);
  const [typeFilter, setType]     = useState<QType[]>([]);
  const [catFilter, setCat]       = useState<string[]>([]);
  const [openCats, setOpenCats]   = useState<string[]>([]);

  /* list state */
  const [sortBy, setSortBy]       = useState<"default"|"diff"|"used">("default");
  const [gridView, setGridView]   = useState(false);
  const [page, setPage]           = useState(1);

  /* selection state */
  const [selected, setSelected]   = useState<string[]>([]);
  const [bump, setBump]           = useState(false);
  const [saving, setSaving]       = useState(false);

  const catTree = useMemo(() => buildCatTree(QUESTIONS), []);

  /* ── filter + sort ─────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let qs = QUESTIONS;
    if (search.trim())   qs = qs.filter(q => q.text.includes(search) || q.cat.includes(search) || q.subCat.includes(search));
    if (diffFilter.length) qs = qs.filter(q => diffFilter.includes(q.diff));
    if (typeFilter.length) qs = qs.filter(q => typeFilter.includes(q.type));
    if (catFilter.length)  qs = qs.filter(q => catFilter.includes(q.subCat) || catFilter.includes(q.cat));
    if (sortBy === "diff")  qs = [...qs].sort((a,b) => ["easy","mid","hard"].indexOf(a.diff) - ["easy","mid","hard"].indexOf(b.diff));
    if (sortBy === "used")  qs = [...qs].sort((a,b) => b.used - a.used);
    return qs;
  }, [search, diffFilter, typeFilter, catFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  /* ── helpers ───────────────────────────────────────────────────────── */
  const toggleDiff = (d: Diff) => setDiff(p => p.includes(d) ? p.filter(x=>x!==d) : [...p,d]);
  const toggleType = (t: QType) => setType(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]);
  const toggleCat  = (c: string) => setCat(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);
  const toggleCatOpen = (c: string) => setOpenCats(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);

  const toggleQ = useCallback((id: string) => {
    setSelected(prev => {
      const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id];
      setBump(true);
      setTimeout(() => setBump(false), 400);
      return next;
    });
  }, []);

  const toggleAll = () => {
    const pageIds = paginated.map(q=>q.id);
    const allSel = pageIds.every(id => selected.includes(id));
    if (allSel) setSelected(p => p.filter(id => !pageIds.includes(id)));
    else        setSelected(p => [...new Set([...p, ...pageIds])]);
  };

  const moveUp   = (id: string) => setSelected(p => { const i=p.indexOf(id); if(i<=0)return p; const n=[...p]; [n[i-1],n[i]]=[n[i],n[i-1]]; return n; });
  const moveDown = (id: string) => setSelected(p => { const i=p.indexOf(id); if(i>=p.length-1)return p; const n=[...p]; [n[i],n[i+1]]=[n[i+1],n[i]]; return n; });
  const removeQ  = (id: string) => setSelected(p => p.filter(x=>x!==id));

  const resetFilters = () => { setSearch(""); setDiff([]); setType([]); setCat([]); };

  const handleDone = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onDone(selected); }, 1000);
  };

  /* derived */
  const pct   = Math.min(100, Math.round((selected.length / exam.targetCount) * 100));
  const over  = selected.length > exam.targetCount;
  const exact = selected.length === exam.targetCount;

  const dist = {
    easy: selected.filter(id => QUESTIONS.find(q=>q.id===id)?.diff==="easy").length,
    mid:  selected.filter(id => QUESTIONS.find(q=>q.id===id)?.diff==="mid").length,
    hard: selected.filter(id => QUESTIONS.find(q=>q.id===id)?.diff==="hard").length,
  };

  const pageIds  = paginated.map(q=>q.id);
  const allOnPage = pageIds.length > 0 && pageIds.every(id=>selected.includes(id));

  const selectedQs = selected.map(id => QUESTIONS.find(q=>q.id===id)).filter(Boolean) as Question[];

  /* ── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="qs-page" dir="rtl">

      {/* ── Topbar ── */}
      <div className="qs-topbar">
        <div className="qs-topbar__left">
          <button className="qs-topbar__back" onClick={onBack}>
            ← بازگشت
          </button>
          <div className="qs-topbar__divider" />
          <span className="qs-topbar__title">انتخاب سوالات</span>
          <div className="qs-topbar__exam-pill">
            <span className="qs-topbar__exam-pill">📝 {exam.name}</span>
          </div>
        </div>
        <div className="qs-topbar__right">
          <div className={`qs-counter ${selected.length>0?"qs-counter--active":""} ${bump?"qs-counter--bump":""}`}>
            <span>سوال انتخاب‌شده:</span>
            <span className="qs-counter__num">{selected.length}</span>
            <span style={{color:"var(--adm-light)"}}> / {exam.targetCount}</span>
          </div>
          <button className="qs-btn qs-btn--ghost" onClick={resetFilters}>پاک کردن فیلترها</button>
          <button
            className="qs-btn qs-btn--primary"
            disabled={selected.length === 0 || saving}
            onClick={handleDone}
          >
            {saving ? <span className="qs-btn__spin" /> : <>✓ تأیید و ذخیره</>}
          </button>
        </div>
      </div>

      {/* ── Workspace ── */}
      <div className="qs-workspace">

        {/* ── LEFT: Filters ── */}
        <aside className="qs-filter">
          <div className="qs-filter__header">
            <span className="qs-filter__title">🔎 فیلترها</span>
            <button className="qs-filter__reset" onClick={resetFilters}>پاک کردن</button>
          </div>

          {/* search */}
          <div className="qs-filter__sec">
            <div className="qs-filter__sec-title">جستجو</div>
            <div className="qs-filter__search">
              <span className="qs-filter__search-icon">🔍</span>
              <input
                placeholder="متن سوال، درس..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* type */}
          <div className="qs-filter__sec">
            <div className="qs-filter__sec-title">نوع سوال</div>
            <div className="qs-chip-group">
              {(Object.keys(TYPE_META) as QType[]).map(t => (
                <button
                  key={t}
                  className={`qs-chip ${typeFilter.includes(t)?"qs-chip--on":""}`}
                  onClick={() => { toggleType(t); setPage(1); }}
                >
                  {TYPE_META[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* difficulty */}
          <div className="qs-filter__sec">
            <div className="qs-filter__sec-title">سطح دشواری</div>
            <div className="qs-chip-group">
              {(Object.keys(DIFF_META) as Diff[]).map(d => (
                <button
                  key={d}
                  className={`qs-chip qs-chip--${d} ${diffFilter.includes(d)?"qs-chip--on":""}`}
                  onClick={() => { toggleDiff(d); setPage(1); }}
                >
                  {DIFF_META[d].label}
                </button>
              ))}
            </div>
          </div>

          {/* categories */}
          <div className="qs-filter__sec" style={{flex:1}}>
            <div className="qs-filter__sec-title">درس / بخش</div>
            {Object.entries(catTree).map(([cat, subs]) => {
              const isOpen = openCats.includes(cat);
              const catCount = Object.values(subs).reduce((s,n)=>s+n,0);
              return (
                <div key={cat}>
                  <div className="qs-cat-row">
                    <input
                      type="checkbox"
                      checked={Object.keys(subs).every(sc => catFilter.includes(sc))}
                      onChange={() => Object.keys(subs).forEach(sc => {
                        if (!catFilter.includes(sc)) toggleCat(sc);
                      })}
                    />
                    <span className="qs-cat-row__label">{cat}</span>
                    <span className="qs-cat-row__count">{catCount}</span>
                    <button
                      className={`qs-cat-row__arrow ${isOpen?"qs-cat-row__arrow--open":""}`}
                      onClick={() => toggleCatOpen(cat)}
                    >▼</button>
                  </div>
                  {isOpen && (
                    <div className="qs-cat-sub">
                      {Object.entries(subs).map(([sc, cnt]) => (
                        <label key={sc} className="qs-cat-sub-item">
                          <input
                            type="checkbox"
                            checked={catFilter.includes(sc)}
                            onChange={() => { toggleCat(sc); setPage(1); }}
                          />
                          <span className="qs-cat-sub-item__label">{sc}</span>
                          <span className="qs-cat-sub-item__count">{cnt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── CENTER: Question List ── */}
        <main className="qs-list-panel">
          {/* toolbar */}
          <div className="qs-list-toolbar">
            <div className="qs-list-toolbar__left">
              <label className="qs-select-all">
                <input type="checkbox" checked={allOnPage} onChange={toggleAll} />
                <span className="qs-select-all__lbl">انتخاب همه صفحه</span>
              </label>
              <span className="qs-result-count">{filtered.length} سوال</span>
            </div>
            <div className="qs-list-toolbar__right">
              <select className="qs-sort" value={sortBy} onChange={e=>setSortBy(e.target.value as typeof sortBy)}>
                <option value="default">پیش‌فرض</option>
                <option value="diff">سطح دشواری</option>
                <option value="used">پر‌استفاده‌ترین</option>
              </select>
              <button
                className={`qs-view-btn ${!gridView?"qs-view-btn--on":""}`}
                onClick={() => setGridView(false)} title="لیست"
              >☰</button>
              <button
                className={`qs-view-btn ${gridView?"qs-view-btn--on":""}`}
                onClick={() => setGridView(true)} title="شبکه"
              >⊞</button>
            </div>
          </div>

          {/* list */}
          <div className={`qs-list ${gridView?"qs-list--grid":""}`}>
            {paginated.length === 0 ? (
              <div className="qs-empty">
                <div className="qs-empty__icon">🔍</div>
                <div className="qs-empty__title">سوالی یافت نشد</div>
                <div className="qs-empty__sub">فیلترها را تغییر داده یا عبارت جستجو را اصلاح کنید</div>
              </div>
            ) : paginated.map((q, idx) => {
              const isSel = selected.includes(q.id);
              return (
                <div
                  key={q.id}
                  className={`qs-qcard ${isSel?"qs-qcard--sel":""}`}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                  onClick={() => toggleQ(q.id)}
                >
                  {isSel && <div className="qs-qcard__sel-badge">✓</div>}
                  <div className="qs-qcard__top">
                    <input
                      type="checkbox"
                      className="qs-qcard__cb"
                      checked={isSel}
                      onChange={() => toggleQ(q.id)}
                      onClick={e => e.stopPropagation()}
                    />
                    <div className="qs-qcard__text">{q.text}</div>
                  </div>
                  <div className="qs-qcard__meta">
                    <span className={`qs-badge ${DIFF_META[q.diff].cls}`}>{DIFF_META[q.diff].label}</span>
                    <span className={`qs-badge ${TYPE_META[q.type].cls}`}>{TYPE_META[q.type].label}</span>
                    <span className="qs-badge qs-badge--gray">{q.subCat}</span>
                    <span className="qs-badge qs-badge--gray" style={{marginRight:"auto"}}>× {q.used} بار</span>
                  </div>
                  {q.options.length > 0 && (
                    <div className="qs-opts">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`qs-opt ${i===q.correct?"qs-opt--ok":""}`}>
                          <span className="qs-opt__ltr">
                            {q.type==="truefalse" ? (i===0?"✓":"✗") : LETTERS[i]}
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="qs-pager">
              <span className="qs-pager__info">
                نمایش {(page-1)*PER_PAGE+1} تا {Math.min(page*PER_PAGE, filtered.length)} از {filtered.length}
              </span>
              <div className="qs-pager__btns">
                <button className="qs-pg" disabled={page===1} onClick={()=>setPage(p=>p-1)}>«</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} className={`qs-pg ${p===page?"qs-pg--on":""}`} onClick={()=>setPage(p)}>{p}</button>
                ))}
                <button className="qs-pg" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>»</button>
              </div>
            </div>
          )}
        </main>

        {/* ── RIGHT: Basket ── */}
        <aside className="qs-basket">
          <div className="qs-basket__head">
            <span className="qs-basket__head-title">🗂 سوالات انتخاب‌شده</span>
            <span className="qs-basket__head-badge">{selected.length} سوال</span>
          </div>

          {/* exam meta */}
          <div className="qs-basket__meta">
            <div className="qs-meta-row"><span className="qs-meta-lbl">نام آزمون</span><span className="qs-meta-val">{exam.name}</span></div>
            <div className="qs-meta-row"><span className="qs-meta-lbl">کلاس</span><span className="qs-meta-val">{exam.class}</span></div>
            <div className="qs-meta-row"><span className="qs-meta-lbl">مدت زمان</span><span className="qs-meta-val">{exam.duration} دقیقه</span></div>
            <div className="qs-meta-row"><span className="qs-meta-lbl">هدف سوال</span><span className="qs-meta-val">{exam.targetCount} سوال</span></div>
          </div>

          {/* progress */}
          <div className="qs-prog">
            <div className="qs-prog__top">
              <span className="qs-prog__lbl">تکمیل آزمون</span>
              <span className="qs-prog__pct" style={{color: over?"var(--rose)":exact?"var(--green)":"var(--primary)"}}>{pct}٪</span>
            </div>
            <div className="qs-prog__track">
              <div className={`qs-prog__fill ${over?"qs-prog__fill--over":""}`} style={{width:`${pct}%`}} />
            </div>
            {over  && <div className="qs-prog__note qs-prog__note--warn">⚠ تعداد سوال بیش از هدف است ({selected.length}/{exam.targetCount})</div>}
            {exact && <div className="qs-prog__note qs-prog__note--ok">✓ تعداد سوال کامل شد!</div>}
          </div>

          {/* distribution */}
          <div className="qs-dist">
            <div className="qs-dist__title">توزیع دشواری</div>
            <div className="qs-dist__row">
              <div className="qs-dist__chip" style={{background:"var(--green-lt)",color:"var(--green)",borderColor:"transparent"}}>
                آسان <strong>{dist.easy}</strong>
              </div>
              <div className="qs-dist__chip" style={{background:"#FEF3C7",color:"#92400E",borderColor:"transparent"}}>
                متوسط <strong>{dist.mid}</strong>
              </div>
              <div className="qs-dist__chip" style={{background:"var(--rose-lt)",color:"var(--rose)",borderColor:"transparent"}}>
                سخت <strong>{dist.hard}</strong>
              </div>
            </div>
          </div>

          {/* selected list */}
          <div className="qs-basket__list">
            {selectedQs.length === 0 ? (
              <div className="qs-basket__empty">
                <div className="qs-basket__empty-icon">📋</div>
                <div className="qs-basket__empty-txt">هنوز سوالی انتخاب نشده</div>
                <div className="qs-basket__empty-sub">روی سوالات سمت چپ کلیک کنید</div>
              </div>
            ) : selectedQs.map((q, idx) => (
              <div key={q.id} className="qs-bitem">
                <div className="qs-bitem__num">{idx+1}</div>
                <div className="qs-bitem__text">{q.text}</div>
                <div className="qs-bitem__acts">
                  <button className="qs-bitem__move" onClick={()=>moveUp(q.id)} title="بالاتر">↑</button>
                  <button className="qs-bitem__move" onClick={()=>moveDown(q.id)} title="پایین‌تر">↓</button>
                  <button className="qs-bitem__del" onClick={()=>removeQ(q.id)} title="حذف">×</button>
                </div>
              </div>
            ))}
          </div>

          {/* footer */}
          <div className="qs-basket__foot">
            <div className="qs-score-row">
              <div>
                <div className="qs-score-row__lbl">نمره هر سوال</div>
                <div className="qs-score-row__sub">بر اساس تعداد کل</div>
              </div>
              <div className="qs-score-row__val">
                {selected.length > 0 ? `${(20 / selected.length).toFixed(1)}` : "—"}
              </div>
            </div>
            <button
              className="qs-btn qs-btn--primary"
              style={{width:"100%",justifyContent:"center"}}
              disabled={selected.length===0 || saving}
              onClick={handleDone}
            >
              {saving
                ? <><span className="qs-btn__spin" />در حال ذخیره...</>
                : <>✓ تأیید {selected.length} سوال و ذخیره آزمون</>
              }
            </button>
            {selected.length > 0 && (
              <button
                className="qs-btn qs-btn--danger"
                style={{width:"100%",justifyContent:"center"}}
                onClick={() => setSelected([])}
              >
                🗑 پاک کردن همه
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuestionSelector;
