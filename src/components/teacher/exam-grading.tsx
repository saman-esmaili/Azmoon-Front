import {useState, useMemo, useCallback, useEffect} from "react";
import "./../../styles/exam-grading.css";
import Axios from "axios";
import {useParams} from "react-router-dom";
import {CheckAuth} from "../../check_auth";

/* ─── Types ─────────────────────────────────────────────────────── */
type QType = "test" | "true_false" | "essay";
type QTab = "all" | "test" | "true_false" | "essay";
type StuFilter = "all" | "graded" | "partial" | "pending";

interface Question {
    question_exam_id: number;
    id: number;
    type: QType;
    text: string;
    maxScore: number;
    question_image: string;
    true_answer: null | string;
    A: null | string;
    B: null | string;
    C: null | string;
    D: null | string;
    A_image: null | string;
    B_image: null | string;
    C_image: null | string;
    D_image: null | string;
    essay_image: null | string;
}

interface Student {
    id: string;
    name: string;
}

interface GradeEntry {
    qId: number;
    score: number;
}

interface Exam {
    id: number;
    name: string;
    class: string;
    date: string;
    totalScore: number;
}

const LETTERS = ["A", "B", "C", "D"];

interface StudentAnswerInfo {
    qeId: number;
    qId: number;
    value: null | string;
}

const gradeColor = (score: number, max: number) => {
    if (max === 0) return {bg: "var(--adm-border)", color: "var(--adm-light)"};
    const p = score / max;
    if (p >= .85) return {bg: "var(--green-lt)", color: "var(--green)"};
    if (p >= .5) return {bg: "#FEF3C7", color: "#92400E"};
    return {bg: "var(--rose-lt)", color: "var(--rose)"};
};

const qStatusOf = (q: Question, grade: GradeEntry | undefined, ans?: StudentAnswerInfo) => {
    if (q.type !== "essay") return ans?.value === q.true_answer ? "correct" : "wrong";
    if (!ans?.value) return "pending";
    if (!grade || grade.score === 0) return "pending";
    if (grade.score === q.maxScore) return "correct";
    return "partial";
};

/* ── نمره خودکار برای تستی و صحیح/غلط ── */
const autoGradeQ = (q: Question, ans: StudentAnswerInfo | undefined): number => {
    if (q.type === "essay") return 0;
    if (!ans?.value || !q.true_answer) return 0;
    // true_answer باید با مقدار ثبت‌شده دانش‌آموز دقیقاً یکی باشد (هر دو string)
    return ans.value === q.true_answer ? q.maxScore : 0;
};

/* ── ساخت نمرات اولیه برای یک دانش‌آموز بر اساس سوالات و جواب‌هایش ── */
const makeInitialGrades = (
    questions: Question[],
    answers: StudentAnswerInfo[] = []
): Record<number, GradeEntry> => {
    const out: Record<number, GradeEntry> = {};
    questions.forEach(q => {
        const ans = answers.find(a => a.qId === q.id);
        out[q.id] = {qId: q.id, score: autoGradeQ(q, ans)};
    });
    return out;
};

const Q_PER_PAGE = 1;

interface QCardProps {
    q: Question;
    ans: StudentAnswerInfo | undefined;
    grade: GradeEntry;
    onGrade: (g: Partial<GradeEntry>) => void;
}

