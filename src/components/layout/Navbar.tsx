"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Sun, Moon, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "홈", href: "/" },
    { name: "골든아워", href: "/golden-hour" },
    { name: "시즌 캘린더", href: "/season" },
    { name: "촬영 스팟", href: "/spots" },
    { name: "전시", href: "/exhibitions" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(true);

    // 초기 테마 설정 (기본 다크)
    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [isDark]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-8 h-[60px] flex items-center gap-10">
                <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                    <div className="w-7 h-7 bg-amber rounded-md flex items-center justify-center text-sm transition-transform group-hover:scale-105">
                        📷
                    </div>
                    <span className="font-serif text-[15px] text-[var(--text)] tracking-tight">
                        Photo<span className="text-amber">Toolkit</span>
                    </span>
                </Link>

                <div className="flex items-center gap-1 flex-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all",
                                pathname === link.href
                                    ? "text-amber bg-amber-dim"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--pill-bg)]"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2.5 ml-auto">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-9.5 h-9.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] flex items-center justify-center transition-all hover:text-amber hover:border-amber"
                        title="테마 전환"
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <button className="px-4.5 py-2 bg-amber text-[#0C0E12] border-none rounded-xl text-[13px] font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0">
                        한국어 ▾
                    </button>
                </div>
            </div>
        </nav>
    );
}
