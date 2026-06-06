import {scoreColor} from "./types";
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

interface Info {
    exam_name0:string;
    exam_score0:number;
    exam_name1:string;
    exam_score1:number;
    student_score0:number;
    student_score1:number;
    user_name:string;
    remain_exam:number;
    exams:number;
    exam_count:number;
    passed_exam:number;
    class_count:number;
    avg_score:number;
    max_score:number;
    messages:number;
}
export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [dashInfo,setDashInfo] = useState<Info>();
    const getDash = () => {
        Axios.get('http://localhost:8000/student/dashboard', {withCredentials: true})
            .then((res) => {
                setDashInfo(res.data.student_dash);
                console.log(res.data.student_dash);
                console.log(dashInfo);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return getDash();
                    }
                }
                revoke()
                navigate('/auth');
            })
    }
    useEffect(() => {
        getDash()
    }, []);
    return <>
        <div className="dash-hero">
            <div className="dash-hero__avatar">🎓</div>
            <div>
                <div className="dash-hero__name">{dashInfo?.user_name}</div>
                <div className="dash-hero__class">دانش‌آموز</div>
            </div>
            <div className="dash-hero__right">
                {[[dashInfo?.remain_exam, "آزمون پیش رو"], [dashInfo?.avg_score, "میانگین نمره"], [dashInfo?.exams, "رتبه کلاس"]].map(([v, l]) => (
                    <div key={l} className="dash-hero-stat">
                        <div className="dash-hero-stat__val">{v}</div>
                        <div className="dash-hero-stat__lbl">{l}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="std-stats">
            {[
                {icon: "📝", label: "کل آزمون‌ها", val:dashInfo?.exam_count, bg: "var(--sky-lt)", color: "var(--sky)"},
                {icon: "✅", label: "شرکت کرده", val: dashInfo?.passed_exam, bg: "var(--green-lt)", color: "var(--green)"},
                {icon: "⭐", label: "بهترین نمره", val:dashInfo?.max_score, bg: "#FEF3C7", color: "#92400E"},
                {icon: "📨", label: "پیام جدید", val: dashInfo?.messages, bg: "var(--violet-lt)", color: "var(--violet)"},
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

        <div className="std-card">
            <div className="std-card__header">
                <div className="std-card__title">📊 آخرین نمرات</div>
            </div>
            <div className="std-card__body">
                {[{exam: dashInfo?.exam_name0, score: dashInfo?.student_score0 ?? 0, total: dashInfo?.exam_score0 ?? 0}, {
                    exam: dashInfo?.exam_name1,
                    score: dashInfo?.student_score1 ?? 0,
                    total: dashInfo?.exam_score1 ?? 0
                }].map(({exam, score, total}) => {
                    const c = scoreColor(score, total);
                    return (
                        <div key={exam} className="score-bar-row">
                            <div className="score-bar-row__exam">{exam}</div>
                            <div className="score-bar-row__bar">
                                <div className="score-bar-row__fill"
                                     style={{width: `${(score / total) * 100}%`, background: c.color}}/>
                            </div>
                            <div className="score-bar-row__val" style={{color: c.color}}>{score}/{total}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    </>
};