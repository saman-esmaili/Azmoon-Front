import {Section} from './types';
export const SECTION_TITLES: Record<Section, string> = {
  classes:      "کلاس‌های من",
  questions:    "بانک سوالات",
  exams:        "آزمون‌ها",
  students:     "دانش‌آموزان",
  "buy-plan":   "خرید پلن",
  "my-plan":    "پلن من",
  transactions: "تراکنش‌ها",
  profile:      "پروفایل من",
  messages:     "ایمیل‌ها",
};

export interface NavItem { id: Section; label: string; icon: string; badge?: number }

export const NAV_MAIN: NavItem[] = [
  { id:"classes",     label:"ایجاد کلاس",     icon:"🏫" },
  { id:"questions",   label:"ایجاد سوال",      icon:"❓" },
  { id:"exams",       label:"ایجاد آزمون",     icon:"📝" },
  { id:"students",    label:"افزودن دانش‌آموز", icon:"👥" },
  { id:"messages",    label:"ارسال و دریافت",  icon:"✉️", badge:2 },
];

export const NAV_ACCOUNT: NavItem[] = [
  { id:"buy-plan",    label:"خرید پلن",         icon:"🛒" },
  { id:"my-plan",     label:"مشخصات پلن",        icon:"💎" },
  { id:"transactions",label:"تراکنش‌ها",         icon:"💳" },
  { id:"profile",     label:"تکمیل مشخصات",     icon:"👤" },
];