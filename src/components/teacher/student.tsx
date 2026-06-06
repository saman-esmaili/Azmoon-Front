import {useState} from "react";
import {CLASSES, scoreColor, STUDENTS} from "./types";

export const StudentsSection: React.FC = () => {
    const [drawer, setDrawer] = useState<typeof STUDENTS[0] | null>(null);
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = STUDENTS.filter(s => s.name.includes(search) || s.class.includes(search));

    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">دانش‌آموزان</div>
                    <div className="tch-sec-sub">{STUDENTS.length} دانش‌آموز</div>
                </div>
                <div className="tch-sec-header__right">
                    <input className="tch-input" style={{width: 200}} placeholder="🔍 جستجو..." value={search}
                           onChange={e => setSearch(e.target.value)}/>
                    <button className="tch-btn tch-btn--primary" onClick={() => setAddModal(true)}>+ افزودن دانش‌آموز
                    </button>
                </div>
            </div>

            <div className="tch-card">
                <div className="tch-table-wrap">
                    <table className="tch-table">
                        <thead>
                        <tr>
                            <th>دانش‌آموز</th>
                            <th>کلاس</th>
                            <th>میانگین</th>
                            <th>رتبه</th>
                            <th>وضعیت</th>
                            <th>عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(s => {
                            const sc = scoreColor(s.avg, 20);
                            return (
                                <tr key={s.id}>
                                    <td>
                                        <div style={{display: "flex", alignItems: "center", gap: 10}}>
                                            <div className="tch-table__avatar"
                                                 style={{background: s.bg}}>{s.name[0]}</div>
                                            <div>
                                                <div className="tch-table__name">{s.name}</div>
                                                <div className="tch-table__sub">{s.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="tch-badge tch-badge--gray">{s.class}</span></td>
                                    <td>
                                        <div className="score-bar-wrap">
                                            <div className="score-bar">
                                                <div className="score-bar__fill"
                                                     style={{width: `${(s.avg / 20) * 100}%`, background: sc.color}}/>
                                            </div>
                                            <span className="score-val" style={{color: sc.color}}>{s.avg}</span>
                                        </div>
                                    </td>
                                    <td style={{color: "var(--adm-sub)", fontWeight: 700}}>#{s.rank}</td>
                                    <td><span
                                        className={`tch-badge ${s.status === "active" ? "tch-badge--green" : "tch-badge--gray"}`}>{s.status === "active" ? "فعال" : "غیرفعال"}</span>
                                    </td>
                                    <td>
                                        <div className="tch-table__acts">
                                            <button className="tch-btn tch-btn--ghost tch-btn--sm"
                                                    onClick={() => setDrawer(s)}>نمرات
                                            </button>
                                            <button className="tch-btn tch-btn--danger tch-btn--sm">حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="tch-pagination">
                    <span className="tch-pagination__info">نمایش ۱ تا {filtered.length}</span>
                    <div className="tch-pagination__btns">
                        {["«", "۱", "۲", "»"].map(p => <button key={p}
                                                               className={`tch-page-btn ${p === "۱" ? "tch-page-btn--active" : ""}`}>{p}</button>)}
                    </div>
                </div>
            </div>

            {/* Student drawer */}
            {drawer && (
                <>
                    <div className="stu-drawer-backdrop" onClick={() => setDrawer(null)}/>
                    <div className="stu-drawer">
                        <div className="stu-drawer__header">
                            <span className="stu-drawer__title">مشخصات دانش‌آموز</span>
                            <button className="stu-drawer__close" onClick={() => setDrawer(null)}>×</button>
                        </div>
                        <div className="stu-drawer__body">
                            <div className="stu-drawer__hero">
                                <div className="stu-drawer__avatar"
                                     style={{background: drawer.bg}}>{drawer.name[0]}</div>
                                <div>
                                    <div className="stu-drawer__name">{drawer.name}</div>
                                    <div className="stu-drawer__email">{drawer.email}</div>
                                    <div className="stu-drawer__cls">{drawer.class}</div>
                                </div>
                            </div>
                            <div className="stu-drawer__grid">
                                {[
                                    ["میانگین نمرات", `${drawer.avg} از ۲۰`],
                                    ["رتبه کلاسی", `#${drawer.rank}`],
                                    ["تعداد آزمون", `${drawer.scores.length} آزمون`],
                                    ["وضعیت", drawer.status === "active" ? "فعال" : "غیرفعال"],
                                ].map(([l, v]) => (
                                    <div key={l} className="stu-drawer__info">
                                        <div className="stu-drawer__info-label">{l}</div>
                                        <div className="stu-drawer__info-val">{v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="stu-drawer__scores-title">📊 سابقه نمرات</div>
                            {drawer.scores.map((sc, i) => {
                                const c = scoreColor(sc.score, sc.total);
                                return (
                                    <div key={i} className="stu-score-row">
                                        <div>
                                            <div className="stu-score-row__exam">{sc.exam}</div>
                                            <div className="stu-score-row__date">{sc.date}</div>
                                        </div>
                                        <div className="stu-score-row__right">
                                            <div className="score-bar" style={{width: 80}}>
                                                <div className="score-bar__fill" style={{
                                                    width: `${(sc.score / sc.total) * 100}%`,
                                                    background: c.color
                                                }}/>
                                            </div>
                                            <span className="stu-score-chip" style={{
                                                background: c.bg,
                                                color: c.color
                                            }}>{sc.score}/{sc.total}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div style={{display: "flex", gap: 8, marginTop: 16}}>
                                <button className="tch-btn tch-btn--primary" style={{flex: 1}}>ارسال ایمیل</button>
                                <button className="tch-btn tch-btn--ghost" style={{flex: 1}}>گزارش کامل</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Add student modal */}
            {addModal && (
                <div className="tch-modal-backdrop" onClick={() => setAddModal(false)}>
                    <div className="tch-modal" onClick={e => e.stopPropagation()}>
                        <div className="tch-modal__header">
                            <span className="tch-modal__title">👤 افزودن دانش‌آموز</span>
                            <button className="tch-modal__close" onClick={() => setAddModal(false)}>×</button>
                        </div>
                        <div className="tch-modal__body">
                            <div className="invite-info">
                                <p className="invite-info__main">
                                    🔗 برای افزودن دانش‌آموز، لینک کلاس را برای او ارسال کنید.
                                </p>

                                <p className="invite-info__guide">
                                    📌 برای گرفتن لینک کلاس: به بخش کلاس‌ها مراجعه کنید و روی منوی سه‌نقطه‌ای کنار هر
                                    کلاس کلیک کرده و گزینه «کپی لینک کلاس» را انتخاب کنید.
                                </p>

                                <p className="invite-info__note">
                                    ⚠️ دانش‌آموز برای اولین ورود باید حتماً از طریق همین لینک وارد کلاس شود.
                                </p>
                            </div>
                            {/*<div className="tch-form-row">*/}
                            {/*  <div><label className="tch-form-label">نام *</label><input className="tch-input" placeholder="نام" /></div>*/}
                            {/*  <div><label className="tch-form-label">نام خانوادگی *</label><input className="tch-input" placeholder="نام خانوادگی" /></div>*/}
                            {/*</div>*/}
                            {/*<div className="tch-form-full"><label className="tch-form-label">ایمیل *</label><input className="tch-input" type="email" placeholder="student@example.com" /></div>*/}
                            {/*<div className="tch-form-full"><label className="tch-form-label">انتخاب کلاس</label><select className="tch-select" style={{width:"100%"}}>{CLASSES.map(c=><option key={c.id}>{c.name}</option>)}</select></div>*/}
                        </div>
                        <div className="tch-modal__footer">
                            {/*<button className="tch-btn tch-btn--ghost" onClick={()=>setAddModal(false)}>انصراف</button>*/}
                            {/*<button className="tch-btn tch-btn--primary" onClick={()=>setAddModal(false)}>✓ افزودن</button>*/}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

