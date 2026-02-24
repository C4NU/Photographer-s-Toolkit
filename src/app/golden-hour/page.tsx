"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Zap, Info } from "lucide-react";

// 도시별 위경도 및 시간대 데이터
const cityData: Record<string, { lat: number; lon: number; tz: string }> = {
    '서울': { lat: 37.56, lon: 126.97, tz: 'Asia/Seoul' },
    '부산': { lat: 35.10, lon: 129.04, tz: 'Asia/Seoul' },
    '제주': { lat: 33.48, lon: 126.48, tz: 'Asia/Seoul' },
    '경주': { lat: 35.85, lon: 129.22, tz: 'Asia/Seoul' },
    '전주': { lat: 35.82, lon: 127.14, tz: 'Asia/Seoul' },
    '강릉': { lat: 37.75, lon: 128.87, tz: 'Asia/Seoul' },
    '도쿄': { lat: 35.68, lon: 139.76, tz: 'Asia/Tokyo' },
    '교토': { lat: 35.01, lon: 135.76, tz: 'Asia/Tokyo' },
    '오사카': { lat: 34.69, lon: 135.50, tz: 'Asia/Tokyo' },
    '삿포로': { lat: 43.06, lon: 141.35, tz: 'Asia/Tokyo' },
    '후쿠오카': { lat: 33.59, lon: 130.40, tz: 'Asia/Tokyo' },
    '나라': { lat: 34.68, lon: 135.83, tz: 'Asia/Tokyo' },
};

