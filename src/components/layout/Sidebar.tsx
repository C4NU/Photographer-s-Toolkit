"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Sunrise,
    Calendar,
    MapPin,
    Image as ImageIcon,
    Sun,
    Moon,
    ChevronRight,
    Settings,
    HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { name: "홈", href: "/", icon: Home },
    { name: "골든아워", href: "/golden-hour", icon: Sunrise },
    { name: "시즌 캘린더", href: "/season", icon: Calendar },
    { name: "촬영 스팟", href: "/spots", icon: MapPin },
    { name: "전시 큐레이션", href: "/exhibitions", icon: ImageIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen z-50 bg-[var(--bg)] border-r border-[var(--border)] transition-all duration-300 hidden md:flex flex-col",
                    isCollapsed ? "w-[80px]" : "w-[260px]"
                )}
            >
                {/* Logo Section */}
                <div className="h-[80px] flex items-center px-6 gap-3 shrink-0">
                    <Link href="/" className="flex items-center gap-3 group overflow-hidden">
                        <div className="w-9 h-9 bg-amber rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105 shadow-[0_4px_12px_rgba(232,168,56,0.3)]">
                            📷
                        </div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-serif text-[18px] text-[var(--text)] tracking-tight whitespace-nowrap"
                            >
                                Photo<span className="text-amber text-[18px]">Toolkit</span>
                            </motion.span>
                        )}
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all relative group",
                                    isActive
                                        ? "text-amber bg-amber-glow font-bold"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                                )}
                            >
                                <div className={cn(
                                    "shrink-0 transition-transform group-hover:scale-110",
                                    isActive ? "text-amber" : "text-[var(--text-tertiary)] group-hover:text-[var(--text)]"
                                )}>
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[14px] whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute right-2 w-1.5 h-1.5 bg-amber rounded-full shadow-[0_0_8px_rgba(232,168,56,0.5)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-[var(--border)] space-y-1.5">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-all group"
                    >
                        <div className="shrink-0 transition-transform group-hover:scale-110">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </div>
                        {!isCollapsed && (
                            <span className="text-[14px] flex-1 text-left">테마 전환</span>
                        )}
                    </button>

                    {!isCollapsed && (
                        <div className="px-3.5 py-3 mt-2 bg-amber-dim rounded-2xl border border-amber/10">
                            <div className="text-[10px] font-bold text-amber tracking-[1px] uppercase mb-1">PRO TOOL</div>
                            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                                모든 도구를<br />무제한으로 이용하세요.
                            </p>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-amber hover:border-amber transition-all shadow-sm md:flex hidden"
                >
                    <ChevronRight size={14} className={cn("transition-transform duration-300", !isCollapsed && "rotate-180")} />
                </button>
            </aside>

            {/* Mobile Bottom Navigation (Tab Bar style) */}
            <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-[var(--bg)]/80 backdrop-blur-xl border-t border-[var(--border)] z-50 flex items-center justify-around px-4 md:hidden pb-safe">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 min-w-[64px] transition-all",
                                isActive ? "text-amber" : "text-[var(--text-tertiary)]"
                            )}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-indicator"
                                    className="w-1 h-1 bg-amber rounded-full mt-0.5"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
