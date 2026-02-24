import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] pt-16 px-8 pb-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-amber rounded-md flex items-center justify-center text-sm">
                                📷
                            </div>
                            <span className="font-serif text-[15px] text-[var(--text)] tracking-tight">
                                Photo<span className="text-amber">Toolkit</span>
                            </span>
                        </div>
                        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
                            한국과 일본 사진작가, 아티스트, 크리에이터를 위한 올인원 정보 허브.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h5 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--text-tertiary)]">
                            기능
                        </h5>
                        <div className="flex flex-col gap-2">
                            {["골든아워 계산기", "시즌 캘린더", "촬영 스팟", "전시 정보"].map((item) => (
                                <span key={item} className="text-[13px] text-[var(--text-secondary)] cursor-pointer transition-colors hover:text-amber">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h5 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--text-tertiary)]">
                            앱 패밀리
                        </h5>
                        <div className="flex flex-col gap-2">
                            {["Nottie", "Paddie", "Packie"].map((item) => (
                                <span key={item} className="text-[13px] text-[var(--text-secondary)] cursor-pointer transition-colors hover:text-amber">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h5 className="text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--text-tertiary)]">
                            정보
                        </h5>
                        <div className="flex flex-col gap-2">
                            {["소개", "문의", "개인정보처리방침"].map((item) => (
                                <span key={item} className="text-[13px] text-[var(--text-secondary)] cursor-pointer transition-colors hover:text-amber">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--border)] gap-6">
                    <span className="text-xs text-[var(--text-tertiary)]">
                        © 2026 Photographer&apos;s Toolkit. All rights reserved.
                    </span>
                    <div className="flex gap-2">
                        {["Nottie", "Paddie", "Packie"].map((name) => (
                            <span
                                key={name}
                                className="px-2.5 py-1 rounded-md border border-[var(--border-secondary)] text-[11px] text-[var(--text-tertiary)]"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
