import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useEffect, useState} from "react";

export const MyPlanSection: React.FC = () => {
    const [PLAN, setPlan] = useState<{
        plan_id: number;
        name: string;
        remained_exam: number;
        exam_count: number;
        expired_date: string;
        remained_expire: string;
        question_count: number;
        exam: number;
        image_count: number;
        image_number: number;
    }>({
        plan_id: -1,
        name: '',
        remained_exam: 0,
        exam_count: 0,
        expired_date: '',
        remained_expire: '',
        question_count: 0,
        exam: 0,
        image_count: 0,
        image_number: 0,
    });
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const my_plan = () => {
        Axios.get('http://localhost:8000/teacher/plan', {withCredentials: true})
            .then((res) => {
                console.log(res.data.my_plan);
                setPlan(res.data.my_plan);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return my_plan();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        my_plan()
    }, []);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(false);
    const [message, setMessage] = useState('');
    const [Mtoast, setMToast] = useState(false);
    const check_comment = async () => {
        if (!comment.trim()) {
            setError('لطفا نظر خود را بنویسید!')
            setToast(true)
            setTimeout(() => {
                setToast(false)
            }, 3000)
            return false
        } else if (comment.length < 2) {
            setError('تعداد کاراکترها باید بین 2 تا 250 باشد!')
            setToast(true)
            setTimeout(() => {
                setToast(false)
            }, 3000)
            return false
        }
        if (rating < 1) {
            setError('لطفا امتیاز خود را ثبت کنید')
            setToast(true)
            setTimeout(() => {
                setToast(false)
            }, 3000)
            return false
        }
        setToast(false)
        return true
    }
    const submitComment = async () => {
        const all_good = await check_comment()
        if (all_good) {
            setLoading(true);
            const data = {'comment': comment, 'star': rating, 'plan_id': PLAN.plan_id}
            Axios.post('http://localhost:8000/comment/add', data, {withCredentials: true})
                .then((res) => {
                    setMessage('نظر شما ثبت شد!');
                    setLoading(false);
                    setMToast(true);
                    setTimeout(() => {
                        setMToast(false)
                    }, 3000)

                })
                .catch(async (err) => {
                    if (err.response.status === 401) {
                        const is_successful = await CheckAuth();
                        if (is_successful) {
                            return submitComment();
                        }
                    }
                    // revoke()
                    // navigate('/auth');
                })
        }
    };
    return <>
        <div className="tch-sec-header">
            <div className="tch-sec-header__left">
                <div className="tch-sec-title">پلن من</div>
                <div className="tch-sec-sub">وضعیت اشتراک و مصرف</div>
            </div>
        </div>

        <div className="plan-hero-card">
            <div>
                <div className="plan-hero-card__label">پلن فعال شما</div>
                <div className="plan-hero-card__name">{PLAN.name}</div>
                <div className="plan-hero-card__sub">تا {PLAN.expired_date} فعال است — پرداخت سالانه</div>
            </div>
            <div className="plan-hero-card__right">
                {[
                    {val: PLAN.remained_exam, total: 0, label: "آزمون باقیمانده"},
                    {val: PLAN.exam_count, total: PLAN.exam, label: "آزمون برگزار شده"},
                    {val: PLAN.image_count || 0, total: PLAN.image_number, label: "تصاویر آپلود شده"},
                    {val: PLAN.remained_expire, total: 12, label: "ماه باقیمانده"},
                ].map(q => (
                    <div key={q.label} className="plan-quota">
                        <div className="plan-quota__val">{q.val}</div>
                        <div className="plan-quota__label">{q.label}</div>
                        <div className="plan-quota__bar">
                            {/*<div className="plan-quota__fill" style={{width: `${(q.val / q.total) * 100}%`}}/>*/}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {PLAN &&
            <div className="plan-feedback-card">
                <div className="plan-feedback-card__title">
                    نظر شما درباره این پلن چیست؟
                </div>

                <div className="plan-feedback-card__sub">
                    پیشنهادات، انتقادات یا مشکلات خود را برای ما بنویسید.
                </div>
                <div className="plan-feedback-card__rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`plan-feedback-card__star ${
                                star <= (hoverRating || rating) ? 'active' : ''
                            }`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
            ★
        </span>
                    ))}
                </div>

                <textarea
                    className="plan-feedback-card__textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="نظر خود را اینجا بنویسید..."
                    rows={5}
                />

                <button
                    className="plan-feedback-card__btn"
                    onClick={submitComment}
                    disabled={loading}
                >
                    {loading ? 'در حال ارسال...' : 'ثبت نظر'}
                </button>
            </div>

        }
        {toast && <div className="error-landing-toast">{error}</div>}
        {Mtoast && <div className="gr-save-toast">✓ {message}</div>}

        {/*<div className="plan-usage-grid">*/}
        {/*    {[*/}
        {/*        {icon: "📝", label: "آزمون‌های برگزار شده", used: 3, total: 10, color: "var(--primary)"},*/}
        {/*        {icon: "👥", label: "دانش‌آموزان ثبت‌شده", used: 98, total: 500, color: "var(--sky)"},*/}
        {/*        {icon: "❓", label: "سوالات ذخیره شده", used: 4, total: null, color: "var(--violet)"},*/}
        {/*        {icon: "💾", label: "فضای ذخیره‌سازی (MB)", used: 234, total: 2048, color: "var(--accent)"},*/}
        {/*        {icon: "📊", label: "گزارش‌های دانلود شده", used: 12, total: null, color: "var(--green)"},*/}
        {/*        {icon: "📧", label: "ایمیل‌های ارسال شده", used: 45, total: 200, color: "var(--rose)"},*/}
        {/*    ].map(u => (*/}
        {/*        <div key={u.label} className="plan-usage-card">*/}
        {/*            <div className="plan-usage-card__icon">{u.icon}</div>*/}
        {/*            <div className="plan-usage-card__label">{u.label}</div>*/}
        {/*            <div className="plan-usage-card__nums">*/}
        {/*                <span className="plan-usage-card__used"*/}
        {/*                      style={{color: u.color}}>{u.used.toLocaleString("fa-IR")}</span>*/}
        {/*                {u.total && <span className="plan-usage-card__total">/ {u.total.toLocaleString("fa-IR")}</span>}*/}
        {/*            </div>*/}
        {/*            {u.total && <div className="plan-usage-bar">*/}
        {/*                <div className="plan-usage-fill"*/}
        {/*                     style={{width: `${(u.used / u.total) * 100}%`, background: u.color}}/>*/}
        {/*            </div>}*/}
        {/*        </div>*/}
        {/*    ))}*/}
        {/*</div>*/}
    </>
};