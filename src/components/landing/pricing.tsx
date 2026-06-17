import {useEffect, useState} from 'react';
import {Pill} from './../landing/details_component';
import {C} from '../../styles/theme'
import './../../styles/azmon_landing.css'
import Axios from "axios";
import {useNavigate} from "react-router-dom";
import {CheckAuth} from "../../check_auth";

export interface Plan {
    id: number;
    name: string;
    exam_number: string;
    price: number | null;
    color: string;
    question_number: string[];
    badge: string | null;
    highlight: boolean;
    student_number: boolean;
}

export const Pricing: React.FC = () => {
    const [annual, setAnnual] = useState<boolean>(false);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [err, setErr] = useState('');
    const navigate = useNavigate();
    const [toast, setToast] = useState(false);
    const [Mtoast, setMToast] = useState(false);
    const [message, setMessage] = useState('');
    const get_plans = () => {
        Axios.get(`http://localhost:8000/plan`)
            .then((res) => {
                setPlans(res.data.plans)
            })
    }

    const addToCart = (plan_id: number) => {
        setToast(false)
        setMToast(false)
        setMessage('')
        setErr('')
        Axios.post('http://localhost:8000/cart/add', {'plan_id': plan_id}, {withCredentials: true})
            .then((res) => {
                setMToast(true);
                setMessage('پلن به سبد خرید اضافه شد');
            })
            .catch(async (err) => {
                if (err.response?.status === 409) {
                    if (err.response?.data?.detail === 'cart exist'){
                        setErr('یک پلن در سبد خرید شما موجود است.')
                    } else {
                        setErr('شما یک پلن فعال دارید')
                    }
                    setToast(true);
                } else if (err.response?.status === 401) {
                    const result = await CheckAuth();
                    if (!result) {
                        navigate('/auth')
                    } else {
                        addToCart(plan_id);
                    }
                } else if (err.response?.status === 403) {
                    setErr('به عنوان استاد وارد شوید')
                    setToast(true);
                }
            })
    }
    useEffect(() => {
        get_plans()
    }, []);

    return (
        <section id='plan' className='pricing-section'>
            <div className='pricing-inner'>
                <> {/*FadeIn */}
                    <div className='pricing-header'>
                        <Pill label="قیمت‌گذاری" color={C.accent} bg={C.accentLt}/>
                        <h2 style={{color: C.text, fontSize: 42, fontWeight: 900, marginBottom: 14}}>پلن مناسب خود را
                            انتخاب کنید</h2>
                        <div style={{
                            display: "inline-flex",
                            background: C.bgWhite,
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 14,
                            padding: 4,
                            gap: 4
                        }}>
                            {/*, "سالانه (۲۰٪ تخفیف)"*/}
                            {/*{["سالانه"].map((t, i) => (*/}
                            {/*    <button key={t} onClick={() => setAnnual(i === 1)}*/}
                            {/*            style={{*/}
                            {/*                padding: "9px 22px",*/}
                            {/*                borderRadius: 10,*/}
                            {/*                border: "none",*/}
                            {/*                cursor: "pointer",*/}
                            {/*                fontSize: 14,*/}
                            {/*                fontWeight: 700,*/}
                            {/*                background: annual === (i === 1) ? `linear-gradient(135deg,${C.primary},${C.primaryDk})` : "transparent",*/}
                            {/*                color: annual === (i === 1) ? "#fff" : C.textSub,*/}
                            {/*                transition: "all 0.25s",*/}
                            {/*                fontFamily: "inherit"*/}
                            {/*            }}*/}
                            {/*    >{t}</button>*/}
                            {/*))}*/}
                        </div>
                    </div>
                </>
                <div className='plans-grid'>
                    {plans.map((p, i) => (
                        <> {/* FadeIn key={p.name} delay={i*0.1} */}
                            <div style={{
                                position: "relative",
                                background: p.highlight ? `linear-gradient(145deg,${C.primary},${C.primaryDk})` : C.bgWhite,
                                border: p.highlight ? "none" : `1.5px solid ${C.border}`,
                                borderRadius: 24,
                                padding: 36,
                                height: "100%",
                                boxShadow: p.highlight ? `0 24px 64px ${C.primary}30` : "none"
                            }}>
                                {p.badge && <div style={{
                                    position: "absolute",
                                    top: -15,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: `linear-gradient(135deg,${C.sun},${C.sunDk})`,
                                    color: C.text,
                                    fontSize: 12,
                                    fontWeight: 900,
                                    padding: "5px 18px",
                                    borderRadius: 100,
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 4px 12px rgba(252,211,77,0.5)"
                                }}>{p.badge}</div>}
                                <span style={{
                                    color: p.highlight ? "rgba(255,255,255,0.7)" : C.primary,
                                    fontSize: 13,
                                    fontWeight: 700
                                }}>{p.name}</span>
                                <h3 style={{
                                    color: p.highlight ? "#fff" : C.text,
                                    fontSize: 24,
                                    fontWeight: 900,
                                    marginBottom: 24,
                                    marginTop: 6
                                }}>{p.name}</h3>
                                {p.price !== null
                                    ? <div style={{marginBottom: 32}}><span style={{
                                        color: p.highlight ? "#fff" : C.text,
                                        fontSize: 44,
                                        fontWeight: 900
                                    }}>{p.price.toLocaleString()}</span><span style={{
                                        color: p.highlight ? "rgba(255,255,255,0.65)" : C.textSub,
                                        fontSize: 15
                                    }}> تومان/سالانه</span></div>
                                    :
                                    <div style={{color: C.accent, fontSize: 28, fontWeight: 900, marginBottom: 32}}>تماس
                                        بگیرید</div>
                                }
                                <div style={{marginBottom: 32}}>
                                    {[
                                        `تعداد آزمون: ${p.exam_number}`,
                                        `تعداد سوالات: ${p.question_number}`,
                                        `تعداد دانش‌آموز: ${p.student_number}`,

                                    ].map((f) => (
                                        <div
                                            key={f}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                marginBottom: 12
                                            }}
                                        >
                                            <div style={{
                                                width: 20,
                                                height: 20,
                                                background: p.highlight ? "rgba(255,255,255,0.2)" : C.primaryLt,
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                fontSize: 11,
                                                color: p.highlight ? "#fff" : C.primary,
                                                fontWeight: 900
                                            }}>
                                                ✓
                                            </div>

                                            <span style={{
                                                color: p.highlight ? "rgba(255,255,255,0.85)" : C.textSub,
                                                fontSize: 14
                                            }}>
                {f}
            </span>
                                        </div>
                                    ))}
                                </div>
                                {/*<div style={{marginBottom: 32}}>*/}
                                {/*    {p.features.map((f) => (*/}
                                {/*        <div key={f}*/}
                                {/*             style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>*/}
                                {/*            <div style={{*/}
                                {/*                width: 20,*/}
                                {/*                height: 20,*/}
                                {/*                background: p.highlight ? "rgba(255,255,255,0.2)" : C.primaryLt,*/}
                                {/*                borderRadius: "50%",*/}
                                {/*                display: "flex",*/}
                                {/*                alignItems: "center",*/}
                                {/*                justifyContent: "center",*/}
                                {/*                flexShrink: 0,*/}
                                {/*                fontSize: 11,*/}
                                {/*                color: p.highlight ? "#fff" : C.primary,*/}
                                {/*                fontWeight: 900*/}
                                {/*            }}>✓*/}
                                {/*            </div>*/}
                                {/*            <span style={{*/}
                                {/*                color: p.highlight ? "rgba(255,255,255,0.85)" : C.textSub,*/}
                                {/*                fontSize: 14*/}
                                {/*            }}>{f}</span>*/}
                                {/*        </div>*/}
                                {/*    ))}*/}
                                {/*</div>*/}
                                <button style={{
                                    width: "100%",
                                    padding: "14px 0",
                                    borderRadius: 12,
                                    border: "none",
                                    background: p.highlight ? C.bgWhite : `linear-gradient(135deg,${C.primary},${C.primaryDk})`,
                                    color: p.highlight ? C.primary : "#fff",
                                    fontSize: 15,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: p.highlight ? "none" : `0 6px 18px ${C.shadow}`,
                                    fontFamily: "inherit"
                                }}
                                        onMouseEnter={(e) => {
                                            const b = e.target as HTMLButtonElement;
                                            b.style.transform = "translateY(-1px)";
                                            b.style.opacity = "0.92";
                                        }}
                                        onMouseLeave={(e) => {
                                            const b = e.target as HTMLButtonElement;
                                            b.style.transform = "translateY(0)";
                                            b.style.opacity = "1";
                                        }}
                                        onClick={() => addToCart(p.id)}
                                >{p.price !== null ? "شروع کنید" : "با ما تماس بگیرید"}</button>
                            </div>
                        </>
                    ))}
                </div>
            </div>
            {toast && <div className="error-landing-toast">{err}</div>}
            {Mtoast && <div className="gr-save-toast">✓ {message}</div>}
        </section>

    );
};
