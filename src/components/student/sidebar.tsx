import {Section} from './types';

export const TITLES: Record<Section, string> = {
    dashboard: "داشبورد",
    exams: "آزمون‌ها",
    join_class: "عضویت در کلاس",
    messages: "پیام‌ها",
    profile: "پروفایل من",
};

export const NAV_ITEMS: [Section, string, string, number?][] = [
    ["dashboard", "داشبورد", "🏠"],
    ["exams", "آزمون‌ها", "📝", 3],
    ["join_class", "عضویت در کلاس", "🔗"],
    ["messages", "پیام‌ها", "✉️", 2],
    ["profile", "پروفایل من", "👤"],
];
