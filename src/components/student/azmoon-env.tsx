import {useEffect, useRef, useState} from "react";
import {Exam, fmtTime, LETTERS, QStatus} from "./types";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {string} from "yup";

export const ExamEnv: React.FC = () => {
    const [duration, setDuration] = useState(0);
    const [questions, setQuestions] = useState<Record<string, [number, number, string]>>({});
    const [topbar, setTopbar] = useState<{ exam_name: string, class_name: string }>({exam_name: '', class_name: ''});
    const [answeredCount, setAnswerCount] = useState(0)
    const [show_question, setShowQuestion] = useState<{
        type: string, question: string, question_image: string, A: string,
        B: string,
        C: string,
        D: string,
        A_image: string,
        B_image: string,
        C_image: string,
        D_image: string
    }>({
        type: '', question: '', question_image: '', A: '',
        B: '',
        C: '',
        D: '',
        A_image: '',
        B_image: '',
        C_image: '',
        D_image: ''
    });
    const navigate = useNavigate()
    const {exam_id} = useParams()
    const startExam = () => {
        Axios.post(`http://localhost:8000/student/exam/start/${exam_id}`, {}, {withCredentials: true})
            .then((res) => {
                const data = res.data.contents;
                setDuration(data.duration);
                setQuestions(data.questions);
                setTopbar(data.topbar);
                setShowQuestion(data.show_question);

            })
            .catch(async (err) => {
                if (err.response?.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return startExam();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        const count = Object.values(questions).filter(q => q[2] !== "").length;
        setAnswerCount(count);
    }, [questions]);
    useEffect(() => {
        startExam()
    }, []);

    const [cur, setCur] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [confirmEnd, setConfirmEnd] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const move = (past_cur: number, new_cur: number) => {
        const data = {
            question_id: questions[String(new_cur + 1)][0],
            question_exam_id: questions[String(past_cur + 1)][1],
            question_answer: questions[String(past_cur + 1)][2] ?? ""
        }
        Axios.post(`http://localhost:8000/student/exam/question-move/${exam_id}`, data, {withCredentials: true})
            .then((res) => {
                setShowQuestion(res.data.show_question);

            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return move(past_cur, new_cur);
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        if (duration === 0) return;
        setTimeLeft(duration * 60);
        timerRef.current = setInterval(() => setTimeLeft(t => {
            if (t <= 1) {
                clearInterval(timerRef.current!);
                return 0;
            }
            return t - 1;
        }), 1000);
        return () => clearInterval(timerRef.current!);
    }, [duration]);
    const progress = Math.round((answeredCount / Object.keys(questions).length) * 100);
    const go = (n: number) => {
        const totalQuestions = Object.keys(questions).length;

        if (n >= 0 && n < totalQuestions) {
            move(cur, n);
            setCur(n);
        }
    };
    const handleAnswer = (val: string | number) => {
        setQuestions(prev => ({
            ...prev,
            [String(cur + 1)]: [prev[String(cur + 1)][0], prev[String(cur + 1)][1], String(val)]
        }));
    };
    const handleEnd = () => {
        clearInterval(timerRef.current!);
        const data = {
            'question_exam_id': questions[String(cur + 1)][1],
            'question_answer': questions[String(cur + 1)][2]
        }
        Axios.post(`http://localhost:8000/student/exam/end/${exam_id}`, data, {withCredentials: true})
            .then((res) => {
                navigate('/student')
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return handleEnd();
                    }
                }
                revoke()
                navigate('/auth');
            })
    };

    const warn = timeLeft < 300;

    return (
        <div className="env-shell" dir="rtl">
            {/* topbar */}
            <div className="env-topbar">
                <div>
                    <div className="env-topbar__name">{topbar.exam_name}</div>
                    <div className="env-topbar__class">{topbar.class_name}</div>
                </div>
                <div className={`env-timer ${warn ? "env-timer--warn" : ""}`}>
                    <span className="env-timer__icon">⏱</span>
                    <span className="env-timer__val">{fmtTime(timeLeft)}</span>
                </div>
                <div className="env-topbar__right">
                    <button className="std-btn std-btn--rose" onClick={() => setConfirmEnd(true)}>پایان آزمون</button>
                </div>
            </div>

            {/* body */}
            <div className="env-body">
                {/* question area */}
                <div className="env-q-area">
                    <div className="env-q-header">
                        <div className="env-q-num">
                            <div className="env-q-num__badge">{cur + 1}</div>
                            <div
                                className="env-q-num__text">سوال <strong>{cur + 1}</strong> از <strong>{Object.keys(questions).length}</strong>
                            </div>
                        </div>
                        <div className="env-q-type-badge">
                            {show_question.type === "test" &&
                                <span className="std-badge std-badge--sky">چهار گزینه</span>}
                            {show_question.type === "true_false" &&
                                <span className="std-badge std-badge--violet">صحیح/غلط</span>}
                            {show_question.type === "essay" &&
                                <span className="std-badge std-badge--amber">تشریحی</span>}
                        </div>
                    </div>

                    <div className="env-q-scroll">
                        <div className="env-q-text">{show_question.question}</div>
                        {show_question.question_image && (
                            <img
                                src={`http://localhost:8000/Questions/${show_question.question_image}`}
                                alt="question"
                                className="question-image"
                            />
                        )}
                        {show_question.type === "test" && (
                            <div className="env-options">
                                {[
                                    {text: show_question.A, image: show_question.A_image},
                                    {text: show_question.B, image: show_question.B_image},
                                    {text: show_question.C, image: show_question.C_image},
                                    {text: show_question.D, image: show_question.D_image},
                                ].map((opt, i) => {
                                    if (!opt.text && !opt.image) return null;
                                    const letter = LETTERS[i];
                                    return (
                                        <div
                                            key={i}
                                            className={`env-option ${
                                                questions[String(cur + 1)][2] === letter
                                                    ? "env-option--sel"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                const current = questions[String(cur + 1)][2];
                                                handleAnswer(current === letter ? "" : letter);
                                            }}
                                        >
                                            <span className="env-option__letter">{letter}</span>
                                            {opt.text && <span>{opt.text}</span>}
                                            {opt.image && (
                                                <img
                                                    src={`http://localhost:8000/Questions/${opt.image}`}
                                                    alt={letter}
                                                    className="opt-image"
                                                    style={{
                                                        width: '100px',
                                                        height: '100px'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {show_question.type === "true_false" && (
                            <div className="env-tf">
                                <button
                                    className={`env-tf-btn env-tf-btn--true ${
                                        questions[String(cur + 1)][2] === 'true'
                                            ? "env-tf-btn--sel"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        const current = questions[String(cur + 1)][2];
                                        handleAnswer(current === 'true' ? "" : 'true');
                                    }}
                                >
                                    <span className="env-tf-btn__icon">✓</span>درست
                                </button>
                                <button
                                    className={`env-tf-btn env-tf-btn--false ${
                                        questions[String(cur + 1)][2] === 'false'
                                            ? "env-tf-btn--sel"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        const current = questions[String(cur + 1)][2];
                                        handleAnswer(current === 'false' ? "" : 'false');
                                    }}
                                >
                                    <span className="env-tf-btn__icon">✗</span>نادرست
                                </button>
                            </div>
                        )}

                        {show_question.type === "essay" && (
                            <div className="env-desc-wrap">
                                <div className="env-desc-label">پاسخ خود را بنویسید:</div>
                                <textarea
                                    className="env-desc-area"
                                    placeholder="پاسخ تشریحی خود را اینجا بنویسید..."
                                    value={questions[String(cur + 1)][2] || ""}
                                    onChange={e => handleAnswer(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* nav footer */}
                    <div className="env-nav">
                        <button className="std-btn std-btn--ghost" disabled={cur === 0} onClick={() => go(cur - 1)}>←
                            قبلی
                        </button>
                        {cur < Object.keys(questions).length - 1
                            ? <button className="std-btn std-btn--primary" onClick={() => go(cur + 1)}>بعدی ←</button>
                            : <button className="std-btn std-btn--green" onClick={() => setConfirmEnd(true)}>✓
                                اتمام</button>
                        }
                    </div>
                </div>

                {/* right: question nav panel */}
                <div className="env-nav-panel">
                    <div className="env-nav-panel__header">
                        <div className="env-nav-panel__title">راهنمای سوالات</div>
                        <div className="env-nav-legend">
                            {([["env-nav-dot--answered", "پاسخ داده"], ["env-nav-dot--skipped", "رد شده"], ["env-nav-dot--unseen", "پاسخ نداده"], ["env-nav-dot--current", "جاری"]] as [string, string][]).map(([cls, lbl]) => (
                                <div key={lbl} className="env-nav-legend-item">
                                    <span className={`env-nav-dot ${cls}`}/>
                                    {lbl}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="env-nav-grid">
                        {Object.keys(questions).map((key, i) => {
                            const user_ans = questions[key][2];
                            const st =
                                user_ans &&
                                String(user_ans).trim() !== ""
                                    ? "answered"
                                    : "unseen";
                            const isCur = i === cur;

                            return (
                                <button
                                    key={key}
                                    className={`env-q-btn ${
                                        isCur
                                            ? "env-q-btn--current"
                                            : st === "answered"
                                                ? "env-q-btn--answered"
                                                : "env-q-btn--unseen"
                                    }`}
                                    onClick={() => go(i)}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="env-nav-panel__footer">
                        <div className="env-progress-bar">
                            <div className="env-progress-fill" style={{width: `${progress}%`}}/>
                        </div>
                        <div className="env-progress-txt">
                            <span>پاسخ داده‌شده</span>
                            <span style={{
                                color: "var(--sky)",
                                fontWeight: 800
                            }}>{answeredCount}/{Object.keys(questions).length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* confirm end modal */}
            {confirmEnd && (
                <div className="std-modal-backdrop">
                    <div className="std-modal">
                        <div className="std-modal__header">
                            <span className="std-modal__title">⚠ پایان آزمون</span>
                            <button className="std-modal__close" onClick={() => setConfirmEnd(false)}>×</button>
                        </div>
                        <div className="std-modal__body" style={{textAlign: "center"}}>
                            <div style={{fontSize: 48, marginBottom: 16}}>🏁</div>
                            <p style={{color: "var(--adm-text)", fontSize: 16, fontWeight: 700, marginBottom: 8}}>
                                آیا مطمئنید می‌خواهید آزمون را پایان دهید؟
                            </p>
                            <p style={{color: "var(--adm-sub)", fontSize: 13, marginBottom: 24}}>
                                {Object.keys(questions).length - answeredCount} سوال پاسخ داده نشده باقی مانده است.
                            </p>
                            <div style={{display: "flex", gap: 12, justifyContent: "center"}}>
                                <button className="std-btn std-btn--ghost" onClick={() => setConfirmEnd(false)}>ادامه
                                    آزمون
                                </button>
                                <button className="std-btn std-btn--green" onClick={handleEnd}>✓ پایان دادن</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};