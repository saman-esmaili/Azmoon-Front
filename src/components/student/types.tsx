
/* ─── Types ─────────────────────────────────────────────────────────── */
export type Section = "dashboard" | "exams" | "messages" | "profile";
export type MailFolder = "inbox" | "sent" | "drafts";
export type QType = "multiple" | "truefalse" | "descriptive";
export type QStatus = "unseen" | "answered" | "skipped";
export type ScoreModal = "score" | "review" | null;

/* ─── Exam data ──────────────────────────────────────────────────────── */
export interface ExamQuestion {
  id: string; type: QType; text: string;
  options?: string[]; correct?: number; correctText?: string;
}
export interface Exam {
  id: string; name: string; subject: string; date: string;
  duration: number; qCount: number; icon: string;
  status: "upcoming" | "active" | "done";
  score?: number; totalScore?: number;
  questions: ExamQuestion[];
}

export const EXAMS: Exam[] = [
  {
    id:"e1", name:"آزمون میان‌ترم ریاضی", subject:"ریاضی پایه دهم",
    date:"۱۴۰۳/۰۴/۱۵", duration:90, qCount:5, icon:"📐",
    status:"active",
    questions:[
      {id:"q1",type:"multiple",text:"مشتق تابع f(x)=x³−3x+2 در نقطه x=1 برابر است با:",options:["0","1","−3","3"],correct:0},
      {id:"q2",type:"multiple",text:"معادله خط عبوری از دو نقطه (۱,۲) و (۳,۶) کدام است؟",options:["y=2x","y=2x+1","y=x+1","y=3x−1"],correct:0},
      {id:"q3",type:"truefalse",text:"مشتق توابع ثابت همواره برابر صفر است.",options:["درست","نادرست"],correct:0},
      {id:"q4",type:"descriptive",text:"تعریف لیمیت را بنویسید و یک مثال بزنید.",correctText:"لیمیت تابع f در نقطه a برابر L است اگر به ازای هر ε>0 یک δ>0 وجود داشته باشد که ..."},
      {id:"q5",type:"multiple",text:"انتگرال ∫(2x)dx برابر است با:",options:["x²+C","2x²+C","x+C","2+C"],correct:0},
    ]
  },
  {
    id:"e2", name:"آزمون فیزیک موج", subject:"فیزیک یازدهم",
    date:"۱۴۰۳/۰۴/۱۸", duration:60, qCount:4, icon:"⚡",
    status:"upcoming",
    questions:[
      {id:"q1",type:"multiple",text:"سرعت نور در خلأ تقریباً چقدر است؟",options:["3×10⁸ m/s","3×10⁶ m/s","9×10⁸ m/s","3×10⁴ m/s"],correct:0},
      {id:"q2",type:"truefalse",text:"امواج صوتی امواج طولی هستند.",options:["درست","نادرست"],correct:0},
      {id:"q3",type:"multiple",text:"فرکانس موجی با دوره T=0.5s چقدر است؟",options:["0.5 Hz","1 Hz","2 Hz","4 Hz"],correct:2},
      {id:"q4",type:"descriptive",text:"پدیده تشدید را توضیح دهید.",correctText:"تشدید زمانی اتفاق می‌افتد که فرکانس نیروی محرک برابر فرکانس طبیعی سیستم شود."},
    ]
  },
  {
    id:"e3", name:"آزمون شیمی آلی", subject:"شیمی دوازدهم",
    date:"۱۴۰۳/۰۳/۲۵", duration:120, qCount:4, icon:"🧪",
    status:"done", score:17, totalScore:20,
    questions:[
      {id:"q1",type:"multiple",text:"فرمول مولکولی گلوکز کدام است؟",options:["C₆H₁₂O₆","C₁₂H₂₂O₁₁","CH₂O","C₆H₆"],correct:0},
      {id:"q2",type:"truefalse",text:"آلکان‌ها فرمول عمومی CₙH₂ₙ دارند.",options:["درست","نادرست"],correct:1},
      {id:"q3",type:"multiple",text:"در واکنش احتراق کامل متان، محصولات کدامند؟",options:["CO₂+H₂O","CO+H₂O","CO₂+H₂","CO+H₂"],correct:0},
      {id:"q4",type:"descriptive",text:"پیوند هیدروژنی را تعریف کنید.",correctText:"پیوند هیدروژنی یک برهم‌کنش الکترواستاتیک بین اتم هیدروژن متصل به اتم الکترونگاتیو ..."},
    ]
  },
];

/* ─── Mail data ──────────────────────────────────────────────────────── */
export const MAILS = [
  {id:"m1",from:"دکتر رضایی",fromEmail:"teacher@azmon.ir",subject:"نتایج آزمون ریاضی",preview:"نتایج آزمون میان‌ترم منتشر شد...",body:"دانش‌آموز عزیز،\n\nنتایج آزمون میان‌ترم ریاضی منتشر شد. لطفاً به بخش آزمون‌ها مراجعه کنید.\n\nموفق باشید\nدکتر رضایی",date:"۱۴۰۳/۰۴/۰۲",unread:true,folder:"inbox" as MailFolder},
  {id:"m2",from:"پشتیبانی",fromEmail:"support@azmon.ir",subject:"خوش‌آمدگویی به آزمون‌گیر",preview:"حساب شما فعال شد...",body:"دانش‌آموز گرامی،\n\nحساب کاربری شما در سامانه آزمون‌گیر فعال شد. هم‌اکنون می‌توانید در آزمون‌ها شرکت کنید.\n\nموفق باشید",date:"۱۴۰۳/۰۳/۲۸",unread:false,folder:"inbox" as MailFolder},
  {id:"m3",from:"من",fromEmail:"student@azmon.ir",subject:"سوال درباره آزمون فیزیک",preview:"استاد عزیز، درباره فصل موج...",body:"استاد عزیز،\n\nدرباره مباحث فصل موج سوالاتی داشتم. آیا امکان تنظیم وقت دارید؟\n\nبا تشکر",date:"۱۴۰۳/۰۴/۰۱",unread:false,folder:"sent" as MailFolder},
];

export const LETTERS = ["الف","ب","پ","ت"];

/* ─── Helpers ────────────────────────────────────────────────────────── */
export const scoreColor = (s:number,t:number)=>{
  const p=s/t;
  if(p>=.85)return{bg:"var(--green-lt)",color:"var(--green)"};
  if(p>=.6 )return{bg:"#FEF3C7",       color:"#92400E"};
  return          {bg:"var(--rose-lt)", color:"var(--rose)"};
};
export const fmtTime=(s:number)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

/* ══════════════════════════════════════════════════════════════════════
   EXAM ENVIRONMENT
══════════════════════════════════════════════════════════════════════ */

