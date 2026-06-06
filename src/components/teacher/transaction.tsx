import {TRANSACTIONS} from "./types";

export const TransactionsSection: React.FC = () => {
    const statusMap: Record<string, [string, string]> = {
        paid: ["tch-badge--green", "پرداخت شده"],
        failed: ["tch-badge--rose", "ناموفق"],
        pending: ["tch-badge--amber", "در انتظار"],
    };
    return (
        <>
            <div className="tch-sec-header">
                <div className="tch-sec-header__left">
                    <div className="tch-sec-title">تراکنش‌ها</div>
                    <div className="tch-sec-sub">سابقه پرداخت‌های شما</div>
                </div>
                <button className="tch-btn tch-btn--ghost">⬇ دانلود Excel</button>
            </div>

            <div className="tch-stats">
                {[
                    {
                        icon: "💰",
                        label: "مجموع پرداختی",
                        value: `${TRANSACTIONS.filter(t => t.status === "paid").reduce((s, t) => s + t.amount, 0).toLocaleString("fa-IR")} هزار`,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                    {
                        icon: "📑",
                        label: "تراکنش موفق",
                        value: `${TRANSACTIONS.filter(t => t.status === "paid").length}`,
                        bg: "var(--primary-lt)",
                        color: "var(--primary)"
                    },
                    {
                        icon: "❌",
                        label: "تراکنش ناموفق",
                        value: `${TRANSACTIONS.filter(t => t.status === "failed").length}`,
                        bg: "var(--rose-lt)",
                        color: "var(--rose)"
                    },
                    {icon: "📅", label: "پرداخت بعدی", value: "۱۴۰۴/۰۱/۰۱", bg: "var(--sky-lt)", color: "var(--sky)"},
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
                            <th>دوره</th>
                            <th>مبلغ</th>
                            <th>روش پرداخت</th>
                            <th>وضعیت</th>
                            <th>تاریخ</th>
                            <th>فاکتور</th>
                        </tr>
                        </thead>
                        <tbody>
                        {TRANSACTIONS.map(t => {
                            const [cls, label] = statusMap[t.status] ?? ["tch-badge--gray", "نامشخص"];

                            return (
                                <tr key={t.id}>
                                    <td data-label="پلن" style={{fontWeight: 700}}>{t.plan}</td>

                                    <td data-label="دوره">
          <span className="tch-badge tch-badge--gray">
            {t.billing}
          </span>
                                    </td>

                                    <td data-label="مبلغ" style={{fontWeight: 800, color: "var(--green)"}}>
                                        {t.amount.toLocaleString("fa-IR")} هزار
                                    </td>

                                    <td data-label="روش پرداخت" style={{color: "var(--adm-sub)"}}>
                                        {t.method}
                                    </td>

                                    <td data-label="وضعیت">
                                        <span className={`tch-badge ${cls}`}>{label}</span>
                                    </td>

                                    <td data-label="تاریخ" style={{color: "var(--adm-sub)", fontSize: 12}}>
                                        {t.date}
                                    </td>

                                    <td data-label="فاکتور">
                                        <button className="tch-btn tch-btn--ghost tch-btn--sm">
                                            دانلود
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
