import {useEffect, useState} from "react";
import Axios from "axios";
import {CheckAuth} from "../../check_auth";

interface ExamInfo {
    question: null | string;
    q_image: null | string;
    student_answer: null | string;
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
    essay_correct?: number;
    type: string;
}

type ReviewModalProps = { exam_id: number; onClose: () => void; };

export const ReviewModal: React.FC<ReviewModalProps> = ({exam_id, onClose}) => {
    const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");
    const [exam, setExam] = useState<ExamInfo[]>([]);

    const get_question = () => {
        Axios.get(`http://localhost:8000/student/exam/review/${exam_id}`, {withCredentials: true})
            .then((res) => {
                setExam(res.data.exam_score);
            }).catch(async (err) => {
            if (err.response.status === 401) {
                const is_successful = await CheckAuth();
                if (is_successful) {
                    return get_question();
                }
            }
        });
    };

    useEffect(() => {
        get_question();
    }, []);

    // helper: build option map (A/B/C/D -> text+image) for test/truefalse types
    const getOption = (q: ExamInfo, key: string | null) => {
        if (!key) return null;
        const map: Record<string, { text: string | null, image: string | null }> = {
            A: {text: q.A, image: q.A_image},
            B: {text: q.B, image: q.B_image},
            C: {text: q.C, image: q.C_image},
            D: {text: q.D, image: q.D_image},
        };
        return map[key] ?? {text: key, image: null};
    };

    const items = exam.map((q, idx) => {
        const isDescriptive = q.type === "essay";
        if (!q.student_answer) return {q, idx, status: "skipped" as const};
        if (isDescriptive) return {q, idx, status: "essay" as const};
        if (q.student_answer === q.true_answer) return {q, idx, status: "correct" as const};
        return {q, idx, status: "wrong" as const};
    });

    const filtered = items.filter(it => {
        if (filter === "all") return true;
        if (filter === "skipped") return it.status === "skipped";
        if (filter === "correct") return it.status === "correct";
        if (filter === "wrong") return it.status === "wrong" || it.status === "essay";
        return true;
    });

    return (
        <div className="std-modal-backdrop" onClick={onClose}>
            <div className="std-modal std-modal--wide" onClick={e => e.stopPropagation()}>
                <div className="std-modal__header">
                    <span className="std-modal__title">🔍 مرور سوالات</span>
                    <button className="std-modal__close" onClick={onClose}>×</button>
                </div>
                <div className="std-modal__body">
                    {/* filter chips */}
                    <div style={{display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap"}}>
                        {([["all", "همه"], ["correct", "درست"], ["wrong", "نادرست"], ["skipped", "پاسخ نداده"]] as [typeof filter, string][]).map(([k, lbl]) => (
                            <button
                                key={k}
                                onClick={() => setFilter(k)}
                                className="std-btn std-btn--sm"
                                style={filter === k ? {
                                    background: "var(--sky)",
                                    color: "#fff",
                                    border: "none"
                                } : {
                                    background: "var(--adm-bg)",
                                    border: "1px solid var(--adm-border)",
                                    color: "var(--adm-sub)"
                                }}
                            >
                                {lbl}
                            </button>
                        ))}
                    </div>

                    {filtered.map(({q, idx, status}) => {
                        const numClass =
                            status === "correct" ? "correct" :
                                status === "skipped" ? "skipped" :
                                    status === "essay" ?
                                        (q.essay_correct === 2 ? "correct" : q.essay_correct === 0 ? "wrong" : "wrong")
                                        : "wrong";

                        const itemClass =
                            status === "essay" ? "skipped" : status;

                        const studentOpt = getOption(q, q.student_answer);
                        const correctOpt = getOption(q, q.true_answer);

                        return (
                            <div key={idx} className={`review-item review-item--${itemClass}`}>
                                <div className={`review-item__num review-item__num--${numClass}`}>
                                    {idx + 1}
                                </div>
                                <div style={{flex: 1}}>
                                    <div className="review-item__text">{q.question}</div>
                                    {q.q_image && (
                                        <img src={`http://localhost:8000/Questions/${q.q_image}`} alt="" style={{
                                            maxWidth: "100%",
                                            maxHeight: '160px',
                                            marginTop: 8,
                                            borderRadius: 8
                                        }}/>
                                    )}

                                    {(q.type === "test" || q.type === "true_false") && (
                                        <div className="review-item__answer" style={{marginTop: 8}}>
                                            {status === "correct" && (
                                                <div className="review-item__correct-ans">
                                                    ✓ پاسخ شما: {studentOpt?.text}
                                                    {studentOpt?.image && (
                                                        <img
                                                            src={`http://localhost:8000/Questions/${studentOpt.image}`}
                                                            alt=""
                                                            style={{
                                                                maxWidth: "100%",
                                                                maxHeight: "30%",
                                                                marginTop: 6,
                                                                borderRadius: 8,
                                                                display: "block"
                                                            }}
                                                        />
                                                    )}
                                                    {" "}— درست!
                                                </div>
                                            )}
                                            {status === "wrong" && (
                                                <>
                                                    <div className="review-item__your-ans">
                                                        ✗ پاسخ شما: {studentOpt?.text}
                                                        {studentOpt?.image && (
                                                            <img
                                                                src={`http://localhost:8000/Questions/${studentOpt.image}`}
                                                                alt=""
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "30%",
                                                                    marginTop: 6,
                                                                    borderRadius: 8,
                                                                    display: "block"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="review-item__correct-ans">
                                                        ✓ پاسخ صحیح: {correctOpt?.text}
                                                        {correctOpt?.image && (
                                                            <img
                                                                src={`http://localhost:8000/Questions/${correctOpt.image}`}
                                                                alt=""
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "30%",
                                                                    marginTop: 6,
                                                                    borderRadius: 8,
                                                                    display: "block"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            {status === "skipped" && (
                                                <div style={{color: "var(--sky)", fontWeight: 700, fontSize: 12}}>
                                                    ↷ پاسخ داده نشد | صحیح: {correctOpt?.text}
                                                    {correctOpt?.image && (
                                                        <img
                                                            src={`http://localhost:8000/Questions/${correctOpt.image}`}
                                                            alt=""
                                                            style={{
                                                                maxWidth: "100%",
                                                                maxHeight: "30%",
                                                                marginTop: 6,
                                                                borderRadius: 8,
                                                                display: "block"
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {q.type === "essay" && (
                                        <div style={{marginTop: 6}}>
                                            <div style={{color: "var(--adm-sub)", fontSize: 12, fontWeight: 700}}>
                                                پاسخ تشریحی:
                                            </div>
                                            {q.student_answer ? (
                                                <div style={{
                                                    color: "var(--adm-text)",
                                                    fontSize: 12,
                                                    marginTop: 4,
                                                    background: "var(--adm-bg)",
                                                    borderRadius: 8,
                                                    padding: "8px 12px"
                                                }}>
                                                    {q.student_answer}
                                                </div>
                                            ) : (
                                                <div style={{color: "var(--adm-light)", fontSize: 12}}>
                                                    پاسخی ثبت نشده
                                                </div>
                                            )}

                                            {typeof q.essay_correct === "number" && (
                                                <div style={{
                                                    color: q.essay_correct === 2 ? "var(--green)" : q.essay_correct === 0 ? "var(--red, #e05252)" : "var(--sky)",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    marginTop: 6
                                                }}>
                                                    {q.essay_correct === 2 && "✓ کامل و صحیح"}
                                                    {q.essay_correct === 1 && "نیم‌امتیاز / صحیح نسبی"}
                                                    {q.essay_correct === 0 && "✗ نادرست"}
                                                </div>
                                            )}

                                            {q.essay_image && (
                                                <div style={{marginTop: 8}}>
                                                    <div style={{
                                                        color: "var(--green)",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        marginBottom: 4
                                                    }}>
                                                        نمونه پاسخ:
                                                    </div>
                                                    <img src={q.essay_image} alt="نمونه پاسخ"
                                                         style={{maxWidth: "100%", borderRadius: 8}}/>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};