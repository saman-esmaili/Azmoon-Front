import { useState, ReactNode } from "react";
import "../styles/student.css";
import {Exam, Section,EXAMS} from '../components/student/types';
import {Dashboard} from "../components/student/dashboard";
import {ExamsSection} from "../components/student/exam-section";
import {MessagesSection} from "../components/student/message";
import {ProfileSection} from "../components/student/profile";
import {NAV_ITEMS, TITLES} from "../components/student/sidebar";
import {ScoreModalComp} from "../components/student/azmoon-score";
import {ExamEnv} from "../components/student/azmoon-env";

const StudentPanel:React.FC=()=>{
  const [section,setSection]=useState<Section>("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const [activeExam,setActiveExam]=useState<Exam|null>(null);
  const [examAnswers,setExamAnswers]=useState<Record<string,string|number>>({});
  const [scoreModal,setScoreModal]=useState<Exam|null>(null);
  const [reviewModal,setReviewModal]=useState<Exam|null>(null);

  const handleStartExam=(e:Exam)=>{setActiveExam(e)};
  const handleExitExam=(answers:Record<string,string|number>)=>{
    setExamAnswers(answers);
    setActiveExam(null);
    setScoreModal(EXAMS.find(e=>e.id===activeExam?.id)!);
  };

  const renderContent=():ReactNode=>{
    if(section==="dashboard")return<Dashboard/>;
    if(section==="exams")    return<ExamsSection onStartExam={handleStartExam}/>;
    if(section==="messages") return<MessagesSection/>;
    if(section==="profile")  return<ProfileSection/>;
    return null;
  };

  if(activeExam){
    return<ExamEnv exam={activeExam} onExit={handleExitExam}/>;
  }

  return(
    <div className="std-shell" dir="rtl">
      {/* Sidebar */}
      <aside className={`std-sidebar ${collapsed?"std-sidebar--col":""}`}>
        <div className="std-sidebar__brand">
          <div className="std-sidebar__brand-icon">آ</div>
          {!collapsed&&<>
            <span className="std-sidebar__brand-name">آزمون‌گیر</span>
            <span className="std-sidebar__brand-badge">دانش‌آموز</span>
          </>}
        </div>

        <nav className="std-sidebar__nav">
          {!collapsed&&<div className="std-sidebar__label">منو اصلی</div>}
          {NAV_ITEMS.map(([id,lbl,icon,badge])=>(
            <button key={id}
              className={`std-nav-item ${section===id?"std-nav-item--active":""}`}
              onClick={()=>setSection(id)}
            >
              <div className="std-nav-item__icon">{icon}</div>
              {!collapsed&&<span className="std-nav-item__label">{lbl}</span>}
              {!collapsed&&badge&&<span className="std-nav-item__badge">{badge}</span>}
            </button>
          ))}
        </nav>

        <div className="std-sidebar__footer">
          <div className="std-sidebar__user">
            <div className="std-sidebar__user-avatar">🎓</div>
            {!collapsed&&<div>
              <div className="std-sidebar__user-name">علی محمدی</div>
              <div className="std-sidebar__user-role">دانش‌آموز دهم</div>
            </div>}
          </div>
          <button className="std-sidebar__toggle" onClick={()=>setCollapsed(p=>!p)}>
            {collapsed?"←":"→"}
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <header className={`std-topbar ${collapsed?"std-topbar--col":""}`}>
        <div className="std-topbar__left">
          <span className="std-topbar__title">{TITLES[section]}</span>
          <div className="std-topbar__bread">
            <a href="/">سایت</a><span>›</span>
            <span>پنل دانش‌آموز</span><span>›</span>
            <span>{TITLES[section]}</span>
          </div>
        </div>
        <div className="std-topbar__right">
          <button className="std-icon-btn" onClick={()=>setSection("messages")}>
            ✉️<span className="std-icon-btn__dot"/>
          </button>
          <button className="std-icon-btn" onClick={()=>setSection("profile")}>👤</button>
        </div>
      </header>

      {/* Content */}
      <main className={`std-content ${collapsed?"std-content--col":""}`} key={section}>
        {renderContent()}
      </main>

      {/* Post-exam score modal */}
      {scoreModal&&<ScoreModalComp exam={scoreModal} answers={examAnswers} onClose={()=>setScoreModal(null)}/>}
    </div>
  );
};

export default StudentPanel;
