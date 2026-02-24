"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flower2, Leaf, Sun, Snowflake, MapPin, Star, Info, Zap } from "lucide-react";

const seasons = [
    { id: 'spring', name: '봄', emoji: '🌸', color: '#ffb7c5', months: [3, 4, 5], title: '🌸 봄의 시작과 개화' },
    { id: 'summer', name: '여름', emoji: '🌿', color: '#50c878', months: [6, 7, 8], title: '🌿 푸른 녹음과 야경' },
    { id: 'autumn', name: '가을', emoji: '🍂', color: '#ff7e5f', months: [9, 10, 11], title: '🍂 단풍과 절정의 색채' },
    { id: 'winter', name: '겨울', emoji: '❄️', color: '#a5f3fc', months: [12, 1, 2], title: '❄️ 설경과 차가운 미학' },
];

const seasonConcepts = {
    spring: [
        { title: "벚꽃 스냅", desc: "낮은 채도의 부드러운 핑크톤", tags: ["인물", "풍경"] },
        { title: "야간 개장 고궁", desc: "조명과 어우러진 밤 벚꽃", tags: ["야경", "장노출"] },
    ],
    summer: [
        { title: "은하수 추적", desc: "여름 대삼각형과 은하수", tags: ["천체", "야외"] },
        { title: "비 오는 날의 반영", desc: "도심의 빛과 빗물 반영", tags: ["스트릿", "반영"] },
    ],
    autumn: [
        { title: "오색 단풍", desc: "압도적인 컬러감의 산세", tags: ["풍경", "드론"] },
        { title: "안개 자욱한 새벽", desc: "몽환적인 분위기의 숲", tags: ["새벽", "감성"] },
    ],
    winter: [
        { title: "함박눈 스냅", desc: "눈 내리는 순간의 플래시 촬영", tags: ["인물", "스냅"] },
        { title: "상고대와 서리꽃", desc: "차가운 공기가 만든 예술", tags: ["매크로", "등산"] },
    ]
};

// 캘린더 더미 데이터 생성 (특정 일자 강조용)
const getHighlightedDays = (seasonId: string) => {
    if (seasonId === 'spring') return [25, 26, 27, 28, 29, 30, 31]; // 3월 말 벚꽃
    if (seasonId === 'autumn') return [15, 16, 17, 18, 19, 20]; // 11월 중순 단풍
    return [1, 2, 3];
};

