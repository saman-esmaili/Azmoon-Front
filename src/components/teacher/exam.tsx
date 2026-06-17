import {useEffect, useState} from "react";
import {CLASSES, EXAMS} from "./types";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";
import QuestionSelector from "./question-selector";

interface classInfo {
    id: number;
    name: string;
}

interface ExamInputs {
    name: string;
    class_id: string;
    exam_date: string;
    start_time: string;
    exam_time: string;
    score: number;
    description: null | string;
    order_type: string;
}

interface ExamLst {
    exam_id: number;
    exam_name: string;
    class_name: string;
    class_id: number;
    exam_date: string;
    exam_start: string;
    exam_time: string;
    question_selected: number;
    exam_status: string;
    score: number;
    order_type: string;
    description: string
}


export const ExamsSection: React.FC = () => {
    const [modal, setModal] = useState(false);
    const [classes, setClasses] = useState<classInfo[]>([]);
    const [examStat, setExamStat] = useState('')
    const [err, setErr] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [editModal, setEditModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");
    const [examId, setExamId] = useState(-1)
    const [examItem, setExamItem] = useState<ExamInputs>({
        name: '',
        class_id: '',
        exam_date: '',
        start_time: '',
        exam_time: '',
        score: 0,
        description: null,
        order_type: 'ordered',
    });

    const [exams, setExams] = useState<ExamLst[]>([]);
    const navigate = useNavigate();
    // API
    const getAddExam = () => {
        Axios.get('http://localhost:8000/teacher/exam/add', {withCredentials: true})
            .then((res) => {
                const class_dict = res.data.classes;
                setClasses(class_dict)
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getAddExam();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const openModal = () => {
        setModal(true);
        getAddExam()
    }
    const control_fields = async () => {
        if (!examItem.name) {
            setErr("فیلد نام آرمون را پر کنید!")
            return false
        } else if (examItem.name.length < 4 || examItem.name.length > 25) {
            setErr('نام آزمون باید حداقل 4 کاراکتر و حداکثر 25 کاراکتر داشته باشد!')
            return false
        }
        if (!examItem.class_id) {
            setErr('کلاس مدنظر را انتخاب کنید!')
            return false
        }
        if (!examItem.exam_date) {
            setErr('تاریخ آزمون را مشخص کنید!')
            return false
        }
        if (!examItem.exam_time) {
            setErr('زمان آزمون را مشخص کنید!')
            return false
        }
        if (!examItem.start_time) {
            setErr('ساعت شروع آزمون را مشخص کنید!')
            return false
        }
        if (!examItem.score) {
            setErr('بارم آزمون را مشخص کنید!')
            return false
        }
        if (examItem.score <= 0) {
            setErr('بارم آزمون باید بزرگتر از 0 باشد!')
            return false
        }
        if (!examItem.order_type) {
            setErr('نحوه نمایش سوالات آزمون را مشخص کنید!')
            return false
        }
        if (examItem.description) {
            if (examItem.description.length < 4 || examItem.description.length > 25) {
                setErr('توضیحات باید حداقل 4 کاراکتر و حداکثر 200 کاراکتر داشته باشد!')
                return false
            }

        }
        return true

    }

    const clearFields = () => {
        setExamItem({
            name: '',
            class_id: '',
            exam_date: '',
            start_time: '',
            exam_time: '',
            score: 0,
            description: null,
            order_type: '',
        })
        setExamId(-1)
    }
    const [toast, setToast] = useState(false);
    const [toastError, setTError] = useState('')
    const addExam = async () => {
        setErr('')
        const is_field_filled = await control_fields()
        if (!is_field_filled) {
            return
        }
        Axios.post('http://localhost:8000/teacher/exam/add', examItem, {withCredentials: true})
            .then((res) => {
                clearFields()
                examsList()
                closeModal()

            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return addExam();
                    } else if (err.response.status === 402) {
                        setTError('برای ایجاد آزمون به یک پلن فعال نیاز دارید!')
                        setToast(true)
                        setTimeout(() => {
                            setToast(false)
                        }, 3000)
                    } else if (err.response.status === 406) {
                        setTError('به سقف ایجاد آزمون رسیده اید!')
                        setToast(true)
                        setTimeout(() => {
                            setToast(false)
                        }, 3000)
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }

    const examsList = () => {
        Axios.get(`http://localhost:8000/teacher/exam?page=${page}&size=6&search=${search}`, {withCredentials: true})
            .then((res) => {
                setExams(res.data.exams);
                setPages(res.data.pages)
                console.log(res.data.exams)
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return examsList();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const [header, setHeader] = useState({
        'درحال برگزاری': 0,
        'پیش رو': 0,
        'برگزار شد': 0,
        'all': 0
    })
    const [meanUsed, setMeanUsed] = useState(0);
    const examsHeader = () => {
        Axios.get(`http://localhost:8000/teacher/exam/header`, {withCredentials: true})
            .then((res) => {
                setHeader(res.data.status);
                setMeanUsed(res.data.mean_used);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return examsHeader();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const closeModal = () => {
        clearFields()
        setModal(false);
        setEditModal(false);
    }
    const openEditModal = (e: any) => {
        getAddExam()
        setExamId(e.exam_id)

        setExamStat(e.exam_status)
        setExamItem({
            name: e.exam_name,
            class_id: e.class_id,
            exam_date: e.exam_date,
            start_time: e.exam_start,
            exam_time: e.exam_time,
            score: e.score,
            description: e.description,
            order_type: e.order_type,
        })
        setEditModal(true)
        setModal(true)
    }

    const removeExam = () => {
        const exam_id = examId;
        Axios.delete(`http://localhost:8000/teacher/exam/${exam_id}`, {withCredentials: true})
            .then((res) => {
                clearFields()
                closeModal();
                examsList();

            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return removeExam();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }

    const editExam = () => {
        const exam_id = examId;
        Axios.put(`http://localhost:8000/teacher/exam/${exam_id}`, examItem, {withCredentials: true})
            .then((res) => {
                examsList()
                closeModal()
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return removeExam();
                    }
                }
                revoke()
                navigate('/auth');
            })

    }
    useEffect(() => {
        examsList();
    }, [page,search]);
    useEffect(() => {
        examsHeader();
    }, [page]);
    // END API

    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">آزمون‌ها</div>
                    <div className="tch-sec-sub">{exams.length} آزمون</div>
                </div>
                <div className="tch-sec-header__right">
                    <input className="tch-input" style={{width: 200}} placeholder="🔍 جستجو..." value={search}
                           onChange={e => setSearch(e.target.value)}/>
                    <button className="tch-btn tch-btn--primary" onClick={() => openModal()}>+ ایجاد آزمون</button>
                </div>
            </div>

            <div className="tch-stats">
                {[
                    {
                        icon: "📝",
                        label: "کل آزمون‌ها",
                        value: `${header.all}`,
                        bg: "var(--primary-lt)",
                        color: "var(--primary)"
                    },
                    {
                        icon: "⏳",
                        label: "پیش رو",
                        value: `${header["پیش رو"] || 0}`,
                        bg: "var(--sky-lt)",
                        color: "var(--sky)"
                    },
                    {
                        icon: "✅",
                        label: "برگزار شده",
                        value: `${header["برگزار شد"] || 0}`,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                    {
                        icon: "📊",
                        label: "میانگین سوال",
                        value: `${meanUsed}`,
                        bg: "var(--violet-lt)",
                        color: "var(--violet)"
                    },
                ].map(s => (
                    <div key={s.label} className="tch-stat">
                        <div className="tch-stat__icon" style={{background: s.bg}}>{s.icon}</div>
                        <div>
                            <div className="tch-stat__label">{s.label}</div>
                            <div className="tch-stat__value" style={{color: s.color}}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="exam-grid">
                {exams.map(e => (
                    <div key={e.exam_id} className="exam-card" onClick={() => (openEditModal(e))}>
                        <div className="exam-card__top">
                            {/*<span style={{fontSize: 30}}>{e.icon}</span>*/}
                            <span
                                className={`tch-badge ${e.exam_status === "پیش رو" ? "tch-badge--sky" : "tch-badge--green"}`}>{e.exam_status === "پیش رو" ? "پیش رو" : "برگزار شد"}</span>
                        </div>
                        <div className="exam-card__name">{e.exam_name}</div>
                        <div className="exam-card__class">{e.class_name}</div>
                        <div className="exam-card__info">
                            <div className="exam-card__info-item">📅 {e.exam_date}</div>
                            <div className="exam-card__info-item">⏱ {e.exam_time} دقیقه</div>
                            <div className="exam-card__info-item">❓ {e.question_selected} </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <div className="tch-modal-backdrop" onClick={() => setModal(false)}>
                    <div className="tch-modal tch-modal--wide" onClick={e => e.stopPropagation()}>
                        <div className="tch-modal__header">
                            <span
                                className="tch-modal__title">📝 {editModal ? 'ویرایش آزمون' : 'ایجاد آزمون جدید'}</span>
                            <button className="tch-modal__close" onClick={() => closeModal()}>×</button>
                        </div>
                        <div className="tch-modal__body">
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">نام آزمون *</label><input className="tch-input"
                                                                                                 placeholder="مثلاً: آزمون میان‌ترم فیزیک"
                                                                                                 value={examItem.name}
                                                                                                 onChange={(e) =>
                                                                                                     setExamItem(prev => ({
                                                                                                         ...prev,
                                                                                                         name: e.target.value
                                                                                                     }))
                                                                                                 }
                                />
                                </div>
                                <div><label className="tch-form-label">کلاس *</label><select

                                    className="tch-select"
                                    style={{width: "100%"}}
                                    onChange={(e) =>
                                        setExamItem(prev => ({
                                            ...prev,
                                            class_id: e.target.value
                                        }))
                                    }
                                >
                                    <option value="">انتخاب کلاس</option>

                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select></div>
                            </div>
                            <div className="tch-form-row-3">
                                <div><label className="tch-form-label">تاریخ برگزاری</label><DatePicker
                                    calendar={persian}
                                    locale={persian_fa}
                                    inputClass="tch-input"
                                    style={{width: '250px'}}
                                    calendarPosition="bottom-center"
                                    value={examItem.exam_date}
                                    onChange={(date) =>
                                        setExamItem(prev => ({
                                            ...prev,
                                            exam_date: date?.format("YYYY/MM/DD") || ""
                                        }))
                                    }
                                /></div>

                                <div><label className="tch-form-label">ساعت شروع</label><input className="tch-input"
                                                                                               value={examItem.start_time}
                                                                                               onChange={(e) =>
                                                                                                   setExamItem(prev => ({
                                                                                                       ...prev,
                                                                                                       start_time: e.target.value
                                                                                                   }))
                                                                                               }
                                                                                               type="time"/></div>
                                <div><label className="tch-form-label">مدت زمان (دقیقه)</label><input
                                    value={examItem.exam_time}
                                    onChange={(e) =>
                                        setExamItem(prev => ({
                                            ...prev,
                                            exam_time: e.target.value
                                        }))
                                    }
                                    className="tch-input" type="number" placeholder="۹۰"/></div>
                            </div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">بارم</label><input className="tch-input"
                                                                                          type="number"
                                                                                          value={examItem.score}
                                                                                          onChange={(e) =>
                                                                                              setExamItem(prev => ({
                                                                                                  ...prev,
                                                                                                  score: Number(e.target.value)
                                                                                              }))
                                                                                          }
                                                                                          placeholder="۲۵"/></div>
                                <div><label className="tch-form-label">نحوه نمایش سوالات</label><select
                                    value={examItem.order_type}
                                    onChange={(e) =>
                                        setExamItem(prev => ({
                                            ...prev,
                                            order_type: e.target.value
                                        }))
                                    }
                                    className="tch-select" style={{width: "100%"}}>
                                    <option value='ordered'>ترتیبی</option>
                                    <option value='unordered'>تصادفی</option>
                                </select></div>
                            </div>
                            <div className="tch-form-full"><label className="tch-form-label">توضیحات
                                آزمون</label><textarea className="tch-textarea" rows={3}
                                                       value={examItem.description ?? ''}
                                                       onChange={(e) =>
                                                           setExamItem(prev => ({
                                                               ...prev,
                                                               description: e.target.value
                                                           }))
                                                       }
                                                       placeholder="دستورالعمل‌ها و توضیحات..."/></div>
                            {/*<div className="tch-form-row">*/}
                            {/*    <div style={{display: "flex", alignItems: "center", gap: 8, padding: "12px 0"}}>*/}
                            {/*        <input type="checkbox" id="antiCheat"/>*/}
                            {/*        <label htmlFor="antiCheat" className="tch-form-label" style={{margin: 0}}>فعال‌سازی*/}
                            {/*            ضد تقلب</label>*/}
                            {/*    </div>*/}
                            {/*    <div style={{display: "flex", alignItems: "center", gap: 8, padding: "12px 0"}}>*/}
                            {/*        <input type="checkbox" id="randomQ"/>*/}
                            {/*        <label htmlFor="randomQ" className="tch-form-label" style={{margin: 0}}>ترتیب تصادفی*/}
                            {/*            گزینه‌ها</label>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {err && <div>
                                <p style={{
                                    color: 'tomato',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    padding: '0 30px 0 0'
                                }}>{err}</p>
                            </div>}
                        </div>
                        {}
                        <div className="tch-modal__footer">
                            {/*disabled={examStat !== 'پیش رو'} */}
                            {(editModal && examStat === 'برگزار شد') && <button className="tch-btn tch-btn--accent"
                                                                                onClick={() => navigate(`/exam/grading/${examId}`)}>تصحیح
                                آزمون
                            </button>}
                            {(editModal && examStat === 'پیش رو') && <>
                                <button className="tch-btn tch-btn--accent"
                                        onClick={() => navigate(`/question-selector/${examId}`)}>انتخاب سوالات
                                    ←
                                </button>
                                <button className="tch-btn tch-btn--primary" onClick={() => editExam()}>✓ ویرایش
                                    آزمون
                                </button>
                            </>}

                            {!editModal &&
                                <button className="tch-btn tch-btn--primary" onClick={() => addExam()}>✓ ذخیره
                                    آزمون</button>
                            }
                            {editModal &&
                                <button className="tch-btn tch-btn--danger" onClick={() => removeExam()}>✗ حذف
                                    آزمون</button>}
                            <button className="tch-btn tch-btn--ghost" onClick={() => closeModal()}>انصراف</button>

                        </div>
                    </div>
                    {toast && <div className="error-landing-toast">{toastError}</div>}
                </div>
            )}
            {exams.length > 6 && (<div className="tch-pagination">
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
        </>
    );
};
