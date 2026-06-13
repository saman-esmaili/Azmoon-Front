import {matchPath, Outlet, useLocation} from "react-router-dom";
import {Nav} from "./components/nav";
import {Footer} from "./components/Footer";

function Layout() {
  const location = useLocation();
  // const hideLayoutPages = ["/auth",'/admin','/teacher','/question-selector/*','/student'];
  const shouldHideLayout =
  matchPath("/question-selector/:examId", location.pathname) ||
  matchPath("/exam/grading/:examId", location.pathname) ||
  ["/auth", "/admin", "/teacher", "/student"].includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Nav />}
      <Outlet />
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default Layout;