const QCard: React.FC<QCardProps> = ({q, ans, grade, onGrade}) => {
    const [modelOpen, setModelOpen] = useState(false);
    const status = qStatusOf(q, grade, ans);
    const QUICK = [0, 25, 50, 75, 100];

    // step: اگه maxScore <= 1 باشه step=0.25، اگه <= 4 باشه step=0.5، وگرنه step=0.5
    const step = q.maxScore <= 1 ? 0.25 : 0.5;
    // نقطه‌های قابل انتخاب بر اساس step
    const scoreSteps = Array.from(
        {length: Math.round(q.maxScore / step) + 1},
        (_, i) => Math.round(i * step * 1000) / 1000
    );

    const setScore = (v: number) =>
        onGrade({score: Math.min(q.maxScore, Math.max(0, v))});

    return (
        <div className={`gr-qcard gr-qcard--${status}`}>
            <div className="gr-qcard__bar"/>

            {/* Header */}
            <div className="gr-qcard__header">
                <div className="gr-qcard__header-left">
                    <div className="gr-qcard__q-text">{q.text}</div>
                    {q.question_image && <div className="gr-qcard__q-text"><img
                        src={`http://localhost:8000/Questions/${q.question_image}`}
                        alt="question"
                        className="question-image-exam-grading"
                    /></div>}
                </div>
                <div className="gr-qcard__badges">
                    {q.type === "test" && <span className="gr-badge gr-badge--sky">چهار گزینه</span>}
                    {q.type === "true_false" && <span className="gr-badge gr-badge--violet">صحیح/غلط</span>}
                    {q.type === "essay" && <span className="gr-badge gr-badge--amber">تشریحی</span>}
                    <span className="gr-badge gr-badge--gray">{q.maxScore} نمره</span>
                    {status === "correct" && <span className="gr-badge gr-badge--green">✓ صحیح</span>}
                    {status === "wrong" && <span className="gr-badge gr-badge--rose">✗ نادرست</span>}
                    {status === "partial" && <span className="gr-badge gr-badge--amber">◑ نیمه</span>}
                    {status === "pending" && <span className="gr-badge gr-badge--gray">⏳ نیاز به تصحیح</span>}
                </div>
            </div>

            <div className="gr-qcard__body">

                {/* Multiple choice */}
                {q.type === "test" && (
                    <>
                        <div className="gr-answer-section">
                            <div className="gr-answer-label">پاسخ دانش‌آموز و گزینه صحیح</div>
                            <div className="gr-mc-grid">
                                {[
                                    {text: q.A, image: q.A_image},
                                    {text: q.B, image: q.B_image},
                                    {text: q.C, image: q.C_image},
                                    {text: q.D, image: q.D_image},
                                ].map((opt, i) => {
                                    const letter = LETTERS[i];           // "A","B","C","D"
                                    const isOk = q.true_answer === letter;
                                    const isStu = ans?.value === letter;
                                    const cls = (isStu && isOk) ? "gr-mc-opt--both"
                                        : isStu ? "gr-mc-opt--wrong"
                                            : isOk ? "gr-mc-opt--correct" : "";
                                    return (
                                        <div key={i} className={`gr-mc-opt ${cls}`}>
                                            <div className="gr-mc-opt__letter">{letter}</div>
                                            <span style={{flex: 1}}>{opt.text}</span>
                                            {opt.image && <span style={{flex: 1}}> <img
                                                src={`http://localhost:8000/Questions/${opt.image}`}
                                                alt="question"
                                                className="question-image-exam-grading"
                                            /></span>}
                                            {isStu && !isOk && <span className="gr-mc-opt__icon">✗</span>}
                                            {isOk && <span className="gr-mc-opt__icon">✓</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* True/False */}
                {q.type === "true_false" && (
                    <>
                        <div className="gr-answer-section">
                            <div className="gr-answer-label">پاسخ دانش‌آموز</div>
                            <div className="gr-tf-row">
                                <div
                                    className={`gr-tf-chip ${status === "correct" ? "gr-tf-chip--correct" : "gr-tf-chip--wrong"}`}>
                                    {ans?.value ?? "—"}
                                </div>
                                {q.true_answer && (
                                    <div className="gr-tf-chip gr-tf-chip--correct">
                                        ✓ {q.true_answer}
                                        <span style={{fontSize: 11, opacity: .7}}> (پاسخ صحیح)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Descriptive */}
                {q.type === "essay" && (
                    <>
                        <div className="gr-answer-section">
                            <div className="gr-answer-label">پاسخ دانش‌آموز</div>
                            <div className="gr-desc-box">
                                {ans?.value
                                    ? <span>{ans.value}</span>
                                    : <span className="gr-desc-empty">دانش‌آموز پاسخی ثبت نکرده است</span>}
                            </div>
                        </div>
                        {q.true_answer && (
                            <div className="gr-answer-section">
                                <button className="gr-model-toggle" onClick={() => setModelOpen(p => !p)}>
                                    {modelOpen ? "▲" : "▼"} پاسخ نمونه
                                </button>
                                {modelOpen && <div className="gr-model-box">{q.true_answer}</div>}
                                {(modelOpen && q.essay_image) && <span className="gr-desc-empty"><img
                                    src={`http://localhost:8000/Questions/${q.essay_image}`}
                                    alt="question"
                                    className="question-image-exam-grading"
                                /></span>}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Score controls — essay only */}
            {q.type === "essay" && (
                <div className="gr-score-panel">
                    <div className="gr-score-panel__header">
                        <span className="gr-score-panel__title">🎯 نمره‌دهی</span>
                        <div className="gr-score-panel__current">
                            <span
                                className="gr-score-panel__num"
                                style={{
                                    color: grade.score === 0
                                        ? "var(--adm-light)"
                                        : grade.score === q.maxScore
                                            ? "var(--green)"
                                            : "var(--primary)"
                                }}>
                                {grade.score}
                            </span>
                            <span className="gr-score-panel__denom">/ {q.maxScore}</span>
                        </div>
                    </div>

                    <div className="gr-score-dots">
                        {scoreSteps.map(v => {
                            const isOn = grade.score === v;
                            const isHalf = v % 1 !== 0;
                            return (
                                <button
                                    key={v}
                                    title={`${v} نمره`}
                                    className={`gr-score-dot
                                        ${isOn ? "gr-score-dot--on" : ""}
                                        ${isHalf ? "gr-score-dot--half" : ""}
                                        ${!isOn && v < grade.score ? "gr-score-dot--filled" : ""}`}
                                    onClick={() => setScore(v)}>
                                    {v}
                                </button>
                            );
                        })}
                    </div>

                    <div className="gr-slider-row">
                        <span className="gr-slider-row__lbl">۰</span>
                        <input
                            type="range" min={0} max={q.maxScore} step={step}
                            value={grade.score}
                            className="gr-slider"
                            onChange={e => setScore(parseFloat(e.target.value))}
                        />
                        <span className="gr-slider-row__lbl">{q.maxScore}</span>
                    </div>

                    <div className="gr-quick-row">
                        <span className="gr-quick-row__lbl">سریع:</span>
                        <div className="gr-quick-btns">
                            {QUICK.map(pct => {
                                const exact = q.maxScore * pct / 100;
                                // گرد به نزدیک‌ترین step
                                const v = Math.round(exact / step) * step;
                                const rounded = Math.round(v * 1000) / 1000;
                                return (
                                    <button
                                        key={pct}
                                        className={`gr-quick-btn ${grade.score === rounded ? "gr-quick-btn--on" : ""}`}
                                        onClick={() => setScore(rounded)}>
                                        {pct}٪ <span style={{fontSize: 10, opacity: .7}}>({rounded})</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
interface ExamGradingProps {
    onBack?: () => void;
}

const ExamGrading: React.FC<ExamGradingProps> = ({
                                                     onBack = () => {
                                                     }
                                                 }) => {
    const {examId} = useParams();

    const [STUDENTS, setStudents] = useState<Student[]>([]);
    const [EXAM, setExam] = useState<Exam>({id: -1, name: '', class: '', date: '', totalScore: 0});
    const [QUESTIONS, setQuestions] = useState<Question[]>([]);
    const [activeStuId, setActiveStuId] = useState<string>('');
    const [allGrades, setAllGrades] = useState<Record<string, Record<number, GradeEntry>>>({});
    const [studentAnswer, setStudentAnswer] = useState<StudentAnswerInfo[]>([]);

    const [search, setSearch] = useState("");
    const [stuFilter, setStuFilter] = useState<StuFilter>("all");
    const [qTab, setQTab] = useState<QTab>("test");
    const [qPage, setQPage] = useState(1);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(false);
    const gradeKey = (q: Question) =>
        q.type === "essay"
            ? q.question_exam_id
            : q.id;
    /* ── وقتی سوالات آپدیت شدن، grades همه دانش‌آموزان رو مقداردهی کن ── */
    useEffect(() => {
        if (QUESTIONS.length === 0 || STUDENTS.length === 0) return;
        setAllGrades(prev => {
            const next = {...prev};
            STUDENTS.forEach(s => {
                if (!next[s.id]) {
                    next[s.id] = makeInitialGrades(QUESTIONS);
                }
            });
            return next;
        });
    }, [QUESTIONS, STUDENTS]);

    const fetchExamData = useCallback(() => {
        Axios.get(`http://localhost:8000/teacher/exam/students/${examId}`, {withCredentials: true})
            .then((res) => {
                const stu: Student[] = res.data.students;
                const exm: Exam = res.data.exam;
                const que: Question[] = res.data.questions;

                setStudents(stu);
                setExam(exm);
                setQuestions(que);

                if (stu.length > 0) {
                    setActiveStuId(stu[0].id);
                    fetchStudentAnswers(stu[0].id);
                }
            })
            .catch(async (err) => {
                if (err.response?.status === 401) {
                    const ok = await CheckAuth();
                    if (ok) fetchExamData();
                }
            });
    }, [examId]);

    const fetchStudentAnswers = useCallback((stuId: string) => {
        Axios.get(`http://localhost:8000/teacher/exam/answers/${examId}/${stuId}`, {withCredentials: true})
            .then((res) => {
                const answers: StudentAnswerInfo[] = res.data.student_answer;
                setStudentAnswer(answers);
                // grades رو با جواب‌های واقعی بساز تا تستی/صحیح‌غلط auto-grade بشن
                setAllGrades(prev => ({
                    ...prev,
                    [stuId]: makeInitialGrades(QUESTIONS, answers),
                }));
            })
            .catch(async (err) => {
                if (err.response?.status === 401) {
                    const ok = await CheckAuth();
                    if (ok) fetchStudentAnswers(stuId);
                }
            });
    }, [examId, QUESTIONS]);

    useEffect(() => {
        fetchExamData();
    }, [fetchExamData]);

    /* ── انتخاب دانش‌آموز ── */
    const selectStudent = useCallback((id: string) => {
        setActiveStuId(id);
        setQPage(1);
        fetchStudentAnswers(id);
    }, [fetchStudentAnswers]);

    /* ── محاسبه نمره کل دانش‌آموز ── */
    const calcTotal = useCallback((
        grades: Record<number, GradeEntry> | undefined,
        answers: StudentAnswerInfo[] = studentAnswer
    ): number => {
        if (QUESTIONS.length === 0 || EXAM.totalScore === 0) return 0;
        const maxRaw = QUESTIONS.reduce((s, q) => s + q.maxScore, 0);
        if (maxRaw === 0) return 0;

        const raw = QUESTIONS.reduce((sum, q) => {
            const key = gradeKey(q);

            if (grades?.[key] !== undefined)
                return sum + grades[key].score;

            const ans = answers.find(a => a.qId === q.id);
            return sum + autoGradeQ(q, ans);
        }, 0);
        return Math.round((raw / maxRaw) * EXAM.totalScore * 100) / 100;
    }, [QUESTIONS, EXAM.totalScore, studentAnswer]);

    /* ── وضعیت تصحیح دانش‌آموز ── */
    const stuStatusOf = useCallback((stuId: string, grades: Record<number, GradeEntry> | undefined): StuFilter => {
        if (!grades) return "pending";
        // فقط سوالات تشریحی که جواب دارند
        const essayQsWithAnswer = QUESTIONS.filter(q =>
            q.type === "essay" && !!studentAnswer.find(a => a.qId === q.id)?.value
        );
        if (essayQsWithAnswer.length === 0) return "graded";
        const allDone = essayQsWithAnswer.every(
            q => (grades[gradeKey(q)]?.score ?? 0) > 0
        );
        if (allDone) return "graded";
        const anyDone = essayQsWithAnswer.some(
            q => (grades[gradeKey(q)]?.score ?? 0) > 0
        );
        return anyDone ? "partial" : "pending";
    }, [QUESTIONS, studentAnswer]);

    /* ── تغییر نمره یک سوال ── */
    const handleGrade = useCallback((key: number, partial: Partial<GradeEntry>) => {
        setAllGrades(prev => ({
            ...prev,
            [activeStuId]: {
                ...prev[activeStuId],
                [key]: {
                    ...(prev[activeStuId]?.[key] ?? {qId: key, score: 0}),
                    ...partial,
                },
            },
        }));
    }, [activeStuId]);

    const calcQuestionStats = (
        questions: Question[],
        grades: Record<number, GradeEntry>,
        answers: StudentAnswerInfo[]
    ) => {
        let correct = 0;
        let wrong = 0;
        let answered = 0;
        let unanswered = 0;

        questions.forEach(q => {
            const ans = answers.find(a => a.qId === q.id);
            const grade = grades[q.question_exam_id ?? q.id];

            const isAnswered = !!ans?.value;

            if (!isAnswered) {
                unanswered++;
                return;
            }

            answered++;

            if (q.type !== "essay") {
                if (ans.value === q.true_answer) {
                    correct++;
                } else {
                    wrong++;
                }
            } else {
                // essay
                if ((grade?.score ?? 0) > 0) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        });

        return {
            correct,
            wrong,
            answered,
            unanswered
        };
    };

    /* ── ارسال نمره یک دانش‌آموز به بک‌اند ── */
    // const handleSave = async () => {
    //     setSaving(true);
    //     try {
    //         const grades = allGrades[activeStuId] ?? {};
    //
    //         const payload = {
    //             student_id: activeStuId,
    //             total_score: calcTotal(grades),
    //             questions: QUESTIONS.map(q => ({
    //                 question_exam_id: q.question_exam_id,
    //                 score:
    //                     grades[q.question_exam_id]?.score ??
    //                     autoGradeQ(
    //                         q,
    //                         studentAnswer.find(a => a.qId === q.id)
    //                     ),
    //             }))
    //         };
    //
    //         await Axios.post(
    //             `http://localhost:8000/teacher/exam/grade/${examId}`,
    //             payload,
    //             {withCredentials: true}
    //         );
    //
    //         setToast(true);
    //         setTimeout(() => setToast(false), 2500);
    //     } catch (err: any) {
    //         if (err.response?.status === 401) {
    //             const ok = await CheckAuth();
    //             if (ok) handleSave();
    //         } else {
    //             alert("خطا در ذخیره نمرات. لطفاً دوباره امتحان کنید.");
    //         }
    //     } finally {
    //         setSaving(false);
    //     }
    // };
    const handleSave = async () => {
        setSaving(true);
        try {
            const grades = allGrades[activeStuId] ?? {};

            const stats = calcQuestionStats(QUESTIONS, grades, studentAnswer);

            const payload = {
                student_id: activeStuId,
                total_score: calcTotal(grades),

                stats: {
                    correct: stats.correct,
                    wrong: stats.wrong,
                    answered: stats.answered,
                    unanswered: stats.unanswered,
                },

                questions: QUESTIONS
                    .filter(q => q.type === "essay")
                    .map(q => ({
                        question_exam_id: q.question_exam_id,
                        score: grades[q.question_exam_id]?.score ?? 0,
                    }))
            };

            await Axios.post(
                `http://localhost:8000/teacher/exam/grade/${examId}`,
                payload,
                {withCredentials: true}
            );

            setToast(true);
            setTimeout(() => setToast(false), 2500);
        } catch (err: any) {
            if (err.response?.status === 401) {
                const ok = await CheckAuth();
                if (ok) handleSave();
            } else {
                alert("خطا در ذخیره نمرات. لطفاً دوباره امتحان کنید.");
            }
        } finally {
            setSaving(false);
        }
    };
    /* ── ارسال نمرات همه دانش‌آموزان به بک‌اند ── */
    // const handleSaveAll = async () => {
    //     setSaving(true);
    //     try {
    //         const payload = {
    //             exam_id: examId,
    //             grades: STUDENTS.map(s => {
    //                 const grades = allGrades[s.id] ?? {};
    //                 return {
    //                     student_id: s.id,
    //                     total_score: calcTotal(grades),
    //                     questions: QUESTIONS.map(q => ({
    //                         question_id: q.id,
    //                         score: grades[q.id]?.score ?? 0,
    //                     })),
    //                 };
    //             }),
    //         };
    //
    //         await Axios.post(
    //             `http://localhost:8000/teacher/exam/grade/${examId}`,
    //             payload,
    //             {withCredentials: true}
    //         );
    //
    //         setToast(true);
    //         setTimeout(() => setToast(false), 2500);
    //     } catch (err: any) {
    //         if (err.response?.status === 401) {
    //             const ok = await CheckAuth();
    //             if (ok) handleSaveAll();
    //         } else {
    //             alert("خطا در ذخیره نمرات. لطفاً دوباره امتحان کنید.");
    //         }
    //     } finally {
    //         setSaving(false);
    //     }
    // };

    /* ── Tab filtering ── */
    const tabCounts: Record<QTab, number> = {
        all: QUESTIONS.length,
        test: QUESTIONS.filter(q => q.type === "test").length,
        true_false: QUESTIONS.filter(q => q.type === "true_false").length,
        essay: QUESTIONS.filter(q => q.type === "essay").length,
    };

    const tabQuestions = useMemo(() =>
            qTab === "all" ? QUESTIONS : QUESTIONS.filter(q => q.type === qTab),
        [qTab, QUESTIONS]
    );

    const totalQPages = Math.ceil(tabQuestions.length / Q_PER_PAGE);
    const pagedQuestions = tabQuestions.slice((qPage - 1) * Q_PER_PAGE, qPage * Q_PER_PAGE);

    const changeTab = (t: QTab) => {
        setQTab(t);
        setQPage(1);
    };

    /* ── لیست دانش‌آموزان ── */
    const gradedCount = useMemo(
        () => STUDENTS.filter(s => stuStatusOf(s.id, allGrades[s.id]) === "graded").length,
        [STUDENTS, allGrades, stuStatusOf]
    );

    const filteredStudents = useMemo(() => {
        let list = STUDENTS;
        if (search.trim()) list = list.filter(s => s.name.includes(search));
        if (stuFilter !== "all") list = list.filter(s => stuStatusOf(s.id, allGrades[s.id]) === stuFilter);
        return list;
    }, [search, stuFilter, allGrades, STUDENTS, stuStatusOf]);

    const totalPct = STUDENTS.length > 0 ? Math.round((gradedCount / STUDENTS.length) * 100) : 0;

    const activeGrades = allGrades[activeStuId] ?? {};
    const activeStu = STUDENTS.find(s => s.id === activeStuId);
    const currentTotal = calcTotal(activeGrades);

    const stuIdx = STUDENTS.findIndex(s => s.id === activeStuId);
    const goPrev = () => {
        if (stuIdx > 0) selectStudent(STUDENTS[stuIdx - 1].id);
    };
    const goNext = () => {
        if (stuIdx < STUDENTS.length - 1) selectStudent(STUDENTS[stuIdx + 1].id);
    };

    const TAB_META: { key: QTab; label: string; badge: string }[] = [
        {key: "test", label: "تستی", badge: String(tabCounts.test)},
        {key: "true_false", label: "صحیح/غلط", badge: String(tabCounts.true_false)},
        {key: "essay", label: "تشریحی", badge: String(tabCounts.essay)},
    ];

    /* ── نمایش loading قبل از دریافت داده ── */
    if (STUDENTS.length === 0) {
        return (
            <div className="gr-page" dir="rtl"
                 style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}>
                <div style={{color: "var(--adm-light)", fontSize: 16}}>در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div className="gr-page" dir="rtl">

            {/* ── Topbar ── */}
            <div className="gr-topbar">
                <div className="gr-topbar__left">
                    <button className="gr-topbar__back" onClick={onBack}>← بازگشت</button>
                    <div className="gr-topbar__divider"/>
                    <div className="gr-topbar__info">
                        <div className="gr-topbar__title">تصحیح آزمون</div>
                        <div className="gr-topbar__sub">{EXAM.name} — {EXAM.class} — {EXAM.date}</div>
                    </div>
                </div>
                <div className="gr-topbar__right">
                    <div className="gr-progress-chip">
                        <span className="gr-progress-chip__label">پیشرفت:</span>
                        <div className="gr-progress-chip__track">
                            <div className="gr-progress-chip__fill" style={{width: `${totalPct}%`}}/>
                        </div>
                        <span className="gr-progress-chip__pct">{gradedCount}/{STUDENTS.length}</span>
                    </div>
                    {/*<button className="gr-btn gr-btn--accent" onClick={handleSaveAll} disabled={saving}>*/}
                    {/*    {saving ? <><span className="gr-btn__spin"/> در حال ذخیره...</> : "💾 ذخیره همه"}*/}
                    {/*</button>*/}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="gr-body">

                {/* LEFT: student list */}
                <aside className="gr-students">
                    <div className="gr-students__head">
                        <div className="gr-students__title">دانش‌آموزان ({STUDENTS.length} نفر)</div>
                        <div className="gr-students__search">
                            <span style={{color: "var(--adm-light)"}}>🔍</span>
                            <input placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)}/>
                        </div>
                    </div>
                    <div className="gr-filter-tabs">
                        {([["all", "همه"], ["graded", "تصحیح شد"], ["partial", "نیمه"], ["pending", "در انتظار"]] as [StuFilter, string][]).map(([k, lbl]) => (
                            <button key={k} className={`gr-filter-tab ${stuFilter === k ? "gr-filter-tab--on" : ""}`}
                                    onClick={() => setStuFilter(k)}>{lbl}</button>
                        ))}
                    </div>
                    <div className="gr-students__list">
                        {filteredStudents.length === 0 && (
                            <div style={{padding: 24, color: "var(--adm-light)", fontSize: 13, textAlign: "center"}}>
                                موردی یافت نشد
                            </div>
                        )}
                        {filteredStudents.map(s => {
                            const grades = allGrades[s.id];
                            const total = calcTotal(grades);
                            const status = stuStatusOf(s.id, grades);
                            const c = gradeColor(total, EXAM.totalScore);
                            return (
                                <div key={s.id}
                                     className={`gr-stu-item ${activeStuId === s.id ? "gr-stu-item--active" : ""}`}
                                     onClick={() => selectStudent(s.id)}>
                                    <div className="gr-stu-item__avatar" style={{background: 'indigo'}}>
                                        {s.name[0]}
                                    </div>
                                    <div style={{flex: 1, minWidth: 0}}>
                                        <div className="gr-stu-item__name">{s.name}</div>
                                        <div className="gr-stu-item__meta">
                                            <span
                                                className={`gr-stu-item__status-dot gr-stu-item__status-dot--${status}`}/>
                                            <span>
                                                {status === "graded" ? "تصحیح شده"
                                                    : status === "partial" ? "نیمه‌کاره"
                                                        : "در انتظار"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="gr-stu-item__score-pill"
                                         style={{background: c.bg, color: c.color}}>{total}</div>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* RIGHT: workspace */}
                {activeStu ? (
                    <div className="gr-workspace">

                        {/* student hero */}
                        <div className="gr-stu-hero">
                            <div className="gr-stu-hero__left">
                                <div className="gr-stu-hero__avatar" style={{background: "forestgreen"}}>
                                    {activeStu.name[0]}
                                </div>
                                <div>
                                    <div className="gr-stu-hero__name">{activeStu.name}</div>
                                    <div className="gr-stu-hero__sub">
                                        <span>{EXAM.class}</span><span>·</span><span>{EXAM.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="gr-stu-hero__right">
                                <div className="gr-stu-hero__chip">
                                    <div className="gr-stu-hero__chip-val"
                                         style={{color: gradeColor(currentTotal, EXAM.totalScore).color}}>
                                        {currentTotal}
                                    </div>
                                    <div className="gr-stu-hero__chip-lbl">از {EXAM.totalScore}</div>
                                </div>
                                <div className="gr-stu-hero__chip">
                                    <div className="gr-stu-hero__chip-val">
                                        {QUESTIONS.filter(q => {
                                            const g = activeGrades[gradeKey(q)];
                                            if (q.type === "essay") return g && g.score > 0;
                                            // تستی و صحیح/غلط: اگر جواب داده → تصحیح شده
                                            return !!studentAnswer.find(a => a.qId === q.id)?.value;
                                        }).length}
                                    </div>
                                    <div className="gr-stu-hero__chip-lbl">تصحیح‌شده / {QUESTIONS.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* student nav */}
                        {/*<div className="gr-stu-nav">*/}
                        {/*    <span className="gr-stu-nav__info">دانش‌آموز {stuIdx + 1} از {STUDENTS.length}</span>*/}
                        {/*    <div className="gr-stu-nav__btns">*/}
                        {/*        <button className="gr-btn gr-btn--ghost gr-btn--sm"*/}
                        {/*                disabled={stuIdx === 0} onClick={goPrev}>← قبلی*/}
                        {/*        </button>*/}
                        {/*        <button className="gr-btn gr-btn--ghost gr-btn--sm"*/}
                        {/*                disabled={stuIdx === STUDENTS.length - 1} onClick={goNext}>بعدی →*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/* TYPE TABS */}
                        <div className="gr-type-tabs">
                            {TAB_META.map(({key, label, badge}) => {
                                const pendingDesc = key === "essay"
                                    ? QUESTIONS.filter(q => q.type === "essay").filter(q => {
                                        const ans = studentAnswer.find(a => a.qId === q.id);
                                        return !!ans?.value && (activeGrades[gradeKey(q)]?.score ?? 0) === 0
                                    }).length
                                    : 0;
                                return (
                                    <button key={key}
                                            className={`gr-type-tab ${qTab === key ? "gr-type-tab--on" : ""}`}
                                            onClick={() => changeTab(key)}>
                                        <span className="gr-type-tab__label">{label}</span>
                                        <span
                                            className={`gr-type-tab__badge ${key === "essay" && pendingDesc > 0 ? "gr-type-tab__badge--warn" : ""}`}>
                                            {key === "essay" && pendingDesc > 0 ? `${pendingDesc} در انتظار` : badge}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* question cards */}
                        <div className="gr-questions" key={`${activeStuId}-${qTab}`}>
                            {pagedQuestions.length === 0 && (
                                <div className="gr-empty">
                                    <div className="gr-empty__icon">📋</div>
                                    <div className="gr-empty__title">سوالی در این دسته نیست</div>
                                </div>
                            )}
                            {pagedQuestions.map(q => (
                                <QCard
                                    key={`${activeStuId}-${q.id}`}
                                    q={q}
                                    ans={studentAnswer.find(a => a.qId === q.id)}
                                    grade={
                                        activeGrades[gradeKey(q)]
                                        ?? {
                                            qId: gradeKey(q),
                                            score: 0
                                        }
                                    }
                                    onGrade={partial => handleGrade(gradeKey(q), partial)}
                                />
                            ))}
                        </div>

                        {/* question pagination */}
                        {totalQPages > 1 && (
                            <div className="gr-q-pager">
                                <button className="gr-btn gr-btn--ghost gr-btn--sm"
                                        disabled={qPage === 1} onClick={() => setQPage(p => p - 1)}>← قبل
                                </button>
                                <div className="gr-q-pager__pages">
                                    {Array.from({length: totalQPages}, (_, i) => i + 1).map(p => (
                                        <button key={p}
                                                className={`gr-q-pager__btn ${qPage === p ? "gr-q-pager__btn--on" : ""}`}
                                                onClick={() => setQPage(p)}>{p}</button>
                                    ))}
                                </div>
                                <span className="gr-q-pager__info">
                                    {(qPage - 1) * Q_PER_PAGE + 1}–{Math.min(qPage * Q_PER_PAGE, tabQuestions.length)} از {tabQuestions.length}
                                </span>
                                <button className="gr-btn gr-btn--ghost gr-btn--sm"
                                        disabled={qPage === totalQPages} onClick={() => setQPage(p => p + 1)}>بعد →
                                </button>
                            </div>
                        )}

                        {/* footer */}
                        <div className="gr-footer">
                            <div className="gr-footer__score">
                                <div>
                                    <div className="gr-footer__score-lbl">نمره نهایی</div>
                                    <div className="gr-footer__score-val"
                                         style={{color: gradeColor(currentTotal, EXAM.totalScore).color}}>
                                        {currentTotal}
                                    </div>
                                </div>
                                <div className="gr-footer__score-max">از {EXAM.totalScore}</div>
                            </div>
                            <div className="gr-footer__actions">
                                <button className="gr-btn gr-btn--ghost gr-btn--sm"
                                        disabled={stuIdx === 0} onClick={goPrev}>← دانش‌آموز قبلی
                                </button>
                                <button className="gr-btn gr-btn--primary" onClick={handleSave} disabled={saving}>
                                    {saving ? <><span className="gr-btn__spin"/> ذخیره...</> : "✓ ذخیره این دانش‌آموز"}
                                </button>
                                <button className="gr-btn gr-btn--green gr-btn--sm"
                                        disabled={stuIdx === STUDENTS.length - 1} onClick={goNext}>دانش‌آموز بعدی →
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="gr-workspace"
                         style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <div style={{color: "var(--adm-light)", fontSize: 14}}>دانش‌آموزی انتخاب نشده</div>
                    </div>
                )}
            </div>

            {toast && <div className="gr-save-toast">✓ نمرات با موفقیت ذخیره شدند</div>}
        </div>
    );
};

export default ExamGrading;