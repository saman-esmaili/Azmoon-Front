import {useEffect, useState} from "react";
import {Exam, EXAMS} from "./types";
import {ScoreModalComp} from "./azmoon-score";
import {ReviewModal} from "./review";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";

interface ExamInfo {
    exam_id: number;
    exam_name: number;
    exam_date: string;
    exam_time: number;
    start_time: string;
    class_name: number;
    status: string;
    score: number,
    exam_score: number;
}

interface Score {
    trues: number;
    falses: number;
    not_answered: number;
    score: number;
    exam_score: number;
}

export const ExamsSection: React.FC = () => {
    const [scoreModal, setScoreModal] = useState<Score | null>(null);
    const [EXAMS, setExams] = useState<ExamInfo[]>([])
    const [examId, setExamId] = useState(-1)
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [reviewModal, setReviewModal] = useState<{
        exam_id: number;
    } | null>(null);
    const navigate = useNavigate();
    const [header,setHeader] = useState({
        avg_score:0,
        exams:0,
        passed_exam:0,
        remain:0,
    })
    const [tab, setTab] = useState<"پیش رو" | "برگزار شد">("پیش رو");
    const getExams = () => {
        Axios.get(`http://localhost:8000/student/exam?page=${page}&size=10`, {withCredentials: true})
            .then((res) => {
                setExams(res.data.exam.exams)
                setHeader(res.data.exam.header)
                setPages(res.data.exam.pages)
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getExams();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const [notAllowed, setNotAllowed] = useState(false);
    const startExam = (exam_id: number) => {
        Axios.post(`http://localhost:8000/student/exam/get-permission/${exam_id}`, {}, {withCredentials: true})
            .then((res) => {
                navigate(`/exam/env/${exam_id}`)
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getExams();
                    }
                } else {
                    setNotAllowed(true);
                }
            })

    }

    useEffect(() => {
        getExams()
    }, [page]);

    const get_score = (exam_id: number) => {
        Axios.get(`http://localhost:8000/student/exam/score/${exam_id}`, {withCredentials: true})
            .then((res) => {
                const data = res.data.exam_score;
                setScoreModal({
                    trues: data.true,
                    falses: data.false,
                    not_answered: data.not_answered,
                    score: data.score,
                    exam_score: data.exam_score
                })
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getExams();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    const demoAnswers: Record<string, string | number> = {q1: 0, q3: 0, q4: "لیمیت عبارت است از..."};
    let shown: ExamInfo[] = [];
    if (EXAMS) {
        shown = EXAMS.filter(e => tab === "پیش رو" ? e.status !== "برگزار شد" : e.status === "برگزار شد");
    }


    return (

        <>
            <div className="std-sec-header">
                <div className="std-sec-header__left">
                    <div className="std-sec-title">آزمون‌ها</div>
                    <div className="std-sec-sub">{EXAMS.length} آزمون</div>
                </div>
                <div className="std-sec-header__right">
                    {(["پیش رو", "برگزار شد"] as const).map(t => (
                        <button key={t} className={`std-btn ${tab === t ? "std-btn--primary" : "std-btn--ghost"}`}
                                onClick={() => setTab(t)}>
                            {t === "پیش رو" ? "پیش رو" : "برگزار شد"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="std-stats">
                {[
                    {icon: "📝", label: "کل آزمون‌ها", val: EXAMS.length, bg: "var(--sky-lt)", color: "var(--sky)"},
                    {
                        icon: "⏳",
                        label: "پیش رو",
                        val: EXAMS.filter(e => e.status === 'پیش رو').length,
                        bg: "var(--violet-lt)",
                        color: "var(--violet)"
                    },
                    {
                        icon: "✅",
                        label: "برگزار شده",
                        val: EXAMS.filter(e => e.status === "برگزار شد").length,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                    {icon: "⭐", label: "میانگین نمرات", val: header.avg_score, bg: "#FEF3C7", color: "#92400E"},
                ].map(s => (
                    <div key={s.label} className="std-stat">
                        <div className="std-stat__icon" style={{background: s.bg}}>{s.icon}</div>
                        <div>
                            <div className="std-stat__label">{s.label}</div>
                            <div className="std-stat__value" style={{color: s.color}}>{s.val}</div>
                        </div>
                    </div>
                ))}
            </div>

            {shown.length === 0 ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 24px',
                    gap: '12px',
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    border: '2px dashed var(--border)',
                    marginTop: '16px',
                }}>
                    <div style={{fontSize: 56}}>📭</div>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'var(--text)',
                    }}>آزمونی وجود ندارد
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-2)',
                    }}>
                        {tab === 'پیش رو' ? 'آزمون پیش رویی برای شما ثبت نشده' : 'هنوز در هیچ آزمونی شرکت نکرده‌اید'}
                    </div>
                </div>
            ) : shown.map(exam => (
                <div key={exam.exam_id} className="exm-card">
                    <div className="exm-card__left">
                        {/*<div className="exm-card__icon"*/}
                        {/*     style={{background: exam.status === "برگزار شده" ? "var(--green-lt)" : exam.status === "درحال برگزاری" ? "var(--sky-lt)" : "var(--violet-lt)"}}>*/}
                        {/*{exam.icon}*/}
                        {/*</div>*/}
                        <div>
                            <div className="exm-card__name">{exam.exam_name}</div>
                            <div className="exm-card__meta">
                                <span className="exm-card__meta-item">📚 {exam.class_name}</span>
                                <span className="exm-card__meta-item">📅 {exam.exam_date}</span>
                                <span className="exm-card__meta-item">⏱ {exam.exam_time} دقیقه</span>
                                {exam.status === "برگزار شد" && exam.score != null && (
                                    <span
                                        className="std-badge std-badge--green">نمره: {exam.exam_score}/{exam.score}</span>
                                )}
                                <span
                                    className={`std-badge ${exam.status === "برگزار شد" ? "std-badge--green" : exam.status === "درحال برگزاری" ? "std-badge--sky" : "std-badge--violet"}`}>
                  {exam.status === "برگزار شد" ? "برگزار شد" : exam.status === "درحال برگزاری" ? "در دسترس" : "پیش رو"}
                </span>
                            </div>
                        </div>
                    </div>
                    <div className="exm-card__actions">
                        {exam.status !== "برگزار شد" && exam.status !== "پیش رو" && (
                            <button className="std-btn std-btn--primary" onClick={() => {
                                startExam(exam.exam_id)
                            }}>
                                شرکت در آزمون ←
                            </button>
                        )}
                        {exam.status === "برگزار شد" && <>
                            <button className="std-btn std-btn--green std-btn--sm"
                                    onClick={() => get_score(exam.exam_id)}
                            >
                                📊 مشاهده نمره
                            </button>
                            <button className="std-btn std-btn--violet std-btn--sm"
                                    onClick={() => setReviewModal({exam_id: exam.exam_id})}
                            >
                                🔍 مرور سوالات
                            </button>
                        </>}
                    </div>
                </div>
            ))}

            {scoreModal && <ScoreModalComp score={scoreModal}
                                           onClose={() => setScoreModal(null)}/>}
            {reviewModal && (
                <ReviewModal
                    exam_id={reviewModal.exam_id}
                    onClose={() => setReviewModal(null)}
                />
            )}
            {notAllowed && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                    onClick={() => setNotAllowed(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "420px",
                            maxWidth: "90%",
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "24px",
                            textAlign: "center",
                            boxShadow: "0 10px 30px rgba(0,0,0,.15)",
                        }}
                    >
                        <div style={{fontSize: "52px", marginBottom: "12px"}}>
                            ⚠️
                        </div>

                        <h3
                            style={{
                                margin: 0,
                                marginBottom: "8px",
                                color: "var(--text)",
                            }}
                        >
                            امکان شرکت در آزمون وجود ندارد
                        </h3>

                        <p
                            style={{
                                color: "var(--text-2)",
                                lineHeight: 1.8,
                                marginBottom: "20px",
                            }}
                        >
                            شما قبلاً در این آزمون شرکت کرده‌اید و امکان ورود مجدد
                            به آزمون برای شما وجود ندارد.
                        </p>

                        <button
                            className="std-btn std-btn--primary"
                            onClick={() => setNotAllowed(false)}
                        >
                            متوجه شدم
                        </button>
                    </div>
                </div>
            )}
            {EXAMS.length > 10 && (<div className="tch-pagination">
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
