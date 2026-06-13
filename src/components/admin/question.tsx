import {useEffect, useState} from "react";
import {diffBadge} from "./types";
import '../../styles/admin.css';
import {diffLabel} from "../teacher/types";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";
type diffType = 'easy' | 'medium' | 'hard';
interface QuestionData {
    id: number;
    text: string;
    score: number;
    cat: string;
    diff: diffType;
    type: string;
    true_answer: string;
    A: null | string;
    B: null | string;
    C: null | string;
    D: null | string;
    question_image: null | string;
    A_image: null | string;
    B_image: null | string;
    C_image: null | string;
    D_image: null | string;
    essay_image: null | string;
}

interface QuestionHeaderData {
    test: 0;
    essay: 0;
    true_false: 0
}

export const QuestionsSection: React.FC = () => {
    const [search, setSearch] = useState("");
    const [QUESTIONS, setQuestion] = useState<QuestionData[]>([])
    const filtered = QUESTIONS.filter((q) => q.text.includes(search) || q.cat.includes(search));
    const navigate = useNavigate();
    const get_questions = () => {
        Axios.get('http://localhost:8000/admin/questions', {withCredentials: true})
            .then((res) => {
                setQuestion(res.data.result);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return get_questions();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        get_questions()
    }, []);
    const LETTERS = ["A", "B", "C", "D"];

    return (
        <>
            <div className="adm-stats">
                {[
                    {
                        icon: "❓",
                        label: "کل سوالات",
                        value: `${QUESTIONS.length}`,
                        change: "+۳ این هفته",
                        up: true,
                        bg: "var(--violet-lt)",
                        color: "var(--violet)"
                    },
                    {
                        icon: "📚",
                        label: "تستی",
                        value: `${QUESTIONS.filter(q => q.type === "test").length}`,
                        change: `${QUESTIONS.filter(q => q.type === "test").length / QUESTIONS.length * 100}٪ از کل`,
                        up: true,
                        bg: "var(--sky-lt)",
                        color: "var(--sky)"
                    },
                    {
                        icon: "✍️",
                        label: "تشریحی/کوتاه",
                        value: `${QUESTIONS.filter(q => q.type === "test").length}`,
                        change: `${QUESTIONS.filter(q => q.type === "test").length / QUESTIONS.length * 100}٪ از کل`,
                        up: true,
                        bg: "var(--accent-lt)",
                        color: "var(--accent)"
                    },
                    {
                        icon: "🎯",
                        label: "صحیح/غلط",
                        value: `${QUESTIONS.filter(q => q.type === "true_false").length}`,
                        change: `${QUESTIONS.filter(q => q.type === "true_false").length / QUESTIONS.length * 100}٪ از کل`,
                        up: true,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                ].map((s) => (
                    <div key={s.label} className="adm-stat-card">
                        <div className="adm-stat-card__icon" style={{background: s.bg}}>{s.icon}</div>
                        <div>
                            <div className="adm-stat-card__label">{s.label}</div>
                            <div className="adm-stat-card__value">{s.value}</div>
                            <div className="adm-stat-card__change adm-stat-card__change--up">{s.change}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="adm-section-header">
                <div className="adm-section-header__left">
                    <div className="adm-section-title">بانک سوالات</div>
                    <div className="adm-section-sub">{filtered.length} سوال</div>
                </div>
                <div className="adm-section-header__right">
                    <input className="adm-input" style={{width: 220}} placeholder="🔍 جستجو در سوالات..." value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                </div>
            </div>

            {filtered.map(q => (
                <div key={q.id} className="q-card">
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
        </>
    );
};
