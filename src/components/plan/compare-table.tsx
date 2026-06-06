import {PlanConfig, PLANS} from "./plans";
import '../../styles/plan_detail.css';
export const CompareTable: React.FC<{ plan: PlanConfig }> = ({ plan }) => (
  <div className="compare-table-wrap">
    <table className="compare-table" dir="rtl">
      <thead>
        <tr>
          <th><span className="compare-th-label">ویژگی</span></th>
          {PLANS.map((p) => (
            <th key={p.id}>
              <div className="compare-th-name" style={{ color: p.id === plan.id ? "var(--primary)" : "var(--text)" }}>{p.name}</div>
              <div className="compare-th-sub" style={{ color: `var(--${p.accentClass})` }}>{p.nameEn}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {plan.featureCats.map((cat, ci) => (
          <>
            <tr key={`cat-${ci}`} className="compare-cat-row">
              <td colSpan={4}><span className="compare-cat-label">{cat.category}</span></td>
            </tr>
            {cat.items.map((item, ii) => (
              <tr key={`row-${ci}-${ii}`} className="compare-feat-row">
                <td className="compare-feat-name">{item.label}</td>
                {PLANS.map((p) => {
                  const feat = p.featureCats[ci]?.items[ii];
                  return (
                    <td key={p.id} style={{ textAlign: "center" }}>
                      {!feat ? null : feat.included === true ? (
                        <span className="compare-check">✓</span>
                      ) : feat.included === false ? (
                        <span className="compare-dash">—</span>
                      ) : (
                        <span className="compare-partial" style={{ background: `var(--${p.accentClass}-lt, var(--primary-lt))`, color: `var(--${p.accentClass}, var(--primary))` }}>{feat.included}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  </div>
);
