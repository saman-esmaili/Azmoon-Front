import "./../styles/auth_page.css";
import {PanelLeft,PanelRight} from "../components/auth/panels";
// ─── Page ─────────────────────────────────────────────────────────────────────
const AuthPage: React.FC = () => (
  <div className="auth-page">
    <PanelLeft />
    <PanelRight />
  </div>
);

export default AuthPage;
