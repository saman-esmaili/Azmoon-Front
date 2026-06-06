import {C} from "../../styles/theme";
import {ContactMethod} from '../contact/types';
import '../../styles/contact_page.css';
export const ContactCard: React.FC<ContactMethod> = ({ icon, label, value, sub, color, bg }) => (
  <div
    className="contact-card"
    style={{ borderColor: C.border }}
    onMouseEnter={(e) => {
      const el = e.currentTarget;
      el.style.borderColor = `${color}45`;
      el.style.boxShadow = `0 16px 40px ${color}14`;
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget;
      el.style.borderColor = C.border;
      el.style.boxShadow = "none";
    }}
  >
    <div className="contact-card-icon" style={{ background: bg }}>{icon}</div>
    <div className="contact-card-label" style={{ color: C.textLight }}>{label}</div>
    <div className="contact-card-value" style={{ color: C.text }}>{value}</div>
    <div className="contact-card-sub" style={{ color: C.textSub }}>{sub}</div>
  </div>
);
