import {useState} from "react";
import {User, USERS, userStatusBadge} from "./types";
import '../../styles/admin.css';
export const UsersSection: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawer, setDrawer] = useState<User | null>(null);

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* Stats */}
      <div className="adm-stats">
        {[
          { icon:"👥", label:"کل کاربران",    value:"۶",   change:"+۲ این ماه",  up:true,  bg:"var(--primary-lt)", color:"var(--primary)" },
          { icon:"✅", label:"کاربر فعال",    value:"۴",   change:"۶۶٪ از کل",   up:true,  bg:"var(--green-lt)",   color:"var(--green)" },
          { icon:"⏳", label:"در انتظار",      value:"۱",   change:"نیاز به تأیید", up:false, bg:"#FEF3C7",          color:"#92400E" },
          { icon:"📊", label:"مجموع آزمون",   value:"۳۸۵", change:"+۴۷ این هفته", up:true,  bg:"var(--sky-lt)",    color:"var(--sky)" },
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

      {/* Table */}
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <div className="adm-card__title">لیست کاربران</div>
            <div className="adm-card__sub">{filtered.length} کاربر</div>
          </div>
          <div className="adm-section-header__right">
            <div className="users-filters">
              <input className="adm-input" style={{ width: 200 }} placeholder="🔍 جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="adm-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="pending">در انتظار</option>
              </select>
            </div>
            <button className="adm-btn adm-btn--primary">+ کاربر جدید</button>
          </div>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>کاربر</th>
                <th>پلن</th>
                <th>وضعیت</th>
                <th>آزمون</th>
                <th>عضویت</th>
                <th>آخرین ورود</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const badge = userStatusBadge(u.status);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="adm-table__avatar" style={{ background: u.avatarBg }}>{u.avatar}</div>
                        <div>
                          <div className="adm-table__name">{u.name}</div>
                          <div className="adm-table__email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-badge" style={{ background: u.planBg, color: u.planColor }}>{u.plan}</span></td>
                    <td><span className={`adm-badge ${badge.cls}`}>{badge.label}</span></td>
                    <td>{u.exams}</td>
                    <td style={{ color: "var(--adm-sub)", fontSize: 12 }}>{u.joinDate}</td>
                    <td style={{ color: "var(--adm-sub)", fontSize: 12 }}>{u.lastLogin}</td>
                    <td>
                      <div className="adm-table__actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setDrawer(u)}>مشاهده</button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm">حذف</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="adm-pagination">
          <span className="adm-pagination__info">نمایش ۱ تا {filtered.length} از {USERS.length}</span>
          <div className="adm-pagination__btns">
            {["«", "۱", "۲", "»"].map((p) => (
              <button key={p} className={`adm-page-btn ${p === "۱" ? "adm-page-btn--active" : ""}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawer && (
        <>
          <div className="user-drawer-backdrop" onClick={() => setDrawer(null)} />
          <div className="user-drawer">
            <div className="user-drawer__header">
              <span className="user-drawer__title">مشخصات کاربر</span>
              <button className="user-drawer__close" onClick={() => setDrawer(null)}>×</button>
            </div>
            <div className="user-drawer__body">
              <div className="user-drawer__avatar-row">
                <div className="user-drawer__avatar" style={{ background: drawer.avatarBg }}>{drawer.avatar}</div>
                <div>
                  <div className="user-drawer__name">{drawer.name}</div>
                  <div className="user-drawer__email">{drawer.email}</div>
                </div>
              </div>
              <div className="user-drawer__detail-grid">
                {[
                  ["شماره تماس", drawer.phone], ["پلن", drawer.plan],
                  ["تعداد آزمون", `${drawer.exams} آزمون`], ["وضعیت", userStatusBadge(drawer.status).label],
                  ["تاریخ عضویت", drawer.joinDate], ["آخرین ورود", drawer.lastLogin],
                ].map(([label, val]) => (
                  <div key={label} className="user-drawer__detail">
                    <div className="user-drawer__detail-label">{label}</div>
                    <div className="user-drawer__detail-val">{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="adm-btn adm-btn--primary" style={{ flex: 1 }}>ویرایش</button>
                <button className="adm-btn adm-btn--ghost" style={{ flex: 1 }}>ارسال ایمیل</button>
                <button className="adm-btn adm-btn--danger adm-btn--sm">حذف</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
