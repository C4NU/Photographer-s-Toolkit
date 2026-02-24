"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Clock, Star } from "lucide-react";

const exhibitions = [
    {
        country: "KR 서울",
        title: "경계 없는 바다: 해양 사진전",
        venue: "사진미술관 PIBI",
        date: "~ 03.15",
        status: "진행 중",
        statusType: "ongoing",
        emoji: "🌊",
        gradient: "linear-gradient(135deg,#0a1628,#1a3a6a)"
    },
    {
        country: "JP 도쿄",
        title: "Sakura Chronicles 2026",
        venue: "Tokyo Photo Art Museum",
        date: "03.20 ~ 05.10",
        status: "예정",
        statusType: "upcoming",
        emoji: "🌸",
        gradient: "linear-gradient(135deg,#1a1040,#4a2060)"
    },
    {
        country: "KR 부산",
        title: "자연의 리듬: 사계절 포토에세이",
        venue: "부산시립미술관",
        date: "~ 04.20",
        status: "진행 중",
        statusType: "ongoing",
        emoji: "🌿",
        gradient: "linear-gradient(135deg,#0d1a0a,#2a4a1a)"
    },
    {
        country: "JP 교토",
        title: "街の詩: 도시를 읽는 시선들",
        venue: "京都国立近代美術館",
        date: "02.28 ~ 04.15",
        status: "곧 시작",
        statusType: "soon",
        emoji: "🏙️",
        gradient: "linear-gradient(135deg,#1a0a0d,#5a1a2a)"
    },
    {
        country: "KR 서울",
        title: "북쪽에서 온 빛: 스칸디나비아 사진전",
        venue: "세종문화회관 미술관",
        date: "~ 03.02",
        status: "진행 중",
        statusType: "ongoing",
        emoji: "❄️",
        gradient: "linear-gradient(135deg,#0a1a2a,#2a4a6a)"
    },
    {
        country: "JP 오사카",
        title: "Neon & Silence: 오사카의 두 얼굴",
        venue: "大阪市立美術館",
        date: "04.01 ~ 06.30",
        status: "예정",
        statusType: "upcoming",
        emoji: "✨",
        gradient: "linear-gradient(135deg,#1a1000,#4a3800)"
    }
];

export default function ExhibitionsPage() {
    return (
        <div className="pt-[60px] pb-24">
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="mb-14 text-center md:text-left">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">Exhibitions</div>
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-[var(--text)] mb-4">
                        지금 가볼 만한<br /><em className="italic text-amber">전시를 골랐습니다</em>
                    </h1>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
                        한국과 일본의 주요 사진·예술 전시를 매주 업데이트합니다.
                    </p>
                </div>

                {/* Featured Card */}
                <section className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden mb-12 grid grid-cols-1 md:grid-cols-2">
                    <div className="h-full min-h-[300px] flex items-center justify-center text-8xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1040] via-[#2d1b4e] to-[#8b2252]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--surface)] hidden md:block" />
                        <span className="relative z-10 drop-shadow-2xl">🌃</span>
                    </div>
                    <div className="p-10 md:p-16 flex flex-col justify-center">
                        <div className="text-[10px] font-bold tracking-[2px] uppercase text-amber mb-4">✦ FEATURED EXHIBITION</div>
                        <h2 className="font-serif text-3xl md:text-4xl text-[var(--text)] leading-tight mb-4">빛의 건축가:<br />도시를 담는 눈들</h2>
                        <div className="flex flex-col gap-2 mb-8">
                            <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                                <MapPin size={14} className="text-amber" /> 🏛️ 국립현대미술관 서울관
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-[var(--text-tertiary)] font-mono">
                                <Calendar size={14} /> 2026.01.15 — 2026.04.30
                            </div>
                        </div>
                        <button className="w-fit px-6 py-3 rounded-xl border-1.5 border-amber text-amber text-[13px] font-bold transition-all hover:bg-amber hover:text-[#0C0E12]">
                            전시 정보 보기 →
                        </button>
                    </div>
                </section>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <h3 className="font-serif text-2xl text-[var(--text)]">진행 중 · 예정 전시</h3>
                    <div className="flex gap-2 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                        {["전체", "🇰🇷 한국", "🇯🇵 일본"].map((c, i) => (
                            <button
                                key={i}
                                className={cn(
                                    "px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all",
                                    i === 0 ? "bg-amber text-[#0C0E12]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exhibitions.map((exh, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-[20px] overflow-hidden cursor-pointer transition-all hover:border-amber hover:-translate-y-1"
                        >
                            <div className="h-40 relative flex items-center justify-center text-5xl">
                                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: exh.gradient }} />
                                <span className="relative z-10">{exh.emoji}</span>
                            </div>
                            <div className="p-6">
                                <div className="text-[10px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] flex items-center gap-1.5 mb-2">
                                    {exh.country}
                                </div>
                                <h4 className="text-[15px] font-bold text-[var(--text)] mb-1 leading-tight">{exh.title}</h4>
                                <p className="text-[12px] text-[var(--text-secondary)] mb-4">{exh.venue}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                                    <span className="text-[11px] font-mono text-[var(--text-tertiary)]">{exh.date}</span>
                                    <span className={cn(
                                        "text-[9px] font-bold px-2.5 py-1 rounded-full",
                                        exh.statusType === 'ongoing' ? "bg-[#50c878]/15 text-[#50c878]" :
                                            exh.statusType === 'upcoming' ? "bg-amber/15 text-amber" :
                                                "bg-[#6496ff]/15 text-[#6496ff]"
                                    )}>
                                        {exh.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