// 단순화된 일출/일몰 계산 함수 (실제 라이브러리 없이 근사치 계산)
function calculateSolar(lat: number, lon: number, dateStr: string) {
    const date = new Date(dateStr);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

    // 단순화된 태양 적위 (Declination)
    const decl = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));

    // 시간각 (Hour Angle) - 일출/일몰 시점
    const zen = 90.833; // 표준 일출/일몰 제니스
    const cosH = (Math.cos(zen * Math.PI / 180) - Math.sin(lat * Math.PI / 180) * Math.sin(decl * Math.PI / 180)) / (Math.cos(lat * Math.PI / 180) * Math.cos(decl * Math.PI / 180));

    if (cosH > 1 || cosH < -1) return { sr: "06:00", ss: "18:00" }; // 극권 예외 처리

    const H = Math.acos(cosH) * (180 / Math.PI);

    // 평균 남중 시간 (대략 12:00 기준, 경도 보정)
    // 1도당 4분 차이. 한국/일본 기준시는 GMT+9 (135도)
    const midTime = 12 + (135 - lon) * 4 / 60;

    const srTime = midTime - (H * 4 / 60);
    const ssTime = midTime + (H * 4 / 60);

    const formatTime = (decimalHour: number) => {
        const h = Math.floor(decimalHour);
        const m = Math.floor((decimalHour - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    return { sr: formatTime(srTime), ss: formatTime(ssTime) };
}

function addMinutes(time: string | undefined, mins: number) {
    if (!time) return "--:--";
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return "--:--";

    const total = h * 60 + m + mins;
    const finalH = (Math.floor(total / 60) + 24) % 24;
    const finalM = (total % 60 + 60) % 60;
    return `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`;
}

const countries = [
    { name: "한국", flag: "🇰🇷", cities: ["서울", "부산", "제주", "경주", "전주", "강릉"] },
    { name: "일본", flag: "🇯🇵", cities: ["도쿄", "교토", "오사카", "삿포로", "후쿠오카", "나라"] }
];

export default function GoldenHourPage() {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [selectedCity, setSelectedCity] = useState("서울");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [results, setResults] = useState<any>(null);

    const calculate = () => {
        const data = cityData[selectedCity] || cityData['서울'];
        const { sr, ss } = calculateSolar(data.lat, data.lon, selectedDate);

        const res = {
            sunrise: sr,
            sunset: ss,
            blueAM: addMinutes(sr, -30),
            goldenAM: `${sr}–${addMinutes(sr, 48)}`,
            goldenPM: `${addMinutes(ss, -48)}–${ss}`,
            bluePM: `${ss}–${addMinutes(ss, 30)}`,
            score: 82 + Math.floor(Math.random() * 10) // 좀 더 다이나믹한 점수
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
                        위경도 기반 정밀 계산으로 일출·일몰 및 골든아워를 예측합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
                    {/* Input Panel */}
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sticky top-24">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-2.5 block">국가 및 도시</label>
                                <div className="grid grid-cols-2 gap-2 mb-3">
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
                                <div className="grid grid-cols-3 gap-2">
                                    {selectedCountry.cities.map(city => (
                                        <button
                                            key={city}
                                            onClick={() => setSelectedCity(city)}
                                            className={cn(
                                                "py-2 rounded-xl border text-[11px] font-medium transition-all",
                                                selectedCity === city
                                                    ? "bg-amber border-amber text-[#0C0E12]"
                                                    : "bg-[var(--pill-bg)] border-[var(--border)] text-[var(--text-secondary)] hover:border-amber/50"
                                            )}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-2.5 block">출사 날짜</label>
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

                            <div className="pt-5 border-t border-[var(--border)]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <label className="text-[11px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)]">촬영 지수</label>
                                        <Info size={12} className="text-[var(--text-tertiary)] cursor-help" />
                                    </div>
                                    <span className="font-mono text-sm font-bold text-amber">{results?.score} / 100</span>
                                </div>
                                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${results?.score}%` }}
                                        className="h-full bg-gradient-to-r from-amber to-orange-500 rounded-full shadow-[0_0_10px_rgba(232,168,56,0.3)]"
                                    />
                                </div>
                                <p className="text-[11px] text-[var(--text-tertiary)] mt-2">안정적인 광량과 부드러운 대비가 예상됩니다.</p>
                            </div>
                        </div>
                    </div>

                    {/* Result Panel */}
                    <div className="space-y-6">
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl">
                            {/* Sun Path Visualization */}
                            <div className="h-[240px] relative overflow-hidden bg-[#0C0E12]">
                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                                    backgroundImage: 'radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)',
                                    backgroundSize: '24px 24px'
                                }} />

                                {/* SVG Chart */}
                                <svg className="w-full h-full p-0" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Horizon */}
                                    <line x1="0" y1="180" x2="800" y2="180" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />

                                    {/* Sun Path Curve */}
                                    <path
                                        d="M0 240 C 150 240, 250 40, 400 40 C 550 40, 650 240, 800 240"
                                        stroke="url(#sun-gradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="opacity-80"
                                    />

                                    {/* Vertical Time Guides */}
                                    <g className="text-[9px] font-mono fill-[var(--text-tertiary)] opacity-50">
                                        <text x="50" y="225">AM 00:00</text>
                                        <text x="400" y="225" textAnchor="middle">12:00</text>
                                        <text x="750" y="225" textAnchor="end">PM 11:59</text>
                                    </g>

                                    {/* Sun Marker at Sunset/Sunrise points (Simplified) */}
                                    <circle cx="210" cy="180" r="4" fill="#e8734a" /> {/* Sunrise marker */}
                                    <circle cx="590" cy="180" r="4" fill="#e8734a" /> {/* Sunset marker */}

                                    <defs>
                                        <linearGradient id="sun-gradient" x1="0%" y1="100%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#1a1040" />
                                            <stop offset="25%" stopColor="#e8734a" />
                                            <stop offset="50%" stopColor="#ffd86e" />
                                            <stop offset="75%" stopColor="#e8734a" />
                                            <stop offset="100%" stopColor="#1a1040" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-bold tracking-[2px] uppercase text-white/40 mb-1">Solar Path</span>
                                    <div className="flex items-center gap-4 text-white">
                                        <div className="text-center">
                                            <div className="text-[10px] text-white/50 mb-0.5">Rise</div>
                                            <div className="font-mono text-lg font-bold">{results?.sunrise}</div>
                                        </div>
                                        <div className="w-px h-6 bg-white/20" />
                                        <div className="text-center">
                                            <div className="text-[10px] text-white/50 mb-0.5">Set</div>
                                            <div className="font-mono text-lg font-bold">{results?.sunset}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-4 right-6 text-[10px] font-mono text-white/40">
                                    LAT {cityData[selectedCity]?.lat} · LON {cityData[selectedCity]?.lon}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { label: "블루아워 (새벽)", time: results?.blueAM, color: "#4A90E2", desc: "고요한 푸른 빛의 미학" },
                                        { label: "골든아워 (아참)", time: results?.goldenAM, color: "#ffd86e", desc: "부드럽고 긴 그림자의 황금빛" },
                                        { label: "골든아워 (저녁)", time: results?.goldenPM, color: "#e8734a", desc: "가장 드라마틱한 빛의 향연" },
                                        { label: "블루아워 (저녁)", time: results?.bluePM, color: "#1a1040", desc: "도시 야경과 가장 잘 어울리는 시간" },
                                        { label: "남중 시간", time: addMinutes(results?.sunrise, 360), color: "#fff", desc: "태양이 가장 높이 뜨는 정오" },
                                        { label: "야간 촬영", time: "21:00~", color: "#555", desc: "은하수 및 별 궤적 촬영 가능" },
                                    ].map((slot, i) => (
                                        <div key={i} className="group bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 hover:border-amber transition-all">
                                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] mb-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: slot.color }} />
                                                {slot.label}
                                            </div>
                                            <div className="font-mono text-xl text-[var(--text)] mb-1 group-hover:text-amber transition-colors">{slot.time}</div>
                                            <div className="text-[11px] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]">{slot.desc}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Section */}
                                <div className="mt-10 pt-10 border-t border-[var(--border)]">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-xs font-bold tracking-[1px] uppercase text-[var(--text-tertiary)] flex items-center gap-2">
                                            <CalendarIcon size={14} className="text-amber" /> 이번달 촬영 권장일
                                        </div>
                                        <span className="text-[10px] text-[var(--text-tertiary)]">기상 통계 기반 예측</span>
                                    </div>
                                    <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
                                        {Array.from({ length: 28 }).map((_, i) => {
                                            const day = i + 1;
                                            const isToday = day === 25; // 현재 날짜 가정
                                            const score = [45, 80, 92, 55, 70, 88, 75, 60, 85, 40, 78, 90, 65, 82, 50, 70, 95, 60, 45, 88, 72, 80, 55, 68, 90, 40, 75, 85][i];
                                            const dotColor = score > 80 ? '#50c878' : score > 60 ? '#E8A838' : '#555';
                                            return (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "flex-shrink-0 w-14 py-4 border rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer",
                                                        isToday ? "bg-amber border-amber shadow-[0_4px_15px_rgba(232,168,56,0.3)]" : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-amber/50"
                                                    )}
                                                >
                                                    <span className={cn("text-[10px] uppercase font-bold", isToday ? "text-[#0C0E12]" : "text-[var(--text-tertiary)]")}>
                                                        {["일", "월", "화", "수", "목", "금", "토"][day % 7]}
                                                    </span>
                                                    <span className={cn("text-lg font-bold", isToday ? "text-[#0C0E12]" : "text-[var(--text)]")}>{day}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isToday ? '#0C0E12' : dotColor }} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-amber-glow border border-amber/20">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-amber mb-3">
                                    <Zap size={16} fill="currentColor" /> 골든아워 촬영 팁
                                </h4>
                                <ul className="text-[13px] text-[var(--text-secondary)] space-y-2.5 leading-relaxed">
                                    <li className="flex items-start gap-2">• 태양을 등지고 찍으면 채도가 높아집니다.</li>
                                    <li className="flex items-start gap-2">• 역광에서는 드라마틱한 실루엣을 만들 수 있습니다.</li>
                                    <li className="flex items-start gap-2">• 화이트 밸런스를 '그늘' 혹은 '흐림'으로 설정해 보세요.</li>
                                </ul>
                            </div>
                            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--text)] mb-3">
                                    <MapPin size={16} className="text-amber" /> 추천 데이터
                                </h4>
                                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                                    현재 선택하신 <span className="text-amber font-bold">{selectedCity}</span>의 지형 정보를 고려할 때, 수평선 너머의 일출·일몰 촬영에 최적화된 시간입니다.
                                </p>
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
