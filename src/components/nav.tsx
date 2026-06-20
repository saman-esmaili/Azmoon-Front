import {useEffect, useMemo, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import "../styles/azmon_landing.css";
import {CheckAuth, revoke} from '../check_auth'
import {HiOutlineShoppingCart} from "react-icons/hi";
import Axios from "axios";

export const Nav: React.FC = () => {
        const [scrolled, setScrolled] = useState(false);
        const [mobileOpen, setMobileOpen] = useState(false);
        const [loggedIn, setLoggedIn] = useState(false);
        const navigate = useNavigate();
        const ShoppingCartIcon = HiOutlineShoppingCart as React.FC<{ size?: number; className?: string }>;

        const handleAuthCheck = async () => {
            const result = await CheckAuth();
            setLoggedIn(!!result)
        };

        useEffect(() => {
            handleAuthCheck()
        }, [])
        const [student, setStudent] = useState();
        const [teacher, setTeacher] = useState();
        const get_types = () => {
            Axios.get('http://localhost:8000/types', {withCredentials: true})
                .then((res) => {
                    setStudent(res.data.student);
                    setTeacher(res.data.Teacher);
                })
        }
        useEffect(() => {
            get_types()
        }, []);

        const handleLogout = async () => {
            await revoke();
            setLoggedIn(false);
        }

        useEffect(() => {
            const h = () => setScrolled(window.scrollY > 30);
            window.addEventListener("scroll", h);
            return () => window.removeEventListener("scroll", h);
        }, []);

        const baseLinks = [
            {label: "خانه", path: "/"},
            {label: "ویژگی‌ها", sectionId: "features"},
            {label: "نحوه‌کار", sectionId: "methods"},
            {label: "پلن‌ها", sectionId: "plan"},
            {label: "درباره", path: "/about"},
            {label: "تماس باما", path: "/contact"},

        ];
        const links = useMemo(() => {
            const extra = [];

            if (teacher) extra.push({label: "پنل", path: "/teacher"});
            else if (student) extra.push({label: "پنل", path: "/student"});

            return [ ...extra, ...baseLinks];
        }, [teacher, student]);

        const location = useLocation();


        const handleSectionClick = (id: string) => {
            setMobileOpen(false);
            if (location.pathname !== "/") {
                navigate("/", {state: {scrollTo: id}});
            } else {
                document.getElementById(id)?.scrollIntoView({behavior: "smooth"});
            }
        };

        return (
            <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
                <div className="nav-inner">

                    {/* Logo */}
                    <div className="nav-logo">
                        <div className="nav-logo-icon">
                            <span>آ</span>
                        </div>
                        <span className="nav-logo-name">آزمون‌گیر</span>
                    </div>

                    {/* Links */}
                    <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
                        {links.map((l) =>
                                l.sectionId ? (
                                    <span
                                        key={l.sectionId}
                                        className="nav-link"
                                        onClick={() => handleSectionClick(l.sectionId!)}
                                    >
                {l.label}
              </span>
                                ) : (
                                    <Link
                                        key={l.path!}
                                        to={l.path!}
                                        className="nav-link"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {l.label}
                                    </Link>
                                )
                        )}
                        {mobileOpen && (
                            <div className="mobile-menu">
                                <button className='btn-login-mob' onClick={() => navigate('/cart')}>
                                    <ShoppingCartIcon size={24}/>
                                </button>
                                {loggedIn ? (
                                    <button onClick={handleLogout} className='btn-login-mob'>خروج</button>
                                ) : (
                                    <Link to="/auth">ورود</Link>
                                )}

                            </div>
                        )}
                    </div>

                    {/* Actions */}

                    <div className="nav-actions">
                        {!loggedIn ? (
                            <Link to="/auth">
                                <button className="btn-login">ورود</button>
                            </Link>
                        ) : (
                            <button onClick={handleLogout} className="btn-login">خروج</button>
                        )
                        }


                        <button className="btn-demo" onClick={() => {
                            navigate('/cart')
                        }}>
                            <ShoppingCartIcon size={24}/>
                        </button>


                        <button
                            className="nav-toggle"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            ☰
                        </button>
                    </div>

                </div>
            </nav>
        )
            ;
    }
;