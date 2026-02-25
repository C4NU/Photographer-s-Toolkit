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
    ChevronLeft,
    ChevronRight,
    Settings,
    HelpCircle,
    Zap,
    Layout,
    Layers,
    Sparkles,
    Type,
    Box,
    Monitor
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// 메뉴 데이터 구조
const navigation = {
    main: [
        { id: 'features', name: "기능", icon: Zap, desc: "골든아워, 캘린더 등", active: true, href: "/golden-hour" },
        { id: 'exhibitions', name: "전시", icon: ImageIcon, desc: "전시회 큐레이팅", active: false, href: "/exhibitions" },
        { id: 'tools', name: "도구", icon: Monitor, desc: "소프트웨어 추천", active: true, href: "/tools" },
        { id: 'assets', name: "에셋 추천", icon: Layers, desc: "폰트, 이미지 등", active: false, href: "/assets" },
    ],
    features: [
        { name: "골든아워", href: "/golden-hour", icon: Sunrise },
        { name: "시즌 캘린더", href: "/season", icon: Calendar },
        { name: "촬영 스팟", href: "/spots", icon: MapPin },
    ],
    exhibitions: [
        { name: "전체 전시", href: "/exhibitions", icon: ImageIcon },
        { name: "추천 큐레이션", href: "/exhibitions#featured", icon: Sparkles },
    ],
    tools: [
        { name: "전체 도구", href: "/tools", icon: Monitor },
        { name: "기획 도구 (Nottie)", href: "/tools?category=촬영 기획", icon: Layout },
        { name: "편집 도구 (Paddie)", href: "/tools?category=사진 편집", icon: ImageIcon },
        { name: "자산 관리 (Packie)", href: "/tools?category=자산 관리", icon: Box },
    ],
    assets: [
        { name: "추천 폰트", href: "/assets", icon: Type },
        { name: "이미지 에셋", href: "/assets", icon: ImageIcon },
        { name: "라이트룸 프리셋", href: "/assets", icon: Layers },
    ]
};

const PLATFORMS = ["iOS", "Android", "macOS", "Windows", "Linux", "Web"];

