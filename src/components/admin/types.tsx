// ─── Types ────────────────────────────────────────────────────────────────────
export type Section = "users" | "payments" | "questions" | "messages";
export type Folder = "inbox" | "sent" | "drafts" | "trash";
export type Billing = "monthly" | "annual";

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    plan: string;
    planColor: string;
    planBg: string;
    status: "student" | "teacher" | "admin";
    joinDate: string;
    lastLogin: string;
    exams: number;
    avatar: string;
    avatarBg: string;
}

export interface Payment {
    id: string;
    userId: string;
    userName: string;
    plan: string;
    amount: number;
    billing: Billing;
    status: "complete" | "incomplete";
    date: string;
    method: string;
}

export interface Question {
    id: string;
    text: string;
    type: "test" | "true_false" | "essay";
    options: string[];
    correct: number;
    category: string;
    difficulty: "easy" | "medium" | "hard";
    createdBy: string;
    usedIn: number;
}

export interface Mail {
    id: string;
    from: string;
    fromEmail: string;
    to: string;
    subject: string;
    preview: string;
    body: string;
    date: string;
    unread: boolean;
    folder: Folder;
    attachments?: { name: string; size: string }[];
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
// export const USERS: User[] = [
//   { id:"u1", name:"دکتر احمد رضایی",  email:"ahmad@uni.ac.ir",    phone:"0912-111-2233", plan:"حرفه‌ای", planColor:"var(--primary)", planBg:"var(--primary-lt)", status:"active",   joinDate:"۱۴۰۲/۰۸/۱۵", lastLogin:"۱۴۰۳/۰۴/۰۱", exams:47, avatar:"ا", avatarBg:"linear-gradient(135deg,#0D9488,#0EA5E9)" },
//   { id:"u2", name:"مریم حسینی",        email:"maryam@zaban.ir",    phone:"0935-222-3344", plan:"پایه",    planColor:"var(--sky)",    planBg:"var(--sky-lt)",     status:"active",   joinDate:"۱۴۰۲/۱۰/۰۳", lastLogin:"۱۴۰۳/۰۳/۲۸", exams:12, avatar:"م", avatarBg:"linear-gradient(135deg,#0EA5E9,#7C3AED)" },
//   { id:"u3", name:"محمد کریمی",        email:"m.karimi@gov.ir",    phone:"0911-333-4455", plan:"سازمانی", planColor:"var(--violet)", planBg:"var(--violet-lt)",  status:"active",   joinDate:"۱۴۰۱/۰۵/۲۰", lastLogin:"۱۴۰۳/۰۴/۰۲", exams:203, avatar:"ک", avatarBg:"linear-gradient(135deg,#7C3AED,#F97316)" },
//   { id:"u4", name:"فاطمه موسوی",       email:"f.mousavi@sch.ir",   phone:"0916-444-5566", plan:"پایه",    planColor:"var(--sky)",    planBg:"var(--sky-lt)",     status:"pending",  joinDate:"۱۴۰۳/۰۳/۱۰", lastLogin:"۱۴۰۳/۰۳/۱۰", exams:0,   avatar:"ف", avatarBg:"linear-gradient(135deg,#F43F5E,#F97316)" },
//   { id:"u5", name:"علی اکبری",         email:"ali@tech.co",        phone:"0901-555-6677", plan:"حرفه‌ای", planColor:"var(--primary)", planBg:"var(--primary-lt)", status:"inactive", joinDate:"۱۴۰۲/۰۱/۱۱", lastLogin:"۱۴۰۲/۱۲/۰۵", exams:31, avatar:"ع", avatarBg:"linear-gradient(135deg,#059669,#0D9488)" },
//   { id:"u6", name:"نرگس طاهری",        email:"narges@konkor.ir",   phone:"0919-666-7788", plan:"حرفه‌ای", planColor:"var(--primary)", planBg:"var(--primary-lt)", status:"active",   joinDate:"۱۴۰۲/۰۶/۰۷", lastLogin:"۱۴۰۳/۰۴/۰۱", exams:89, avatar:"ن", avatarBg:"linear-gradient(135deg,#F97316,#FCD34D)" },
// ];

// export const PAYMENTS: Payment[] = [
//   { id:"p1", userId:"u1", userName:"دکتر احمد رضایی",  plan:"حرفه‌ای", amount:1200, billing:"annual",  status:"paid",     date:"۱۴۰۳/۰۱/۰۱", method:"ملی" },
//   { id:"p2", userId:"u2", userName:"مریم حسینی",        plan:"پایه",    amount:500,  billing:"monthly", status:"paid",     date:"۱۴۰۳/۰۳/۰۵", method:"پارسیان" },
//   { id:"p3", userId:"u3", userName:"محمد کریمی",        plan:"سازمانی", amount:4500, billing:"monthly", status:"paid",     date:"۱۴۰۳/۰۴/۰۱", method:"ملت" },
//   { id:"p4", userId:"u4", userName:"فاطمه موسوی",       plan:"پایه",    amount:500,  billing:"monthly", status:"pending",  date:"۱۴۰۳/۰۳/۱۰", method:"شتاب" },
//   { id:"p5", userId:"u5", userName:"علی اکبری",         plan:"حرفه‌ای", amount:1500, billing:"monthly", status:"refunded", date:"۱۴۰۲/۱۲/۰۱", method:"سامان" },
//   { id:"p6", userId:"u6", userName:"نرگس طاهری",        plan:"حرفه‌ای", amount:1200, billing:"annual",  status:"paid",     date:"۱۴۰۳/۰۲/۱۵", method:"ملی" },
//   { id:"p7", userId:"u1", userName:"دکتر احمد رضایی",  plan:"حرفه‌ای", amount:1200, billing:"annual",  status:"failed",   date:"۱۴۰۲/۱۲/۲۸", method:"ملت" },
// ];
//
// export const QUESTIONS: Question[] = [
//     {
//         id: "q1",
//         text: "کدام گزینه درباره اینترنت اشیاء (IoT) صحیح است؟",
//         type: "multiple",
//         options: ["اتصال دستگاه‌های فیزیکی به اینترنت", "فقط مربوط به گوشی‌های هوشمند", "نیاز به اتصال فیزیکی دارد", "هیچکدام"],
//         correct: 0,
//         category: "فناوری",
//         difficulty: "medium",
//         createdBy: "دکتر رضایی",
//         usedIn: 8
//     },
//     {
//         id: "q2",
//         text: "بزرگ‌ترین قاره جهان از نظر مساحت کدام است؟",
//         type: "multiple",
//         options: ["آفریقا", "آمریکا", "آسیا", "اروپا"],
//         correct: 2,
//         category: "جغرافیا",
//         difficulty: "easy",
//         createdBy: "خانم حسینی",
//         usedIn: 14
//     },
//     {
//         id: "q3",
//         text: "آیا آب در دمای صفر درجه سانتی‌گراد یخ می‌زند؟",
//         type: "truefalse",
//         options: ["درست", "نادرست"],
//         correct: 0,
//         category: "علوم",
//         difficulty: "easy",
//         createdBy: "آقای کریمی",
//         usedIn: 23
//     },
//     {
//         id: "q4",
//         text: "مفهوم «دموکراسی مستقیم» به چه معناست؟",
//         type: "multiple",
//         options: ["انتخاب نمایندگان", "مشارکت مستقیم مردم", "حکومت نخبگان", "انتخابات غیرمستقیم"],
//         correct: 1,
//         category: "علوم سیاسی",
//         difficulty: "hard",
//         createdBy: "دکتر رضایی",
//         usedIn: 5
//     },
//     {
//         id: "q5",
//         text: "مقدار پی (π) تا دو رقم اعشار چقدر است؟",
//         type: "short",
//         options: [],
//         correct: -1,
//         category: "ریاضی",
//         difficulty: "easy",
//         createdBy: "خانم طاهری",
//         usedIn: 31
//     },
// ];

export const MAILS: Mail[] = [
    {
        id: "m1",
        from: "دکتر احمد رضایی",
        fromEmail: "ahmad@uni.ac.ir",
        to: "support@azmon.ir",
        subject: "مشکل در ورود به پنل",
        preview: "سلام، از دیروز نمی‌توانم وارد پنل مدیریتی شوم...",
        body: "سلام،\n\nاز دیروز نمی‌توانم وارد پنل مدیریتی شوم. رمز عبور را فراموش نکرده‌ام ولی خطای ۴۰۳ می‌دهد. لطفاً بررسی کنید.\n\nممنون،\nدکتر رضایی",
        date: "۱۴۰۳/۰۴/۰۲ ۱۰:۳۲",
        unread: true,
        folder: "inbox"
    },
    {
        id: "m2",
        from: "مریم حسینی",
        fromEmail: "maryam@zaban.ir",
        to: "support@azmon.ir",
        subject: "درخواست ارتقاء پلن",
        preview: "می‌خواهم از پلن پایه به حرفه‌ای ارتقا دهم...",
        body: "با سلام،\n\nمی‌خواهم از پلن پایه به حرفه‌ای ارتقا دهم. لطفاً راهنمایی کنید. آیا می‌توانم وسط ماه ارتقا دهم یا باید تا ابتدای ماه بعد صبر کنم؟\n\nبا تشکر",
        date: "۱۴۰۳/۰۴/۰۱ ۱۴:۱۵",
        unread: true,
        folder: "inbox"
    },
    {
        id: "m3",
        from: "محمد کریمی",
        fromEmail: "m.karimi@gov.ir",
        to: "support@azmon.ir",
        subject: "نیاز به فاکتور رسمی",
        preview: "برای حسابداری سازمان به فاکتور رسمی...",
        body: "سلام،\n\nبرای حسابداری سازمان به فاکتور رسمی با مهر و امضا نیاز داریم. لطفاً برای ماه‌های فروردین تا خرداد ارسال کنید.\n\nآدرس: تهران، خیابان ولیعصر...",
        date: "۱۴۰۳/۰۳/۲۸ ۰۹:۵۰",
        unread: false,
        folder: "inbox",
        attachments: [{name: "درخواست فاکتور.pdf", size: "۱۲۰ کیلوبایت"}]
    },
    {
        id: "m4",
        from: "support@azmon.ir",
        fromEmail: "support@azmon.ir",
        to: "ahmad@uni.ac.ir",
        subject: "پاسخ: مشکل در ورود به پنل",
        preview: "ضمن پوزش، مشکل برطرف شد...",
        body: "سلام دکتر رضایی عزیز،\n\nضمن عذرخواهی از این مشکل، تیم فنی بررسی کرد و مشخص شد IP شما به اشتباه بلاک شده بود. مشکل برطرف شد.\n\nلطفاً مجدداً تلاش کنید.",
        date: "۱۴۰۳/۰۴/۰۲ ۱۱:۰۵",
        unread: false,
        folder: "sent"
    },
    {
        id: "m5",
        from: "نرگس طاهری",
        fromEmail: "narges@konkor.ir",
        to: "support@azmon.ir",
        subject: "گزارش باگ در آزمون همزمان",
        preview: "هنگام برگزاری آزمون با ۴۰۰ نفر...",
        body: "سلام،\n\nهنگام برگزاری آزمون با ۴۰۰ نفر، بعد از ۴۵ دقیقه صفحه برای ۱۵ نفر لود نشد. لطفاً بررسی کنید و پاسخ دهید.",
        date: "۱۴۰۳/۰۳/۲۵ ۱۶:۴۸",
        unread: false,
        folder: "inbox"
    },
];

// ─── Status helpers ───────────────────────────────────────────────────────────
export const userStatusBadge = (s: User["status"]) => {
    if (s === "student") return {cls: "adm-badge--green", label: "دانش آموز"};
    if (s === "teacher") return {cls: "adm-badge--gray", label: "مدرس"};
    return {cls: "adm-badge--amber", label: "ادمین"};
};
type STATUS = "complete" | 'incomplete'
export const payStatusBadge = (
    s: STATUS
): { cls: string; label: string } => {
    if (s === "complete")
        return {cls: "adm-badge--green", label: "پرداخت شده"};

    return {cls: "adm-badge--rose", label: "ناموفق"};
};
export const diffBadge = (d: Question["difficulty"]) => {
    if (d === "easy") return {cls: "adm-badge--green", label: "آسان"};
    if (d === "medium") return {cls: "adm-badge--amber", label: "متوسط"};
    return {cls: "adm-badge--rose", label: "سخت"};
};
export const formatK = (n: number) => `${n.toLocaleString("fa-IR")} هزار`;
