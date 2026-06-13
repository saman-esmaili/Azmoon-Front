import {payStatusBadge} from "./types";
import '../../styles/admin.css';
import {useEffect, useState} from "react";
import Axios from "axios";
import {CheckAuth} from "../../check_auth";

interface headerInfo {
    all: number;
    price: number;
    incomplete: number;
    complete: number;
    month_income: []
}
type STATUS = "complete" | 'incomplete'

interface paymentsInfo {
    user_name: null | string;
    plan: string;
    gateway: string;
    price: number;
    payment_date: string;
    status: STATUS;
    trans_id: string;
    id: number
}

export const PaymentsSection: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(0);
    const [PAYMENTS, setPayments] = useState<paymentsInfo[]>([])
    const months = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
    ];
    const [header, setHeader] = useState<headerInfo>({
        all: 0,
        price: 0,
        incomplete: 0,
        complete: 0,
        month_income: []
    })
    const paymentHeader = () => {
        Axios.get('http://localhost:8000/admin/payments-info', {withCredentials: true})
            .then((res) => {
                setHeader(res.data.payment_header);
                setCurrentMonth(res.data.month_number);
                setPayments([])
                if (res.data.transactions){
                    setPayments(res.data.transactions);
                }

            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return paymentHeader();
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        paymentHeader()
    }, []);
    const labels = Array.from({length: 6}, (_, i) => {
        const monthIndex = (currentMonth - 6 + i + 12) % 12;
        return months[monthIndex];
    });
    const values = header.month_income;

    const chartData = labels.map((month, index) => ({
        month,
        val: values[index],
    }));

    const currentM = months[currentMonth]
    // const totalPaid = PAYMENTS.filter((p) => p.status === "complete").reduce((s, p) => s + p.price, 0);
    // const failed = PAYMENTS.filter((p) => p.status === "incomplete").length;
    //

    return (
        <>
            <div className="adm-stats">
                {[
                    {
                        icon: "💰",
                        label: "درآمد این ماه",
                        value: header.price,
                        change: "+۱۸٪",
                        up: true,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                    {
                        icon: "✅",
                        label: "پرداخت موفق",
                        value: header.complete,
                        change: "نیاز به پیگیری",
                        up: false,
                        bg: "#FEF3C7",
                        color: "#92400E"
                    },
                    {
                        icon: "❌",
                        label: "پرداخت ناموفق",
                        value: header.incomplete,
                        change: "باید پیگیری شود",
                        up: false,
                        bg: "var(--rose-lt)",
                        color: "var(--rose)"
                    },
                    {
                        icon: "📈",
                        label: "تراکنش‌های کل",
                        value: `${PAYMENTS.length}`,
                        change: "این دوره",
                        up: true,
                        bg: "var(--sky-lt)",
                        color: "var(--sky)"
                    },
                ].map((s) => (
                    <div key={s.label} className="adm-stat-card">
                        <div className="adm-stat-card__icon" style={{background: s.bg}}>{s.icon}</div>
                        <div>
                            <div className="adm-stat-card__label">{s.label}</div>
                            <div className="adm-stat-card__value">{s.value}</div>
                            <div
                                className={`adm-stat-card__change ${s.up ? "adm-stat-card__change--up" : "adm-stat-card__change--down"}`}>{s.change}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue bar chart (visual) */}
            <div className="adm-card" style={{marginBottom: 20}}>
                <div className="adm-card__header">
                    <div className="adm-card__title">درآمد ۶ ماه اخیر</div>
                </div>
                <div style={{padding: "20px 24px"}}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(6,1fr)",
                        gap: 8,
                        alignItems: "end",
                        height: 120
                    }}>
                        {chartData.map((d) => (
                            <div key={d.month} style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 6,
                                height: "100%",
                                justifyContent: "flex-end"
                            }}>
                                <div style={{
                                    width: "100%",
                                    background: "var(--primary)",
                                    borderRadius: "6px 6px 0 0",
                                    height: `${d.val}%`,
                                    opacity: d.month === currentM ? 1 : 0.55,
                                    transition: "height 0.5s ease"
                                }}/>
                                <span
                                    style={{color: "var(--adm-light)", fontSize: 11, fontWeight: 600}}>{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="adm-card">
                <div className="adm-card__header">
                    <div>
                        <div className="adm-card__title">تراکنش‌ها</div>
                        <div className="adm-card__sub">{PAYMENTS.length} رکورد</div>
                    </div>
                    <div className="adm-section-header__right">
                        <select className="adm-select">
                            <option>همه وضعیت‌ها</option>
                            <option>پرداخت شده</option>
                            <option>در انتظار</option>
                            <option>ناموفق</option>
                        </select>
                        <button className="adm-btn adm-btn--ghost">⬇ خروجی Excel</button>
                    </div>
                </div>
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>کاربر</th>
                            <th>پلن</th>
                            {/*<th>دوره</th>*/}
                            <th>مبلغ</th>
                            <th>روش</th>
                            <th>وضعیت</th>
                            <th>تاریخ</th>
                            <th>عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {PAYMENTS.map((p) => {
                            const badge = payStatusBadge(p.status);
                            return (
                                <tr key={p.id}>
                                    <td style={{
                                        color: "var(--adm-light)",
                                        fontFamily: "monospace",
                                        fontSize: 12
                                    }}>#{p.id}</td>
                                    <td><span className="adm-table__name">{p.user_name}</span></td>
                                    <td>{p.plan}</td>
                                    {/*<td><span*/}
                                    {/*    className="adm-badge adm-badge--gray">{p.plan}</span>*/}
                                    {/*</td>*/}
                                    <td style={{
                                        fontWeight: 800,
                                        color: "var(--green)"
                                    }}>{p.price.toLocaleString("fa-IR")} هزار
                                    </td>
                                    <td style={{color: "var(--adm-sub)"}}>{p.gateway}</td>
                                    <td><span className={`adm-badge ${badge.cls}`}>{badge.label}</span></td>
                                    <td style={{color: "var(--adm-sub)", fontSize: 12}}>{p.payment_date}</td>
                                    <td>
                                        <div className="adm-table__actions">
                                            <button className="adm-btn adm-btn--ghost adm-btn--sm">فاکتور</button>
                                            {p.status === "incomplete" &&
                                                <button className="adm-btn adm-btn--primary adm-btn--sm">تأیید</button>}
                                            {p.status === "complete" && <button
                                                className="adm-btn adm-btn--danger adm-btn--sm">استرداد</button>}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="adm-pagination">
                    <span className="adm-pagination__info">نمایش ۱ تا {PAYMENTS.length}</span>
                    <div className="adm-pagination__btns">
                        {["«", "۱", "»"].map((p) => (
                            <button key={p}
                                    className={`adm-page-btn ${p === "۱" ? "adm-page-btn--active" : ""}`}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};