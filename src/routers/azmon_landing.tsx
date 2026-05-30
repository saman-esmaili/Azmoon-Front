import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";

// ─── Design Tokens — Warm Coral × Teal × Sunshine ────────────────────────────
const C = {
  // backgrounds
  bg:        "#FFFBF7",          // warm cream
  bgSection: "#FFF5EE",          // peach tint
  bgWhite:   "#FFFFFF",

  // primary — deep teal/peacock
  primary:   "#0D9488",
  primaryDk: "#0F766E",
  primaryLt: "#CCFBF1",

  // accent — vivid coral/orange-red
  accent:    "#F97316",
  accentDk:  "#EA6A0A",
  accentLt:  "#FFF0E4",

  // highlight — sunny yellow
  sun:       "#FCD34D",
  sunDk:     "#F59E0B",

  // supporting
  violet:    "#7C3AED",
  violetLt:  "#EDE9FE",
  rose:      "#F43F5E",
  roseLt:    "#FFE4E6",
  sky:       "#0EA5E9",
  skyLt:     "#E0F2FE",
  lime:      "#84CC16",
  limeLt:    "#F0FFF4",

  // text
  text:      "#1C1917",
  textSub:   "#57534E",
  textLight: "#A8A29E",

  // borders / shadows
  border:    "rgba(13,148,136,0.13)",
  shadow:    "rgba(13,148,136,0.14)",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface FadeInProps { children: ReactNode; delay?: number; className?: string; }
interface Feature    { icon: string; title: string; desc: string; color: string; bg: string; }
interface Step       { n: string; title: string; desc: string; icon: string; }
interface Plan       { name: string; name_en: string; price: number | null; color: string; btnBg: string; features: string[]; badge: string | null; highlight: boolean; }
interface Review     { name: string; role: string; stars: number; text: string; avatar: string; ac: string; }
interface FaqItem    { q: string; a: string; }
interface FooterCol  { title: string; items: string[]; }
interface StatItem   { val: string; label: string; color: string; }
interface DashStat   { label: string; val: string; color: string; icon: string; }
interface PBar       { name: string; pct: number; color: string; }

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useInView = (threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean>(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>{children}</div>
  );
};

// ─── Pill badge ───────────────────────────────────────────────────────────────
const Pill: React.FC<{ label: string; color: string; bg: string }> = ({ label, color, bg }) => (
  <div style={{ display: "inline-block", background: bg, border: `1.5px solid ${color}30`, borderRadius: 100, padding: "6px 20px", marginBottom: 18 }}>
    <span style={{ color, fontSize: 13, fontWeight: 700 }}>{label}</span>
  </div>
);

// ─── Nav ──────────────────────────────────────────────────────────────────────
const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links: string[] = ["ویژگی‌ها", "نحوه کار", "قیمت‌گذاری", "نظرات", "سوالات"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,251,247,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      boxShadow: scrolled ? `0 2px 20px ${C.shadow}` : "none",
      transition: "all 0.35s ease", padding: "0 40px", direction: "rtl",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, background: `linear-gradient(135deg,${C.primary},${C.sky})`, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${C.shadow}` }}>
            <span style={{ color: "#fff", fontSize: 21, fontWeight: 900 }}>آ</span>
          </div>
          <span style={{ color: C.text, fontSize: 21, fontWeight: 900, letterSpacing: "-0.5px" }}>آزمون‌گیر</span>
        </div>
        {/* Links */}
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {links.map((l) => (
            <a key={l} href="#" style={{ color: C.textSub, textDecoration: "none", fontSize: 15, fontWeight: 600, transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.primary)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textSub)}
            >{l}</a>
          ))}
        </div>
        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button style={{ background: "none", border: `1.5px solid ${C.border}`, color: C.primary, padding: "10px 22px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={(e) => { const b = e.target as HTMLButtonElement; b.style.borderColor = C.primary; b.style.background = C.primaryLt; }}
            onMouseLeave={(e) => { const b = e.target as HTMLButtonElement; b.style.borderColor = C.border; b.style.background = "none"; }}
          >ورود</button>
          <button style={{ background: `linear-gradient(135deg,${C.accent},${C.accentDk})`, border: "none", color: "#fff", padding: "10px 22px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 800, boxShadow: `0 4px 16px rgba(249,115,22,0.38)`, transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={(e) => { const b = e.target as HTMLButtonElement; b.style.transform = "translateY(-1px)"; b.style.boxShadow = "0 8px 26px rgba(249,115,22,0.52)"; }}
            onMouseLeave={(e) => { const b = e.target as HTMLButtonElement; b.style.transform = "translateY(0)"; b.style.boxShadow = "0 4px 16px rgba(249,115,22,0.38)"; }}
          >دموی رایگان ✦</button>
        </div>
      </div>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero: React.FC = () => {
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
    <section style={{
      minHeight: "100vh",
      background: `
        radial-gradient(ellipse 70% 55% at 70% -5%, ${C.primary}1A 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 0% 95%, ${C.accent}14 0%, transparent 50%),
        radial-gradient(ellipse 40% 30% at 100% 80%, ${C.violet}0F 0%, transparent 50%),
        ${C.bg}
      `,
      display: "flex", alignItems: "center", position: "relative", overflow: "hidden", direction: "rtl",
    }}>
      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.45 }}>
          <defs><pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.8" fill={C.primary} opacity="0.18" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        {/* Glowing orbs */}
        <div style={{ position:"absolute", top:80, right:-60, width:440, height:440, background:`radial-gradient(circle,${C.primary}18,transparent 70%)`, borderRadius:"50%", animation:"blobFloat 5s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:60, left:-80, width:360, height:360, background:`radial-gradient(circle,${C.accent}12,transparent 70%)`, borderRadius:"50%", animation:"blobFloat 7s ease-in-out infinite 1.5s" }} />
        <div style={{ position:"absolute", top:"45%", left:"38%", width:260, height:260, background:`radial-gradient(circle,${C.sun}10,transparent 70%)`, borderRadius:"50%", animation:"blobFloat 6s ease-in-out infinite 0.8s" }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "130px 40px 90px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%", position:"relative" }}>
        {/* Copy */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.primaryLt, border: `1.5px solid ${C.primary}28`, borderRadius: 100, padding: "7px 18px", marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, background: C.accent, borderRadius: "50%", animation: "ping 1.8s ease-in-out infinite" }} />
            <span style={{ color: C.primary, fontSize: 13, fontWeight: 700 }}>پلتفرم شماره یک آزمون آنلاین ایران</span>
          </div>

          <h1 style={{ color: C.text, fontSize: 54, fontWeight: 900, lineHeight: 1.2, marginBottom: 24, letterSpacing: "-1.5px" }}>
            سامانه هوشمند<br />
            <span style={{ background: `linear-gradient(110deg,${C.primary},${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>آزمون‌گیری آنلاین</span>
          </h1>

          <p style={{ color: C.textSub, fontSize: 18, lineHeight: 1.9, marginBottom: 40, maxWidth: 460 }}>
            برگزاری آزمون‌های تخصصی برای دانشگاه‌ها، مدارس و موسسات آموزشی با فناوری ضد تقلب و تحلیل پیشرفته
          </p>

          <div style={{ display: "flex", gap: 16, marginBottom: 56 }}>
            <button style={{ background: `linear-gradient(135deg,${C.primary},${C.primaryDk})`, border: "none", color: "#fff", padding: "16px 36px", borderRadius: 14, cursor: "pointer", fontSize: 16, fontWeight: 800, boxShadow: `0 8px 26px ${C.shadow}`, transition: "all 0.3s", fontFamily: "inherit" }}
              onMouseEnter={(e) => { const b = e.target as HTMLButtonElement; b.style.transform = "translateY(-2px)"; b.style.boxShadow = `0 14px 34px ${C.primary}40`; }}
              onMouseLeave={(e) => { const b = e.target as HTMLButtonElement; b.style.transform = "translateY(0)"; b.style.boxShadow = `0 8px 26px ${C.shadow}`; }}
            >🚀 شروع رایگان</button>
            <button style={{ background: C.bgWhite, border: `2px solid ${C.primary}28`, color: C.primary, padding: "16px 36px", borderRadius: 14, cursor: "pointer", fontSize: 16, fontWeight: 700, transition: "all 0.3s", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", fontFamily: "inherit" }}
              onMouseEnter={(e) => { const b = e.target as HTMLButtonElement; b.style.borderColor = C.primary; b.style.boxShadow = `0 6px 20px ${C.shadow}`; }}
              onMouseLeave={(e) => { const b = e.target as HTMLButtonElement; b.style.borderColor = `${C.primary}28`; b.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"; }}
            >▶ مشاهده دمو</button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 0 }}>
            {stats.map(({ val, label, color }, i) => (
              <div key={label} style={{ paddingLeft: i < stats.length-1 ? 32 : 0, marginLeft: i < stats.length-1 ? 32 : 0, borderLeft: i < stats.length-1 ? `1.5px solid ${C.border}` : "none" }}>
                <div style={{ color, fontSize: 30, fontWeight: 900, marginBottom: 4, lineHeight: 1 }}>{val}</div>
                <div style={{ color: C.textSub, fontSize: 13, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div style={{ position: "relative" }}>
          <div style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: 24, boxShadow: `0 28px 72px ${C.shadow}, 0 0 0 1px ${C.primary}06`, animation: "cardFloat 4s ease-in-out infinite" }}>
            {/* Browser bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20 }}>
              {["#FF5F57","#FEBC2E","#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              <div style={{ flex: 1, background: C.bg, borderRadius: 8, height: 26, marginRight: 10, display: "flex", alignItems: "center", padding: "0 12px" }}>
                <span style={{ color: C.textLight, fontSize: 12 }}>azmon.ir/dashboard</span>
              </div>
            </div>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {dashStats.map(({ label, val, color, icon }) => (
                <div key={label} style={{ background: `${color}0C`, borderRadius: 14, padding: "14px 12px", border: `1px solid ${color}1E` }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                  <div style={{ color, fontSize: 22, fontWeight: 900, marginBottom: 2 }}>{val}</div>
                  <div style={{ color: C.textLight, fontSize: 10 }}>{label}</div>
                </div>
              ))}
            </div>
            {/* Chart */}
            <div style={{ background: C.bg, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ color: C.textSub, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>نمودار عملکرد کلاس</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(to top,${C.primary},${C.sky})`, borderRadius: "4px 4px 0 0", opacity: 0.78 }} />
                ))}
              </div>
            </div>
            {/* Progress */}
            {pbars.map(({ name, pct, color }) => (
              <div key={name} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: C.textSub, fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                  <span>{name}</span><span>{pct}٪</span>
                </div>
                <div style={{ height: 7, background: `${color}18`, borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}CC)`, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
          {/* Badges */}
          <div style={{ position:"absolute", top:-18, left:-28, background:`linear-gradient(135deg,${C.primary},${C.primaryDk})`, borderRadius:14, padding:"10px 16px", boxShadow:`0 8px 22px ${C.shadow}`, animation:"cardFloat 4s ease-in-out infinite 1s" }}>
            <div style={{ color:"#fff", fontSize:13, fontWeight:800 }}>✅ آزمون تمام شد</div>
            <div style={{ color:"rgba(255,255,255,0.82)", fontSize:11 }}>نمره: ١٨.٥ از ٢٠</div>
          </div>
          <div style={{ position:"absolute", bottom:-14, right:-22, background:`linear-gradient(135deg,${C.accent},${C.accentDk})`, borderRadius:14, padding:"10px 16px", boxShadow:"0 8px 22px rgba(249,115,22,0.3)", animation:"cardFloat 3.5s ease-in-out infinite 0.5s" }}>
            <div style={{ color:"#fff", fontSize:13, fontWeight:800 }}>🔒 ضد تقلب فعال</div>
            <div style={{ color:"rgba(255,255,255,0.82)", fontSize:11 }}>تشخیص چهره: فعال</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Trust ────────────────────────────────────────────────────────────────────
const TrustSection: React.FC = () => {
  const orgs: string[] = ["دانشگاه تهران","دانشگاه شریف","دانشگاه امیرکبیر","دانشگاه علم و صنعت","دانشگاه اصفهان","دانشگاه شیراز"];
  return (
    <section style={{ background: C.bgWhite, padding:"52px 40px", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, direction:"rtl" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <p style={{ textAlign:"center", color:C.textLight, fontSize:12, fontWeight:700, marginBottom:26, letterSpacing:2, textTransform:"uppercase" }}>مورد اعتماد بیش از ۵۰۰ موسسه آموزشی در ایران</p>
        <div style={{ display:"flex", justifyContent:"center", gap:48, flexWrap:"wrap" }}>
          {orgs.map((o) => (
            <span key={o} style={{ color:C.textLight, fontSize:15, fontWeight:800, whiteSpace:"nowrap", transition:"color 0.2s", cursor:"default" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.primary)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.textLight)}
            >{o}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Features ─────────────────────────────────────────────────────────────────
const Features: React.FC = () => {
  const features: Feature[] = [
    { icon:"🧠", title:"بانک سوال هوشمند",   desc:"طبقه‌بندی سوالات بر اساس موضوع، سطح و نوع. پشتیبانی از تستی، تشریحی و صحیح/غلط.", color:C.primary, bg:C.primaryLt },
    { icon:"🛡️", title:"ضد تقلب پیشرفته",   desc:"تشخیص چهره، قفل مرورگر، ثبت رفتار کاربر و هشدار فوری به استاد.", color:C.rose, bg:C.roseLt },
    { icon:"⚡", title:"تصحیح خودکار",       desc:"نمره‌دهی فوری با هوش مصنوعی. گزارش آنی نتایج به دانشجو و استاد.", color:"#059669", bg:"#D1FAE5" },
    { icon:"📊", title:"داشبورد تحلیلی",     desc:"نمودارهای تعاملی، تحلیل آماری عمیق، مقایسه عملکرد و پیشرفت تحصیلی.", color:C.accent, bg:C.accentLt },
    { icon:"📱", title:"پشتیبانی موبایل",    desc:"تجربه کامل روی موبایل و تبلت. اپ اختصاصی اندروید و iOS.", color:C.violet, bg:C.violetLt },
    { icon:"📄", title:"گزارش‌دهی پیشرفته", desc:"صدور کارنامه اتوماتیک، خروجی Excel و PDF، ارسال نتایج به ایمیل.", color:C.sky, bg:C.skyLt },
    { icon:"🌐", title:"چند زبانه",          desc:"پشتیبانی کامل از فارسی، عربی و انگلیسی با RTL/LTR هوشمند.", color:"#DB2777", bg:"#FCE7F3" },
    { icon:"🔐", title:"امنیت داده",         desc:"رمزنگاری end-to-end، بکاپ خودکار ابری، انطباق با GDPR.", color:C.lime, bg:C.limeLt },
  ];
  return (
    <section style={{ background:C.bgSection, padding:"120px 40px", direction:"rtl" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <Pill label="ویژگی‌ها" color={C.primary} bg={C.primaryLt} />
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14, letterSpacing:"-0.5px" }}>همه چیز در یک پلتفرم</h2>
            <p style={{ color:C.textSub, fontSize:18, maxWidth:500, margin:"0 auto" }}>ابزارهای کامل برای برگزاری، مدیریت و تحلیل آزمون‌های آنلاین</p>
          </div>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i*0.07}>
              <div style={{ background:C.bgWhite, border:`1.5px solid ${C.border}`, borderRadius:20, padding:28, transition:"all 0.3s", cursor:"default", height:"100%" }}
                onMouseEnter={(e) => { const el=e.currentTarget; el.style.borderColor=`${f.color}50`; el.style.transform="translateY(-5px)"; el.style.boxShadow=`0 16px 40px ${f.color}1A`; }}
                onMouseLeave={(e) => { const el=e.currentTarget; el.style.borderColor=C.border; el.style.transform="translateY(0)"; el.style.boxShadow="none"; }}
              >
                <div style={{ width:52, height:52, background:f.bg, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:18 }}>{f.icon}</div>
                <h3 style={{ color:C.text, fontSize:16, fontWeight:800, marginBottom:10 }}>{f.title}</h3>
                <p style={{ color:C.textSub, fontSize:14, lineHeight:1.7 }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── How It Works ─────────────────────────────────────────────────────────────
const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    { n:"۰۱", title:"ثبت‌نام سازمان",   desc:"در ۵ دقیقه حساب سازمانی بسازید و تیم خود را اضافه کنید.",                 icon:"🏢" },
    { n:"۰۲", title:"ساخت بانک سوال",   desc:"سوالات را آپلود یا مستقیم وارد کنید. دسته‌بندی خودکار با هوش مصنوعی.",     icon:"📝" },
    { n:"۰۳", title:"طراحی آزمون",      desc:"زمان‌بندی، محدودیت‌ها و تنظیمات ضد تقلب را تعیین کنید.",                   icon:"⚙️" },
    { n:"۰۴", title:"دعوت دانشجویان",   desc:"لینک اشتراک‌گذاری یا import از Excel. ایمیل خودکار ارسال می‌شود.",          icon:"📨" },
    { n:"۰۵", title:"برگزاری آزمون",    desc:"مانیتورینگ زنده، هشدار تقلب، آمار لحظه‌ای.",                               icon:"🎯" },
    { n:"۰۶", title:"دریافت گزارش",     desc:"گزارش کامل با نمودار، کارنامه خودکار، صادرات داده.",                        icon:"📈" },
  ];
  return (
    <section style={{ background:C.bgWhite, padding:"120px 40px", direction:"rtl" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <Pill label="نحوه کار" color="#059669" bg="#D1FAE5" />
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14 }}>در ۶ گام شروع کنید</h2>
            <p style={{ color:C.textSub, fontSize:18 }}>از ثبت‌نام تا برگزاری اولین آزمون، کمتر از ۳۰ دقیقه</p>
          </div>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:28 }}>
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i*0.1}>
              <div style={{ position:"relative", background:C.bgSection, border:`1.5px solid ${C.border}`, borderRadius:20, padding:"28px 24px", overflow:"hidden", transition:"all 0.3s" }}
                onMouseEnter={(e) => { const el=e.currentTarget; el.style.borderColor=`${C.primary}35`; el.style.boxShadow=`0 12px 36px ${C.shadow}`; el.style.transform="translateY(-3px)"; }}
                onMouseLeave={(e) => { const el=e.currentTarget; el.style.borderColor=C.border; el.style.boxShadow="none"; el.style.transform="translateY(0)"; }}
              >
                <div style={{ position:"absolute", top:-6, right:8, color:`${C.primary}0E`, fontSize:80, fontWeight:900, lineHeight:1, fontFamily:"monospace", userSelect:"none" }}>{s.n}</div>
                <div style={{ position:"relative" }}>
                  <div style={{ fontSize:36, marginBottom:14 }}>{s.icon}</div>
                  <h3 style={{ color:C.text, fontSize:18, fontWeight:800, marginBottom:10 }}>{s.title}</h3>
                  <p style={{ color:C.textSub, fontSize:15, lineHeight:1.7 }}>{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Pricing ──────────────────────────────────────────────────────────────────
const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState<boolean>(false);
  const plans: Plan[] = [
    {
      name:"پایه", name_en:"Basic", price:annual?400:500, color:C.primary, btnBg:`linear-gradient(135deg,${C.primary},${C.primaryDk})`,
      features:["تا ۱۰۰ دانشجو","۱۰ آزمون در ماه","بانک سوال ۵۰۰ سوال","تصحیح خودکار","پشتیبانی ایمیل"],
      badge:null, highlight:false,
    },
    {
      name:"حرفه‌ای", name_en:"Pro", price:annual?1200:1500, color:C.bgWhite, btnBg:`linear-gradient(135deg,${C.bgWhite},#EEF)`,
      features:["تا ۵۰۰ دانشجو","آزمون نامحدود","بانک سوال نامحدود","ضد تقلب پیشرفته","API دسترسی","پشتیبانی ۲۴/۷","داشبورد تحلیلی"],
      badge:"محبوب‌ترین", highlight:true,
    },
    {
      name:"سازمانی", name_en:"Enterprise", price:null, color:C.accent, btnBg:`linear-gradient(135deg,${C.accent},${C.accentDk})`,
      features:["دانشجو نامحدود","سرور اختصاصی","قابلیت‌های سفارشی","مدیر حساب اختصاصی","SLA ۹۹.۹٪","آموزش تیم","یکپارچگی با سیستم موجود"],
      badge:null, highlight:false,
    },
  ];
  return (
    <section style={{ background:C.bgSection, padding:"120px 40px", direction:"rtl" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <Pill label="قیمت‌گذاری" color={C.accent} bg={C.accentLt} />
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14 }}>پلن مناسب خود را انتخاب کنید</h2>
            <p style={{ color:C.textSub, fontSize:18, marginBottom:32 }}>۱۴ روز رایگان، بدون نیاز به کارت اعتباری</p>
            <div style={{ display:"inline-flex", background:C.bgWhite, border:`1.5px solid ${C.border}`, borderRadius:14, padding:4, gap:4 }}>
              {["ماهانه","سالانه (۲۰٪ تخفیف)"].map((t, i) => (
                <button key={t} onClick={() => setAnnual(i===1)}
                  style={{ padding:"9px 22px", borderRadius:10, border:"none", cursor:"pointer", fontSize:14, fontWeight:700, background: annual===(i===1) ? `linear-gradient(135deg,${C.primary},${C.primaryDk})` : "transparent", color: annual===(i===1) ? "#fff" : C.textSub, transition:"all 0.25s", fontFamily:"inherit" }}
                >{t}</button>
              ))}
            </div>
          </div>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {plans.map((p, i) => (
            <FadeIn key={p.name} delay={i*0.1}>
              <div style={{ position:"relative", background: p.highlight ? `linear-gradient(145deg,${C.primary},${C.primaryDk})` : C.bgWhite, border: p.highlight ? "none" : `1.5px solid ${C.border}`, borderRadius:24, padding:36, height:"100%", boxShadow: p.highlight ? `0 24px 64px ${C.primary}30` : "none" }}>
                {p.badge && <div style={{ position:"absolute", top:-15, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.sun},${C.sunDk})`, color:C.text, fontSize:12, fontWeight:900, padding:"5px 18px", borderRadius:100, whiteSpace:"nowrap", boxShadow:"0 4px 12px rgba(252,211,77,0.5)" }}>{p.badge}</div>}
                <span style={{ color: p.highlight ? "rgba(255,255,255,0.7)" : C.primary, fontSize:13, fontWeight:700 }}>{p.name_en}</span>
                <h3 style={{ color: p.highlight ? "#fff" : C.text, fontSize:24, fontWeight:900, marginBottom:24, marginTop:6 }}>{p.name}</h3>
                {p.price !== null
                  ? <div style={{ marginBottom:32 }}><span style={{ color: p.highlight ? "#fff" : C.text, fontSize:44, fontWeight:900 }}>{p.price.toLocaleString()}</span><span style={{ color: p.highlight ? "rgba(255,255,255,0.65)" : C.textSub, fontSize:15 }}> هزار تومان/ماه</span></div>
                  : <div style={{ color:C.accent, fontSize:28, fontWeight:900, marginBottom:32 }}>تماس بگیرید</div>
                }
                <div style={{ marginBottom:32 }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <div style={{ width:20, height:20, background: p.highlight ? "rgba(255,255,255,0.2)" : C.primaryLt, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color: p.highlight ? "#fff" : C.primary, fontWeight:900 }}>✓</div>
                      <span style={{ color: p.highlight ? "rgba(255,255,255,0.85)" : C.textSub, fontSize:14 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width:"100%", padding:"14px 0", borderRadius:12, border:"none", background: p.highlight ? C.bgWhite : `linear-gradient(135deg,${C.primary},${C.primaryDk})`, color: p.highlight ? C.primary : "#fff", fontSize:15, fontWeight:800, cursor:"pointer", transition:"all 0.2s", boxShadow: p.highlight ? "none" : `0 6px 18px ${C.shadow}`, fontFamily:"inherit" }}
                  onMouseEnter={(e) => { const b=e.target as HTMLButtonElement; b.style.transform="translateY(-1px)"; b.style.opacity="0.92"; }}
                  onMouseLeave={(e) => { const b=e.target as HTMLButtonElement; b.style.transform="translateY(0)"; b.style.opacity="1"; }}
                >{p.price !== null ? "شروع کنید" : "با ما تماس بگیرید"}</button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
const Testimonials: React.FC = () => {
  const reviews: Review[] = [
    { name:"دکتر احمد رضایی",  role:"استاد دانشگاه تهران",     stars:5, text:"آزمون‌گیر کاملاً تجربه ما را در برگزاری آزمون‌های میان‌ترم و پایان‌ترم دگرگون کرد. سیستم ضد تقلب فوق‌العاده است.", avatar:"🎓", ac:C.primary },
    { name:"مریم حسینی",       role:"مدیر آموزشگاه زبان",      stars:5, text:"سادگی استفاده و قدرت تحلیل داده‌ها بی‌نظیر است. از روزی که شروع کردیم دیگر به هیچ ابزار دیگری نیاز نداشتیم.", avatar:"👩‍💼", ac:C.rose },
    { name:"محمد کریمی",       role:"رئیس اداره آموزش",        stars:5, text:"برای ارزیابی و استخدام کارکنان از این سامانه استفاده می‌کنیم. گزارش‌های آماری بسیار دقیق و مفید هستند.", avatar:"👨‍💼", ac:"#059669" },
    { name:"فاطمه موسوی",      role:"معلم دبیرستان",            stars:5, text:"دانش‌آموزانم عاشق آزمون‌های آنلاین شدند! رابط کاربری ساده و نتایج فوری باعث انگیزه بیشتر شده.", avatar:"👩‍🏫", ac:C.accent },
    { name:"علی اکبری",        role:"مسئول IT دانشگاه",         stars:5, text:"پیاده‌سازی ساده، API کامل و پشتیبانی فنی عالی. یکپارچگی با سیستم LMS موجود ما بدون مشکل انجام شد.", avatar:"👨‍💻", ac:C.violet },
    { name:"نرگس طاهری",       role:"استاد آموزشگاه کنکور",     stars:5, text:"بانک سوال هوشمند و امکان آزمون آزمایشی در همان شرایط کنکور، دقیقاً همان چیزی است که نیاز داشتیم.", avatar:"👩‍🎓", ac:C.sky },
  ];
  return (
    <section style={{ background:C.bgWhite, padding:"120px 40px", direction:"rtl" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:72 }}>
            <Pill label="نظرات مشتریان" color={C.violet} bg={C.violetLt} />
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14 }}>مشتریان ما چه می‌گویند</h2>
            <p style={{ color:C.textSub, fontSize:18 }}>بیش از ۵۰۰ موسسه آموزشی به ما اعتماد کرده‌اند</p>
          </div>
        </FadeIn>
        {/* grid with align-items:stretch so all cards same height */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, alignItems:"stretch" }}>
          {reviews.map((r, i) => (
            <FadeIn key={r.name} delay={i*0.08}>
              {/* wrapper fills full height */}
              <div style={{ height:"100%", display:"flex" }}>
                <div style={{ background:C.bgSection, border:`1.5px solid ${C.border}`, borderRadius:20, padding:28, transition:"all 0.3s", display:"flex", flexDirection:"column", width:"100%" }}
                  onMouseEnter={(e) => { const el=e.currentTarget; el.style.borderColor=`${r.ac}35`; el.style.background=C.bgWhite; el.style.boxShadow=`0 12px 40px ${r.ac}14`; el.style.transform="translateY(-4px)"; }}
                  onMouseLeave={(e) => { const el=e.currentTarget; el.style.borderColor=C.border; el.style.background=C.bgSection; el.style.boxShadow="none"; el.style.transform="translateY(0)"; }}
                >
                  {/* Stars */}
                  <div style={{ color:C.sunDk, fontSize:16, marginBottom:14, letterSpacing:3 }}>{"★".repeat(r.stars)}</div>
                  {/* Text grows to fill space */}
                  <p style={{ color:C.textSub, fontSize:15, lineHeight:1.85, marginBottom:20, flex:1 }}>"{r.text}"</p>
                  {/* Author pinned to bottom */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                    <div style={{ width:44, height:44, background:`${r.ac}14`, border:`2px solid ${r.ac}28`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{r.avatar}</div>
                    <div>
                      <div style={{ color:C.text, fontSize:14, fontWeight:800 }}>{r.name}</div>
                      <div style={{ color:C.textLight, fontSize:12, marginTop:2 }}>{r.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number|null>(null);
  const faqs: FaqItem[] = [
    { q:"آیا نسخه آزمایشی رایگان دارد؟",               a:"بله، ۱۴ روز کامل رایگان، بدون نیاز به کارت اعتباری. تمام ویژگی‌های پلن حرفه‌ای در اختیار شماست." },
    { q:"چگونه می‌توانم شروع کنم؟",                    a:"کافیست روی 'شروع رایگان' کلیک کنید، ایمیل و نام سازمان خود را وارد کنید و ظرف ۵ دقیقه آماده برگزاری اولین آزمون هستید." },
    { q:"آیا اطلاعات دانشجویان امن است؟",              a:"بله. تمام داده‌ها با رمزنگاری AES-256 ذخیره می‌شود. سرورها در داخل ایران قرار دارند و بکاپ روزانه انجام می‌شود." },
    { q:"پشتیبانی چگونه است؟",                         a:"پلن پایه: پشتیبانی ایمیل در ساعات اداری. پلن حرفه‌ای: پشتیبانی ۲۴/۷ تلفنی و چت. پلن سازمانی: مدیر حساب اختصاصی." },
    { q:"آیا آموزش داده می‌شود؟",                      a:"بله. ویدیوهای آموزشی کامل، مستندات دقیق و جلسه آموزش آنلاین رایگان برای تیم شما ارائه می‌دهیم." },
    { q:"آیا می‌توان با سیستم‌های موجود یکپارچه کرد؟", a:"بله. API کامل REST برای یکپارچگی با LMS، سیستم‌های دانشگاهی و ERP سازمان‌ها در دسترس است." },
  ];
  return (
    <section style={{ background:C.bgSection, padding:"120px 40px", direction:"rtl" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <FadeIn>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <h2 style={{ color:C.text, fontSize:42, fontWeight:900, marginBottom:14 }}>سوالات متداول</h2>
            <p style={{ color:C.textSub, fontSize:18 }}>پاسخ سوالات رایج</p>
          </div>
        </FadeIn>
        {faqs.map((f, i) => (
          <FadeIn key={f.q} delay={i*0.06}>
            <div style={{ background:C.bgWhite, border:`1.5px solid ${open===i ? C.primary+"45" : C.border}`, borderRadius:16, marginBottom:12, overflow:"hidden", transition:"all 0.2s", boxShadow: open===i ? `0 6px 20px ${C.shadow}` : "none" }}>
              <button onClick={() => setOpen(open===i ? null : i)}
                style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", background: open===i ? C.primaryLt : C.bgWhite, border:"none", cursor:"pointer", color:C.text, fontSize:16, fontWeight:700, textAlign:"right", gap:16, fontFamily:"inherit", direction:"rtl" }}
              >
                <span>{f.q}</span>
                <span style={{ color:C.primary, fontSize:24, transform: open===i ? "rotate(45deg)" : "rotate(0)", transition:"transform 0.3s", flexShrink:0, fontWeight:300, lineHeight:1 }}>+</span>
              </button>
              {open===i && <div style={{ padding:"4px 24px 22px", color:C.textSub, fontSize:15, lineHeight:1.9 }}>{f.a}</div>}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

// ─── CTA ──────────────────────────────────────────────────────────────────────
const CTA: React.FC = () => {
  const fields = [
    { p:"نام و نام خانوادگی" },
    { p:"آدرس ایمیل" },
    { p:"نام سازمان/دانشگاه", col:2 },
  ];
  return (
    <section style={{
      background:`linear-gradient(135deg,${C.primary} 0%,${C.primaryDk} 55%,#065F46 100%)`,
      padding:"120px 40px", direction:"rtl", position:"relative", overflow:"hidden"
    }}>
      {/* Decorations */}
      <div style={{ position:"absolute", top:-120, right:-120, width:460, height:460, background:"rgba(255,255,255,0.05)", borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-80, left:-60, width:340, height:340, background:"rgba(255,255,255,0.04)", borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"28%", left:"16%", width:240, height:240, background:`${C.sun}1E`, borderRadius:"50%", pointerEvents:"none", animation:"blobFloat 7s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"20%", right:"12%", width:160, height:160, background:`${C.accent}18`, borderRadius:"50%", pointerEvents:"none", animation:"blobFloat 5s ease-in-out infinite 2s" }} />

      <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <FadeIn>
          <div style={{ display:"inline-block", background:"rgba(255,255,255,0.14)", border:"1.5px solid rgba(255,255,255,0.22)", borderRadius:100, padding:"6px 20px", marginBottom:28 }}>
            <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>✨ همین امروز شروع کنید</span>
          </div>
          <h2 style={{ color:"#fff", fontSize:48, fontWeight:900, marginBottom:18, letterSpacing:"-1px", lineHeight:1.2 }}>
            برگزاری اولین آزمون<br />
            <span style={{ color:C.sun }}>کمتر از ۳۰ دقیقه</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.78)", fontSize:18, marginBottom:48 }}>۱۴ روز رایگان، بدون نیاز به کارت اعتباری، بدون تعهد</p>

          {/* Form */}
          <div style={{ background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:24, padding:"36px 40px", backdropFilter:"blur(20px)", marginBottom:28 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
              {fields.map((inp, i) => (
                <input key={i} placeholder={inp.p}
                  style={{ gridColumn: inp.col ? `span ${inp.col}` : "auto", background:"rgba(255,255,255,0.96)", border:"2px solid transparent", borderRadius:12, padding:"14px 18px", color:C.text, fontSize:15, outline:"none", fontFamily:"inherit", direction:"rtl", transition:"border-color 0.2s" } as CSSProperties}
                  onFocus={(e) => (e.target.style.borderColor = C.sun)}
                  onBlur={(e)  => (e.target.style.borderColor = "transparent")}
                />
              ))}
            </div>
            <button style={{ width:"100%", padding:"16px", background:`linear-gradient(135deg,${C.accent},${C.accentDk})`, border:"none", borderRadius:14, color:"#fff", fontSize:17, fontWeight:900, cursor:"pointer", transition:"all 0.3s", boxShadow:"0 8px 26px rgba(249,115,22,0.45)", fontFamily:"inherit" }}
              onMouseEnter={(e) => { const b=e.target as HTMLButtonElement; b.style.transform="translateY(-2px)"; b.style.boxShadow="0 14px 38px rgba(249,115,22,0.62)"; }}
              onMouseLeave={(e) => { const b=e.target as HTMLButtonElement; b.style.transform="translateY(0)"; b.style.boxShadow="0 8px 26px rgba(249,115,22,0.45)"; }}
            >🚀 دریافت دموی رایگان</button>
          </div>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>با ثبت‌نام، با شرایط استفاده و حریم خصوصی موافقت می‌کنید</p>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const cols: FooterCol[] = [
    { title:"آزمون‌گیر", items:["درباره ما","تیم ما","وبلاگ","اخبار","مشاغل"] },
    { title:"محصول",     items:["ویژگی‌ها","امنیت","API","مستندات","تغییرات"] },
    { title:"پشتیبانی", items:["مرکز راهنما","تماس با ما","وضعیت سیستم","گزارش باگ","جامعه کاربران"] },
  ];
  return (
    <footer style={{ background:C.text, padding:"80px 40px 40px", direction:"rtl" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:60, marginBottom:60 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:42, height:42, background:`linear-gradient(135deg,${C.primary},${C.sky})`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#fff", fontSize:21, fontWeight:900 }}>آ</span>
              </div>
              <span style={{ color:"#fff", fontSize:20, fontWeight:900 }}>آزمون‌گیر</span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.42)", fontSize:14, lineHeight:1.8, marginBottom:24, maxWidth:260 }}>سامانه هوشمند آزمون‌گیری آنلاین برای موسسات آموزشی ایران</p>
            <div style={{ display:"flex", gap:10 }}>
              {["📘","📸","🐦","💼"].map((icon, i) => (
                <div key={i} style={{ width:38, height:38, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16, transition:"all 0.2s" }}
                  onMouseEnter={(e) => { const el=e.currentTarget; el.style.background=`${C.primary}50`; el.style.borderColor=`${C.primary}70`; }}
                  onMouseLeave={(e) => { const el=e.currentTarget; el.style.background="rgba(255,255,255,0.07)"; el.style.borderColor="rgba(255,255,255,0.1)"; }}
                >{icon}</div>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 style={{ color:"#fff", fontSize:15, fontWeight:800, marginBottom:20 }}>{col.title}</h4>
              {col.items.map((item) => (
                <a key={item} href="#" style={{ display:"block", color:"rgba(255,255,255,0.42)", fontSize:14, textDecoration:"none", marginBottom:12, transition:"color 0.2s" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.sun)}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.42)")}
                >{item}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:32, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>© ۱۴۰۳ آزمون‌گیر. تمام حقوق محفوظ است.</span>
          <div style={{ display:"flex", gap:24 }}>
            {["حریم خصوصی","شرایط استفاده","کوکی‌ها"].map((t) => (
              <a key={t} href="#" style={{ color:"rgba(255,255,255,0.3)", fontSize:13, textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <div style={{ fontFamily:"'Segoe UI',Tahoma,sans-serif", minHeight:"100vh" }}>
    <style>{`
      @keyframes blobFloat { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-18px) scale(1.04);} }
      @keyframes cardFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
      @keyframes ping { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.4);} }
      * { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      ::placeholder { color:#A8A29E !important; }
    `}</style>
    <Nav />
    <Hero />
    <TrustSection />
    <Features />
    <HowItWorks />
    <Pricing />
    <Testimonials />
    <FAQ />
    <CTA />
    <Footer />
  </div>
);

export default App;
