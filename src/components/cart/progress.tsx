import {STEPS} from "./types";
import '../../styles/cart.css';
export const ProgressSteps: React.FC<{ current: number }> = ({ current }) => (
  <div className="cart-steps">
    {STEPS.map((label, i) => {
      const done   = i < current;
      const active = i === current;
      return (
        <div key={label} className="cart-step">
          <div className={`cart-step__bubble ${done ? "cart-step__bubble--done" : active ? "cart-step__bubble--active" : "cart-step__bubble--pending"}`}>
            {done ? "✓" : i + 1}
          </div>
          <span className={`cart-step__label ${active || done ? "cart-step__label--active" : "cart-step__label--pending"}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`cart-step__line ${done ? "cart-step__line--done" : "cart-step__line--pending"}`} />
          )}
        </div>
      );
    })}
  </div>
);