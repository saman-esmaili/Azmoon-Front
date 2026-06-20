import {useState, ReactNode, useEffect} from "react";
import "../styles/admin.css";
import {Section} from "../components/admin/types";
import {UsersSection} from "../components/admin/users";
import {PaymentsSection} from "../components/admin/payments";
import {QuestionsSection} from "../components/admin/question";
import {MessagesSection} from "../components/admin/message";
import {NAV_ITEMS, SECTION_TITLES} from "../components/admin/sidebar";
import {LogOut} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {revoke} from "../check_auth";

const AdminPanel: React.FC = () => {
    const [active, setActive] = useState<Section>("users");
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    /* جلوگیری از اسکرول وقتی سایدبار موبایل باز است */
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [mobileOpen]);

    const renderContent = (): ReactNode => {
        if (active === "users") return <UsersSection/>;
        if (active === "payments") return <PaymentsSection/>;
        if (active === "questions") return <QuestionsSection/>;
        if (active === "messages") return <MessagesSection/>;
        return null;
    };

    const handleNavClick = (id: Section) => {
        setActive(id);
        setMobileOpen(false); // در موبایل بسته شود
    };
    const navigate = useNavigate()
    const handleLogout = async () => {
        await revoke();
        navigate('/');
    }
    return (
        <div className="adm-shell" dir="rtl">

            {/* Overlay موبایل */}
            {mobileOpen && (
                <div
                    className="tch-sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}


            {/* ── Sidebar ── */}
            <aside
                className={`tch-sidebar 
        ${collapsed ? "tch-sidebar--collapsed" : ""} 
        ${mobileOpen ? "tch-sidebar--open" : ""}`}
            >

                {/* Brand */}
                <div className="adm-sidebar__brand">
                    <div className="adm-sidebar__brand-icon">آ</div>
                    {!collapsed && (
                        <>
                            <span className="adm-sidebar__brand-name">آزمون‌گیر</span>
                            <span className="adm-sidebar__brand-badge">ادمین</span>
                        </>
                    )}
                </div>

                {/* Nav */}
                <nav className="adm-sidebar__nav">
                    {!collapsed && (
                        <div className="adm-sidebar__section-label">مدیریت</div>
                    )}

                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            className={`adm-nav-item ${
                                active === item.id ? "adm-nav-item--active" : ""
                            }`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            <div className="adm-nav-item__icon">{item.icon}</div>
                            {!collapsed && (
                                <span className="adm-nav-item__label">
                  {item.label}
                </span>
                            )}
                            {!collapsed && item.badge && (
                                <span className="adm-nav-item__badge">
                  {item.badge}
                </span>
                            )}
                        </button>
                    ))}

                    {!collapsed && (
                        <div
                            className="adm-sidebar__section-label"
                            style={{marginTop: 24}}
                        >
                            سیستم
                        </div>
                    )}

                    {[
                        {icon: "⚙️", label: "تنظیمات"},
                        {icon: "📊", label: "گزارش‌ها"},
                        {icon: "🔗", label: "بازگشت به سایت"},
                    ].map((item) => (
                        <button key={item.label} className="adm-nav-item">
                            <div className="adm-nav-item__icon">{item.icon}</div>
                            {!collapsed && (
                                <span className="adm-nav-item__label">
                  {item.label}
                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User */}
                <div className="adm-sidebar__footer">
                    <div className="adm-sidebar__user">
                        <div className="adm-sidebar__user-avatar">👤</div>
                        {!collapsed && (
                            <div>
                                <div className="adm-sidebar__user-name">
                                    ادمین اصلی
                                </div>
                                <div className="adm-sidebar__user-role">
                                    مدیر سیستم
                                </div>
                            </div>
                        )}
                    </div>

                    {/* collapse فقط دسکتاپ */}
                    <button
                        className="adm-sidebar__toggle"
                        onClick={() => setCollapsed((p) => !p)}
                    >
                        {collapsed ? "←" : "→"}
                    </button>
                </div>
            </aside>

            {/* ── Topbar ── */}
            <header
                className={`adm-topbar ${
                    collapsed ? "adm-topbar--collapsed" : ""
                }`}
            >
                <div className="adm-topbar__left">

                    {/* Hamburger موبایل */}
                    <button
                        className="adm-topbar__hamburger"
                        onClick={() => setMobileOpen(true)}
                    >
                        <span/>
                    </button>

                    <span className="adm-topbar__page-title">
            {SECTION_TITLES[active]}
          </span>

                    <div className="adm-topbar__breadcrumb">
                        <a href="/">سایت</a>
                        <span>›</span>
                        <span>پنل ادمین</span>
                        <span>›</span>
                        <span>{SECTION_TITLES[active]}</span>
                    </div>
                </div>

                <div className="adm-topbar__right">
                    <button
                        className="tch-icon-btn"
                        onClick={() => handleLogout()}
                    >
                        <LogOut size={20}/>
                    </button>
                </div>
            </header>

            {/* ── Content ── */}
            <main
                className={`adm-content ${
                    collapsed ? "adm-content--collapsed" : ""
                }`}
                key={active}
            >
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminPanel;