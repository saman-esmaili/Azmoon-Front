export type Section = "classes" | "questions" | "exams" | "students" | "buy-plan" | "my-plan" | "transactions" | "profile" | "messages";
export type MailFolder = "inbox" | "sent" | "drafts" | "trash";
export type ProfileTab = "personal" | "contact" | "security";

// ─── Seed Data ────────────────────────────────────────────────────────────────
export const CLASSES = [
  { id:"c1", name:"ریاضی پایه دهم",  subject:"ریاضی",   grade:"دهم",  students:28, color:"#0D9488", bg:"var(--primary-lt)", icon:"📐", exams:5,  nextExam:"۱۴۰۳/۰۴/۱۵" },
  { id:"c2", name:"فیزیک یازدهم",    subject:"فیزیک",   grade:"یازدهم", students:22, color:"#0EA5E9", bg:"var(--sky-lt)",    icon:"⚡", exams:3,  nextExam:"۱۴۰۳/۰۴/۱۸" },
  { id:"c3", name:"شیمی دوازدهم",    subject:"شیمی",    grade:"دوازدهم", students:30, color:"#7C3AED", bg:"var(--violet-lt)", icon:"🧪", exams:7,  nextExam:"۱۴۰۳/۰۴/۲۰" },
  { id:"c4", name:"حساب و آمار",     subject:"ریاضی",   grade:"یازدهم", students:18, color:"#F97316", bg:"var(--accent-lt)", icon:"📊", exams:4,  nextExam:"ندارد" },
];

export const QUESTIONS = [
  { id:"q1", text:"کدام گزینه مفهوم لیمیت را به درستی بیان می‌کند؟", type:"multiple", options:["مقدار تابع در نقطه","مقدار تابع در نزدیکی نقطه","شیب خط مماس","مشتق در نقطه"], correct:1, cat:"حساب", diff:"hard", used:12 },
  { id:"q2", text:"معادله خط عبوری از دو نقطه (۱,۲) و (۳,۶) چیست؟", type:"multiple", options:["y=2x","y=2x+1","y=x+1","y=3x-1"], correct:0, cat:"ریاضی", diff:"easy", used:24 },
  { id:"q3", text:"آیا مشتق توابع ثابت برابر صفر است؟", type:"truefalse", options:["درست","نادرست"], correct:0, cat:"حساب", diff:"easy", used:31 },
  { id:"q4", text:"چه نوع تابعی f(x)=x² را یک به یک نمی‌سازد؟", type:"multiple", options:["تابع زوج","تابع فرد","تابع پیوسته","تابع خطی"], correct:0, cat:"ریاضی", diff:"medium", used:8 },
];

export const EXAMS = [
  { id:"e1", name:"آزمون میان‌ترم ریاضی", class:"ریاضی پایه دهم", date:"۱۴۰۳/۰۴/۱۵", time:"۰۹:۰۰", duration:90, qCount:25, status:"upcoming", icon:"📝" },
  { id:"e2", name:"آزمون فصل موج",         class:"فیزیک یازدهم",   date:"۱۴۰۳/۰۴/۱۸", time:"۱۰:۳۰", duration:60, qCount:20, status:"upcoming", icon:"📡" },
  { id:"e3", name:"آزمون ترکیبات آلی",     class:"شیمی دوازدهم",   date:"۱۴۰۳/۰۳/۲۵", time:"۰۸:۰۰", duration:120,qCount:40, status:"done",     icon:"🧪" },
  { id:"e4", name:"آزمون تشریحی آمار",     class:"حساب و آمار",    date:"۱۴۰۳/۰۳/۱۸", time:"۱۱:۰۰", duration:90, qCount:15, status:"done",     icon:"📊" },
];

export const STUDENTS = [
  { id:"s1", name:"علی محمدی",    email:"ali@stu.ir",    class:"ریاضی پایه دهم",  avg:17.5, rank:2,  status:"active", bg:"linear-gradient(135deg,#0D9488,#0EA5E9)",   scores:[{exam:"میان‌ترم ریاضی",score:18,total:20,date:"۱۴۰۳/۰۳/۲۵"},{exam:"آزمون آمار",score:17,total:20,date:"۱۴۰۳/۰۳/۱۸"}] },
  { id:"s2", name:"فاطمه رضایی", email:"f.rezaei@stu.ir", class:"فیزیک یازدهم",   avg:15.8, rank:5,  status:"active", bg:"linear-gradient(135deg,#7C3AED,#0EA5E9)",   scores:[{exam:"آزمون موج",score:16,total:20,date:"۱۴۰۳/۰۴/۰۱"},{exam:"آزمون آمار",score:15,total:20,date:"۱۴۰۳/۰۳/۱۸"}] },
  { id:"s3", name:"محمد حسینی",  email:"m.h@stu.ir",    class:"شیمی دوازدهم",   avg:19.1, rank:1,  status:"active", bg:"linear-gradient(135deg,#059669,#0D9488)",   scores:[{exam:"ترکیبات آلی",score:19,total:20,date:"۱۴۰۳/۰۳/۲۵"},{exam:"آزمون آمار",score:20,total:20,date:"۱۴۰۳/۰۳/۱۸"}] },
  { id:"s4", name:"نرگس کریمی",  email:"narges@stu.ir", class:"ریاضی پایه دهم",  avg:12.3, rank:15, status:"inactive",bg:"linear-gradient(135deg,#F97316,#F43F5E)",  scores:[{exam:"میان‌ترم ریاضی",score:12,total:20,date:"۱۴۰۳/۰۳/۲۵"}] },
  { id:"s5", name:"رضا موسوی",   email:"reza@stu.ir",   class:"حساب و آمار",    avg:16.2, rank:7,  status:"active", bg:"linear-gradient(135deg,#FCD34D,#F97316)",   scores:[{exam:"آزمون آمار",score:16,total:20,date:"۱۴۰۳/۰۳/۱۸"},{exam:"میان‌ترم ریاضی",score:17,total:20,date:"۱۴۰۳/۰۳/۲۵"}] },
];

export const TRANSACTIONS = [
  { id:"t1", plan:"حرفه‌ای", amount:1200, billing:"سالانه",  status:"paid",    date:"۱۴۰۳/۰۱/۰۱", method:"ملی" },
  { id:"t2", plan:"پایه",    amount:500,  billing:"ماهانه", status:"paid",    date:"۱۴۰۲/۱۲/۰۱", method:"سامان" },
  { id:"t3", plan:"پایه",    amount:500,  billing:"ماهانه", status:"paid",    date:"۱۴۰۲/۱۱/۰۱", method:"سامان" },
  { id:"t4", plan:"حرفه‌ای", amount:1500, billing:"ماهانه", status:"failed",  date:"۱۴۰۲/۱۰/۲۸", method:"ملت" },
];

export const MAILS = [
  { id:"m1", from:"علی محمدی",   fromEmail:"ali@stu.ir",     subject:"سوال درباره آزمون",       preview:"استاد درباره فرمول‌های فصل سوم...",      body:"استاد عزیز،\n\nدرباره فرمول‌های فصل سوم کتاب، آیا باید همه موارد را حفظ کنیم یا فقط موارد اصلی کافی است؟\n\nممنون", date:"۱۴۰۳/۰۴/۰۲", unread:true,  folder:"inbox" as MailFolder, to:'azmoon' },
  { id:"m2", from:"فاطمه رضایی", fromEmail:"f.rezaei@stu.ir", subject:"درخواست تمدید آزمون",    preview:"به دلیل بیماری نتوانستم...",               body:"استاد محترم،\n\nبه دلیل بیماری نتوانستم در آزمون شرکت کنم. آیا امکان برگزاری آزمون جبرانی وجود دارد؟\n\nبا تشکر", date:"۱۴۰۳/۰۴/۰۱", unread:true,  folder:"inbox" as MailFolder,to:'azmoon' },
  { id:"m3", from:"support@azmon.ir", fromEmail:"support@azmon.ir", subject:"تیکت شماره ۱۲۳۴",   preview:"تیکت شما بررسی شد...",                    body:"استاد عزیز،\n\nتیکت پشتیبانی شما بررسی و مشکل برطرف شد. لطفاً مجدداً تلاش کنید.", date:"۱۴۰۳/۰۳/۲۸", unread:false, folder:"inbox" as MailFolder ,to:'azmoon'},
  { id:"m4", from:"من",            fromEmail:"teacher@azmon.ir", subject:"نتایج آزمون میان‌ترم", preview:"دانش‌آموزان عزیز، نتایج منتشر شد...",     body:"دانش‌آموزان عزیز،\n\nنتایج آزمون میان‌ترم ریاضی منتشر شد. به پنل خود مراجعه کنید.\n\nموفق باشید", date:"۱۴۰۳/۰۳/۲۶", unread:false, folder:"sent" as MailFolder,to:'azmoon' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const scoreColor = (s: number, t: number) => {
  const p = s / t;
  if (p >= 0.85) return { bg: "var(--green-lt)", color: "var(--green)" };
  if (p >= 0.60) return { bg: "#FEF3C7",         color: "#92400E" };
  return                 { bg: "var(--rose-lt)",  color: "var(--rose)" };
};

export const diffBadge = (d: string) => {
  if (d === "easy")   return "tch-badge--green";
  if (d === "medium") return "tch-badge--amber";
  return "tch-badge--rose";
};

export const diffLabel = (d: string) => d === "easy" ? "آسان" : d === "medium" ? "متوسط" : "سخت";