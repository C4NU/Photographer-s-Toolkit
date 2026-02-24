"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Zap, Info } from "lucide-react";

// 샘플 데이터
const cityData: Record<string, { sr: string; ss: string; lat: number }> = {
    '서울': { sr: '07:14', ss: '18:39', lat: 37.56 },
    '부산': { sr: '07:10', ss: '18:44', lat: 35.10 },
    '제주': { sr: '07:15', ss: '18:52', lat: 33.48 },
    '경주': { sr: '07:08', ss: '18:41', lat: 35.85 },
    '전주': { sr: '07:12', ss: '18:42', lat: 35.82 },
    '강릉': { sr: '07:05', ss: '18:35', lat: 37.75 },
    '도쿄': { sr: '06:22', ss: '17:55', lat: 35.68 },
    '교토': { sr: '06:38', ss: '18:07', lat: 35.01 },
    '오사카': { sr: '06:40', ss: '18:09', lat: 34.69 },
    '삿포로': { sr: '06:10', ss: '17:35', lat: 43.06 },
    '후쿠오카': { sr: '07:06', ss: '18:22', lat: 33.59 },
    '나라': { sr: '06:39', ss: '18:07', lat: 34.68 },
};

function addMinutes(time: string, mins: number) {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + mins;
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const countries = [
    { name: "한국", flag: "🇰🇷", cities: ["서울", "부산", "제주", "경주", "전주", "강릉"] },
    { name: "일본", flag: "🇯🇵", cities: ["도쿄", "교토", "오사카", "삿포로", "후쿠오카", "나라"] }
];

export default function GoldenHourPage() {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [selectedCity, setSelectedCity] = useState("서울");
    const [selectedDate, setSelectedDate] = useState("2026-02-24");
    const [results, setResults] = useState<any>(null);

    const calculate = () => {
        const data = cityData[selectedCity] || cityData['서울'];
        const res = {
            sunrise: data.sr,
            sunset: data.ss,
            blueAM: addMinutes(data.sr, -30),
            goldenAM: `${data.sr}–${addMinutes(data.sr, 48)}`,
            goldenPM: `${addMinutes(data.ss, -48)}–${data.ss}`,
            bluePM: `${data.ss}–${addMinutes(data.ss, 30)}`,
            score: 78 // 가상 스코어
        };
        setResults(res);
    };

    useEffect(() => {
        calculate();
    }, [selectedCity, selectedDate]);

    return (
        <div className="pt-0 pb-24">
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="mb-14">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">Golden Hour Calculator</div>
                    <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-[var(--text)] mb-4">
                        오늘 촬영하기<br /><em className="italic text-amber">가장 좋은 시간</em>은?
                    </h1>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
                        도시와 날짜를 선택하면 일출·일몰·골든아워·블루아워를 즉시 계산합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
                    {/* Input Panel */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sticky top-24">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-2.5 block">국가 선택</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {countries.map(c => (
                                        <button
                                            key={c.name}
                                            onClick={() => {
                                                setSelectedCountry(c);
                                                setSelectedCity(c.cities[0]);
                                            }}
                                            className={cn(
                                                "py-2.5 rounded-xl border text-xs font-medium transition-all",
                                                selectedCountry.name === c.name
                                                    ? "bg-amber-dim border-amber text-amber"
                                                    : "bg-[var(--pill-bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-amber/50"
                                            )}
                                        >
                                            {c.flag} {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-2.5 block">도시 선택</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedCountry.cities.map(city => (
                                        <button
                                            key={city}
                                            onClick={() => setSelectedCity(city)}
                                            className={cn(
                                                "py-2.5 rounded-xl border text-xs font-medium transition-all",
                                                selectedCity === city
                                                    ? "bg-amber-dim border-amber text-amber"
                                                    : "bg-[var(--pill-bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-amber/50"
                                            )}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-2.5 block">날짜</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--text)] outline-none focus:border-amber transition-colors appearance-none"
                                    />
                                    <CalendarIcon size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
                                </div>
                            </div>

                            <button
                                onClick={calculate}
                                className="w-full py-3.5 bg-amber text-[#0C0E12] rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                            >
                                <Zap size={16} fill="currentColor" /> 계산하기
                            </button>

                            <div className="pt-5 border-t border-[var(--border)]">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)]">촬영 날씨 스코어</label>
                                    <span className="font-mono text-sm font-bold text-amber">{results?.score}</span>
                                </div>
                                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${results?.score}%` }}
                                        className="h-full bg-gradient-to-r from-[#50c878] to-amber rounded-full"
                                    />
                                </div>
                                <p className="text-[11px] text-[var(--text-tertiary)] mt-2">맑음 · 구름 거의 없음 · 촬영 최적</p>
                            </div>
                        </div>
                    </div>

                    {/* Result Panel */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl">
                        {/* Sky Visual */}
                        <div className="h-[200px] relative overflow-hidden sky-bg transition-all duration-1000">
                            <style jsx>{`
                .sky-bg {
                  background: linear-gradient(180deg, #0a0a1a 0%, #1a1040 20%, #2d1b4e 35%, #8b3a4a 50%, #e8734a 65%, #f4a444 78%, #ffd86e 90%, #fff8d0 100%);
                }
                :global(.light) .sky-bg {
                   background: linear-gradient(180deg, #87CEEB 0%, #98d8f5 30%, #fcd280 55%, #f4a444 70%, #e8734a 82%, #c45a3a 100%);
                }
              `}</style>

                            <motion.div
                                animate={{ bottom: results ? -20 : -100 }}
                                className="absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[radial-gradient(circle,#fff9c4,#ffd86e_40%,rgba(255,180,50,0)_70%)] shadow-[0_0_60px_20px_rgba(255,200,80,0.5)]"
                            />
                            <div className="absolute bottom-0 inset-x-0 h-10 bg-[var(--surface)] rounded-t-[50%] scale-x-150 transform origin-bottom" />

                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-mono text-white/90">
                                {selectedCity} · {selectedDate.replace(/-/g, '.')}
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "블루아워 (새벽)", time: results?.blueAM, color: "#1a3a6a", desc: "일출 30분 전, 부드러운 청색 빛" },
                                    { label: "일출", time: results?.sunrise, color: "#e8734a", desc: "태양이 수평선 위로 오르는 순간" },
                                    { label: "골든아워 (아침)", time: results?.goldenAM, color: "var(--color-amber)", desc: "황금빛 조명, 사진의 마법 시간" },
                                    { label: "골든아워 (저녁)", time: results?.goldenPM, color: "var(--color-amber)", desc: "저녁 황금빛, 가장 인기 있는 시간" },
                                    { label: "일몰", time: results?.sunset, color: "#e8734a", desc: "태양이 지는 순간, 드라마틱한 색감" },
                                    { label: "블루아워 (저녁)", time: results?.bluePM, color: "#1a3a6a", desc: "일몰 후 30분, 도시 야경과 환상의 조화" },
                                ].map((slot, i) => (
                                    <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5">
                                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slot.color }} />
                                            {slot.label}
                                        </div>
                                        <div className="font-mono text-2xl text-[var(--text)] mb-1">{slot.time}</div>
                                        <div className="text-[11px] text-[var(--text-tertiary)]">{slot.desc}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-[var(--border)]">
                                <div className="text-xs font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-4 flex items-center gap-2">
                                    <CalendarIcon size={14} /> 이번달 최적 촬영일
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                                    {Array.from({ length: 28 }).map((_, i) => {
                                        const day = i + 1;
                                        const isToday = day === 24;
                                        const score = [45, 80, 92, 55, 70, 88, 75, 60, 85, 40, 78, 90, 65, 82, 50, 70, 95, 60, 45, 88, 72, 80, 55, 68, 90, 40, 75, 85][i];
                                        const dotColor = score > 80 ? '#50c878' : score > 60 ? '#E8A838' : '#555';
                                        return (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex-shrink-0 w-12 py-3 border rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer hover:border-amber",
                                                    isToday ? "bg-amber border-amber" : "bg-[var(--bg-secondary)] border-[var(--border)]"
                                                )}
                                            >
                                                <span className={cn("text-[9px] uppercase", isToday ? "text-[#0C0E12] font-bold" : "text-[var(--text-tertiary)]")}>
                                                    {["일", "월", "화", "수", "목", "금", "토"][day % 7]}
                                                </span>
                                                <span className={cn("text-base font-bold", isToday ? "text-[#0C0E12]" : "text-[var(--text)]")}>{day}</span>
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isToday ? '#0C0E12' : dotColor }} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
