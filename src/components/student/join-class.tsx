import {useState, useRef, useMemo, useEffect} from "react";
import "./../../styles/join-class.css";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";

/* ─── Types ───────────────────────────────────────────────────────────── */
interface ClassPreview {
    id: string;
    name: string;
    teacher: string;
    subject: string;
}

interface EnrolledClass {
    id: string;
    name: string;
    teacher: string;
    subject: string;
}


/* ─── Helpers ─────────────────────────────────────────────────────────── */
const normalizeLink = (raw: string): string => {
    let v = raw.trim();
    v = v.replace(/^https?:\/\//, "").replace(/^www\./, "");
    v = v.replace(/\/+$/, "");
    return v;
};

const todayFa = "۱۴۰۳/۰۴/۱۹";

/* ═══════════════════════════════════════════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════════════════════════════════════════ */
interface ConfirmModalProps {
    cls: ClassPreview;
    onConfirm: () => void;
    onCancel: () => void;
    joining: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const JoinClass: React.FC = () => {
    const [link, setLink] = useState("");
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(false);
    const [preview, setPreview] = useState<ClassPreview | null>(null);
    const [toast, setToast] = useState("");
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [enrolled, setEnrolled] = useState<EnrolledClass[]>([]);
    const navigate = useNavigate();
    const get_class = () => {
        Axios.get(`http://localhost:8000/student/class?size=10&page=${page}&search=${search}`, {withCredentials: true})
            .then((res) => {
                setEnrolled(res.data.classes);
                console.log(res.data.classes);
                setPages(res.data.pages);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return get_class();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchText);
            setPage(1);
        }, 800);

        return () => clearTimeout(timer);
    }, [searchText]);
    useEffect(() => {
        get_class()
    }, [page, search]);
    const inputRef = useRef<HTMLInputElement>(null);

    /* ── paste from clipboard ── */
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setLink(text);
                setError("");
            }
        } catch {
            inputRef.current?.focus();
        }
    };

    /* ── validate + lookup ── */
    const handleCheck = () => {
        setError("");
        setPreview(null);
        const trimmed = link.trim();

        if (!trimmed) {
            setError("لطفاً لینک کلاس را وارد کنید");
            return;
        }

        const normalized = normalizeLink(trimmed);
        setChecking(true);
        confirm(normalized)
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleCheck();
    };

    const confirm = (link: string) => {
        const data = {'link': link}
        Axios.post('http://localhost:8000/student/class/join', data, {withCredentials: true})
            .then((res) => {
                setToast(`ثبت نام در کلاس ${res.data.data} با موفقیت انجام شد`)
                get_class()
                setChecking(false);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return confirm(link);
                    }
                } else if (err.response.status === 404) {
                    setError('لینک کلاس معتبر نیست!')
                    setChecking(false);
                } else if (err.response.status === 409) {
                    setError('قبلا در این کلاس ثبتنام کرده اید!')
                    setChecking(false);
                } else if (err.response.status === 400) {
                    setError('\'ظرفیت کلاس تکمیل شده است! به استاد خود اطلاع دهید!')
                    setChecking(false);
                } else if (err.response.status === 402) {
                    setError('استاد پلن فعال ندارد!')
                    setChecking(false);
                }
                // revoke()
                // navigate('/auth');
            })
    }


    return (
        <div className="jc-page" dir="rtl">
            <div className="jc-wrap">

                <div className="jc-header">
                    <div className="jc-title">عضویت در کلاس</div>
                    <div className="jc-sub">لینک کلاس را از مدرس خود دریافت کرده و در اینجا وارد کنید</div>
                </div>

                {/* ── Join hero card ── */}
                <div className="jc-join-card">
                    <div className="jc-join-card__icon">🔗</div>
                    <div className="jc-join-card__title">لینک کلاس را وارد کنید</div>
                    <div className="jc-join-card__desc">
                        لینک دعوت کلاس که توسط مدرس برای شما ارسال شده را در کادر زیر کپی و سپس روی دکمه تأیید کلیک
                        کنید.
                    </div>

                    <div className="jc-input-row">
                        <div className={`jc-input-wrap ${error ? "jc-input-wrap--error" : ""}`}>
                            <span className="jc-input-wrap__icon">🔗</span>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="azmoongir.ir/join/xxxx-xxxx"
                                value={link}
                                onChange={e => {
                                    setLink(e.target.value);
                                    setError("");
                                }}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="jc-paste-btn" onClick={handlePaste}>📋 چسباندن</button>
                        </div>

                        <button
                            className="jc-submit-btn"
                            onClick={handleCheck}
                            disabled={checking}
                        >
                            {checking
                                ? <><span className="jc-submit-btn__spin"/> در حال بررسی...</>
                                : <>✓ تأیید لینک</>
                            }
                        </button>
                    </div>

                    {error && (
                        <div className="jc-error-msg">⚠ {error}</div>
                    )}

                    <div className="jc-help">
                        <span>💡</span>
                        <span>لینک را ندارید؟ از مدرس خود بخواهید لینک کلاس را برایتان ارسال کند.</span>
                    </div>
                </div>

                {/* ── Enrolled classes list ── */}
                <div className="jc-section-head">
                    <span className="jc-section-title">📚 کلاس‌های من</span>
                    <span className="jc-section-count">{enrolled.length} کلاس</span>
                </div>

                {enrolled.length > 0 && (
                    <div className="jc-list-toolbar">
                        <div className="jc-search">
                            <span style={{color: "var(--adm-light)"}}>🔍</span>
                            <input
                                placeholder="جستجو در کلاس‌ها..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {enrolled.length === 0 ? (
                    <div className="jc-empty">
                        <div className="jc-empty__icon">📭</div>
                        <div className="jc-empty__title">
                            {enrolled.length === 0 ? "هنوز در هیچ کلاسی عضو نشده‌اید" : "کلاسی با این مشخصات یافت نشد"}
                        </div>
                        <div className="jc-empty__sub">
                            {enrolled.length === 0 && "لینک کلاس را در کادر بالا وارد کنید"}
                        </div>
                    </div>
                ) : (
                    enrolled.map(c => (
                        <div key={c.id} className="jc-class-card">
                            <div className="jc-class-card__left">
                                <div className="jc-class-card__icon"
                                     style={{background: 'var(--accent-lt)'}}>{c.name[0]}</div>
                                <div>
                                    <div className="jc-class-card__name">{c.name}</div>
                                    <div className="jc-class-card__meta">
                                        <span className="jc-class-card__meta-item">👤 {c.teacher}</span>
                                        <span className="jc-class-card__meta-item">📚 {c.subject}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {enrolled.length > 10 && (<div className="tch-pagination">
                    <div className="tch-pagination__btns">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className={'tch-page-btn'}
                        >
                            «
                        </button>

                        <span className={'tch-pagination__info'}>
        صفحه {page} از {pages}
    </span>

                        <button
                            disabled={page === pages}
                            className={'tch-page-btn'}
                            onClick={() => setPage(p => p + 1)}
                        >
                            »
                        </button>
                    </div>
                </div>)}
            </div>

            {/* ── Success toast ── */}
            {toast && (
                <div className="jc-toast">
                    <span className="jc-toast__icon">✓</span>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default JoinClass;
