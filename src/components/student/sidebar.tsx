import {Section} from './types';
export const TITLES:Record<Section,string>={dashboard:"داشبورد",exams:"آزمون‌ها",messages:"پیام‌ها",profile:"پروفایل من"};

export const NAV_ITEMS:[Section,string,string,number?][]=[
  ["dashboard","داشبورد","🏠"],
  ["exams","آزمون‌ها","📝",3],
  ["messages","پیام‌ها","✉️",2],
  ["profile","پروفایل من","👤"],
];
