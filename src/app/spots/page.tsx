"use client";

import { useState } from "react";
import { Search, Filter, MapPin, Star, Clock, ChevronDown, Check } from "lucide-react";

const filterGroups = [
    {
        title: "국가",
        options: [
            { label: "한국", flag: "🇰🇷", count: 28 },
            { label: "일본", flag: "🇯🇵", count: 20 }
        ]
    },
    {
        title: "장르",
        options: [
            { label: "일출 · 골든아워", icon: "🌅" },
            { label: "야경", icon: "🌃" },
            { label: "시즌 꽃", icon: "🌸" },
            { label: "도시 풍경", icon: "🏙️" },
            { label: "자연 · 바다", icon: "🌊" }
        ]
    },
    {
        title: "최적 시간대",
        options: [
            { label: "이른 아침", icon: "🌄" },
            { label: "낮", icon: "☀️" },
            { label: "저녁", icon: "🌇" },
            { label: "야간", icon: "🌙" }
        ]
    }
];

const initialSpots = [
    {
        name: "남산 서울타워 전망대",
        location: "서울 용산구",
        emoji: "🌉",
        tags: ["야경", "도시 풍경"],
        peak: "골든아워",
        rating: 4.8,
        bestTime: "17:51",
        gradient: "linear-gradient(135deg,#0a1628,#1a3a6a)"
    },
    {
        name: "경복궁 근정전",
        location: "서울 종로구",
        emoji: "⛩️",
        tags: ["문화유산", "시즌 꽃"],
        peak: "이른 아침",
        rating: 4.9,
        bestTime: "07:14",
        gradient: "linear-gradient(135deg,#1a1040,#4a2060)"
    },
    {
        name: "광안리 해수욕장",
        location: "부산 수영구",
        emoji: "🌊",
        tags: ["야경", "바다"],
        peak: "일몰",
        rating: 4.7,
        bestTime: "18:39",
        gradient: "linear-gradient(135deg,#0d2a1a,#2a6a4a)"
    },
    {
        name: "후시미이나리 타이샤",
        location: "교토, 일본",
        emoji: "⛩️",
        tags: ["문화유산", "일본 추천"],
        peak: "이른 아침",
        rating: 4.9,
        bestTime: "06:30",
        gradient: "linear-gradient(135deg,#1a0a0a,#5a2020)"
    },
    {
        name: "도쿄 스카이트리 전망대",
        location: "도쿄 스미다구, 일본",
        emoji: "🗼",
        tags: ["야경", "도시 풍경"],
        peak: "블루아워",
        rating: 4.6,
        bestTime: "18:39",
        gradient: "linear-gradient(135deg,#0a1a2a,#1a4a7a)"
    },
    {
        name: "성산일출봉",
        location: "제주 서귀포시",
        emoji: "⛰️",
        tags: ["자연", "세계유산"],
        peak: "일출",
        rating: 4.9,
        bestTime: "07:20",
        gradient: "linear-gradient(135deg,#1a0d00,#5a3a10)"
    }
];

export default function ShootingSpotsPage() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["한국", "일본", "일출 · 골든아워", "시즌 꽃", "이른 아침", "저녁"]);

    const toggleFilter = (label: string) => {
        setSelectedFilters(prev =>
            prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
        );
    };

    return (
        <div className="pt-[60px] pb-24">
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="mb-14">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">Shooting Spots</div>
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-[var(--text)] mb-4">
                        당신만 아는<br /><em className="italic text-amber">그 장소를 찾아서</em>
                    </h1>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
                        공식 명소부터 숨은 명소까지. 사진작가가 직접 큐레이팅한 촬영 스팟 가이드.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Filters Sidebar */}
                    <aside className="space-y-4 sticky top-24 h-fit">
                        {filterGroups.map((group, i) => (
                            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
                                <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--text-tertiary)] mb-4">{group.title}</h3>
                                <div className="space-y-2">
                                    {group.options.map((opt, j) => {
                                        const isChecked = selectedFilters.includes(opt.label);
                                        return (
                                            <div
                                                key={j}
                                                onClick={() => toggleFilter(opt.label)}
                                                className="flex items-center justify-between py-2 group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)] group-hover:text-[var(--text)] transition-colors">
                                                    <span className="text-sm">{'flag' in opt ? opt.flag : (opt as any).icon}</span>
                                                    {opt.label}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {'count' in opt && <span className="text-[10px] text-[var(--text-tertiary)] bg-[var(--pill-bg)] px-1.5 py-0.5 rounded leading-none">{opt.count}</span>}
                                                    <div className={cn(
                                                        "w-[18px] h-[18px] rounded-[5px] border-1.5 flex items-center justify-center transition-all",
                                                        isChecked ? "bg-amber border-amber text-[#0C0E12]" : "bg-[var(--bg-secondary)] border-[var(--border-secondary)] text-transparent"
                                                    )}>
                                                        <Check size={12} strokeWidth={4} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </aside>

                    {/* Spots Grid */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] text-[var(--text-secondary)]">총 <strong className="text-[var(--text)]">48개</strong> 스팟</span>
                            <div className="relative group">
                                <select className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-2 px-4 pr-10 text-[12px] text-[var(--text)] outline-none focus:border-amber appearance-none cursor-pointer">
                                    <option>추천순</option>
                                    <option>최신순</option>
                                    <option>평점순</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-tertiary)]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {initialSpots.map((spot, i) => (
                                <div key={i} className="group flex flex-col bg-[var(--card-bg)] border border-[var(--border)] rounded-[20px] overflow-hidden transition-all hover:-translate-y-1 hover:border-amber">
                                    <div className="h-[140px] relative flex items-center justify-center text-6xl">
                                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: spot.gradient }} />
                                        <span className="relative z-10">{spot.emoji}</span>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-[15px] font-bold text-[var(--text)] mb-1">{spot.name}</h3>
                                        <div className="text-[11px] text-[var(--text-tertiary)] mb-4 flex items-center gap-1.5">
                                            <MapPin size={12} /> {spot.location}
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {spot.tags.map((tag, j) => (
                                                <span key={j} className="text-[10px] px-2 py-0.5 rounded-lg bg-[var(--pill-bg)] text-[var(--pill-text)]">
                                                    {tag}
                                                </span>
                                            ))}
                                            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#50c878]/10 text-[#50c878]">
                                                {spot.peak}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="px-5 py-3.5 border-t border-[var(--border)] flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber">
                                            <Star size={14} fill="currentColor" /> {spot.rating}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-tertiary)]">
                                            <Clock size={12} /> {spot.bestTime} → 최적
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
