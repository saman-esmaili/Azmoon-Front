import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import "../styles/azmon_landing.css";
import {CheckAuth, revoke} from '../check_auth'
import { HiOutlineShoppingCart } from "react-icons/hi";

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

        const handleLogout = async () => {
            await revoke();
            setLoggedIn(false);
        }

        useEffect(() => {
            const h = () => setScrolled(window.scrollY > 30);
            window.addEventListener("scroll", h);
            return () => window.removeEventListener("scroll", h);
        }, []);

        const links = [
            {label: "خانه", path: "/"},
            {label: "ویژگی‌ها", sectionId: "features"},
            {label: "نحوه‌کار", sectionId: "methods"},
            {label: "پلن‌ها", sectionId: "plan"},
            {label: "درباره", path: "/about"},
            {label: "تماس باما", path: "/contact"},
        ];

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


                        <button className="btn-demo" onClick={()=>{navigate('/cart')}}>
                            <ShoppingCartIcon size={24} />
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