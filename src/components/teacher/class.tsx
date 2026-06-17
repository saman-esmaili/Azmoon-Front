// ── 1. Classes ────────────────────────────────────────────────────────────────
import {useEffect, useState} from "react";
import Axios from 'axios';
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";
import ThreeDotsMenu from "../DotMenu";
import DeleteClassModal from "./delete_class";
import DeleteModal from "./delete_class";

interface ClassData {
    id: number;
    name: string;
    subject: string;
    grade: string;
    description: string;
    link: string;
    student_count: number;
}

interface ClassInfoType {
    class_count: number;
    exam_count: number;
    student_count: number;
    next_exam_date: string;
    next_exam_name: string
}

export const ClassesSection: React.FC = () => {
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [CLASSES, setCLASSES] = useState<ClassData[]>([]);
    const [ClassInfo, setClassInfo] = useState<ClassInfoType>({
        class_count: 0,
        exam_count: 0,
        student_count: 0,
        next_exam_date: '',
        next_exam_name: ''
    });
    const [className, setClassName] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");
    const [lessonName, setLessonName] = useState('');
    const [grade, setGrade] = useState('');
    const [description, setDescription] = useState<string | null>(null);
    const [addError, setAddError] = useState('');
    const [open, setOpen] = useState(false);
    const [DeleteClassId, setDeleteClassId] = useState(-1);
    const [EditClassId, setEditClassId] = useState(-1);
    const [DeleteClassName, setDeleteClassName] = useState('');
    const [toastErr, setToastErr] = useState('');
    const [toast, setToast] = useState(false);
    // API
    const addClassSession = () => {
        setModal(true)
        setClassName('')
        setLessonName('')
        setDescription(null)
        setToast(false)
        setToastErr('')
    }

    const checkField = (class_name: string, lesson_name: string, grade: string, description: string | null) => {
        if (class_name === '') {
            setAddError('فیلد نام کلاس را پر کنید!')
            return false
        } else if (4 > className.length || className.length > 25) {
            setAddError('نام کلاس باید حداقل 4 و حداکثر 25 کاراکتر داشته باشد')
            return false
        }
        if (lesson_name === '') {
            setAddError('فیلد نام درس را پر کنید!')
            return false
        } else if (4 > lesson_name.length || lesson_name.length > 25) {
            setAddError('نام درس باید حداقل 4 و حداکثر 25 کاراکتر داشته باشد')
            return false
        }
        if (grade === '') {
            setAddError('پایه تحصیلی مدنظر خود را انتخاب کنید!')
            return false
        }
        if (description !== null) {
            if (4 > description.length || description.length > 200) {
                setAddError('توضیحات باید حداقل 4 و حداکثر 200 کاراکتر داشته باشد')
                return false
            }
        }
        if (description === '') {
            setDescription(null)
        }
        return true
    }


    const addClass = async (): Promise<void> => {
        const field_fill = checkField(className, lessonName, grade, description);
        const data = {'name': className, 'lesson': lessonName, 'grade': grade, 'description': description}
        if (field_fill) {
            Axios.post('http://localhost:8000/teacher/add/class', data, {withCredentials: true})
                .then((res) => {
                    setModal(false)
                    setAddError('')
                    getClass(page)
                })
                .catch(async (err) => {
                    if (err.response.status === 401) {
                        const is_successful = await CheckAuth();
                        if (is_successful) {
                            return addClass();
                        }
                    } else if (err.response.status === 402) {
                        setToastErr('برای ایجاد کلاس به یک پلن فعال نیاز دارید!')
                        setToast(true)
                        return
                    } else if (err.response.status === 409) {
                        setAddError('نام کلاس تکراری است!')
                        return
                    } else {
                        setAddError('مشکلی در افزودن کلاس پیش آمده! لطفا دوباره تلاش کنید!')
                        return
                    }
                    revoke()
                    navigate('/auth');
                })
        }
    }

    const navigate = useNavigate()

    const getClass = async (pageNumber = 1): Promise<void> => {
        try {
            const res = await Axios.get(
                `http://localhost:8000/teacher/class?page=${pageNumber}&size=6&search=${search}`,
                {withCredentials: true}
            );
            setCLASSES(res.data.class);
            setPages(res.data.pages);
        } catch (err: unknown) {
            if (Axios.isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getClass(page);
                    }
                }
            }
            revoke()
            navigate('/auth');
        }
    };
    const getInfoClass = async (): Promise<void> => {
        try {
            const res = await Axios.get(
                `http://localhost:8000/teacher/class/header`,
                {withCredentials: true}
            );
            setClassInfo(res.data.all_info)

        } catch (err: unknown) {
            if (Axios.isAxiosError(err)) {
                const status = err.response?.status;
                if (status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getInfoClass();
                    }
                }
            }
            revoke()
            navigate('/auth');
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchText);
            setPage(1);
        }, 800);

        return () => clearTimeout(timer);
    }, [searchText]);
    useEffect(() => {
        getClass(page)
    }, [page, search]);
    useEffect(() => {
        getInfoClass()
    }, []);

    const delete_class = (class_id: number) => {
        Axios.delete(`http://localhost:8000/teacher/delete/class/${class_id}`, {withCredentials: true})
            .then((res) => {
                getClass(page)
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return delete_class(class_id);
                    }
                }
                revoke()
                navigate('/auth');
            })
    }

    const editClass = (class_id: number) => {
        const field_fill = checkField(className, lessonName, grade, description);
        const data = {'name': className, 'lesson': lessonName, 'grade': grade, 'description': description}

        if (field_fill) {
            Axios.put(`http://localhost:8000/teacher/edit/class/${class_id}`, data, {withCredentials: true})
                .then((res) => {
                    setModal(false)
                    setEditModal(false)
                    setLessonName('')
                    setClassName('')
                    setGrade('')
                    setDescription('')
                    setAddError('')
                    getClass(page)
                })
                .catch(async (err) => {
                    if (err.response.status === 401) {
                        const is_successful = await CheckAuth();
                        if (is_successful) {
                            return editClass(class_id);
                        }
                    } else if (err.response.status === 409) {
                        setAddError('نام کلاس تکراری است!')
                        return
                    }
                    revoke()
                    navigate('/auth');
                })
        }
    }

    // --- END API ---
    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">کلاس‌های من</div>
                    <div className="tch-sec-sub">{ClassInfo.class_count} کلاس فعال</div>
                </div>
                <div className="tch-sec-header__right">
                    <input
                        className="tch-input"
                        style={{width: 200}}
                        placeholder="🔍 جستجو..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="tch-btn tch-btn--primary" onClick={() => addClassSession()}>+ ایجاد کلاس جدید
                    </button>
                </div>
            </div>

            <div className="tch-stats">
                {[
                    {
                        icon: "🏫",
                        label: "کل کلاس‌ها",
                        value: `${ClassInfo.class_count}`,
                        note: "فعال",
                        bg: "var(--primary-lt)",
                        color: "var(--primary)"
                    },
                    {
                        icon: "👥",
                        label: "کل دانش‌آموزان",
                        value: `${ClassInfo.student_count}`,
                        note: "در همه کلاس‌ها",
                        bg: "var(--sky-lt)",
                        color: "var(--sky)"
                    },
                    {
                        icon: "📝",
                        label: "کل آزمون‌ها",
                        value: `${ClassInfo.exam_count}`,
                        note: "تا الان",
                        bg: "var(--violet-lt)",
                        color: "var(--violet)"
                    },
                    {
                        icon: "📅",
                        label: "آزمون آینده",
                        value: `${ClassInfo.next_exam_date || '؟'}`,
                        note: `${ClassInfo.next_exam_name || '-'}`,
                        bg: "var(--accent-lt)",
                        color: "var(--accent)"
                    },
                ].map(s => (
                    <div key={s.label} className="tch-stat">
                        <div className="tch-stat__icon" style={{background: s.bg}}>{s.icon}</div>
                        <div>
                            <div className="tch-stat__label">{s.label}</div>
                            <div className="tch-stat__value" style={{color: s.color}}>{s.value}</div>
                            <div className="tch-stat__change tch-stat__up">{s.note}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="class-grid">
                {CLASSES?.map(c => (
                    <div key={c.id} className="class-card">

                        <div className="class-card__stripe" style={{background: 'green'}}/>
                        <div className="class-card__head">
                            <span className="tch-badge tch-badge--gray">{c.grade}</span>
                            <ThreeDotsMenu
                                items={[
                                    {
                                        label: "کپی لینک کلاس",
                                        onClick: () => {
                                            navigator.clipboard.writeText(c.link);
                                        },
                                    },
                                    {
                                        label: "حذف",
                                        onClick: () => {
                                            setDeleteClassId(c.id)
                                            setDeleteClassName(c.name)
                                            setOpen(true)
                                        },
                                    },
                                    {
                                        label: "ویرایش",
                                        danger: true,
                                        onClick: () => {
                                            setClassName(c.name)
                                            setGrade(c.grade)
                                            setDescription(c.description)
                                            setLessonName(c.subject)
                                            setEditClassId(c.id)
                                            setEditModal(true);
                                            setModal(true);
                                        },
                                    },
                                ]}
                            />

                        </div>
                        <div className="class-card__name">{c.name}</div>
                        <div className="class-card__meta">{c.subject}</div>
                        {/*• آزمون بعدی: {c.nextExam}*/}
                        <div className="class-card__footer">
                            <span className="class-card__stu">👥 {c.student_count} دانش‌آموز</span>
                            {/*<div style={{display: "flex", gap: 6}}>*/}
                            {/*    <button className="tch-btn tch-btn--ghost tch-btn--sm">مشاهده</button>*/}
                            {/*    <button className="tch-btn tch-btn--primary tch-btn--sm">آزمون</button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                ))}
                {Array.isArray(CLASSES) && CLASSES.length === 0 &&
                    <div className="class-card--new" onClick={() => addClassSession()}>
                        <div className="class-card--new__icon">➕</div>
                        <div className="class-card--new__label">کلاس جدید</div>
                    </div>}
            </div>
            <DeleteModal
                isOpen={open}
                ItemName={DeleteClassName}
                name='کلاس'
                onCancel={() => setOpen(false)}
                onConfirm={() => {
                    if (DeleteClassId !== -1) {
                        delete_class(DeleteClassId)
                    }
                    setOpen(false)
                }}
            />
            {modal && (
                <div className="tch-modal-backdrop" onClick={() => setModal(false)}>
                    <div className="tch-modal" onClick={e => e.stopPropagation()}>
                        <div className="tch-modal__header">
                            <span className="tch-modal__title">🏫 {editModal ? "ویرایش" : "ایجاد"} کلاس جدید</span>
                            <button className="tch-modal__close" onClick={() => setModal(false)}>×</button>
                        </div>
                        <div className="tch-modal__body">
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">نام کلاس *</label><input className="tch-input"
                                                                                                onChange={(e) => {
                                                                                                    setClassName(e.target.value)
                                                                                                }}
                                                                                                value={className}
                                                                                                placeholder="مثلاً: ریاضی پایه دهم"/>
                                </div>
                                <div><label className="tch-form-label">درس *</label><input className="tch-input"
                                                                                           value={lessonName}
                                                                                           onChange={(e) => {
                                                                                               setLessonName(e.target.value)
                                                                                           }}
                                                                                           placeholder="مثلاً: ریاضی"/>
                                </div>
                            </div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">پایه تحصیلی</label><select className="tch-select"
                                                                                                  value={grade}
                                                                                                  onChange={(e) => {
                                                                                                      setGrade(e.target.value)
                                                                                                  }}
                                                                                                  style={{width: "100%"}}>
                                    <option>دبستان</option>
                                    <option>راهنمایی</option>
                                    <option>دهم</option>
                                    <option>یازدهم</option>
                                    <option>دوازدهم</option>
                                    <option>دانشگاه</option>
                                    <option>سایر</option>
                                </select></div>
                            </div>
                            <div className="tch-form-full"><label className="tch-form-label">توضیحات</label><textarea
                                className="tch-textarea" rows={3}
                                value={description || ''}  // <--- این خط را تغییر دهید
                                onChange={(e) => {
                                    setDescription(e.target.value); // این قسمت را می‌توانید به همین شکل نگه دارید
                                    // یا اگر می‌خواهید null ذخیره شود: setDescription(e.target.value === '' ? null : e.target.value);
                                }} placeholder="توضیحات کلاس..."/>
                            </div>
                        </div>
                        {addError && <div>
                            <p style={{
                                color: 'tomato',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                padding: '0 30px 16px 0'
                            }}>{addError}</p>
                        </div>}
                        <div className="tch-modal__footer">
                            <button className="tch-btn tch-btn--ghost" onClick={() => setModal(false)}>انصراف</button>
                            {editModal ?
                                <button className="tch-btn tch-btn--primary" onClick={() => editClass(EditClassId)}>✓
                                    ویرایش کلاس</button> :
                                <button className="tch-btn tch-btn--primary" onClick={() => addClass()}>✓ ایجاد
                                    کلاس</button>}

                        </div>
                    </div>
                </div>
            )}
            {CLASSES.length > 6 && (<div className="tch-pagination">
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

            {toast && <div className="error-landing-toast">{toastErr}</div>}
        </>
    );
};