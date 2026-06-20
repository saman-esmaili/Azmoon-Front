import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AzmoonPage from './routers/azmon_landing'
import AuthPage from "./routers/auth_page";
import Layout from './layout'
import AboutPage from "./routers/about_page";
import ContactPage from "./routers/contact_page";
import Cart from "./routers/cart";
import PlanDetailPage from "./routers/plan_detail";
import AdminPanel from "./routers/admin";
import './App.css'
import TeacherPanel from "./routers/teacher";
import QuestionSelector from "./components/teacher/question-selector";
import StudentPanel from "./routers/student";
import {ExamEnv} from "./components/student/azmoon-env";
import ExamGrading from "./components/teacher/exam-grading";
import NotFound from "./routers/not-found";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<AzmoonPage/>}/>
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/exam/grading/:examId" element={<ExamGrading/>}/>
                    <Route path="/exam/env/:exam_id" element={<ExamEnv/>}/>
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/plan" element={<PlanDetailPage/>}/>
                    <Route path="/admin" element={<AdminPanel/>}/>
                    <Route path="/teacher" element={<TeacherPanel/>}/>
                    <Route path="/question-selector/:examId" element={<QuestionSelector/>}/>
                    <Route path="/student" element={<StudentPanel/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;