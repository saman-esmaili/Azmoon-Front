import {useEffect, useState} from "react";
import {diffBadge, diffLabel} from './types'
import Axios from 'axios';
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";
import DeleteModal from "./delete_class";

interface QuestionData {
    id: number;
    text: string;
    score: number;
    cat: string;
    diff: string;
    type: string;
    true_answer: string;
    A: null | string;
    B: null | string;
    C: null | string;
    D: null | string;
    essay: null | string;
    question_image: null | string;
    A_image: null | string;
    B_image: null | string;
    C_image: null | string;
    D_image: null | string;
    essay_image: null | string;
}

interface QuestionHeaderData {
    all: 0;
    use_count: 0;
    test_count:0,
    true_false_count:0
    essay_count:0
}

const QuestionsSection: React.FC = () => {
    const [modal, setModal] = useState(false);
    // const [editQ, setEditQ] = useState<typeof QUESTIONS[0] | null>(null);
    const LETTERS = ["A", "B", "C", "D"];
    const [questionType, setQuestionType] = useState('test')
    const [difficulty, setDifficulty] = useState('easy')
    const [questionText, setQuestionText] = useState('')
    const [category, setCategory] = useState('')
    const [trueAnswer, setTrueAnswer] = useState('')
    const [QUESTIONS, setQuestions] = useState<QuestionData[]>([])
    const [edit, setEdit] = useState(false)
    const [QuestionID, setQuestionID] = useState(-1)
    const [toastErr, setToastErr] = useState('');
    const [toast, setToast] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState("");
    const [openDelete, setOpenDelete] = useState(false)
    const [questionHeader, setQuestionHeader] = useState<QuestionHeaderData>()
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [options, setOptions] = useState<{
        A: string | null;
        B: string | null;
        C: string | null;
        D: string | null;
    }>({
        A: null,
        B: null,
        C: null,
        D: null,
    });
    const navigate = useNavigate();
    const [addError, setError] = useState('')
    const [score, setScore] = useState(0)
    const open = () => {
        setModal(true)
    }
    const openEdit = (q: QuestionData) => {
        const BASE_URL = "http://localhost:8000/Questions";

        setQuestionID(q.id);
        setQuestionText(q.text);
        setScore(q.score);
        setCategory(q.cat);
        setTrueAnswer(q.true_answer);
        setQuestionType(q.type);
        setDifficulty(q.diff);

        setOptions({
            A: q.A,
            B: q.B,
            C: q.C,
            D: q.D,
        });

        setPhotos({
            question: null,
            A: null,
            B: null,
            C: null,
            D: null,
            essay: null,
        });

        setPreviews({
            question: q.question_image
                ? `${BASE_URL}/${q.question_image}`
                : null,

            A: q.A_image
                ? `${BASE_URL}/${q.A_image}`
                : null,

            B: q.B_image
                ? `${BASE_URL}/${q.B_image}`
                : null,

            C: q.C_image
                ? `${BASE_URL}/${q.C_image}`
                : null,

            D: q.D_image
                ? `${BASE_URL}/${q.D_image}`
                : null,

            essay: q.essay_image
                ? `${BASE_URL}/${q.essay_image}`
                : null,
        });

        setEdit(true);
        setModal(true);
    };


    // API

    const [photos, setPhotos] = useState<{
        question: File | null;
        A: File | null;
        B: File | null;
        C: File | null;
        D: File | null;
        essay: File | null;
    }>({
        question: null,
        A: null,
        B: null,
        C: null,
        D: null,
        essay: null,
    });
    const [previews, setPreviews] = useState<{
        question: string | null;
        A: string | null;
        B: string | null;
        C: string | null;
        D: string | null;
        essay: string | null;
    }>({
        question: null,
        A: null,
        B: null,
        C: null,
        D: null,
        essay: null,
    });

    const handlePhoto = (key: string) => (e: any) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const MAX_FILE_SIZE = 220 * 1024;

        const ALLOWED_TYPES = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        // بررسی فرمت
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("فقط فایل‌های JPG، JPEG، PNG و WEBP مجاز هستند");
            e.target.value = "";
            return;
        }

        // بررسی حجم
        if (file.size > MAX_FILE_SIZE) {
            setError("حجم عکس نباید بیشتر از 220 کیلوبایت باشد");
            e.target.value = "";
            return;
        }

        setError("");

        setPhotos(prev => ({
            ...prev,
            [key]: file
        }));

        setPreviews(prev => ({
            ...prev,
            [key]: URL.createObjectURL(file)
        }));
    };
    const removePhoto = (
        key: "question" | "A" | "B" | "C" | "D" | "essay"
    ) => {
        setPhotos(prev => ({
            ...prev,
            [key]: null
        }));

        setPreviews(prev => ({
            ...prev,
            [key]: null
        }));
    };

    const closeModal = () => {
        setModal(false);
        setError('');
        getQuestions();
    }

    const handleData = async (q_text: string, category: string, score: number, a: string | null, b: string | null, c: string | null, d: string | null, true_answer: string) => {
        if (q_text === '' && (!photos.question && !previews.question)) {
            setError('سوال خود را بنویسید!')
            return false
        }
        if (!photos.question) {
            if (q_text.length > 350) {
                setError('متن سوال باید حداکثر 350 کاراکتر داشته باشد!')
                return false
            }
        }
        if (category === '') {
            setError('لطفا فیلد دسته بندی را پر کنید')
            return false
        }
        if (score <= 0) {
            setError('مقدار بارم باید بیش از 0 باشد!')
            return false
        }
        if (questionType === 'test') {
            if (!a && !photos.A && !previews.A) {
                setError('لطفا گزینه A را پر کنید!')
                return false
            }

            if (!b && !photos.B && !previews.B) {
                setError('لطفا گزینه B را پر کنید!')
                return false
            }

            if (!c && !photos.C && !previews.C) {
                setError('لطفا گزینه C را پر کنید!')
                return false
            }

            if (!d && !photos.D && !previews.D) {
                setError('لطفا گزینه D را پر کنید!')
                return false
            }
        }
        if (questionType === 'essay' && (!photos.essay && !previews.essay)) {
            if (true_answer === '' || !true_answer) {
                setError('گزینه صحیح را انتخاب کنید!')
                return false
            }
        }
        if (questionType !== 'essay') {
            if (true_answer === '' || !true_answer) {
                setError('گزینه صحیح را انتخاب کنید!')
                return false
            }
        }


        return true
    }

    const handleSubmit = async () => {
        const is_good = await handleData(questionText, category, score, options.A, options.B, options.C, options.D, trueAnswer)
        if (!is_good) {
            return
        }
        const formData = new FormData();
        const result = {
            'question': questionText,
            'difficulty': difficulty,
            'type': questionType,
            'score': score,
            'category': category,
            'a': options.A,
            'b': options.B,
            'c': options.C,
            'd': options.D,
            'true_answer': trueAnswer
        }
        formData.append("question_data", JSON.stringify(result));

        // هر عکس با key جداگانه
        if (photos.question) formData.append("question_image", photos.question);
        if (photos.A) formData.append("A_image", photos.A);
        if (photos.B) formData.append("B_image", photos.B);
        if (photos.C) formData.append("C_image", photos.C);
        if (photos.D) formData.append("D_image", photos.D);
        if (photos.essay) formData.append("essay_image", photos.essay);
        console.log(difficulty)
        await Axios.post("http://localhost:8000/teacher/question/add", formData, {
            withCredentials: true
        }).then((res) => {
            setTrueAnswer('')
            setError('')
            setCategory('')
            setScore(0)
            setQuestionText('')

            setOptions({
                A: "",
                B: "",
                C: "",
                D: "",
            });

            setPhotos({
                question: null,
                A: null,
                B: null,
                C: null,
                D: null,
                essay: null,
            });

            setPreviews({
                question: null,
                A: null,
                B: null,
                C: null,
                D: null,
                essay: null,
            });
        })
            .catch(async (err) => {
                const status = err.response.status;
                if (status === 401) {
                    const is_successful = await CheckAuth()
                    if (is_successful) {
                        return handleSubmit()
                    }
                } else if (status === 400) {
                    setError('خطایی در ثبت سوال پیش آمده!')
                } else if (err.response.status === 402 || err.response.status === 406) {
                    setToastErr('برای ایجاد سوال به یک پلن فعال نیاز دارید!')
                    setToast(true)
                    return
                }
                revoke()
                navigate('/auth')
            })

    };
    const getQuestions = () => {
        Axios.get(`http://localhost:8000/teacher/question?page=${page}&size=5&search=${search}`, {withCredentials: true})
            .then((res) => {
                setQuestions(res.data.questions);
                setQuestionHeader(res.data.questions_info);
                setPages(res.data.pages);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getQuestions();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const getQuestionsHeader = () => {
        Axios.get('http://localhost:8000/teacher/question/header', {withCredentials: true})
            .then((res) => {
                setQuestionHeader(res.data.questions_info);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getQuestionsHeader();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    const clearInput = () => {
        setTrueAnswer('')
        setError('')
        setCategory('')
        setScore(0)
        setQuestionText('')

        setOptions({
            A: "",
            B: "",
            C: "",
            D: "",
        });

        setPhotos({
            question: null,
            A: null,
            B: null,
            C: null,
            D: null,
            essay: null,
        });

        setPreviews({
            question: null,
            A: null,
            B: null,
            C: null,
            D: null,
            essay: null,
        });
    }

    const removeQuestion = (q_id: number) => {
        Axios.delete(`http://localhost:8000/teacher/question/delete/${q_id}`, {withCredentials: true})
            .then((res) => {
                setModal(false)
                setEdit(false)
                getQuestions()
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return removeQuestion(q_id);
                    }
                } else if (err.response.status === 404) {
                    setModal(false);
                    getQuestions()
                }
                revoke()
                navigate('/auth');
            })
    }

    const editQuestion = async () => {
        const is_good = await handleData(questionText, category, score, options.A, options.B, options.C, options.D, trueAnswer)
        if (!is_good) {
            return
        }
        const editFormData = new FormData();

        editFormData.append(
            "question_data",
            JSON.stringify({
                question: questionText,
                type: questionType,
                score: score,
                category: category,
                difficulty: difficulty,
                true_answer: trueAnswer,
                a: options.A,
                b: options.B,
                c: options.C,
                d: options.D,
                a_prev: previews.A,
                b_prev: previews.B,
                c_prev: previews.C,
                d_prev: previews.D,
                essay_prev: previews.essay,
                q_prev_image: previews.question
            })
        );

        if (photos.question)
            editFormData.append("question_image", photos.question);

        if (photos.A)
            editFormData.append("A_image", photos.A);

        if (photos.B)
            editFormData.append("B_image", photos.B);

        if (photos.C)
            editFormData.append("C_image", photos.C);

        if (photos.D)
            editFormData.append("D_image", photos.D);

        if (photos.essay)
            editFormData.append("essay_image", photos.essay);


        Axios.put(`http://localhost:8000/teacher/question/edit/${QuestionID}`, editFormData, {withCredentials: true})
            .then((res) => {
                setEdit(false);
                setModal(false);
                getQuestions()
                clearInput()
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return editQuestion();
                    }
                } else if (err.response.status !== 403) {
                    setEdit(false);
                    setModal(false);
                    getQuestions()
                } else if (err.response.status === 402 || err.response.status === 406) {
                    setToastErr('برای افزودن تصویر به یک پلن فعال نیاز دارید!')
                    setToast(true)
                    return
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
        getQuestions()
    }, [page,search])
    useEffect(() => {
        getQuestionsHeader()
    }, [page])
    //  END API

    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">بانک سوالات</div>
                    <div className="tch-sec-sub">{QUESTIONS.length} سوال ذخیره شده</div>
                </div>
                <div className="tch-sec-header__right">
                    <input className="tch-input" style={{width: 200}} placeholder="🔍 جستجو..." value={search}
                           onChange={e => setSearch(e.target.value)}/>
                    <button className="tch-btn tch-btn--primary" onClick={() => open()}>+ سوال جدید</button>
                </div>
            </div>

            <div className="tch-stats">
                {[
                    {
                        icon: "❓",
                        label: "کل سوالات",
                        value: `${questionHeader?.all}`,
                        bg: "var(--violet-lt)",
                        color: "var(--violet)"
                    },
                    {
                        icon: "📋",
                        label: "تستی",
                        value: `${questionHeader?.test_count}`,
                        bg: "var(--sky-lt)",
                        color: "var(--sky)"
                    },
                    {
                        icon: "✅",
                        label: "درست/نادرست",
                        value: `${questionHeader?.true_false_count}`,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                    {
                        icon: "🎯",
                        label: "بار استفاده",
                        value: `${questionHeader?.use_count}`,
                        bg: "var(--accent-lt)",
                        color: "var(--accent)"
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

            {QUESTIONS.map(q => (
                <div key={q.id} className="q-card" onClick={() => openEdit(q)}>
                    <div className="q-card__top">
                        {q.text && <div className="q-card__text">{q.text}</div>}
                        <div className="question-image-wrapper">
                            {q?.question_image && (
                                <img
                                    src={`http://localhost:8000/Questions/${q.question_image}`}
                                    alt="question"
                                    className="question-image"
                                />
                            )}
                        </div>
                        <div className="q-card__meta">
                            <span className={`tch-badge ${diffBadge(q.diff)}`}>{diffLabel(q.diff)}</span>
                            <span className="tch-badge tch-badge--sky">{q.cat}</span>
                            <span className="tch-badge tch-badge--gray">× {q.score}</span>
                        </div>
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
                                                className='opt-image'
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
                        <div className="q-card__opts">
                            {[
                                {value: "true", label: "✓ صحیح"},
                                {value: "false", label: "✗ غلط"}
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`q-card__opt ${
                                        q.true_answer === item.value
                                            ? "q-card__opt--ok"
                                            : ""
                                    }`}
                                >
                                    {item.label}

                                    {q.true_answer === item.value && (
                                        <span
                                            style={{
                                                marginRight: 8,
                                                color: "green",
                                                fontWeight: "bold"
                                            }}
                                        >
                    </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {q.type === "essay" && (
                        <div className="q-card__opts">
                            {/*{q.true_answer && <div className="q-card__essay-answer">*/}
                            {/*    <textarea className='tch-textarea' rows={6} readOnly={true}>{q.true_answer}</textarea>*/}
                            {/*</div>}*/}
                            {q.true_answer && (
                                <div className="q-card__opt q-card__opt--ok">
                                    <strong style={{marginLeft: "8px"}}>
                                        پاسخ:
                                    </strong>

                                    <span>{q.true_answer}</span>
                                </div>
                            )}
                            {q.essay_image && (
                                <img
                                    src={`http://localhost:8000/Questions/${q.essay_image}`}
                                    alt="Essay Answer"
                                    className='essay-image'
                                />
                            )}
                        </div>
                    )}
                </div>
            ))}

            {modal && (
                <div className="tch-modal-backdrop" onClick={() => setModal(false)}>
                    <div className="tch-modal" onClick={e => e.stopPropagation()}>
                        <div className="tch-modal__header">
                            <span className="tch-modal__title">{edit ? 'ویرایش سوال' : "سوال جدید"}</span>
                            <button className="tch-modal__close" onClick={() => closeModal()}>×</button>
                        </div>
                        <div className="tch-modal__body">
                            <div className="tch-form-full"><label className="tch-form-label">متن سوال *</label>

                                <textarea
                                    className="tch-textarea" rows={3}
                                    placeholder="متن سوال را بنویسید..."
                                    onChange={(e) => {
                                        setQuestionText(e.target.value);
                                    }}
                                    value={questionText}
                                />
                                <label className='upload-question-btn'>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    انتخاب تصویر
                                    <input type="file" accept="image/*" onChange={handlePhoto("question")}
                                           style={{display: "none"}}/>
                                </label>
                                <div>
                                    {previews.question && (
                                        <div style={{position: "relative", width: "80px"}}>
                                            <img
                                                src={previews.question}
                                                alt="preview"
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ddd"
                                                }}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removePhoto("question")}
                                                style={{
                                                    position: "absolute",
                                                    top: "-8px",
                                                    right: "-8px",
                                                    width: "22px",
                                                    height: "22px",
                                                    borderRadius: "50%",
                                                    border: "none",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">نوع سوال</label><select className="tch-select"
                                                                                               style={{width: "100%"}}
                                                                                               onChange={(e) => { // onChange رو به خود select اضافه کن
                                                                                                   const selectedType = e.target.value;
                                                                                                   setQuestionType(selectedType); // مقدار انتخاب شده رو به state بفرست
                                                                                               }}
                                                                                               value={questionType}
                                                                                               disabled={edit}

                                >
                                    <option value="test">چهار گزینه‌ای</option>
                                    <option value="true_false">درست/نادرست</option>
                                    <option value="essay">کوتاه‌پاسخ</option>
                                </select></div>
                                <div><label className="tch-form-label">دشواری</label><select className="tch-select"
                                                                                             style={{width: "100%"}}
                                                                                             onChange={(e) => {
                                                                                                 setDifficulty(e.target.value);
                                                                                             }}
                                                                                             value={difficulty}
                                >
                                    <option value="easy">آسان</option>
                                    <option value="medium">متوسط</option>
                                    <option value="hard">سخت</option>
                                </select></div>
                            </div>
                            <div className="tch-form-row">
                                <div><label className="tch-form-label">دسته‌بندی</label><input className="tch-input"

                                                                                               placeholder="مثلاً: ریاضی، فیزیک..."
                                                                                               onChange={(e) => {
                                                                                                   setCategory(e.target.value);
                                                                                               }}
                                                                                               value={category}
                                />
                                </div>
                                <div>
                                    <label className="tch-form-label">بارم</label>
                                    <input type='number' className="tch-input" value={score} onChange={(e) => {
                                        setScore(+e.target.value)
                                    }}/>
                                </div>
                            </div>
                            <div>
                                {questionType === 'test' && (
                                    <>
                                        <label className="tch-form-label">گزینه‌ها (گزینه صحیح را علامت بزنید)</label>
                                        {LETTERS.map((l, i) => (
                                            <div key={l} style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                marginBottom: 8
                                            }}>
                                                <label className='upload-question-answer-btn'>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                         strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                        <polyline points="17 8 12 3 7 8"/>
                                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                                    </svg>
                                                    <input type="file" accept="image/*"
                                                           onChange={handlePhoto(`${l}`)}
                                                           style={{display: "none"}}/>
                                                </label>
                                                <input type="radio" name="correct"
                                                       onChange={(e) => {
                                                           setTrueAnswer(l)
                                                       }}/>
                                                <span style={{
                                                    color: "var(--adm-sub)",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    minWidth: 20
                                                }}>{l}</span>
                                                <input className="tch-input"
                                                       onChange={(e) => setOptions(prev => ({
                                                           ...prev,
                                                           [l]: e.target.value
                                                       }))}
                                                       placeholder={`گزینه ${l}...`}/>
                                                {previews[l as keyof typeof previews] && (
                                                    <div
                                                        style={{
                                                            position: "relative",
                                                            width: "50px",
                                                            height: "50px"
                                                        }}
                                                    >
                                                        <img
                                                            src={previews[l as keyof typeof previews]!}
                                                            alt=""
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                                objectFit: "cover",
                                                                borderRadius: "6px"
                                                            }}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removePhoto(l as "A" | "B" | "C" | "D")
                                                            }
                                                            style={{
                                                                position: "absolute",
                                                                top: "-6px",
                                                                right: "-6px",
                                                                width: "18px",
                                                                height: "18px",
                                                                borderRadius: "50%",
                                                                border: "none",
                                                                background: "#ef4444",
                                                                color: "#fff",
                                                                cursor: "pointer",
                                                                fontSize: "12px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                padding: 0,
                                                                lineHeight: 1
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                                {questionType === 'true_false' && (
                                    <>
                                        <label className="tch-form-label">پاسخ صحیح را انتخاب کنید</label>
                                        {/* گزینه صحیح */}
                                        <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 8}}>
                                            <input
                                                type="radio"
                                                name="true_false_answer" // نام منحصر به فرد برای این نوع سوال
                                                value={trueAnswer} // مقدار این گزینه
                                                onChange={(e) => {
                                                    setTrueAnswer('true')
                                                }}
                                            />
                                            <span style={{
                                                color: "var(--adm-sub)",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                minWidth: 20
                                            }}>صحیح</span>
                                        </div>
                                        {/* گزینه غلط */}
                                        <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 8}}>
                                            <input
                                                type="radio"
                                                name="true_false_answer" // باید با نام بالا یکی باشه تا فقط یکی انتخاب بشه
                                                value="false" // مقدار این گزینه
                                                onChange={(e) => {
                                                    setTrueAnswer('false')
                                                }}
                                            />
                                            <span style={{
                                                color: "var(--adm-sub)",
                                                fontSize: 12,
                                                fontWeight: 700,
                                                minWidth: 20
                                            }}>غلط</span>
                                        </div>
                                    </>
                                )}
                                {questionType === 'essay' && (
                                    <div>
                                        <label className="tch-form-label">پاسخ خود را بنویسید</label>
                                        <textarea
                                            className="tch-input" // یا هر کلاسی که برای textarea هاتون استفاده می‌کنید
                                            style={{
                                                width: "100%",
                                                minHeight: "100px",
                                                marginTop: "8px"
                                            }} // استایل دلخواه
                                            placeholder="پاسخ خود را اینجا بنویسید..."
                                            onChange={(e) => setTrueAnswer(e.target.value)}
                                            value={trueAnswer}
                                        />
                                        <label className='upload-question-answer-btn'>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                 strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="17 8 12 3 7 8"/>
                                                <line x1="12" y1="3" x2="12" y2="15"/>
                                            </svg>
                                            <input type="file" accept="image/*"
                                                   onChange={handlePhoto("essay")}
                                                   style={{display: "none"}}/>
                                        </label>
                                        <div>
                                            {previews.essay && (
                                                <div
                                                    style={{
                                                        position: "relative",
                                                        width: "80px",
                                                        height: "80px",
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    <img
                                                        src={previews.essay}
                                                        alt="essay"
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px"
                                                        }}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto("essay")}
                                                        style={{
                                                            position: "absolute",
                                                            top: "-8px",
                                                            right: "-8px",
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                            border: "none",
                                                            background: "#ef4444",
                                                            color: "#fff",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "12px",
                                                            padding: 0
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                            {addError && <div>
                                <p style={{
                                    color: 'tomato',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    padding: '0 30px 0 0'
                                }}>{addError}</p>
                            </div>}
                        </div>
                        <div className="tch-modal__footer">


                            {edit && <button className="tch-btn tch-btn--danger" onClick={() => setOpenDelete(true)}>حذف
                                ✗</button>}
                            {edit ?
                                <button className="tch-btn tch-btn--primary" onClick={() => editQuestion()}>💾 ویرایش
                                </button> :
                                <button className="tch-btn tch-btn--primary" onClick={() => handleSubmit()}>💾 ذخیره
                                </button>}
                            <button className="tch-btn tch-btn--ghost" onClick={() => closeModal()}>انصراف</button>


                        </div>
                    </div>
                    <DeleteModal
                        isOpen={openDelete}
                        ItemName={questionText}
                        name='سوال'
                        onCancel={() => setOpenDelete(false)}
                        onConfirm={() => {
                            if (QuestionID !== -1) {
                                removeQuestion(QuestionID)
                            }
                            setOpenDelete(false)
                        }}
                    />
                </div>
            )}
            <div className="tch-pagination">
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
            </div>
            {toast && <div className="error-landing-toast">{toastErr}</div>}
        </>
    );
};
export default QuestionsSection
