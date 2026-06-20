import {useState, ReactNode, useEffect} from "react";
import "../styles/teacher.css";
import {Section} from "../components/teacher/types";
import {ClassesSection} from "../components/teacher/class";
import QuestionsSection from "../components/teacher/question";
import {ExamsSection} from "../components/teacher/exam";
import {StudentsSection} from "../components/teacher/student";
import {MyPlanSection} from "../components/teacher/my-plan";
import {TransactionsSection} from "../components/teacher/transaction";
import {ProfileSection} from "../components/teacher/profile";
import {MessagesSection} from "../components/teacher/message";
import {LogOut} from "lucide-react";
import {NAV_ACCOUNT, NAV_MAIN, SECTION_TITLES} from "../components/teacher/sidebar";
import {revoke} from "../check_auth";
import {useNavigate} from "react-router-dom";
import Axios from "axios";
import {PlanComments} from "./commentPlan";

const TeacherPanel: React.FC = () => {
    const [active, setActive] = useState<Section>("classes");
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    useEffect(() => {
        setMobileOpen(false);
    }, [active]);
    const navigate = useNavigate()
    const handleLogout = async () => {
        await revoke();
        navigate('/');
    }
    const [isStudent, setIsStudent] = useState(false);
    const get_types = () => {
        Axios.get('http://localhost:8000/types', {withCredentials: true})
            .then((res) => {
                setIsStudent(res.data.student)
            })
    }
    useEffect(() => {
        get_types()
    }, []);

    const student_panel = () =>{
        navigate('/student')
    }
    const renderContent = (): ReactNode => {
        if (active === "classes") return <ClassesSection/>;
        if (active === "questions") return <QuestionsSection/>;
        if (active === "exams") return <ExamsSection/>;
        if (active === "students") return <StudentsSection/>;
        // if (active === "comments") return <PlanComments/>;
        // if (active === "buy-plan") return <BuyPlanSection/>;
        if (active === "my-plan") return <MyPlanSection/>;
        if (active === "transactions") return <TransactionsSection/>;
        if (active === "profile") return <ProfileSection/>;
        if (active === "messages") return <MessagesSection/>;
        return null;
    };

    return (
        <div className="tch-shell" dir="rtl">

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
                <div className="tch-sidebar__brand">
                    <div className="tch-sidebar__brand-icon">آ</div>
                    {!collapsed && (
                        <>
                            <span className="tch-sidebar__brand-name">آزمون‌گیر</span>
                            <span className="tch-sidebar__brand-badge">استاد</span>
                        </>
                    )}
                </div>

                <nav className="tch-sidebar__nav">
                    {!collapsed && <div className="tch-sidebar__label">ابزار تدریس</div>}
                    {NAV_MAIN.map((item) => (
                        <button
                            key={item.id}
                            className={`tch-nav-item ${
                                active === item.id ? "tch-nav-item--active" : ""
                            }`}
                            onClick={() => setActive(item.id)}
                        >
                            <div className="tch-nav-item__icon">{item.icon}</div>
                            {!collapsed && (
                                <span className="tch-nav-item__label">{item.label}</span>
                            )}
                            {!collapsed && item.badge && (
                                <span className="tch-nav-item__badge">{item.badge}</span>
                            )}
                        </button>
                    ))}

                    {!collapsed && (
                        <div className="tch-sidebar__label" style={{marginTop: 20}}>
                            حساب کاربری
                        </div>
                    )}
                    {NAV_ACCOUNT.map((item) => (
                        <button
                            key={item.id}
                            className={`tch-nav-item ${
                                active === item.id ? "tch-nav-item--active" : ""
                            }`}
                            onClick={() => setActive(item.id)}
                        >
                            <div className="tch-nav-item__icon">{item.icon}</div>
                            {!collapsed && (
                                <span className="tch-nav-item__label">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="tch-sidebar__footer">
                    <div className="tch-sidebar__user">
                        <button className="tch-sidebar__btn">
                            پنل استاد
                        </button>

                        {isStudent && (
                            <button className="tch-sidebar__btn" onClick={()=>{student_panel()}}>
                                پنل دانش‌آموز
                            </button>
                        )}
                    </div>

                    {/* دسکتاپ collapse */}
                    <button
                        className="tch-sidebar__toggle"
                        onClick={() => setCollapsed((p) => !p)}
                    >
                        {collapsed ? "←" : "→"}
                    </button>
                </div>
            </aside>

            {/* ── Topbar ── */}
            <header
                className={`tch-topbar ${collapsed ? "tch-topbar--collapsed" : ""}`}
            >
                <div className="tch-topbar__left">

                    {/* دکمه همبرگری موبایل */}
                    <button
                        className="tch-hamburger"
                        onClick={() => setMobileOpen(true)}
                    >
                        ☰
                    </button>

                    <span className="tch-topbar__title">
            {SECTION_TITLES[active]}
          </span>

                    <div className="tch-topbar__bread">
                        <a href="/">سایت</a><span>›</span>
                        <span>پنل استاد</span><span>›</span>
                        <span>{SECTION_TITLES[active]}</span>
                    </div>
                </div>

                <div className="tch-topbar__right">
                    {/*<div className="tch-topbar__search">*/}
                    {/*    <span style={{color: "var(--adm-light)"}}>🔍</span>*/}
                    {/*    <input placeholder="جستجوی سریع..."/>*/}
                    {/*</div>*/}
                    {/*<button*/}
                    {/*    className="tch-icon-btn"*/}
                    {/*    onClick={() => setActive("messages")}*/}
                    {/*>*/}
                    {/*    ✉️*/}
                    {/*    <span className="tch-icon-btn__dot"/>*/}
                    {/*</button>*/}
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
                className={`tch-content ${collapsed ? "tch-content--collapsed" : ""}`}
                key={active}
            >
                {renderContent()}
            </main>
        </div>
    );
};

export default TeacherPanel;