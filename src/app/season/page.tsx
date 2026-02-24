"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flower2, Leaf, Sun, Snowflake, MapPin, Star } from "lucide-react";

const seasons = [
    { id: 'cherry', name: '벚꽃', emoji: '🌸', title: '🌸 벚꽃 개화 예측 캘린더' },
    { id: 'autumn', name: '단풍', emoji: '🍂', title: '🍂 단풍 절정 예측 캘린더' },
    { id: 'canola', name: '유채꽃', emoji: '🌼', title: '🌼 유채꽃 개화 예측 캘린더' },
    { id: 'snow', name: '설경', emoji: '❄️', title: '❄️ 설경 촬영 최적 기간' },
];

const seasonData: Record<string, number[]> = {
    cherry: [0, 0, 60, 90, 30, 0, 0, 0, 0, 0, 0, 0],
    autumn: [0, 0, 0, 0, 0, 0, 0, 0, 30, 85, 60, 10],
    canola: [0, 0, 40, 80, 50, 0, 0, 0, 0, 0, 0, 0],
    snow: [60, 70, 20, 0, 0, 0, 0, 0, 0, 0, 20, 55],
};

const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const recommendations = [
    {
        name: "경복궁 & 창덕궁",
        location: "서울, 한국",
        emoji: "🌸",
        gradient: "linear-gradient(135deg,#1a1040,#4a2060,#8b4a8a)",
        badge: "절정 예상",
        meta: ["3월 말 ~ 4월 초", "골든아워 추천"]
    },
    {
        name: "철도길 벚꽃 터널",
        location: "경주, 한국",
        emoji: "🌸",
        gradient: "linear-gradient(135deg,#0d2a1a,#1a4a2e,#2d7a4a)",
        badge: "인기 명소",
        meta: ["4월 1일 ~ 4월 10일", "이른 아침 추천"]
    },
    {
        name: "마루야마 공원",
        location: "교토, 일본",
        emoji: "🌸",
        gradient: "linear-gradient(135deg,#2a1a0d,#4a3020,#8a6040)",
        badge: "일본 추천",
        meta: ["3월 25일 ~ 4월 5일", "야간 조명 명소"]
    }
];

export default function SeasonCalendarPage() {
    const [activeSeason, setActiveSeason] = useState(seasons[0]);
    const [activeCountry, setActiveCountry] = useState("한국");

    return (
        <div className="pt-[60px] pb-24">
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="mb-14">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">Season Calendar</div>
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-[var(--text)] mb-4">
                        지금 피어나는<br /><em className="italic text-amber">계절을 담으세요</em>
                    </h1>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
                        한국과 일본의 벚꽃, 단풍, 유채꽃 시기를 기상 데이터 기반으로 예측합니다.
                    </p>
                </div>

                <div className="space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-2 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-fit">
                            {seasons.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSeason(s)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all flex items-center gap-2",
                                        activeSeason.id === s.id
                                            ? "bg-amber text-[#0C0E12] font-bold"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                                    )}
                                >
                                    {s.emoji} {s.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {["한국", "일본", "전체"].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setActiveCountry(c)}
                                    className={cn(
                                        "px-5 py-2 rounded-xl border text-[13px] font-medium transition-all",
                                        activeCountry === c
                                            ? "bg-amber-dim border-amber text-amber"
                                            : "bg-[var(--pill-bg)] border-[var(--border)] text-[var(--text-secondary)]"
                                    )}
                                >
                                    {c === "한국" ? "🇰🇷 한국" : c === "일본" ? "🇯🇵 일본" : "🌏 전체"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Heatmap Container */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <h3 className="font-serif text-2xl text-[var(--text)]">{activeSeason.title}</h3>
                            <span className="px-2.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full text-[11px] font-bold text-[var(--text-tertiary)]">2026년</span>
                        </div>

                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-4">
                            {months.map((month, i) => {
                                const val = seasonData[activeSeason.id][i];
                                const opacity = val / 100;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-full h-20 bg-[var(--bg-secondary)] rounded-xl relative overflow-hidden group">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${val}%` }}
                                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                                className="absolute bottom-0 inset-x-0 rounded-t-lg"
                                                style={{
                                                    backgroundColor: val > 70 ? 'var(--color-amber)' : val > 30 ? 'rgba(232,168,56,0.6)' : 'rgba(232,168,56,0.25)',
                                                    opacity: val > 0 ? 1 : 0
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <span className="text-[10px] font-mono font-bold text-amber">{val > 0 ? `${val}%` : ''}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase text-[var(--text-tertiary)]">{month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 flex-wrap">
                        <span className="text-xs text-[var(--text-tertiary)]">개화 가능성:</span>
                        {[
                            { label: "낮음", color: "rgba(232,168,56,0.25)" },
                            { label: "중간", color: "rgba(232,168,56,0.6)" },
                            { label: "절정", color: "var(--color-amber)" }
                        ].map((l, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-5 h-3 rounded-[3px]" style={{ backgroundColor: l.color }} />
                                <span className="text-[11px] text-[var(--text-tertiary)]">{l.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    <div className="pt-10">
                        <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">추천 촬영 스팟</div>
                        <h3 className="font-serif text-2xl text-[var(--text)] mb-8">이 시즌 최고의 장소</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.map((spot, i) => (
                                <div key={i} className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-[20px] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:border-amber hover:shadow-2xl">
                                    <div className="h-40 relative overflow-hidden flex items-center justify-center text-6xl">
                                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: spot.gradient }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                        <span className="relative z-10">{spot.emoji}</span>
                                        <span className="absolute top-3 left-3 bg-amber text-[#0C0E12] text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wider">{spot.badge}</span>
                                    </div>

                                    <div className="p-5">
                                        <h4 className="text-[15px] font-bold text-[var(--text)] mb-1">{spot.name}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-3">
                                            <MapPin size={12} /> {spot.location}
                                        </div>
                                        <div className="flex gap-2">
                                            {spot.meta.map((m, j) => (
                                                <span key={j} className={cn(
                                                    "px-2.5 py-1 rounded-lg text-[10px] font-medium",
                                                    j === 0 ? "bg-[#50c878]/10 text-[#50c878]" : "bg-[var(--pill-bg)] text-[var(--pill-text)]"
                                                )}>
                                                    {m}
                                                </span>
                                            ))}
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
