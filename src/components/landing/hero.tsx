import {C} from "../../styles/theme";
import {useState, useEffect} from "react";
import {StatItem,PBar,DashStat} from './../landing/details_component'
import '../../styles/azmon_landing.css'
export const Hero: React.FC = () => {
  const [count1, setCount1] = useState<number>(0);
  const [count2, setCount2] = useState<number>(0);
  const [count3, setCount3] = useState<number>(0);
  useEffect(() => {
    const animate = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, dur: number) => {
      let start: number | null = null;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        setter(Math.floor(p * target));
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 700);
    };
    animate(setCount1, 500, 2000);
    animate(setCount2, 1_000_000, 2500);
    animate(setCount3, 999, 2000);
  }, []);

  const stats: StatItem[] = [
    { val: `+${count1}`, label: "موسسه آموزشی", color: C.primary },
    { val: `+${count2.toLocaleString("fa-IR")}`, label: "آزمون برگزار شده", color: C.accent },
    { val: `٪${(count3 / 10).toFixed(1)}`, label: "آپتایم", color: C.violet },
  ];
  const dashStats: DashStat[] = [
    { label: "دانشجوی آنلاین", val: "٢٤٧", color: C.primary, icon: "👥" },
    { label: "در حال آزمون",   val: "١٨٩", color: C.accent,  icon: "✍️" },
    { label: "تمام شده",       val: "٥٨",  color: C.violet,  icon: "✅" },
  ];
  const bars: number[] = [65, 80, 45, 90, 70, 85, 60, 95, 75, 88];
  const pbars: PBar[] = [
    { name: "ریاضی ۳", pct: 87, color: C.primary },
    { name: "فیزیک",   pct: 72, color: C.accent },
  ];

  return (
    <section className='hero'>
      {/* Dot grid */}
      <div className='hero-bg'>
        <svg className='hero-dots-svg'>
          <defs><pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.8" fill={C.primary} opacity="0.18" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        {/* Glowing orbs */}
        <div className='hero-orb-1' />
        <div className='hero-orb-2' />
        <div className='hero-orb-3' />
      </div>

      <div className='hero-inner'>
        {/* Copy */}
        <div>
          <div className='hero-badge'>
            <div className='hero-badge-dot' />
            <span className='hero-badge-text'>پلتفرم شماره یک آزمون آنلاین ایران</span>
          </div>

          <h1 style={{ color: C.text, fontSize: 54, fontWeight: 900, lineHeight: 1.2, marginBottom: 24, letterSpacing: "-1.5px" }}>
            سامانه هوشمند<br />
            <span className='hero-h1-gradient'>آزمون‌گیری آنلاین</span>
          </h1>

          <p style={{ color: C.textSub, fontSize: 18, lineHeight: 1.9, marginBottom: 40, maxWidth: 460 }}>
            برگزاری آزمون‌های تخصصی برای دانشگاه‌ها، مدارس و موسسات آموزشی با فناوری ضد تقلب و تحلیل پیشرفته
          </p>

          <div className='hero-buttons'>
            <button className='btn-primary'>🚀 شروع رایگان</button>
            <button className='btn-secondary'>▶ مشاهده دمو</button>
          </div>

          {/* Stats */}
          <div className='hero-stats'>
            {stats.map(({ val, label, color }, i) => (
              <div key={label} style={{ paddingLeft: i < stats.length-1 ? 32 : 0, marginLeft: i < stats.length-1 ? 32 : 0, borderLeft: i < stats.length-1 ? `1.5px solid ${C.border}` : "none" }}>
                <div style={{ color, fontSize: 30, fontWeight: 900, marginBottom: 4, lineHeight: 1 }}>{val}</div>
                <div style={{ color: C.textSub, fontSize: 13, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className='dashboard-wrap'>
          <div className='dashboard-card'>
            {/* Browser bar */}
            <div className='browser-bar'>
              {["#FF5F57","#FEBC2E","#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              <div className='browser-url'>
                <span style={{ color: C.textLight, fontSize: 12 }}>azmon.ir/dashboard</span>
              </div>
            </div>
            {/* Stat cards */}
            <div className='stat-cards-grid'>
              {dashStats.map(({ label, val, color, icon }) => (
                <div key={label} style={{ background: `${color}0C`, borderRadius: 14, padding: "14px 12px", border: `1px solid ${color}1E` }}>
                  <div className='stat-card-icon'>{icon}</div>
                  <div className='stat-card-val'>{val}</div>
                  <div className='stat-card-label'>{label}</div>
                </div>
              ))}
            </div>
            {/* Chart */}
            <div className='chart-wrap'>
              <div className='chart-title'>نمودار عملکرد کلاس</div>
              <div className='chart-bars'>
                {bars.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(to top,${C.primary},${C.sky})`, borderRadius: "4px 4px 0 0", opacity: 0.78 }} />
                ))}
              </div>
            </div>
            {/* Progress */}
            {pbars.map(({ name, pct, color }) => (
              <div key={name} className='pbar-wrap'>
                <div className='pbar-header'>
                  <span>{name}</span><span>{pct}٪</span>
                </div>
                <div style={{ height: 7, background: `${color}18`, borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}CC)`, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
          {/* Badges */}
          <div className='dashboard-badge-1'>
            <div style={{ color:"#fff", fontSize:13, fontWeight:800 }}>✅ آزمون تمام شد</div>
            <div style={{ color:"rgba(255,255,255,0.82)", fontSize:11 }}>نمره: ١٨.٥ از ٢٠</div>
          </div>
          <div className='dashboard-badge-2'>
            <div className='badge-title'>🔒 ضد تقلب فعال</div>
            <div className='badge-sub'>تشخیص چهره: فعال</div>
          </div>
        </div>
      </div>
    </section>
  );
};
