import { useState, useEffect, useRef, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FadeInProps { children: ReactNode; delay?: number; className?: string; }
export interface Feature    { icon: string; title: string; desc: string; color: string; bg: string; }
export interface Step       { n: string; title: string; desc: string; icon: string; }
export interface Plan       { name: string; name_en: string; price: number | null; color: string; btnBg: string; features: string[]; badge: string | null; highlight: boolean; }
export interface Review     { name: string; role: string; stars: number; text: string; avatar: string; ac: string; }
export interface FaqItem    { q: string; a: string; }
export interface FooterCol  { title: string; items: string[]; }
export interface StatItem   { val: string; label: string; color: string; }
export interface DashStat   { label: string; val: string; color: string; icon: string; }
export interface PBar       { name: string; pct: number; color: string; }

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useInView = (threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean>(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
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
export const Pill: React.FC<{ label: string; color: string; bg: string }> = ({ label, color, bg }) => (
  <div style={{ display: "inline-block", background: bg, border: `1.5px solid ${color}30`, borderRadius: 100, padding: "6px 20px", marginBottom: 18 }}>
    <span style={{ color, fontSize: 13, fontWeight: 700 }}>{label}</span>
  </div>
);