export default function SeasonCalendarPage() {
    const [activeSeason, setActiveSeason] = useState(seasons[0]);
    const [activeCountry, setActiveCountry] = useState("한국");
    const [ideas, setIdeas] = useState<string[]>([]);
    const [newIdea, setNewIdea] = useState("");

    const handleAddIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (newIdea.trim()) {
            setIdeas([...ideas, newIdea.trim()]);
            setNewIdea("");
        }
    };

    return (
        <div className="pt-0 pb-24">
            <div className="max-w-7xl mx-auto px-8 py-20">
                {/* Header Section */}
                <div className="mb-14">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">Season Calendar</div>
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-[var(--text)] mb-4">
                        지금 피어나는<br /><em className="italic text-amber">계절을 담으세요</em>
                    </h1>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
                        사계절의 흐름을 일 단위로 파악하고, 당신만의 촬영 아이디어를 브레인스토밍해 보세요.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex gap-2 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-fit">
                        {seasons.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSeason(s)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[13px] font-medium transition-all flex items-center gap-2",
                                    activeSeason.id === s.id
                                        ? "bg-amber text-[#0C0E12] font-bold shadow-lg"
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

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
                    <div className="space-y-8">
                        {/* Daily Calendar View */}
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-serif text-2xl text-[var(--text)] flex items-center gap-3">
                                    {activeSeason.title}
                                    <span className="text-sm font-sans text-[var(--text-tertiary)] font-normal">2026년 3월 일차별 현황</span>
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-amber" />
                                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold">절정</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)]" />
                                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold">대기</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-3">
                                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
                                    <div key={d} className="text-[10px] font-bold text-[var(--text-tertiary)] text-center pb-2">{d}</div>
                                ))}
                                {Array.from({ length: 31 }).map((_, i) => {
                                    const day = i + 1;
                                    const isHighlighted = getHighlightedDays(activeSeason.id).includes(day);
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.01 }}
                                            className={cn(
                                                "aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group/day",
                                                isHighlighted
                                                    ? "bg-amber border-amber shadow-[0_0_20px_rgba(232,168,56,0.2)]"
                                                    : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-amber/50"
                                            )}
                                        >
                                            <span className={cn("text-sm font-bold", isHighlighted ? "text-[#0C0E12]" : "text-[var(--text)] group-hover/day:text-amber")}>{day}</span>
                                            {isHighlighted && <span className="text-[8px] font-bold text-[#0C0E12]/60 uppercase tracking-tighter">Peak</span>}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Seasonal Concepts Feed */}
                        <div>
                            <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-4">Recommended Concepts</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {seasonConcepts[activeSeason.id as keyof typeof seasonConcepts].map((concept, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-amber transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="text-lg font-bold text-[var(--text)] group-hover:text-amber transition-colors">{concept.title}</h4>
                                            <div className="flex gap-1.5">
                                                {concept.tags.map(t => (
                                                    <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-tertiary)] text-[9px] font-bold">#{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{concept.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Brainstorming Board */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 shadow-xl">
                            <h3 className="font-serif text-2xl text-[var(--text)] mb-2 flex items-center gap-2">
                                <Zap size={20} className="text-amber" /> 아이디어 보드
                            </h3>
                            <p className="text-[13px] text-[var(--text-tertiary)] mb-6 leading-relaxed">
                                {activeSeason.name} 촬영에 대한 구상을 자유롭게 기록해 보세요.
                            </p>

                            <form onSubmit={handleAddIdea} className="relative mb-6">
                                <input
                                    type="text"
                                    value={newIdea}
                                    onChange={(e) => setNewIdea(e.target.value)}
                                    placeholder="예: 교토 철도길 벚꽃 스냅..."
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 pl-4 pr-12 text-sm text-[var(--text)] outline-none focus:border-amber transition-colors"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-amber text-[#0C0E12] flex items-center justify-center hover:opacity-90 transition-opacity">
                                    <Star size={14} fill="currentColor" />
                                </button>
                            </form>

                            <div className="flex flex-wrap gap-2">
                                {ideas.length > 0 ? ideas.map((idea, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="px-3 py-1.5 rounded-lg bg-amber-dim border border-amber/30 text-amber text-xs font-medium flex items-center gap-2"
                                    >
                                        {idea}
                                        <button onClick={() => setIdeas(ideas.filter((_, idx) => idx !== i))} className="hover:text-white">×</button>
                                    </motion.span>
                                )) : (
                                    <div className="w-full py-10 border-2 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-2">
                                        <Info size={24} className="text-[var(--text-tertiary)]" />
                                        <span className="text-xs text-[var(--text-tertiary)]">아직 기록된 아이디어가 없습니다.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* External Resources Summary */}
                        <div className="p-6 rounded-3xl bg-amber-dim/30 border border-amber/10">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber mb-3 flex items-center gap-2">
                                <MapPin size={14} /> 실시간 예보 리소스
                            </h4>
                            <div className="space-y-3">
                                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                    웨더뉴스 단풍 레이더 및 SAKURA MAP의 최신 데이터를 페이지 하단에서 확인하실 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* External Resources Grid (Moved to bottom) */}
                <div className="pt-20 border-t border-[var(--border)] mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-serif text-2xl text-[var(--text)]">촬영 전 체크리스트</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[10px] font-bold text-[var(--text-tertiary)]">2026.02 기준</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "일본 벚꽃 지도", source: "CURBON", url: "https://www.curbon.jp/products/sakuramap", icon: Flower2 },
                            { title: "웨더뉴스 단풍 정보", source: "WeatherNews", url: "https://weathernews.jp/koyo/?fm=header", icon: Leaf },
                            { title: "세이세키 사쿠라가오카 지도", source: "Tama City", url: "https://www.city.tama.lg.jp/kanko/midokoro/shiki/1006521.html", icon: MapPin }
                        ].map((res, i) => (
                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-amber transition-all flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-amber transition-colors">
                                    <res.icon size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-[var(--text)]">{res.title}</div>
                                    <div className="text-[10px] text-[var(--text-tertiary)]">{res.source}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
