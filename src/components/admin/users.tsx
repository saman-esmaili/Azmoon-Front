import {useEffect, useState} from "react";
import {userStatusBadge} from "./types";
import '../../styles/admin.css';
import Axios from "axios";
import {CheckAuth, revoke} from "../../check_auth";
import {useNavigate} from "react-router-dom";

type UserType = "student" | "teacher" | "admin";

interface User {
    id: number;
    name: null | string;
    mobile: string;
    last_login: string;
    membership_date: string;
    plan: null | string;
    type: UserType;
    email: null | string;
    plan_count:number;
}

export const UsersSection: React.FC = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [drawer, setDrawer] = useState<User | null>(null);
    const [USERS, setUsers] = useState<User[]>([]);
    const [examCount, setExamCount] = useState(0);
    const navigate = useNavigate();

    const get_users = () => {
        Axios.get('http://localhost:8000/admin/users', {withCredentials: true})
            .then((res) => {
                setUsers(res.data.users);
                setExamCount(res.data.exam)
                console.log(USERS);
                console.log(examCount);
            }).catch(async (err) => {
            if (err.response.status === 401) {
                const is_successful = await CheckAuth();
                if (is_successful) {
                    return get_users();
                }
            }
            // revoke()
            // navigate('/auth');
        })
    }
    useEffect(() => {
        get_users()
    }, []);
    const filtered = USERS.filter((u) => {
        const matchSearch = u.name?.includes(search) || u.mobile.includes(search);
        const matchFilter = filter === "all" || u.type === filter;
        return matchSearch && matchFilter;
    });

    return (
        <>
            {/* Stats */}
            <div className="adm-stats">
                {[
                    {
                        icon: "👥",
                        label: "کل کاربران",
                        value: USERS.length,
                        change: "+۲ این ماه",
                        up: true,
                        bg: "var(--primary-lt)",
                        color: "var(--primary)"
                    },
                    {
                        icon: "✅",
                        label: "دانش آموز",
                        value: USERS.filter(u => u.type === "student").length,
                        change: "۶۶٪ از کل",
                        up: true,
                        bg: "var(--green-lt)",
                        color: "var(--green)"
                    },
                    {
                        icon: "⏳",
                        label: "مدرس",
                        value: USERS.filter(u => u.type === "teacher").length,
                        change: "نیاز به تأیید",
                        up: false,
                        bg: "#FEF3C7",
                        color: "#92400E"
                    },
                    {
                        icon: "📊",
                        label: "مجموع آزمون",
                        value: examCount,
                        // change: "+۴۷ این هفته",
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

            {/* Table */}
            <div className="adm-card">
                <div className="adm-card__header">
                    <div>
                        <div className="adm-card__title">لیست کاربران</div>
                        <div className="adm-card__sub">{filtered.length} کاربر</div>
                    </div>
                    <div className="adm-section-header__right">
                        <div className="users-filters">
                            <input className="adm-input" style={{width: 200}} placeholder="🔍 جستجو..." value={search}
                                   onChange={(e) => setSearch(e.target.value)}/>
                            <select className="adm-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">همه کاربران</option>
                                <option value="teacher">مدرس</option>
                                <option value="student">دانش آموز</option>
                                <option value="admin">ادمین</option>
                            </select>
                        </div>
                        {/*<button className="adm-btn adm-btn--primary">+ کاربر جدید</button>*/}
                    </div>
                </div>
                <div className="adm-table-wrap">
                    <table className="adm-table">
                        <thead>
                        <tr>
                            <th>کاربر</th>
                            <th>پلن</th>
                            <th>نوع</th>
                            {/*<th>آزمون</th>*/}
                            <th>عضویت</th>
                            <th>آخرین ورود</th>
                            <th>عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((u) => {
                            const badge = userStatusBadge(u.type);
                            return (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{display: "flex", alignItems: "center", gap: 10}}>
                                            <div className="adm-table__avatar"
                                                 style={{background: 'bisque'}}>{u.name?.[0] || '?'}</div>
                                            <div>
                                                <div className="adm-table__name">{u.name || '-'}</div>
                                                <div className="adm-table__email">{u.mobile}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="adm-badge"
                                              style={{background: 'var(--adm-light)'}}>{u.plan}</span></td>
                                    {u.type === 'student' && <td>دانش آموز</td>}
                                    {u.type === 'teacher' && <td>مدرس</td>}
                                    {u.type === 'admin' && <td>ادمین</td>}
                                    <td style={{color: "var(--adm-sub)", fontSize: 12}}>{u.membership_date}</td>
                                    <td style={{color: "var(--adm-sub)", fontSize: 12}}>{u.last_login}</td>
                                    <td>
                                        <div className="adm-table__actions">
                                            <button className="adm-btn adm-btn--ghost adm-btn--sm"
                                                    onClick={() => setDrawer(u)}>مشاهده
                                            </button>
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
                            <button key={p}
                                    className={`adm-page-btn ${p === "۱" ? "adm-page-btn--active" : ""}`}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Drawer */}
            {drawer && (
                <>
                    <div className="user-drawer-backdrop" onClick={() => setDrawer(null)}/>
                    <div className="user-drawer">
                        <div className="user-drawer__header">
                            <span className="user-drawer__title">مشخصات کاربر</span>
                            <button className="user-drawer__close" onClick={() => setDrawer(null)}>×</button>
                        </div>
                        <div className="user-drawer__body">
                            <div className="user-drawer__avatar-row">
                                <div className="user-drawer__avatar"
                                     style={{background: 'var(--adm-sidebar-act)'}}>{drawer.name?.[0] || '?'}</div>
                                <div>
                                    <div className="user-drawer__name">{drawer.name || '-'}</div>
                                    <div className="user-drawer__email">{drawer.email || '-'}</div>
                                </div>
                            </div>
                            <div className="user-drawer__detail-grid">
                                {[
                                    ["شماره تماس", drawer.mobile], ["پلن", drawer.plan],
                                    ["تعداد پلن", `${drawer.plan_count || 0}`], ["نوع کاربر", userStatusBadge(drawer.type).label],
                                    ["تاریخ عضویت", drawer.membership_date], ["آخرین ورود", drawer.last_login],
                                ].map(([label, val]) => (
                                    <div key={label} className="user-drawer__detail">
                                        <div className="user-drawer__detail-label">{label}</div>
                                        <div className="user-drawer__detail-val">{val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
