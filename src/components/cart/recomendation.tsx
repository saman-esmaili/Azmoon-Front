import {Plan,ALL_PLANS,formatPrice} from "./types";
import '../../styles/cart.css';
export const RecommendedPlans: React.FC<{
  currentIds: string[];
  onAdd: (plan: Plan) => void;
}> = ({ currentIds, onAdd }) => {
  const available = ALL_PLANS.filter((p) => !currentIds.includes(p.id));
  if (available.length === 0) return null;

  return (
    <div className="recommended">
      <div className="recommended__title">پلن‌های دیگر را هم ببینید</div>
      <div className="recommended__grid">
        {available.map((p) => (
          <div key={p.id} className="recommended__card">
            <div className="recommended__card-icon">{p.icon}</div>
            <div className="recommended__card-name">پلن {p.name}</div>
            <div className="recommended__card-price" style={{ color: p.colorVar }}>
              {formatPrice(p.monthlyPrice)} هزار / ماه
            </div>
            <button
              className="recommended__card-btn"
              style={{ background: p.bgVar, color: p.colorVar }}
              onClick={() => onAdd(p)}
            >
              + افزودن به سبد
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