export default function Sidebar() {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);

    // 필터 접힘 상태
    const [isCatsOpen, setIsCatsOpen] = useState(true);
    const [isPlatsOpen, setIsPlatsOpen] = useState(true);
    const [isPricingOpen, setIsPricingOpen] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentType = searchParams.get('type') || 'all';
    const currentCat = searchParams.get('category') || '전체';
    const currentPlat = searchParams.get('platform') || '전체';
    const currentPricing = searchParams.get('pricing') || '전체';
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [isDark]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*').order('name', { ascending: true });
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (pathname.startsWith('/tools')) {
            setActiveCategory('tools');
        } else if (pathname.startsWith('/golden-hour') || pathname.startsWith('/season') || pathname.startsWith('/spots')) {
            setActiveCategory('features');
        } else if (pathname.startsWith('/exhibitions')) {
            setActiveCategory('exhibitions');
        } else if (pathname.startsWith('/assets')) {
            setActiveCategory('assets');
        } else {
            setActiveCategory(null);
        }
    }, [pathname]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === '전체' || (key === 'type' && value === 'all')) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const currentMenu = activeCategory ? (navigation as any)[activeCategory] : navigation.main;
    const categoryTitle = navigation.main.find(c => c.id === activeCategory)?.name;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen z-50 bg-[var(--bg)] border-r border-[var(--border)] transition-all duration-300 hidden md:flex flex-col",
                    isCollapsed ? "w-[80px]" : "w-[280px]"
                )}
            >
                {/* Logo Section / Back Button */}
                <div className="h-[80px] flex items-center px-4 shrink-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!activeCategory || isCollapsed ? (
                            <motion.div
                                key="logo"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center gap-3 px-2"
                            >
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="w-9 h-9 bg-amber rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105 shadow-[0_4px_12px_rgba(232,168,56,0.3)]">
                                        📷
                                    </div>
                                    {!isCollapsed && (
                                        <span className="font-serif text-[18px] text-[var(--text)] tracking-tight whitespace-nowrap">
                                            Photo<span className="text-amber">Toolkit</span>
                                        </span>
                                    )}
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="back"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onClick={() => setActiveCategory(null)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text)] transition-colors w-full"
                            >
                                <ChevronLeft size={20} className="text-amber" />
                                <span className="font-bold text-[15px]">{categoryTitle}</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Area */}
                <div className="flex-1 px-3 py-4 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeCategory === 'tools' && !isCollapsed ? (
                            <motion.div
                                key="tools-filters"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 pb-20 overflow-y-auto premium-scrollbar h-full pr-4"
                            >
                                {/* 도구 타입 탭 */}
                                <div className="space-y-1">
                                    {[
                                        { id: 'all', name: '전체 도구', icon: Monitor },
                                        { id: 'official', name: '추천 도구', icon: Sparkles },
                                        { id: 'community', name: '커뮤니티 도구', icon: Layers }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => updateFilter('type', tab.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all group",
                                                currentType === tab.id
                                                    ? "text-amber bg-amber-glow font-bold"
                                                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                                            )}
                                        >
                                            <tab.icon size={18} className={currentType === tab.id ? "text-amber" : "text-[var(--text-tertiary)] group-hover:text-[var(--text)]"} />
                                            <span className="text-[14px]">{tab.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="h-px bg-[var(--border)]/30 mx-2" />

                                {/* 접이식 필터 섹션들 */}
                                <div className="space-y-4">
                                    {/* Categories */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setIsCatsOpen(!isCatsOpen)}
                                            className="flex items-center justify-between w-full px-2 group"
                                        >
                                            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--text-secondary)]/50 group-hover:text-amber transition-colors">Categories</span>
                                            {isCatsOpen ? <ChevronLeft size={14} className="rotate-270" /> : <ChevronRight size={14} />}
                                        </button>
                                        <AnimatePresence>
                                            {isCatsOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden space-y-1"
                                                >
                                                    {["전체", ...categories.map(c => c.name)].map((cat) => (
                                                        <button
                                                            key={cat}
                                                            onClick={() => updateFilter('category', cat)}
                                                            className={cn(
                                                                "w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group",
                                                                currentCat === cat
                                                                    ? 'bg-amber/10 text-amber'
                                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--text-secondary)]/5 hover:text-[var(--text)]'
                                                            )}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Platforms */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setIsPlatsOpen(!isPlatsOpen)}
                                            className="flex items-center justify-between w-full px-2 group"
                                        >
                                            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--text-secondary)]/50 group-hover:text-amber transition-colors">Platforms</span>
                                            {isPlatsOpen ? <ChevronLeft size={14} className="rotate-270" /> : <ChevronRight size={14} />}
                                        </button>
                                        <AnimatePresence>
                                            {isPlatsOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden space-y-1"
                                                >
                                                    {["전체", ...PLATFORMS].map((plat) => (
                                                        <button
                                                            key={plat}
                                                            onClick={() => updateFilter('platform', plat)}
                                                            className={cn(
                                                                "w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group",
                                                                currentPlat === plat
                                                                    ? 'bg-[var(--text)] text-[var(--bg)]'
                                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--text-secondary)]/5 hover:text-[var(--text)]'
                                                            )}
                                                        >
                                                            {plat}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Pricing */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setIsPricingOpen(!isPricingOpen)}
                                            className="flex items-center justify-between w-full px-2 group"
                                        >
                                            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--text-secondary)]/50 group-hover:text-amber transition-colors">Pricing</span>
                                            {isPricingOpen ? <ChevronLeft size={14} className="rotate-270" /> : <ChevronRight size={14} />}
                                        </button>
                                        <AnimatePresence>
                                            {isPricingOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden space-y-1"
                                                >
                                                    {[
                                                        { id: "전체", label: "모든 가격" },
                                                        { id: "free", label: "무료 (Free)" },
                                                        { id: "paid", label: "유료 (Purchase)" },
                                                        { id: "subscription", label: "구독 (Sub)" }
                                                    ].map((p) => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => updateFilter('pricing', p.id)}
                                                            className={cn(
                                                                "w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group",
                                                                currentPricing === p.id
                                                                    ? 'bg-[var(--text)] text-[var(--bg)]'
                                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--text-secondary)]/5 hover:text-[var(--text)]'
                                                            )}
                                                        >
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.nav
                                key={activeCategory || 'main'}
                                initial={{ opacity: 0, x: activeCategory ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: activeCategory ? -20 : 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-1.5 overflow-y-auto no-scrollbar"
                            >
                                {currentMenu.map((item: any) => {
                                    const isMain = !activeCategory;
                                    const isActive = item.href === pathname;

                                    if (isMain) {
                                        const isDisabled = !item.active;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    if (isDisabled) return;
                                                    setActiveCategory(item.id);
                                                    if (item.href) router.push(item.href);
                                                }}
                                                disabled={isDisabled}
                                                className={cn(
                                                    "w-full flex items-center gap-3.5 px-3.5 py-4 rounded-xl transition-all relative group text-[var(--text-secondary)]",
                                                    isDisabled
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]",
                                                    activeCategory === item.id && "bg-[var(--bg-secondary)] text-[var(--text)]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] transition-colors",
                                                    !isDisabled && "group-hover:bg-amber-glow group-hover:text-amber",
                                                    activeCategory === item.id ? "text-amber bg-amber-glow" : "text-[var(--text-tertiary)]"
                                                )}>
                                                    <item.icon size={20} />
                                                </div>
                                                {!isCollapsed && (
                                                    <div className="flex flex-col items-start translate-y-[1px] flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[14px] font-bold leading-none">{item.name}</span>
                                                            {isDisabled && (
                                                                <span className="text-[9px] px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-md text-[var(--text-tertiary)] font-bold">SOON</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-[var(--text-tertiary)] mt-1">{item.desc}</span>
                                                    </div>
                                                )}
                                                {!isCollapsed && !isDisabled && <ChevronRight size={14} className={cn("ml-auto text-[var(--text-tertiary)] transition-transform", activeCategory === item.id ? "rotate-90 text-amber" : "opacity-0 group-hover:opacity-100")} />}
                                            </button>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3.5 px-3.5 py-3.5 rounded-xl transition-all relative group",
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
                                            {!isCollapsed && <span className="text-[14px]">{item.name}</span>}
                                            {isActive && !isCollapsed && (
                                                <div className="absolute right-3 w-1.5 h-1.5 bg-amber rounded-full" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-[var(--border)] space-y-1.5 shrink-0">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-all group"
                    >
                        <div className="shrink-0 transition-transform group-hover:scale-110">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </div>
                        {!isCollapsed && <span className="text-[14px] flex-1 text-left">테마 전환</span>}
                    </button>

                    <Link href="/settings" className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-all group">
                        <Settings size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-[14px]">설정</span>}
                    </Link>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-amber hover:border-amber transition-all shadow-sm md:flex hidden z-10"
                >
                    <ChevronRight size={14} className={cn("transition-transform duration-300", !isCollapsed && "rotate-180")} />
                </button>
            </aside>

            {/* Mobile Bottom Navigation (Tab Bar) */}
            <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-[var(--bg)]/80 backdrop-blur-xl border-t border-[var(--border)] z-50 flex items-center justify-around px-4 md:hidden pb-safe">
                {navigation.main.map((item) => {
                    const isActive = activeCategory === item.id;
                    const isDisabled = !item.active;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (isDisabled) return;
                                if (activeCategory === item.id) {
                                    setActiveCategory(null);
                                } else {
                                    setActiveCategory(item.id);
                                    if (item.href) router.push(item.href);
                                }
                            }}
                            className={cn(
                                "flex flex-col items-center gap-1 min-w-[64px] transition-all relative",
                                isActive ? "text-amber" : "text-[var(--text-tertiary)]",
                                isDisabled && "opacity-40 grayscale"
                            )}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-indicator"
                                    className="absolute -top-1 w-8 h-0.5 bg-amber rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
