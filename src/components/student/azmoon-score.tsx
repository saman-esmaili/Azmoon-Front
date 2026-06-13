type Score = {
    trues: number;
    falses: number;
    not_answered: number;
    score: number;
    exam_score:number;
};

export const ScoreModalComp = ({
                                   score,
                                   onClose,
                               }: {
    score: Score;
    onClose: () => void;
}) => {
    console.log(score)
    return (
        <div className="std-modal-backdrop" onClick={onClose}>
            <div className="std-modal" onClick={e => e.stopPropagation()}>
                <div className="std-modal__header">
                    <span className="std-modal__title">📊 نتیجه آزمون</span>
                    <button className="std-modal__close" onClick={onClose}>×</button>
                </div>
                <div className="std-modal__body">
                    <div className="std-modal__body">
                        {score.score ? <>
                            <div className="score-hero">
                                <div className="score-hero__val">{score.score ?? '-'}</div>
                                <div className="score-hero__total">از {score.exam_score}</div>
                            </div>
                            <div className="score-breakdown">
                                <div className="score-item">
                                    <div className="score-item__val" style={{color: "var(--green)"}}>{score.trues}</div>
                                    <div className="score-item__lbl">درست</div>
                                </div>
                                <div className="score-item">
                                    <div className="score-item__val" style={{color: "var(--rose)"}}>{score.falses}</div>
                                    <div className="score-item__lbl">نادرست</div>
                                </div>
                                <div className="score-item">
                                    <div className="score-item__val"
                                         style={{color: "var(--sky)"}}>{score.not_answered}</div>
                                    <div className="score-item__lbl">پاسخ نداده</div>
                                </div>
                            </div>
                        </> : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px",
                                padding: "32px 0",
                            }}>
                                <div style={{fontSize: "48px"}}>📭</div>
                                <div style={{fontSize: "1rem", fontWeight: 600, color: "var(--text)"}}>نمره‌ای ثبت
                                    نشده
                                </div>
                                <div style={{fontSize: "0.85rem", color: "var(--text-2)"}}>نتیجه این آزمون هنوز اعلام
                                    نشده است
                                </div>
                            </div>
                        )}
                        <button className="std-btn std-btn--primary" style={{width: "100%", justifyContent: "center"}}
                                onClick={onClose}>
                            بستن
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
