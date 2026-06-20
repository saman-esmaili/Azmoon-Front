import {useState, ReactNode, useEffect} from "react";
import "../styles/student.css";
import {Exam, Section, EXAMS} from '../components/student/types';
import {Dashboard} from "../components/student/dashboard";
import {ExamsSection} from "../components/student/exam-section";
import {MessagesSection} from "../components/student/message";
import {ProfileSection} from "../components/student/profile";
import {NAV_ITEMS, TITLES} from "../components/student/sidebar";
import {ScoreModalComp} from "../components/student/azmoon-score";
import {ExamEnv} from "../components/student/azmoon-env";
import {useNavigate} from "react-router-dom";
import Axios from "axios";
import {LogOut} from "lucide-react";
import {revoke} from "../check_auth";
import JoinClass from "../components/student/join-class";

const StudentPanel: React.FC = () => {
    const [section, setSection] = useState<Section>("dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [activeExam, setActiveExam] = useState<Exam | null>(null);
    const [examAnswers, setExamAnswers] = useState<Record<string, string | number>>({});
    const [scoreModal, setScoreModal] = useState<Exam | null>(null);
    const [reviewModal, setReviewModal] = useState<Exam | null>(null);
    const [active, setActive] = useState<Section>("dashboard");
    const [isTeacher, setIsTeacher] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    useEffect(() => {
        setMobileOpen(false);
    }, [active]);
    const navigate = useNavigate()
    const get_types = () => {
        Axios.get('http://localhost:8000/types', {withCredentials: true})
            .then((res) => {
                setIsTeacher(res.data.teacher)
            })
    }
    useEffect(() => {
        get_types()
    }, []);
    const teacher_panel = () => {
        navigate('/teacher')
    }
    const handleLogout = async () => {
        await revoke();
        navigate('/');
    }
    const handleStartExam = (e: Exam) => {
        setActiveExam(e)
    };
    const handleExitExam = (answers: Record<string, string | number>) => {
        setExamAnswers(answers);
        setActiveExam(null);
        setScoreModal(EXAMS.find(e => e.id === activeExam?.id)!);
    };

    const renderContent = (): ReactNode => {
        if (section === "dashboard") return <Dashboard/>;
        if (section === "exams") return <ExamsSection/>;
        if (section === "join_class") return <JoinClass/>;
        if (section === "messages") return <MessagesSection/>;
        if (section === "profile") return <ProfileSection/>;
        return null;
    };

    // if(activeExam){
    //   return<ExamEnv exam={activeExam} onExit={handleExitExam}/>;
    // }

    return (
        <div className="std-shell" dir="rtl">
            {/* Sidebar */}
            {mobileOpen && (
                <div
                    className="tch-sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}a
            <aside
                className={`tch-sidebar 
        ${collapsed ? "tch-sidebar--collapsed" : ""} 
        ${mobileOpen ? "tch-sidebar--open" : ""}`}
            >
                <div className="std-sidebar__brand">
                    <div className="std-sidebar__brand-icon">آ</div>
                    {!collapsed && <>
                        <span className="std-sidebar__brand-name">آزمون‌گیر</span>
                        <span className="std-sidebar__brand-badge">دانش‌آموز</span>
                    </>}
                </div>

                <nav className="std-sidebar__nav">
                    {!collapsed && <div className="std-sidebar__label">منو اصلی</div>}
                    {NAV_ITEMS.map(([id, lbl, icon, badge]) => (
                        <button key={id}
                                className={`std-nav-item ${section === id ? "std-nav-item--active" : ""}`}
                                onClick={() => setSection(id)}
                        >
                            <div className="std-nav-item__icon">{icon}</div>
                            {!collapsed && <span className="std-nav-item__label">{lbl}</span>}
                            {!collapsed && badge && <span className="std-nav-item__badge">{badge}</span>}
                        </button>
                    ))}
                </nav>

                <div className="tch-sidebar__footer">
                    <div className="tch-sidebar__user">
                        <button className="tch-sidebar__btn">
                            پنل دانش‌آموز
                        </button>

                        {isTeacher && (
                            <button className="tch-sidebar__btn" onClick={() => {
                                teacher_panel()
                            }}>
                                پنل استاد
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

            {/* Topbar */}
            <header
                className={`tch-topbar ${collapsed ? "tch-topbar--collapsed" : ""}`}
            >
                <div className="tch-topbar__left">
                    <button
                        className="tch-hamburger"
                        onClick={() => setMobileOpen(true)}
                    >
                        ☰
                    </button>
                    <span className="std-topbar__title">{TITLES[section]}</span>
                    <div className="std-topbar__bread">
                        <a href="/">سایت</a><span>›</span>
                        <span>پنل دانش‌آموز</span><span>›</span>
                        <span>{TITLES[section]}</span>
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

            {/* Content */}
            <main
                className={`tch-content ${collapsed ? "tch-content--collapsed" : ""}`}
                key={active}
            >
                {renderContent()}
            </main>

            {/* Post-exam score modal */}
            {/*{scoreModal&&<ScoreModalComp exam={scoreModal} answers={examAnswers} onClose={()=>setScoreModal(null)}/>}*/}
        </div>
    );
};

export default StudentPanel;
