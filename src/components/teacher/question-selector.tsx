import {useState, useMemo, useCallback, useEffect} from "react";
import "./../../styles/question-selector.css";
import {useNavigate, useParams} from "react-router-dom";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Diff = "easy" | "medium" | "hard";
type QType = "test" | "true_false" | "essay";

interface Question {
    id: string;
    text: string;
    question_image: null | string;
    type: QType;
    diff: Diff;
    cat: string;
    selected: boolean;
    A: null | string;
    B: null | string;
    C: null | string;
    D: null | string;
    A_image: null | string;
    B_image: null | string;
    C_image: null | string;
    D_image: null | string;
    essay_image: null | string;
    score: number;
    true_answer: string
}

interface ExamMeta {
    name: string;
    class: string;
    duration: number;   /* minutes */
    score: number;
}

const LETTERS = ["A", "B", "C", "D"];

const DIFF_META: Record<Diff, { label: string; cls: string; chipCls: string }> = {
    easy: {label: "آسان", cls: "qs-badge--green", chipCls: "qs-chip--easy"},
    medium: {label: "متوسط", cls: "qs-badge--amber", chipCls: "qs-chip--mid"},
    hard: {label: "سخت", cls: "qs-badge--rose", chipCls: "qs-chip--hard"},
};

const TYPE_META: Record<QType, { label: string; cls: string }> = {
    test: {label: "چهار گزینه", cls: "qs-badge--sky"},
    true_false: {label: "صحیح/غلط", cls: "qs-badge--violet"},
    essay: {label: "کوتاه‌پاسخ", cls: "qs-badge--gray"},
};

const PER_PAGE = 4;

/* ─── Exam meta (props in real usage) ───────────────────────────────────── */

