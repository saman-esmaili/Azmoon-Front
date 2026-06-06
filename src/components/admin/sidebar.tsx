import {Section} from "./types";

export interface NavItem { id: Section; label: string; icon: string; badge?: number; }

export const NAV_ITEMS: NavItem[] = [
  { id: "users",    label: "مشخصات افراد",      icon: "👥", badge: 1 },
  { id: "payments", label: "پرداختی‌های افراد",  icon: "💳" },
  { id: "questions",label: "سوالات",             icon: "❓" },
  { id: "messages", label: "ارسال و دریافت",    icon: "✉️", badge: 2 },
];

export const SECTION_TITLES: Record<Section, string> = {
  users:     "مشخصات افراد",
  payments:  "پرداختی‌های افراد",
  questions: "بانک سوالات",
  messages:  "ارسال و دریافت ایمیل",
};
