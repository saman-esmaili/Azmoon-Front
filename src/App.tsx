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

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<AzmoonPage/>}/>
                    {/*<Route path="/auth/:Admin" element={<AuthPage/>}/>*/}
                    {/*<Route path="/auth/:classUrl" element={<AuthPage/>}/>*/}
                    <Route path="/auth" element={<AuthPage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/plan" element={<PlanDetailPage/>}/>
                    <Route path="/admin" element={<AdminPanel/>}/>
                    <Route path="/teacher" element={<TeacherPanel/>}/>
                    <Route path="/question-selector/:examId" element={<QuestionSelector/>}/>
                    <Route path="/student" element={<StudentPanel/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;