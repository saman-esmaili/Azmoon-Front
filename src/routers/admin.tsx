import {useState, ReactNode, useEffect} from "react";
import "../styles/admin.css";
import {Section} from "../components/admin/types";
import {UsersSection} from "../components/admin/users";
import {PaymentsSection} from "../components/admin/payments";
import {QuestionsSection} from "../components/admin/question";
import {MessagesSection} from "../components/admin/message";
import {NAV_ITEMS, SECTION_TITLES} from "../components/admin/sidebar";

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

    return (
        <div className="adm-shell" dir="rtl">

            {/* Overlay موبایل */}
            {mobileOpen && (
                <div
                    className="adm-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`adm-sidebar
          ${collapsed ? "adm-sidebar--collapsed" : ""}
          ${mobileOpen ? "adm-sidebar--open" : ""}`}
            >
                {/* Header موبایل */}
                <div className="adm-sidebar__mobile-header">
                    <span>منو</span>
                    <button onClick={() => setMobileOpen(false)}>✕</button>
                </div>

                {/* Brand */}
                <div className="adm-sidebar__brand">
                    <div className="adm-sidebar__brand-icon">آ</div>
                    {!collapsed && (
                        <>
                            <span className="adm-sidebar__brand-name">آزمون‌گیر</span>
                            <span className="adm-sidebar__brand-badge">Admin</span>
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
                    {/*<div className="adm-topbar__search">*/}
                    {/*    <span className="adm-topbar__search-icon">🔍</span>*/}
                    {/*    <input placeholder="جستجوی سریع..."/>*/}
                    {/*</div>*/}

                    <button className="adm-icon-btn">
                        🔔
                        <span className="adm-icon-btn__dot"/>
                    </button>

                    <button className="adm-icon-btn">⚙️</button>
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