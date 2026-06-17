import {useEffect, useState} from "react";
import {scoreColor} from "./types";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import DeleteModal from "./delete_class";
import {useNavigate} from "react-router-dom";

interface StudentInfo {
    student_id: number;
    student_email: null | string;
    student_name: null | string;
    student_last_name: null | string;
    student_mobile: string;
    class_name: string;
    class_id: number;
    mean_score: number;
    student_class_id: number;
    total_score: number;
}

interface ScoreInfo {
    student_score: number;
    exam_score: number;
    date: string;
    exam: string
}

export const StudentsSection: React.FC = () => {
    const [drawer, setDrawer] = useState<typeof STUDENTS[0] | null>(null);
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState("");
    const [STUDENTS, setStudent] = useState<StudentInfo[]>([])
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [openDelete, setOpenDelete] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [maxScore, setMaxScore] = useState(-1);
    const [scores, setScores] = useState<ScoreInfo[]>([]);
    const navigate = useNavigate();
    const get_student = (pageNumber = 1) => {
        Axios.get(`http://localhost:8000/teacher/students?page=${pageNumber}&size=10&search=${search}`, {withCredentials: true})
            .then((res) => {
                console.log(res.data.students)
                setStudent(res.data.students);
                setPages(res.data.pages);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return get_student(page);
                    }
                }
                revoke()
                navigate('/auth');
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
        get_student(page)
    }, [page, search]);
    const [SCID, setSCID] = useState(-1)
    const [student_name, setStudentName] = useState('')
    const handle_delete = (id: number, text: string) => {
        setSCID(id);
        setStudentName(text);
        setOpenDelete(true);
    }
    const delete_student = (id: number) => {
        Axios.delete(`http://localhost:8000/teacher/student/${id}`, {withCredentials: true})
            .then((res) => {
                get_student()
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return get_student(page);
                    }
                }
            })
    }

    const openDrawer = (s: any) => {
        setDrawer(s);
        Axios.get(`http://localhost:8000/teacher/student/score/${s.student_id}/${s.class_id}`, {withCredentials: true})
            .then((res) => {
                setMaxScore(res.data.maxScore);
                setScores(res.data.scores);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return get_student(page);
                    }
                }
            })
    }

    // const filtered = STUDENTS.filter(s => s.student_name?.includes(search) || s.class_name.includes(search) || s.student_last_name?.includes(search));

    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">دانش‌آموزان</div>
                </div>
                <div className="tch-sec-header__right">
                    <input
                        className="tch-input"
                        style={{width: 200}}
                        placeholder="🔍 جستجو..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
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
                            <th>عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {STUDENTS.map(s => {
                            const sc = scoreColor(s.mean_score, s.total_score);
                            return (
                                <tr key={s.student_class_id}>
                                    <td>
                                        <div style={{display: "flex", alignItems: "center", gap: 10}}>
                                            <div className="tch-table__avatar"
                                                 style={{background: 'linear-gradient(135deg,#0D9488,#0EA5E9)'}}>{s.student_name?.[0] || '?'}</div>
                                            <div>

                                                <div
                                                    className="tch-table__name">{`${s.student_name || ''} ${s.student_last_name || ''}`.trim() || '-'}</div>
                                                <div className="tch-table__sub">{s.student_mobile}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="tch-badge tch-badge--gray">{s.class_name}</span></td>
                                    <td>
                                        <div className="score-bar-wrap">
                                            <div className="score-bar">
                                                <div className="score-bar__fill"
                                                     style={{
                                                         width: `${(s.mean_score / s.total_score) * 100}%`,
                                                         background: sc.color
                                                     }}/>
                                            </div>
                                            <span className="score-val"
                                                  style={{color: sc.color}}>{s.mean_score || '-'}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="tch-table__acts">
                                            <button className="tch-btn tch-btn--ghost tch-btn--sm"
                                                    onClick={() => openDrawer(s)}>نمرات
                                            </button>
                                            <button className="tch-btn tch-btn--danger tch-btn--sm" onClick={() => {
                                                handle_delete(s.student_class_id, `${s.student_mobile} از ${s.class_name}`)
                                            }}>حذف
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                {STUDENTS.length > 10 && (<div className="tch-pagination">
                    {/*<span className="tch-pagination__info">نمایش {page} تا {pages}</span>*/}
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
                                     style={{background: 'linear-gradient(135deg,#FCD34D,#F97316)'}}>{drawer.student_name?.[0] || '؟'}</div>
                                <div>
                                    <div className="stu-drawer__name">{drawer.student_name || '-'}</div>
                                    <div className="stu-drawer__email">{drawer.student_email || '-'}</div>
                                    <div className="stu-drawer__cls">{drawer.class_name}</div>
                                </div>
                            </div>
                            <div className="stu-drawer__grid">
                                {[
                                    ["میانگین نمرات", `${drawer.mean_score || '-'}`],
                                    ["بالاترین نمره", `${maxScore !== -1 ? maxScore : '-'}`]
                                ].map(([l, v]) => (
                                    <div key={l} className="stu-drawer__info">
                                        <div className="stu-drawer__info-label">{l}</div>
                                        <div className="stu-drawer__info-val">{v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="stu-drawer__scores-title">📊 سابقه نمرات</div>
                            {scores.map((sc, i) => {
                                const c = scoreColor(sc.student_score, sc.exam_score);
                                return (
                                    <div key={i} className="stu-score-row">
                                        <div>
                                            <div className="stu-score-row__exam">{sc.exam}</div>
                                            <div className="stu-score-row__date">{sc.date}</div>
                                        </div>
                                        <div className="stu-score-row__right">
                                            <div className="score-bar" style={{width: 80}}>
                                                <div className="score-bar__fill" style={{
                                                    width: `${(sc.student_score / sc.exam_score) * 100}%`,
                                                    background: c.color
                                                }}/>
                                            </div>
                                            <span className="stu-score-chip" style={{
                                                background: c.bg,
                                                color: c.color
                                            }}>{sc.student_score}/{sc.exam_score}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {/*<div style={{display: "flex", gap: 8, marginTop: 16}}>*/}
                            {/*    <button className="tch-btn tch-btn--primary" style={{flex: 1}}>ارسال ایمیل</button>*/}
                            {/*    <button className="tch-btn tch-btn--ghost" style={{flex: 1}}>گزارش کامل</button>*/}
                            {/*</div>*/}
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
            <DeleteModal
                isOpen={openDelete}
                ItemName={student_name}
                name='حذف دانش آموز'
                onCancel={() => setOpenDelete(false)}
                onConfirm={() => {
                    if (SCID !== -1) {
                        delete_student(SCID)
                    }
                    setOpenDelete(false)
                }}
            />
        </>
    );
};

