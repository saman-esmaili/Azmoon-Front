import {formatK, PAYMENTS, payStatusBadge} from "./types";
import '../../styles/admin.css';
export const PaymentsSection: React.FC = () => {
  const totalPaid = PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending   = PAYMENTS.filter((p) => p.status === "pending").length;
  const failed    = PAYMENTS.filter((p) => p.status === "failed").length;

  return (
    <>
      <div className="adm-stats">
        {[
          { icon:"💰", label:"درآمد این ماه",  value:formatK(totalPaid), change:"+۱۸٪", up:true,  bg:"var(--green-lt)",  color:"var(--green)" },
          { icon:"⏳", label:"در انتظار",       value:`${pending}`,       change:"نیاز به پیگیری", up:false, bg:"#FEF3C7", color:"#92400E" },
          { icon:"❌", label:"پرداخت ناموفق",  value:`${failed}`,        change:"باید پیگیری شود", up:false, bg:"var(--rose-lt)", color:"var(--rose)" },
          { icon:"📈", label:"تراکنش‌های کل",  value:`${PAYMENTS.length}`, change:"این دوره", up:true, bg:"var(--sky-lt)", color:"var(--sky)" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-card__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="adm-stat-card__label">{s.label}</div>
              <div className="adm-stat-card__value">{s.value}</div>
              <div className={`adm-stat-card__change ${s.up ? "adm-stat-card__change--up" : "adm-stat-card__change--down"}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue bar chart (visual) */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card__header">
          <div className="adm-card__title">درآمد ۶ ماه اخیر</div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, alignItems: "end", height: 120 }}>
            {[
              { month: "بهمن", val: 60 }, { month: "اسفند", val: 75 },
              { month: "فروردین", val: 55 }, { month: "اردیبهشت", val: 88 },
              { month: "خرداد", val: 70 }, { month: "تیر", val: 100 },
            ].map((d) => (
              <div key={d.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ width: "100%", background: "var(--primary)", borderRadius: "6px 6px 0 0", height: `${d.val}%`, opacity: d.month === "تیر" ? 1 : 0.55, transition: "height 0.5s ease" }} />
                <span style={{ color: "var(--adm-light)", fontSize: 11, fontWeight: 600 }}>{d.month}</span>
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
                <th>دوره</th>
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
                    <td style={{ color: "var(--adm-light)", fontFamily: "monospace", fontSize: 12 }}>#{p.id}</td>
                    <td><span className="adm-table__name">{p.userName}</span></td>
                    <td>{p.plan}</td>
                    <td><span className="adm-badge adm-badge--gray">{p.billing === "annual" ? "سالانه" : "ماهانه"}</span></td>
                    <td style={{ fontWeight: 800, color: "var(--green)" }}>{p.amount.toLocaleString("fa-IR")} هزار</td>
                    <td style={{ color: "var(--adm-sub)" }}>{p.method}</td>
                    <td><span className={`adm-badge ${badge.cls}`}>{badge.label}</span></td>
                    <td style={{ color: "var(--adm-sub)", fontSize: 12 }}>{p.date}</td>
                    <td>
                      <div className="adm-table__actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm">فاکتور</button>
                        {p.status === "pending" && <button className="adm-btn adm-btn--primary adm-btn--sm">تأیید</button>}
                        {p.status === "paid" && <button className="adm-btn adm-btn--danger adm-btn--sm">استرداد</button>}
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
              <button key={p} className={`adm-page-btn ${p === "۱" ? "adm-page-btn--active" : ""}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};