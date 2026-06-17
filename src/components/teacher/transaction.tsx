import {TRANSACTIONS} from "./types";
import Axios from "axios";
import {useEffect, useState} from "react";
import {CheckAuth} from "../../check_auth";

interface transInfo {
    name: string;
    price: number;
    status: string;
    gateway: string;
    date: string;
    id: number;
    trans_id: string;
}

export const TransactionsSection: React.FC = () => {
    const statusMap: Record<string, [string, string]> = {
        complete: ["tch-badge--green", "پرداخت شده"],
        incomplete: ["tch-badge--rose", "ناموفق"],
    };
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [TRANSACTIONS, setTrans] = useState<transInfo[]>([])
    const [stats, setStats] = useState({
        total_amount: 0,
        complete_count: 0,
        incomplete_count: 0
    });
    const get_trans_stat = () => {
        Axios.get('http://localhost:8000/teacher/transaction/trans/info', {withCredentials: true})
            .then((res) => {
                setStats(res.data.stats)
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return get_trans(page);
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    const get_trans = (pageNumber = 1) => {
        Axios.get(`http://localhost:8000/teacher/transaction?page=${pageNumber}&size=10`, {withCredentials: true})
            .then((res) => {
                setTrans(res.data.items);
                setPages(res.data.pages);
            })
            .catch(async (err) => {
                if (err.response.status === 401) {
                    const is_successful = await CheckAuth();
                    if (is_successful) {
                        return get_trans(page);
                    }
                }
                // revoke()
                // navigate('/auth');
            })
    }
    useEffect(() => {
        get_trans_stat()
    }, []);
    useEffect(() => {
        get_trans(page)
    }, [page]);
    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">تراکنش‌ها</div>
                    <div className="tch-sec-sub">سابقه پرداخت‌های شما</div>
                </div>
                {/*<button className="tch-btn tch-btn--ghost">⬇ دانلود Excel</button>*/}
            </div>

            <div className="tch-stats">
                {[
                    {
                        icon: "💰",
                        label: "مجموع پرداختی",
                        value: `${stats.total_amount.toLocaleString("fa-IR")} هزار`,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                    {
                        icon: "📑",
                        label: "تراکنش موفق",
                        value: stats.complete_count,
                        bg: "var(--primary-lt)",
                        color: "var(--primary)"
                    },
                    {
                        icon: "❌",
                        label: "تراکنش ناموفق",
                        value: stats.incomplete_count,
                        bg: "var(--rose-lt)",
                        color: "var(--rose)"
                    },
                    // {icon: "📅", label: "پرداخت بعدی", value: "۱۴۰۴/۰۱/۰۱", bg: "var(--sky-lt)", color: "var(--sky)"},
                ].map(s => (
                    <div key={s.label} className="tch-stat">
                        <div className="tch-stat__icon" style={{background: s.bg}}>{s.icon}</div>
                        <div>
                            <div className="tch-stat__label">{s.label}</div>
                            <div className="tch-stat__value" style={{color: s.color}}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tch-card">
                <div className="tch-table-wrap">
                    <table className="tch-table">
                        <thead>
                        <tr>

                            <th>پلن</th>
                            {/*<th>دوره</th>*/}
                            <th>مبلغ</th>
                            <th>روش پرداخت</th>
                            <th>وضعیت</th>
                            <th>تاریخ</th>
                            {/*<th>فاکتور</th>*/}
                            <th>کد رهگیری</th>
                        </tr>
                        </thead>
                        <tbody>
                        {TRANSACTIONS.map(t => {
                            const [cls, label] = statusMap[t.status] ?? ["tch-badge--gray", "نامشخص"];

                            return (
                                <tr key={t.id}>
                                    <td data-label="پلن" style={{fontWeight: 700}}>{t.name}</td>


                                    {/*<td data-label="دوره">*/}
                                    {/*<span className="tch-badge tch-badge--gray">*/}
                                    {/*  {t.billing}*/}
                                    {/*</span>*/}
                                    {/*                          </td>*/}

                                    <td data-label="مبلغ" style={{fontWeight: 800, color: "var(--green)"}}>
                                        {t.price.toLocaleString("fa-IR")} هزار
                                    </td>

                                    <td data-label="روش پرداخت" style={{color: "var(--adm-sub)"}}>
                                        {t.gateway}
                                    </td>

                                    <td data-label="وضعیت">
                                        <span className={`tch-badge ${cls}`}>{label}</span>
                                    </td>

                                    <td data-label="تاریخ" style={{color: "var(--adm-sub)", fontSize: 12}}>
                                        {t.date}
                                    </td>
                                    <td data-label="کد رهگیری" style={{fontWeight: 700}}>{t.trans_id}</td>
                                    {/*<td data-label="فاکتور">*/}
                                    {/*    <button className="tch-btn tch-btn--ghost tch-btn--sm">*/}
                                    {/*        دانلود*/}
                                    {/*    </button>*/}
                                    {/*</td>*/}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {TRANSACTIONS.length > 10 && (
                        <div className="tch-pagination">
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
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