/* categories derived from data */
const buildCatTree = (qs: Question[]) => {
    const map: Record<string, number> = {};

    qs.forEach(q => {
        map[q.cat] = (map[q.cat] || 0) + 1;
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
                                                               onBack = () => {
                                                               },
                                                               onDone = () => {
                                                               },
                                                           }) => {
    /* filter state */
    const [search, setSearch] = useState("");
    const [diffFilter, setDiff] = useState<Diff[]>([]);
    const [typeFilter, setType] = useState<QType[]>([]);
    const [catFilter, setCat] = useState<string[]>([]);
    const [openCats, setOpenCats] = useState<string[]>([]);
    const {examId} = useParams();
    const [QUESTIONS, setQUESTIONS] = useState<Question[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [exam, setExam] = useState<ExamMeta>({
        name: '',
        class: '',
        duration: 0,
        score: 0,
    })
    const navigate = useNavigate();
    // API
    const getQuestionExam = () => {
        Axios.get(`http://localhost:8000/teacher/exam/question/${examId}`, {withCredentials: true})
            .then((res) => {
                resetFilters()
                const questions = res.data.questions;
                const q_ids = questions
                    .filter((q: Question) => q.selected)
                    .map((q: Question) => q.id);
                setTimeout(() => {
                    setQUESTIONS([...questions]);
                    setExam(res.data.exam_info);
                    setSelected([...q_ids]);
                }, 0);

            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getQuestionExam();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        getQuestionExam()
    }, []);
    useEffect(() => {
        console.log("QUESTIONS updated", QUESTIONS);
    }, [QUESTIONS]);
    // END API


    /* list state */
    const [sortBy, setSortBy] = useState<"default" | "diff" | "selected">("default");
    const [gridView, setGridView] = useState(false);
    const [page, setPage] = useState(1);

    /* selection state */
    const [selected, setSelected] = useState<string[]>([]);
    const [bump, setBump] = useState(false);
    const [saving, setSaving] = useState(false);

    // const catTree = useMemo(() => buildCatTree(QUESTIONS), []);
    const catTree = useMemo(() => buildCatTree(QUESTIONS), [QUESTIONS]);

    /* ── filter + sort ─────────────────────────────────────────────────── */
    const filtered = useMemo(() => {
        let qs = QUESTIONS;
        if (search.trim()) qs = qs.filter(q => q.text.includes(search) || q.cat.includes(search));
        if (diffFilter.length) qs = qs.filter(q => diffFilter.includes(q.diff));
        if (typeFilter.length) qs = qs.filter(q => typeFilter.includes(q.type));
        if (catFilter.length) qs = qs.filter(q => catFilter.includes(q.cat));
        if (sortBy === "diff") qs = [...qs].sort((a, b) => ["easy", "medium", "hard"].indexOf(a.diff) - ["easy", "medium", "hard"].indexOf(b.diff));
        // if (sortBy === "selected") qs = [...qs].sort((a, b) => b.selected - a.selected);
        return qs;
    }, [QUESTIONS, search, diffFilter, typeFilter, catFilter, sortBy]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    /* ── helpers ───────────────────────────────────────────────────────── */
    const toggleDiff = (d: Diff) => setDiff(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
    const toggleType = (t: QType) => setType(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
    const toggleCat = (c: string) => setCat(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
    const toggleCatOpen = (c: string) => setOpenCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
    const toggleQ = useCallback((id: string) => {
        setSelected(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            setBump(true);
            setTimeout(() => setBump(false), 400);
            return next;
        });
    }, []);

    const toggleAll = () => {
        const pageIds = paginated.map(q => q.id);
        const allSel = pageIds.every(id => selected.includes(id));
        if (allSel) setSelected(p => p.filter(id => !pageIds.includes(id)));
        else setSelected(p => [...new Set([...p, ...pageIds])]);
    };

    const moveUp = (id: string) => setSelected(p => {
        const i = p.indexOf(id);
        if (i <= 0) return p;
        const n = [...p];
        [n[i - 1], n[i]] = [n[i], n[i - 1]];
        return n;
    });
    const moveDown = (id: string) => setSelected(p => {
        const i = p.indexOf(id);
        if (i >= p.length - 1) return p;
        const n = [...p];
        [n[i], n[i + 1]] = [n[i + 1], n[i]];
        return n;
    });
    const removeQ = (id: string) => setSelected(p => p.filter(x => x !== id));

    const resetFilters = () => {
        setSearch("");
        setDiff([]);
        setType([]);
        setCat([]);
    };

    const handleDone = () => {
        const data = {'question_id': selected}
        Axios.post(`http://localhost:8000/teacher/exam/question/add/${examId}`, data, {withCredentials: true})
            .then((res) => {
                setShowSuccess(true);

                setTimeout(() => {
                    navigate("/teacher");
                }, 10000);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getQuestionExam();
                    }
                }
                // revoke()
                // navigate('/auth');
            })

        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            onDone(selected);
        }, 1000);
    };
    const selectedScore = selected.reduce((sum, id) => {
        const q = QUESTIONS.find(q => q.id === id);
        return sum + (q?.score || 0);
    }, 0);
    /* derived */
    const pct = exam.score > 0
        ? Math.min(100, Math.round((selectedScore / exam.score) * 100))
        : 0;

    const over = selectedScore > exam.score;
    const exact = selectedScore === exam.score;

    const dist = {
        easy: selected.filter(id => QUESTIONS.find(q => q.id === id)?.diff === "easy").length,
        medium: selected.filter(id => QUESTIONS.find(q => q.id === id)?.diff === "medium").length,
        hard: selected.filter(id => QUESTIONS.find(q => q.id === id)?.diff === "hard").length,
    };

    const pageIds = paginated.map(q => q.id);
    const allOnPage = pageIds.length > 0 && pageIds.every(id => selected.includes(id));

    const selectedQs = selected.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean) as Question[];

    /* ── render ─────────────────────────────────────────────────────────── */
    return (
        <div className="qs-page" dir="rtl">
            {showSuccess && (
                <div className="success-popup-backdrop">
                    <div className="success-popup">
                        <div className="success-popup__check">
                            ✓
                        </div>

                        <h2>عملیات با موفقیت انجام شد</h2>

                        <p>
                            سوالات آزمون ذخیره شدند.
                        </p>

                        <p className="success-popup__timer">
                            انتقال به صفحه بعد تا ۱۰ ثانیه دیگر...
                        </p>
                    </div>
                </div>
            )}
            {/* ── Topbar ── */}
            <div className="qs-topbar">
                <div className="qs-topbar__left">
                    <button className="qs-topbar__back" onClick={() => navigate('/teacher')}>
                        ← بازگشت
                    </button>
                    <div className="qs-topbar__divider"/>
                    <span className="qs-topbar__title">انتخاب سوالات</span>
                    <div className="qs-topbar__exam-pill">
                        <span className="qs-topbar__exam-pill">📝 {exam.name}</span>
                    </div>
                </div>
                <div className="qs-topbar__right">
                    <div
                        className={`qs-counter ${selected.length > 0 ? "qs-counter--active" : ""} ${bump ? "qs-counter--bump" : ""}`}>
                        <span>سوال انتخاب‌شده:</span>
                        {/*<span className="qs-counter__num">{selectedScore}</span>*/}
                        <span style={{color: "var(--adm-light)"}}>  {selected.length}</span>
                    </div>
                    <button className="qs-btn qs-btn--ghost" onClick={resetFilters}>پاک کردن فیلترها</button>
                    <button
                        className="qs-btn qs-btn--primary"
                        disabled={selected.length === 0 || saving}
                        onClick={handleDone}
                    >
                        {saving ? <span className="qs-btn__spin"/> : <>✓ تأیید و ذخیره</>}
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
                                onChange={e => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
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
                                    className={`qs-chip ${typeFilter.includes(t) ? "qs-chip--on" : ""}`}
                                    onClick={() => {
                                        toggleType(t);
                                        setPage(1);
                                    }}
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
                                    className={`qs-chip qs-chip--${d} ${diffFilter.includes(d) ? "qs-chip--on" : ""}`}
                                    onClick={() => {
                                        toggleDiff(d);
                                        setPage(1);
                                    }}
                                >
                                    {DIFF_META[d].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* categories */}
                    <div className="qs-filter__sec" style={{flex: 1}}>
                        <div className="qs-filter__sec-title">درس / بخش</div>
                        {Object.entries(catTree).map(([cat, count]) => (
                            <div key={cat}>
                                <div className="qs-cat-row">
                                    <input
                                        type="checkbox"
                                        checked={catFilter.includes(cat)}
                                        onChange={() => {
                                            toggleCat(cat);
                                            setPage(1);
                                        }}
                                    />

                                    <span className="qs-cat-row__label">
                {cat}
            </span>

                                    <span className="qs-cat-row__count">
                {count}
            </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ── CENTER: Question List ── */}
                <main className="qs-list-panel">
                    {/* toolbar */}
                    <div className="qs-list-toolbar">
                        <div className="qs-list-toolbar__left">
                            <label className="qs-select-all">
                                <input type="checkbox" checked={allOnPage} onChange={toggleAll}/>
                                <span className="qs-select-all__lbl">انتخاب همه صفحه</span>
                            </label>
                            <span className="qs-result-count">{filtered.length} سوال</span>
                        </div>
                        <div className="qs-list-toolbar__right">
                            <select className="qs-sort" value={sortBy}
                                    onChange={e => setSortBy(e.target.value as typeof sortBy)}>
                                <option value="default">پیش‌فرض</option>
                                <option value="diff">سطح دشواری</option>
                                <option value="used">پر‌استفاده‌ترین</option>
                            </select>
                            <button
                                className={`qs-view-btn ${!gridView ? "qs-view-btn--on" : ""}`}
                                onClick={() => setGridView(false)} title="لیست"
                            >☰
                            </button>
                            <button
                                className={`qs-view-btn ${gridView ? "qs-view-btn--on" : ""}`}
                                onClick={() => setGridView(true)} title="شبکه"
                            >⊞
                            </button>
                        </div>
                    </div>

                    {/* list */}
                    <div className={`qs-list ${gridView ? "qs-list--grid" : ""}`}>
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
                                    className={`qs-qcard ${isSel ? "qs-qcard--sel" : ""}`}
                                    style={{animationDelay: `${idx * 0.03}s`}}
                                    onClick={() => toggleQ(q.id)}
                                >
                                    <div style={{
                                        position: "absolute",
                                        top: "12px",
                                        left: "12px",
                                        display: "flex",
                                        gap: "6px",
                                        flexWrap: "wrap",
                                        zIndex: 1
                                    }}>
                                        <span
                                            className={`qs-badge ${DIFF_META[q.diff].cls}`}>{DIFF_META[q.diff].label}</span>
                                        <span
                                            className={`qs-badge ${TYPE_META[q.type].cls}`}>{TYPE_META[q.type].label}</span>
                                        <span className="qs-badge qs-badge--gray">× {q.score}</span>
                                    </div>
                                    <div className="qs-qcard__top">
                                        <input
                                            type="checkbox"
                                            className="qs-qcard__cb"
                                            checked={isSel}
                                            onChange={() => toggleQ(q.id)}
                                            onClick={e => e.stopPropagation()}
                                        />
                                        {q.text && <div className="qs-bitem__text">{q.text}</div>}
                                        {q.question_image && (
                                            <img
                                                src={`http://localhost:8000/Questions/${q.question_image}`}
                                                alt="question"
                                                className="qs-image"
                                                style={{
                                                    width: "100%",
                                                    maxWidth: "300px",
                                                    maxHeight: "220px",
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                    marginTop: "10px",
                                                    border: "1px solid #e5e7eb"
                                                }}
                                            />
                                        )}
                                        {/*<div className="qs-qcard__meta" style={{marginLeft: "auto"}}>*/}
                                        {/*    <span*/}
                                        {/*        className={`qs-badge ${DIFF_META[q.diff].cls}`}>{DIFF_META[q.diff].label}</span>*/}
                                        {/*    <span*/}
                                        {/*        className={`qs-badge ${TYPE_META[q.type].cls}`}>{TYPE_META[q.type].label}</span>*/}
                                        {/*    <span className="qs-badge qs-badge--gray">× {q.score}</span>*/}
                                        {/*</div>*/}
                                    </div>

                                    {q.type === "test" && (
                                        <div className="q-card__opts">
                                            {[
                                                {text: q.A, image: q.A_image},
                                                {text: q.B, image: q.B_image},
                                                {text: q.C, image: q.C_image},
                                                {text: q.D, image: q.D_image},
                                            ].map((opt, i) => {
                                                if (!opt.text && !opt.image) return null;

                                                const letter = LETTERS[i];

                                                return (
                                                    <div
                                                        key={i}
                                                        className={`q-card__opt ${
                                                            letter === q.true_answer
                                                                ? "q-card__opt--ok"
                                                                : ""
                                                        }`}
                                                    >
                    <span className="q-card__opt-ltr">
                        {letter}
                    </span>

                                                        {opt.text && <span>{opt.text}</span>}

                                                        {opt.image && (
                                                            <img
                                                                src={`http://localhost:8000/Questions/${opt.image}`}
                                                                alt={letter}
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "8px",
                                                                    marginRight: "10px"
                                                                }}
                                                            />
                                                        )}

                                                        {letter === q.true_answer && (
                                                            <span
                                                                style={{
                                                                    marginRight: 8,
                                                                    color: "green",
                                                                    fontWeight: "bold"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {q.type === "true_false" && (
                                        <div className="qs-opts">

                                            <div
                                                className={`qs-opt ${
                                                    q.true_answer === "true"
                                                        ? "qs-opt--ok"
                                                        : ""
                                                }`}
                                            >
                                                <span className="qs-opt__ltr">✓</span>

                                                <span>صحیح</span>

                                                {q.true_answer === "true" && (
                                                    <span
                                                        style={{
                                                            color: "#22c55e",
                                                            fontWeight: 700,
                                                            marginRight: "8px"
                                                        }}
                                                    >
                </span>
                                                )}
                                            </div>

                                            <div
                                                className={`qs-opt ${
                                                    q.true_answer === "false"
                                                        ? "qs-opt--ok"
                                                        : ""
                                                }`}
                                            >
                                                <span className="qs-opt__ltr">✗</span>

                                                <span>غلط</span>

                                                {q.true_answer === "false" && (
                                                    <span
                                                        style={{
                                                            color: "#22c55e",
                                                            fontWeight: 700,
                                                            marginRight: "8px"
                                                        }}
                                                    >
                </span>
                                                )}
                                            </div>

                                        </div>
                                    )}

                                    {q.type === "essay" && (
                                        <div className="qs-opts">
                                            <div
                                                className="qs-opt qs-opt--ok"
                                                style={{
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    width: "100%"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                        marginBottom: "8px",
                                                        color: "#22c55e"
                                                    }}
                                                >
                                                    ✓ پاسخ
                                                </div>

                                                <div
                                                    style={{
                                                        whiteSpace: "pre-wrap",
                                                        lineHeight: 1.8
                                                    }}
                                                >
                                                    {q.true_answer}
                                                </div>

                                                {q.essay_image && (
                                                    <img
                                                        src={`http://localhost:8000/Questions/${q.essay_image}`}
                                                        alt="Essay Answer"
                                                        style={{
                                                            direction: 'rtl',
                                                            maxWidth: "200px",
                                                            borderRadius: "8px",
                                                            marginTop: "10px"
                                                        }}
                                                    />
                                                )}
                                            </div>
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
                نمایش {(page - 1) * PER_PAGE + 1} تا {Math.min(page * PER_PAGE, filtered.length)} از {filtered.length}
              </span>
                            <div className="qs-pager__btns">
                                <button className="qs-pg" disabled={page === 1} onClick={() => setPage(p => p - 1)}>«
                                </button>
                                {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                                    <button key={p} className={`qs-pg ${p === page ? "qs-pg--on" : ""}`}
                                            onClick={() => setPage(p)}>{p}</button>
                                ))}
                                <button className="qs-pg" disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}>»
                                </button>
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
                        <div className="qs-meta-row"><span className="qs-meta-lbl">نام آزمون</span><span
                            className="qs-meta-val">{exam.name}</span></div>
                        <div className="qs-meta-row"><span className="qs-meta-lbl">کلاس</span><span
                            className="qs-meta-val">{exam.class}</span></div>
                        <div className="qs-meta-row"><span className="qs-meta-lbl">مدت زمان</span><span
                            className="qs-meta-val">{exam.duration} دقیقه</span></div>
                        {/*<div className="qs-meta-row"><span className="qs-meta-lbl">هدف بارم</span><span*/}
                        {/*    className="qs-meta-val">{exam.score} </span></div>*/}
                        <div className="qs-meta-row">
                            <span className="qs-meta-lbl">بارم انتخاب شده</span>
                            <span className="qs-meta-val">{selectedScore}</span>
                        </div>
                    </div>

                    {/* progress */}
                    <div className="qs-prog">
                        <div className="qs-prog__top">
                            <span className="qs-prog__lbl">تکمیل بارم آزمون</span>

                            <span
                                className="qs-prog__pct"
                                style={{
                                    color: over
                                        ? "var(--rose)"
                                        : exact
                                            ? "var(--green)"
                                            : "var(--primary)"
                                }}
                            >
            {pct}%
        </span>
                        </div>

                        <div className="qs-prog__track">
                            <div
                                className={`qs-prog__fill ${over ? "qs-prog__fill--over" : ""}`}
                                style={{width: `${pct}%`}}
                            />
                        </div>

                        {over && (
                            <div className="qs-prog__note qs-prog__note--warn">
                                ⚠ بارم انتخاب شده بیشتر از بارم آزمون است
                                ({selectedScore}/{exam.score})
                            </div>
                        )}

                        {exact && (
                            <div className="qs-prog__note qs-prog__note--ok">
                                ✓ بارم آزمون کامل شد
                            </div>
                        )}
                    </div>

                    {/* distribution */}
                    <div className="qs-dist">
                        <div className="qs-dist__title">توزیع دشواری</div>
                        <div className="qs-dist__row">
                            <div className="qs-dist__chip" style={{
                                background: "var(--green-lt)",
                                color: "var(--green)",
                                borderColor: "transparent"
                            }}>
                                آسان <strong>{dist.easy}</strong>
                            </div>
                            <div className="qs-dist__chip"
                                 style={{background: "#FEF3C7", color: "#92400E", borderColor: "transparent"}}>
                                متوسط <strong>{dist.medium}</strong>
                            </div>
                            <div className="qs-dist__chip" style={{
                                background: "var(--rose-lt)",
                                color: "var(--rose)",
                                borderColor: "transparent"
                            }}>
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
                                    <div className="qs-bitem__num">{idx + 1}</div>
                                    {q.text && <div className="qs-bitem__text">{q.text}</div>}
                                    {q.question_image && (
                                        <img
                                            src={`http://localhost:8000/Questions/${q.question_image}`}
                                            alt="question"
                                            className="question-image"
                                            style={{
                                                width: "100%",
                                                maxWidth: "300px",
                                                maxHeight: "220px",
                                                objectFit: "contain",
                                                borderRadius: "8px",
                                                marginTop: "10px",
                                                border: "1px solid #e5e7eb"
                                            }}
                                        />
                                    )}
                                    <div className="qs-bitem__acts">
                                        <button className="qs-bitem__move" onClick={() => moveUp(q.id)} title="بالاتر">↑
                                        </button>
                                        <button className="qs-bitem__move" onClick={() => moveDown(q.id)}
                                                title="پایین‌تر">↓
                                        </button>
                                        <button className="qs-bitem__del" onClick={() => removeQ(q.id)} title="حذف">×
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* footer */
                    }
                    <div className="qs-basket__foot">
                        {/*<div className="qs-score-row">*/}
                        {/*    <div>*/}
                        {/*        <div className="qs-score-row__lbl">نمره هر سوال</div>*/}
                        {/*        <div className="qs-score-row__sub">بر اساس تعداد کل</div>*/}
                        {/*    </div>*/}
                        {/*    <div className="qs-score-row__val">*/}
                        {/*        {selected.length > 0 ? `${(20 / selected.length).toFixed(1)}` : "—"}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <button
                            className="qs-btn qs-btn--primary"
                            style={{width: "100%", justifyContent: "center"}}
                            disabled={selectedScore !== exam.score || saving}
                            onClick={handleDone}
                        >
                            {saving
                                ? <><span className="qs-btn__spin"/>در حال ذخیره...</>
                                : <>✓ تأیید {selected.length} سوال و ذخیره آزمون</>
                            }
                        </button>
                        {selected.length > 0 && (
                            <button
                                className="qs-btn qs-btn--danger"
                                style={{width: "100%", justifyContent: "center"}}
                                onClick={() => setSelected([])}
                            >
                                🗑 پاک کردن همه
                            </button>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
        ;
};

export default QuestionSelector;
