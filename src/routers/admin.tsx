import { useState, ReactNode } from "react";
import "./admin.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "users" | "payments" | "questions" | "messages";
type Folder  = "inbox" | "sent" | "drafts" | "trash";
type Billing = "monthly" | "annual";

interface User {
  id: string; name: string; email: string; phone: string;
  plan: string; planColor: string; planBg: string;
  status: "active" | "inactive" | "pending";
  joinDate: string; lastLogin: string; exams: number; avatar: string; avatarBg: string;
}

interface Payment {
  id: string; userId: string; userName: string; plan: string;
  amount: number; billing: Billing;
  status: "paid" | "failed" | "refunded" | "pending";
  date: string; method: string;
}

interface Question {
  id: string; text: string; type: "multiple" | "truefalse" | "short";
  options: string[]; correct: number; category: string; difficulty: "easy" | "medium" | "hard";
  createdBy: string; usedIn: number;
}

interface Mail {
  id: string; from: string; fromEmail: string; to: string;
  subject: string; preview: string; body: string;
  date: string; unread: boolean; folder: Folder;
  attachments?: { name: string; size: string }[];
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const USERS: User[] = [
  { id:"u1", name:"دکتر احمد رضایی",  email:"ahmad@uni.ac.ir",    phone:"0912-111-2233", plan:"حرفه‌ای", planColor:"var(--primary)", planBg:"var(--primary-lt)", status:"active",   joinDate:"۱۴۰۲/۰۸/۱۵", lastLogin:"۱۴۰۳/۰۴/۰۱", exams:47, avatar:"ا", avatarBg:"linear-gradient(135deg,#0D9488,#0EA5E9)" },
  { id:"u2", name:"مریم حسینی",        email:"maryam@zaban.ir",    phone:"0935-222-3344", plan:"پایه",    planColor:"var(--sky)",    planBg:"var(--sky-lt)",     status:"active",   joinDate:"۱۴۰۲/۱۰/۰۳", lastLogin:"۱۴۰۳/۰۳/۲۸", exams:12, avatar:"م", avatarBg:"linear-gradient(135deg,#0EA5E9,#7C3AED)" },
  { id:"u3", name:"محمد کریمی",        email:"m.karimi@gov.ir",    phone:"0911-333-4455", plan:"سازمانی", planColor:"var(--violet)", planBg:"var(--violet-lt)",  status:"active",   joinDate:"۱۴۰۱/۰۵/۲۰", lastLogin:"۱۴۰۳/۰۴/۰۲", exams:203, avatar:"ک", avatarBg:"linear-gradient(135deg,#7C3AED,#F97316)" },
  { id:"u4", name:"فاطمه موسوی",       email:"f.mousavi@sch.ir",   phone:"0916-444-5566", plan:"پایه",    planColor:"var(--sky)",    planBg:"var(--sky-lt)",     status:"pending",  joinDate:"۱۴۰۳/۰۳/۱۰", lastLogin:"۱۴۰۳/۰۳/۱۰", exams:0,   avatar:"ف", avatarBg:"linear-gradient(135deg,#F43F5E,#F97316)" },
  { id:"u5", name:"علی اکبری",         email:"ali@tech.co",        phone:"0901-555-6677", plan:"حرفه‌ای", planColor:"var(--primary)", planBg:"var(--primary-lt)", status:"inactive", joinDate:"۱۴۰۲/۰۱/۱۱", lastLogin:"۱۴۰۲/۱۲/۰۵", exams:31, avatar:"ع", avatarBg:"linear-gradient(135deg,#059669,#0D9488)" },
  { id:"u6", name:"نرگس طاهری",        email:"narges@konkor.ir",   phone:"0919-666-7788", plan:"حرفه‌ای", planColor:"var(--primary)", planBg:"var(--primary-lt)", status:"active",   joinDate:"۱۴۰۲/۰۶/۰۷", lastLogin:"۱۴۰۳/۰۴/۰۱", exams:89, avatar:"ن", avatarBg:"linear-gradient(135deg,#F97316,#FCD34D)" },
];

const PAYMENTS: Payment[] = [
  { id:"p1", userId:"u1", userName:"دکتر احمد رضایی",  plan:"حرفه‌ای", amount:1200, billing:"annual",  status:"paid",     date:"۱۴۰۳/۰۱/۰۱", method:"ملی" },
  { id:"p2", userId:"u2", userName:"مریم حسینی",        plan:"پایه",    amount:500,  billing:"monthly", status:"paid",     date:"۱۴۰۳/۰۳/۰۵", method:"پارسیان" },
  { id:"p3", userId:"u3", userName:"محمد کریمی",        plan:"سازمانی", amount:4500, billing:"monthly", status:"paid",     date:"۱۴۰۳/۰۴/۰۱", method:"ملت" },
  { id:"p4", userId:"u4", userName:"فاطمه موسوی",       plan:"پایه",    amount:500,  billing:"monthly", status:"pending",  date:"۱۴۰۳/۰۳/۱۰", method:"شتاب" },
  { id:"p5", userId:"u5", userName:"علی اکبری",         plan:"حرفه‌ای", amount:1500, billing:"monthly", status:"refunded", date:"۱۴۰۲/۱۲/۰۱", method:"سامان" },
  { id:"p6", userId:"u6", userName:"نرگس طاهری",        plan:"حرفه‌ای", amount:1200, billing:"annual",  status:"paid",     date:"۱۴۰۳/۰۲/۱۵", method:"ملی" },
  { id:"p7", userId:"u1", userName:"دکتر احمد رضایی",  plan:"حرفه‌ای", amount:1200, billing:"annual",  status:"failed",   date:"۱۴۰۲/۱۲/۲۸", method:"ملت" },
];

const QUESTIONS: Question[] = [
  { id:"q1", text:"کدام گزینه درباره اینترنت اشیاء (IoT) صحیح است؟", type:"multiple", options:["اتصال دستگاه‌های فیزیکی به اینترنت","فقط مربوط به گوشی‌های هوشمند","نیاز به اتصال فیزیکی دارد","هیچکدام"], correct:0, category:"فناوری", difficulty:"medium", createdBy:"دکتر رضایی", usedIn:8 },
  { id:"q2", text:"بزرگ‌ترین قاره جهان از نظر مساحت کدام است؟", type:"multiple", options:["آفریقا","آمریکا","آسیا","اروپا"], correct:2, category:"جغرافیا", difficulty:"easy", createdBy:"خانم حسینی", usedIn:14 },
  { id:"q3", text:"آیا آب در دمای صفر درجه سانتی‌گراد یخ می‌زند؟", type:"truefalse", options:["درست","نادرست"], correct:0, category:"علوم", difficulty:"easy", createdBy:"آقای کریمی", usedIn:23 },
  { id:"q4", text:"مفهوم «دموکراسی مستقیم» به چه معناست؟", type:"multiple", options:["انتخاب نمایندگان","مشارکت مستقیم مردم","حکومت نخبگان","انتخابات غیرمستقیم"], correct:1, category:"علوم سیاسی", difficulty:"hard", createdBy:"دکتر رضایی", usedIn:5 },
  { id:"q5", text:"مقدار پی (π) تا دو رقم اعشار چقدر است؟", type:"short", options:[], correct:-1, category:"ریاضی", difficulty:"easy", createdBy:"خانم طاهری", usedIn:31 },
];

const MAILS: Mail[] = [
  { id:"m1", from:"دکتر احمد رضایی", fromEmail:"ahmad@uni.ac.ir", to:"support@azmon.ir", subject:"مشکل در ورود به پنل", preview:"سلام، از دیروز نمی‌توانم وارد پنل مدیریتی شوم...", body:"سلام،\n\nاز دیروز نمی‌توانم وارد پنل مدیریتی شوم. رمز عبور را فراموش نکرده‌ام ولی خطای ۴۰۳ می‌دهد. لطفاً بررسی کنید.\n\nممنون،\nدکتر رضایی", date:"۱۴۰۳/۰۴/۰۲ ۱۰:۳۲", unread:true, folder:"inbox" },
  { id:"m2", from:"مریم حسینی", fromEmail:"maryam@zaban.ir", to:"support@azmon.ir", subject:"درخواست ارتقاء پلن", preview:"می‌خواهم از پلن پایه به حرفه‌ای ارتقا دهم...", body:"با سلام،\n\nمی‌خواهم از پلن پایه به حرفه‌ای ارتقا دهم. لطفاً راهنمایی کنید. آیا می‌توانم وسط ماه ارتقا دهم یا باید تا ابتدای ماه بعد صبر کنم؟\n\nبا تشکر", date:"۱۴۰۳/۰۴/۰۱ ۱۴:۱۵", unread:true, folder:"inbox" },
  { id:"m3", from:"محمد کریمی", fromEmail:"m.karimi@gov.ir", to:"support@azmon.ir", subject:"نیاز به فاکتور رسمی", preview:"برای حسابداری سازمان به فاکتور رسمی...", body:"سلام،\n\nبرای حسابداری سازمان به فاکتور رسمی با مهر و امضا نیاز داریم. لطفاً برای ماه‌های فروردین تا خرداد ارسال کنید.\n\nآدرس: تهران، خیابان ولیعصر...", date:"۱۴۰۳/۰۳/۲۸ ۰۹:۵۰", unread:false, folder:"inbox", attachments:[{name:"درخواست فاکتور.pdf", size:"۱۲۰ کیلوبایت"}] },
  { id:"m4", from:"support@azmon.ir", fromEmail:"support@azmon.ir", to:"ahmad@uni.ac.ir", subject:"پاسخ: مشکل در ورود به پنل", preview:"ضمن پوزش، مشکل برطرف شد...", body:"سلام دکتر رضایی عزیز،\n\nضمن عذرخواهی از این مشکل، تیم فنی بررسی کرد و مشخص شد IP شما به اشتباه بلاک شده بود. مشکل برطرف شد.\n\nلطفاً مجدداً تلاش کنید.", date:"۱۴۰۳/۰۴/۰۲ ۱۱:۰۵", unread:false, folder:"sent" },
  { id:"m5", from:"نرگس طاهری", fromEmail:"narges@konkor.ir", to:"support@azmon.ir", subject:"گزارش باگ در آزمون همزمان", preview:"هنگام برگزاری آزمون با ۴۰۰ نفر...", body:"سلام،\n\nهنگام برگزاری آزمون با ۴۰۰ نفر، بعد از ۴۵ دقیقه صفحه برای ۱۵ نفر لود نشد. لطفاً بررسی کنید و پاسخ دهید.", date:"۱۴۰۳/۰۳/۲۵ ۱۶:۴۸", unread:false, folder:"inbox" },
];

// ─── Status helpers ───────────────────────────────────────────────────────────
const userStatusBadge = (s: User["status"]) => {
  if (s === "active")   return { cls: "adm-badge--green",  label: "فعال" };
  if (s === "inactive") return { cls: "adm-badge--gray",   label: "غیرفعال" };
  return                       { cls: "adm-badge--amber",  label: "در انتظار" };
};
const payStatusBadge = (s: Payment["status"]) => {
  if (s === "paid")     return { cls: "adm-badge--green",  label: "پرداخت شده" };
  if (s === "failed")   return { cls: "adm-badge--rose",   label: "ناموفق" };
  if (s === "refunded") return { cls: "adm-badge--amber",  label: "مسترد شده" };
  return                       { cls: "adm-badge--sky",    label: "در انتظار" };
};
const diffBadge = (d: Question["difficulty"]) => {
  if (d === "easy")   return { cls: "adm-badge--green",  label: "آسان" };
  if (d === "medium") return { cls: "adm-badge--amber",  label: "متوسط" };
  return                     { cls: "adm-badge--rose",   label: "سخت" };
};
const formatK = (n: number) => `${n.toLocaleString("fa-IR")} هزار`;

// ════════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// ── Users ─────────────────────────────────────────────────────────────────────
const UsersSection: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [drawer, setDrawer] = useState<User | null>(null);

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* Stats */}
      <div className="adm-stats">
        {[
          { icon:"👥", label:"کل کاربران",    value:"۶",   change:"+۲ این ماه",  up:true,  bg:"var(--primary-lt)", color:"var(--primary)" },
          { icon:"✅", label:"کاربر فعال",    value:"۴",   change:"۶۶٪ از کل",   up:true,  bg:"var(--green-lt)",   color:"var(--green)" },
          { icon:"⏳", label:"در انتظار",      value:"۱",   change:"نیاز به تأیید", up:false, bg:"#FEF3C7",          color:"#92400E" },
          { icon:"📊", label:"مجموع آزمون",   value:"۳۸۵", change:"+۴۷ این هفته", up:true,  bg:"var(--sky-lt)",    color:"var(--sky)" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-card__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="adm-stat-card__label">{s.label}</div>
              <div className="adm-stat-card__value">{s.value}</div>
              <div className={`adm-stat-card__change ${s.up ? "adm-stat-card__change--up" : "adm-stat-card__change--down"}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <div className="adm-card__title">لیست کاربران</div>
            <div className="adm-card__sub">{filtered.length} کاربر</div>
          </div>
          <div className="adm-section-header__right">
            <div className="users-filters">
              <input className="adm-input" style={{ width: 200 }} placeholder="🔍 جستجو..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="adm-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="pending">در انتظار</option>
              </select>
            </div>
            <button className="adm-btn adm-btn--primary">+ کاربر جدید</button>
          </div>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>کاربر</th>
                <th>پلن</th>
                <th>وضعیت</th>
                <th>آزمون</th>
                <th>عضویت</th>
                <th>آخرین ورود</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const badge = userStatusBadge(u.status);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="adm-table__avatar" style={{ background: u.avatarBg }}>{u.avatar}</div>
                        <div>
                          <div className="adm-table__name">{u.name}</div>
                          <div className="adm-table__email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-badge" style={{ background: u.planBg, color: u.planColor }}>{u.plan}</span></td>
                    <td><span className={`adm-badge ${badge.cls}`}>{badge.label}</span></td>
                    <td>{u.exams}</td>
                    <td style={{ color: "var(--adm-sub)", fontSize: 12 }}>{u.joinDate}</td>
                    <td style={{ color: "var(--adm-sub)", fontSize: 12 }}>{u.lastLogin}</td>
                    <td>
                      <div className="adm-table__actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setDrawer(u)}>مشاهده</button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm">حذف</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="adm-pagination">
          <span className="adm-pagination__info">نمایش ۱ تا {filtered.length} از {USERS.length}</span>
          <div className="adm-pagination__btns">
            {["«", "۱", "۲", "»"].map((p) => (
              <button key={p} className={`adm-page-btn ${p === "۱" ? "adm-page-btn--active" : ""}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawer && (
        <>
          <div className="user-drawer-backdrop" onClick={() => setDrawer(null)} />
          <div className="user-drawer">
            <div className="user-drawer__header">
              <span className="user-drawer__title">مشخصات کاربر</span>
              <button className="user-drawer__close" onClick={() => setDrawer(null)}>×</button>
            </div>
            <div className="user-drawer__body">
              <div className="user-drawer__avatar-row">
                <div className="user-drawer__avatar" style={{ background: drawer.avatarBg }}>{drawer.avatar}</div>
                <div>
                  <div className="user-drawer__name">{drawer.name}</div>
                  <div className="user-drawer__email">{drawer.email}</div>
                </div>
              </div>
              <div className="user-drawer__detail-grid">
                {[
                  ["شماره تماس", drawer.phone], ["پلن", drawer.plan],
                  ["تعداد آزمون", `${drawer.exams} آزمون`], ["وضعیت", userStatusBadge(drawer.status).label],
                  ["تاریخ عضویت", drawer.joinDate], ["آخرین ورود", drawer.lastLogin],
                ].map(([label, val]) => (
                  <div key={label} className="user-drawer__detail">
                    <div className="user-drawer__detail-label">{label}</div>
                    <div className="user-drawer__detail-val">{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="adm-btn adm-btn--primary" style={{ flex: 1 }}>ویرایش</button>
                <button className="adm-btn adm-btn--ghost" style={{ flex: 1 }}>ارسال ایمیل</button>
                <button className="adm-btn adm-btn--danger adm-btn--sm">حذف</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// ── Payments ──────────────────────────────────────────────────────────────────
const PaymentsSection: React.FC = () => {
  const totalPaid = PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending   = PAYMENTS.filter((p) => p.status === "pending").length;
  const failed    = PAYMENTS.filter((p) => p.status === "failed").length;

  return (
    <>
      <div className="adm-stats">
        {[
          { icon:"💰", label:"درآمد این ماه",  value:formatK(totalPaid), change:"+۱۸٪", up:true,  bg:"var(--green-lt)",  color:"var(--green)" },
          { icon:"⏳", label:"در انتظار",       value:`${pending}`,       change:"نیاز به پیگیری", up:false, bg:"#FEF3C7", color:"#92400E" },
          { icon:"❌", label:"پرداخت ناموفق",  value:`${failed}`,        change:"باید پیگیری شود", up:false, bg:"var(--rose-lt)", color:"var(--rose)" },
          { icon:"📈", label:"تراکنش‌های کل",  value:`${PAYMENTS.length}`, change:"این دوره", up:true, bg:"var(--sky-lt)", color:"var(--sky)" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-card__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="adm-stat-card__label">{s.label}</div>
              <div className="adm-stat-card__value">{s.value}</div>
              <div className={`adm-stat-card__change ${s.up ? "adm-stat-card__change--up" : "adm-stat-card__change--down"}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue bar chart (visual) */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card__header">
          <div className="adm-card__title">درآمد ۶ ماه اخیر</div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, alignItems: "end", height: 120 }}>
            {[
              { month: "بهمن", val: 60 }, { month: "اسفند", val: 75 },
              { month: "فروردین", val: 55 }, { month: "اردیبهشت", val: 88 },
              { month: "خرداد", val: 70 }, { month: "تیر", val: 100 },
            ].map((d) => (
              <div key={d.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ width: "100%", background: "var(--primary)", borderRadius: "6px 6px 0 0", height: `${d.val}%`, opacity: d.month === "تیر" ? 1 : 0.55, transition: "height 0.5s ease" }} />
                <span style={{ color: "var(--adm-light)", fontSize: 11, fontWeight: 600 }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card__header">
          <div>
            <div className="adm-card__title">تراکنش‌ها</div>
            <div className="adm-card__sub">{PAYMENTS.length} رکورد</div>
          </div>
          <div className="adm-section-header__right">
            <select className="adm-select">
              <option>همه وضعیت‌ها</option>
              <option>پرداخت شده</option>
              <option>در انتظار</option>
              <option>ناموفق</option>
            </select>
            <button className="adm-btn adm-btn--ghost">⬇ خروجی Excel</button>
          </div>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>کاربر</th>
                <th>پلن</th>
                <th>دوره</th>
                <th>مبلغ</th>
                <th>روش</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p) => {
                const badge = payStatusBadge(p.status);
                return (
                  <tr key={p.id}>
                    <td style={{ color: "var(--adm-light)", fontFamily: "monospace", fontSize: 12 }}>#{p.id}</td>
                    <td><span className="adm-table__name">{p.userName}</span></td>
                    <td>{p.plan}</td>
                    <td><span className="adm-badge adm-badge--gray">{p.billing === "annual" ? "سالانه" : "ماهانه"}</span></td>
                    <td style={{ fontWeight: 800, color: "var(--green)" }}>{p.amount.toLocaleString("fa-IR")} هزار</td>
                    <td style={{ color: "var(--adm-sub)" }}>{p.method}</td>
                    <td><span className={`adm-badge ${badge.cls}`}>{badge.label}</span></td>
                    <td style={{ color: "var(--adm-sub)", fontSize: 12 }}>{p.date}</td>
                    <td>
                      <div className="adm-table__actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm">فاکتور</button>
                        {p.status === "pending" && <button className="adm-btn adm-btn--primary adm-btn--sm">تأیید</button>}
                        {p.status === "paid" && <button className="adm-btn adm-btn--danger adm-btn--sm">استرداد</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="adm-pagination">
          <span className="adm-pagination__info">نمایش ۱ تا {PAYMENTS.length}</span>
          <div className="adm-pagination__btns">
            {["«", "۱", "»"].map((p) => (
              <button key={p} className={`adm-page-btn ${p === "۱" ? "adm-page-btn--active" : ""}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ── Questions ─────────────────────────────────────────────────────────────────
const QuestionsSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editQ, setEditQ] = useState<Question | null>(null);
  const [search, setSearch] = useState("");

  const filtered = QUESTIONS.filter((q) => q.text.includes(search) || q.category.includes(search));

  const openEditor = (q: Question | null) => { setEditQ(q); setModalOpen(true); };

  const LETTERS = ["الف", "ب", "پ", "ت"];

  return (
    <>
      <div className="adm-stats">
        {[
          { icon:"❓", label:"کل سوالات",    value:`${QUESTIONS.length}`, change:"+۳ این هفته", up:true, bg:"var(--violet-lt)", color:"var(--violet)" },
          { icon:"📚", label:"تستی",          value:"۳",  change:"۶۰٪ از کل",   up:true, bg:"var(--sky-lt)",    color:"var(--sky)" },
          { icon:"✍️",label:"تشریحی/کوتاه", value:"۲",  change:"۴۰٪ از کل",  up:true, bg:"var(--accent-lt)", color:"var(--accent)" },
          { icon:"🎯", label:"استفاده‌شده",  value:"۸۱", change:"در آزمون‌ها",  up:true, bg:"var(--green-lt)",  color:"var(--green)" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-card__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="adm-stat-card__label">{s.label}</div>
              <div className="adm-stat-card__value">{s.value}</div>
              <div className="adm-stat-card__change adm-stat-card__change--up">{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-section-header">
        <div className="adm-section-header__left">
          <div className="adm-section-title">بانک سوالات</div>
          <div className="adm-section-sub">{filtered.length} سوال</div>
        </div>
        <div className="adm-section-header__right">
          <input className="adm-input" style={{ width: 220 }} placeholder="🔍 جستجو در سوالات..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="adm-btn adm-btn--primary" onClick={() => openEditor(null)}>+ سوال جدید</button>
        </div>
      </div>

      {filtered.map((q) => {
        const diff = diffBadge(q.difficulty);
        return (
          <div key={q.id} className="question-card" onClick={() => openEditor(q)}>
            <div className="question-card__top">
              <div className="question-card__text">{q.text}</div>
              <div className="question-card__meta">
                <span className={`adm-badge ${diff.cls}`}>{diff.label}</span>
                <span className="adm-badge adm-badge--sky">{q.category}</span>
                <span className="adm-badge adm-badge--gray">استفاده: {q.usedIn}</span>
              </div>
            </div>
            {q.type === "multiple" && (
              <div className="question-card__options">
                {q.options.map((opt, i) => (
                  <div key={i} className={`question-card__option ${i === q.correct ? "question-card__option--correct" : ""}`}>
                    <span className="question-card__option-letter">{LETTERS[i]}</span>
                    {opt}
                  </div>
                ))}
              </div>
            )}
            {q.type === "truefalse" && (
              <div className="question-card__options">
                {q.options.map((opt, i) => (
                  <div key={i} className={`question-card__option ${i === q.correct ? "question-card__option--correct" : ""}`}>
                    <span className="question-card__option-letter">{i === 0 ? "✓" : "×"}</span>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Question editor modal */}
      {modalOpen && (
        <div className="q-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="q-modal" onClick={(e) => e.stopPropagation()}>
            <div className="q-modal__header">
              <span className="q-modal__title">{editQ ? "ویرایش سوال" : "سوال جدید"}</span>
              <button className="user-drawer__close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="q-modal__body">
              <div className="adm-form-full">
                <label className="adm-form-label">متن سوال *</label>
                <textarea className="adm-textarea" rows={3} defaultValue={editQ?.text} placeholder="متن سوال را وارد کنید..." />
              </div>
              <div className="adm-form-row">
                <div>
                  <label className="adm-form-label">نوع سوال</label>
                  <select className="adm-select" style={{ width: "100%" }} defaultValue={editQ?.type}>
                    <option value="multiple">چهار گزینه‌ای</option>
                    <option value="truefalse">درست / نادرست</option>
                    <option value="short">کوتاه‌پاسخ</option>
                  </select>
                </div>
                <div>
                  <label className="adm-form-label">سطح دشواری</label>
                  <select className="adm-select" style={{ width: "100%" }} defaultValue={editQ?.difficulty}>
                    <option value="easy">آسان</option>
                    <option value="medium">متوسط</option>
                    <option value="hard">سخت</option>
                  </select>
                </div>
              </div>
              <div className="adm-form-full">
                <label className="adm-form-label">دسته‌بندی</label>
                <input className="adm-input" defaultValue={editQ?.category} placeholder="مثلاً: ریاضی، علوم، فناوری..." />
              </div>
              {(!editQ || editQ.type === "multiple") && (
                <div>
                  <label className="adm-form-label">گزینه‌ها (گزینه صحیح را مشخص کنید)</label>
                  {["الف", "ب", "پ", "ت"].map((l, i) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <input type="radio" name="correct" defaultChecked={editQ?.correct === i} />
                      <span style={{ color: "var(--adm-sub)", fontSize: 12, fontWeight: 700, minWidth: 20 }}>{l}</span>
                      <input className="adm-input" defaultValue={editQ?.options[i]} placeholder={`گزینه ${l}...`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="q-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={() => setModalOpen(false)}>انصراف</button>
              <button className="adm-btn adm-btn--primary" onClick={() => setModalOpen(false)}>💾 ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Messages ──────────────────────────────────────────────────────────────────
const MessagesSection: React.FC = () => {
  const [folder, setFolder] = useState<Folder>("inbox");
  const [selected, setSelected] = useState<Mail | null>(MAILS[0]);
  const [compose, setCompose] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const inboxCount = MAILS.filter((m) => m.folder === "inbox" && m.unread).length;
  const folderMails = MAILS.filter((m) => m.folder === folder);

  const FOLDERS: { key: Folder; label: string; icon: string; count?: number }[] = [
    { key: "inbox",  label: "صندوق ورودی",  icon: "📥", count: inboxCount },
    { key: "sent",   label: "ارسال‌شده",     icon: "📤" },
    { key: "drafts", label: "پیش‌نویس",      icon: "📝" },
    { key: "trash",  label: "حذف‌شده",       icon: "🗑" },
  ];

  const handleSend = () => {
    setSendLoading(true);
    setTimeout(() => { setSendLoading(false); setCompose(false); }, 1200);
  };

  return (
    <>
      <div className="adm-section-header" style={{ marginBottom: 16 }}>
        <div className="adm-section-header__left">
          <div className="adm-section-title">ایمیل‌ها</div>
          <div className="adm-section-sub">{MAILS.length} پیام</div>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => setCompose(true)}>✉️ نوشتن ایمیل</button>
      </div>

      <div className="mail-layout">
        {/* Mail sidebar */}
        <div className="mail-sidebar">
          <div className="mail-sidebar__compose">
            <button className="adm-btn adm-btn--primary" style={{ width: "100%" }} onClick={() => setCompose(true)}>+ نوشتن</button>
          </div>
          <div className="mail-sidebar__nav">
            {FOLDERS.map((f) => (
              <button key={f.key} className={`mail-folder-btn ${folder === f.key ? "mail-folder-btn--active" : ""}`} onClick={() => setFolder(f.key)}>
                <span className="mail-folder-btn__icon">{f.icon}</span>
                {f.label}
                {f.count ? <span className="mail-folder-btn__count">{f.count}</span> : null}
              </button>
            ))}
          </div>

          {/* Mail list */}
          <div className="mail-list">
            {folderMails.length === 0 ? (
              <div style={{ padding: 24, color: "var(--adm-light)", fontSize: 13, textAlign: "center" }}>پیامی وجود ندارد</div>
            ) : folderMails.map((m) => (
              <div key={m.id}
                className={`mail-item ${m.unread ? "mail-item--unread" : ""} ${selected?.id === m.id ? "mail-item--active" : ""}`}
                onClick={() => setSelected(m)}
              >
                <div className="mail-item__from">{folder === "sent" ? m.to : m.from}</div>
                <div className="mail-item__subject">{m.subject}</div>
                <div className="mail-item__preview">{m.preview}</div>
                <div className="mail-item__date">{m.date.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mail detail */}
        {selected ? (
          <div className="mail-detail">
            <div className="mail-detail__toolbar">
              <button className="adm-btn adm-btn--ghost adm-btn--sm">↩ پاسخ</button>
              <button className="adm-btn adm-btn--ghost adm-btn--sm">↪ فوروارد</button>
              <button className="adm-btn adm-btn--danger adm-btn--sm">🗑 حذف</button>
              <button className="adm-btn adm-btn--ghost adm-btn--sm">⭐ ستاره</button>
            </div>
            <div className="mail-detail__header">
              <div className="mail-detail__subject">{selected.subject}</div>
              <div className="mail-detail__meta">
                <div className="mail-detail__from">از: <strong>{selected.from}</strong> &lt;{selected.fromEmail}&gt;</div>
                <div className="mail-detail__from">به: <strong>{selected.to}</strong></div>
                <div className="mail-detail__date">{selected.date}</div>
              </div>
            </div>
            <div className="mail-detail__body">
              <div className="mail-detail__body-text">{selected.body.split("\n").map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}</div>
            </div>
            {selected.attachments && (
              <div className="mail-detail__attachments">
                <div className="mail-detail__att-title">پیوست‌ها ({selected.attachments.length})</div>
                {selected.attachments.map((a) => (
                  <span key={a.name} className="mail-detail__att-item">📎 {a.name} <span style={{ color: "var(--adm-light)" }}>{a.size}</span></span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mail-detail mail-detail--empty">
            <div className="mail-detail--empty-icon">📭</div>
            <div>یک ایمیل انتخاب کنید</div>
          </div>
        )}
      </div>

      {/* Compose modal */}
      {compose && (
        <div className="compose-modal">
          <div className="compose-modal__header">
            <span className="compose-modal__title">✉️ نوشتن ایمیل جدید</span>
            <button className="compose-modal__close" onClick={() => setCompose(false)}>×</button>
          </div>
          <div className="compose-modal__body">
            {[["به", "user@example.com"], ["موضوع", "موضوع ایمیل..."]].map(([label, ph]) => (
              <div key={label} className="compose-modal__field">
                <span className="compose-modal__field-label">{label}:</span>
                <input placeholder={ph} />
              </div>
            ))}
            <div className="compose-modal__editor">
              <textarea placeholder="متن ایمیل را اینجا بنویسید..." />
            </div>
          </div>
          <div className="compose-modal__footer">
            <div className="compose-modal__tools">
              {["B", "I", "U", "🔗", "📎"].map((t) => (
                <button key={t} className="compose-tool-btn">{t}</button>
              ))}
            </div>
            <button className="adm-btn adm-btn--primary" onClick={handleSend} disabled={sendLoading}>
              {sendLoading ? <span className="adm-btn__spinner" /> : "📤 ارسال"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ════════════════════════════════════════════════════════════════════════════
interface NavItem { id: Section; label: string; icon: string; badge?: number; }

const NAV_ITEMS: NavItem[] = [
  { id: "users",    label: "مشخصات افراد",      icon: "👥", badge: 1 },
  { id: "payments", label: "پرداختی‌های افراد",  icon: "💳" },
  { id: "questions",label: "سوالات",             icon: "❓" },
  { id: "messages", label: "ارسال و دریافت",    icon: "✉️", badge: 2 },
];

const SECTION_TITLES: Record<Section, string> = {
  users:     "مشخصات افراد",
  payments:  "پرداختی‌های افراد",
  questions: "بانک سوالات",
  messages:  "ارسال و دریافت ایمیل",
};

const AdminPanel: React.FC = () => {
  const [active, setActive] = useState<Section>("users");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = (): ReactNode => {
    if (active === "users")     return <UsersSection />;
    if (active === "payments")  return <PaymentsSection />;
    if (active === "questions") return <QuestionsSection />;
    if (active === "messages")  return <MessagesSection />;
    return null;
  };

  return (
    <div className="adm-shell" dir="rtl">

      {/* ── Sidebar ── */}
      <aside className={`adm-sidebar ${collapsed ? "adm-sidebar--collapsed" : ""}`}>

        {/* Brand */}
        <div className="adm-sidebar__brand">
          <div className="adm-sidebar__brand-icon">آ</div>
          {!collapsed && (
            <>
              <span className="adm-sidebar__brand-name">آزمون‌گیر</span>
              <span className="adm-sidebar__brand-badge">Admin</span>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="adm-sidebar__nav">
          {!collapsed && <div className="adm-sidebar__section-label">مدیریت</div>}
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`adm-nav-item ${active === item.id ? "adm-nav-item--active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <div className="adm-nav-item__icon">{item.icon}</div>
              {!collapsed && <span className="adm-nav-item__label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="adm-nav-item__badge">{item.badge}</span>
              )}
            </button>
          ))}

          {!collapsed && <div className="adm-sidebar__section-label" style={{ marginTop: 24 }}>سیستم</div>}
          {[
            { icon: "⚙️", label: "تنظیمات" },
            { icon: "📊", label: "گزارش‌ها" },
            { icon: "🔗", label: "بازگشت به سایت" },
          ].map((item) => (
            <button key={item.label} className="adm-nav-item">
              <div className="adm-nav-item__icon">{item.icon}</div>
              {!collapsed && <span className="adm-nav-item__label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="adm-sidebar__footer">
          <div className="adm-sidebar__user">
            <div className="adm-sidebar__user-avatar">👤</div>
            {!collapsed && (
              <div>
                <div className="adm-sidebar__user-name">ادمین اصلی</div>
                <div className="adm-sidebar__user-role">مدیر سیستم</div>
              </div>
            )}
          </div>
          <button className="adm-sidebar__toggle" onClick={() => setCollapsed((p) => !p)}>
            {collapsed ? "←" : "→"}
          </button>
        </div>
      </aside>

      {/* ── Topbar ── */}
      <header className={`adm-topbar ${collapsed ? "adm-topbar--collapsed" : ""}`}>
        <div className="adm-topbar__left">
          <span className="adm-topbar__page-title">{SECTION_TITLES[active]}</span>
          <div className="adm-topbar__breadcrumb">
            <a href="/">سایت</a>
            <span>›</span>
            <span>پنل ادمین</span>
            <span>›</span>
            <span>{SECTION_TITLES[active]}</span>
          </div>
        </div>
        <div className="adm-topbar__right">
          <div className="adm-topbar__search">
            <span className="adm-topbar__search-icon">🔍</span>
            <input placeholder="جستجوی سریع..." />
          </div>
          <button className="adm-icon-btn">
            🔔
            <span className="adm-icon-btn__dot" />
          </button>
          <button className="adm-icon-btn">⚙️</button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={`adm-content ${collapsed ? "adm-content--collapsed" : ""}`} key={active}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;
