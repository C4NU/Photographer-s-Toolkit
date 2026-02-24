"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Clipboard, Image as ImageIcon, Box, Flower2, Sunrise, MapPin, Landmark, CloudSun, Layers } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as any }
};

const appFamily = [
  {
    icon: <Globe />,
    tag: "Hub",
    name: "Photographer's Toolkit",
    desc: "골든아워 계산, 시즌 캘린더, 촬영 스팟, 전시 큐레이션까지 — 모든 정보의 출발점.",
    href: "/",
    featured: true
  },
  {
    icon: <Clipboard />,
    tag: "iOS · Android",
    name: "Nottie",
    desc: "AI가 함께하는 촬영 기획서. 스토리보드 스타일로 아이디어를 구조화합니다.",
    href: "#",
    color: "rgba(100,150,255,0.15)",
    tagColor: "#6496ff"
  },
  {
    icon: <ImageIcon />,
    tag: "iOS · Android",
    name: "Paddie",
    desc: "사진 프레임, 편집, 공유까지. 멀티 기능 사진 앱의 새로운 기준.",
    href: "#",
    color: "rgba(80,200,120,0.12)",
    tagColor: "#50c878"
  },
  {
    icon: <Box />,
    tag: "Mac · Windows",
    name: "Packie",
    desc: "폰트, 프레임, 이미지를 한 곳에서. 크리에이터를 위한 리소스 관리 앱.",
    href: "#",
    color: "rgba(255,100,100,0.1)",
    tagColor: "#ff7070"
  }
];

const features = [
  { icon: "🌸", title: "시즌 데이터", desc: "벚꽃, 단풍, 유채꽃 — 한국과 일본의 개화 시기를 실시간 기상 데이터로 예측합니다." },
  { icon: "🌅", title: "골든아워 계산기", desc: "원하는 도시와 날짜를 선택하면 일출·일몰·골든아워·블루아워를 즉시 확인합니다." },
  { icon: "📍", title: "촬영 스팟 가이드", desc: "공식 관광지부터 숨은 명소까지. 최적 시간대와 촬영 팁을 함께 제공합니다." },
  { icon: "🏛️", title: "전시 큐레이션", desc: "한국과 일본의 주요 사진 전시를 매주 업데이트합니다. 예매 링크까지 한번에." },
  { icon: "🌤", title: "촬영 날씨 스코어", desc: "7일 예보를 바탕으로 오늘 촬영하기 가장 좋은 날을 0~100점으로 알려줍니다." },
  { icon: "🔗", title: "앱 패밀리 연동", desc: "Nottie에서 스팟을 기획하고, Paddie로 결과물을 편집하는 워크플로우를 지원합니다." }
];

export default function Home() {
  return (
    <div className="pt-0 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center overflow-hidden">
        <div className="hero-gradient absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:60px_60px] md:[mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black_0%,transparent_80%)] pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.div
            {...fadeUp}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-dim border border-amber/30 rounded-full text-xs text-amber font-medium mb-7"
          >
            <span className="w-1.5 h-1.5 bg-amber rounded-full" />
            한국 · 일본 사진작가를 위한 플랫폼
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-[var(--text)] mb-6"
          >
            지금, 어디서<br /><em className="italic text-amber">무엇을 찍을까</em>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-[520px] mx-auto mb-10"
          >
            골든아워부터 벚꽃 개화 시기, 전시 정보, 촬영 스팟까지.<br />
            사진작가의 모든 시작점이 여기에 있습니다.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <Link href="/golden-hour" className="px-7 py-3.5 bg-amber text-[#0C0E12] rounded-xl text-[15px] font-bold transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,168,56,0.3)]">
              골든아워 계산기 →
            </Link>
            <Link href="/season" className="px-7 py-3.5 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl text-[15px] font-bold transition-all hover:border-amber hover:text-amber hover:-translate-y-0.5">
              시즌 캘린더 보기
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.4 }}
            className="flex items-center justify-center gap-10 mt-20 pt-10 border-t border-[var(--border)]"
          >
            {[
              { num: "2", label: "한국 · 일본", unit: "개국" },
              { num: "48", label: "큐레이션 스팟", unit: "+" },
              { num: "12", label: "시즌 이벤트", unit: "개" },
              { num: "30", label: "이번달 전시", unit: "+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-3xl text-[var(--text)]">
                  {stat.num}<span className="text-amber text-lg ml-0.5">{stat.unit}</span>
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Apps Family Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="mb-14">
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">App Family</div>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-tight text-[var(--text)] mb-4">
            창작의 흐름을<br />하나로 연결합니다
          </h2>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
            Nottie로 기획하고, Paddie로 편집하고, Packie로 관리하세요. 그 모든 여정의 시작점이 바로 여기입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appFamily.map((app, i) => (
            <div
              key={i}
              className={cn(
                "group relative p-7 rounded-[20px] bg-[var(--card-bg)] border border-[var(--border)] cursor-pointer transition-all hover:-translate-y-1 hover:border-amber",
                app.featured && "lg:col-span-2 bg-gradient-to-br from-[var(--surface)] to-[var(--bg-secondary)]"
              )}
            >
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-amber-dim flex items-center justify-center text-amber text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowRight size={14} />
              </div>

              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 bg-amber-dim text-amber" style={{ backgroundColor: app.color }}>
                {app.icon}
              </div>

              <div className="inline-block text-[10px] font-bold tracking-[1.5px] uppercase text-amber bg-amber-dim px-2 py-0.5 rounded-sm mb-2.5" style={{ color: app.tagColor, backgroundColor: app.tagColor ? `${app.tagColor}1F` : undefined }}>
                {app.tag}
              </div>

              <h3 className="font-serif text-2xl text-[var(--text)] mb-2">{app.name}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{app.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--bg-secondary)] py-24">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center md:text-left mb-14">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">Why Toolkit</div>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-tight text-[var(--text)] mb-4">
              사진작가만을 위한<br />정보가 따로 없었습니다
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
              흩어진 정보들을 한곳에. 당신의 다음 촬영을 더 특별하게.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[var(--border)] rounded-3xl overflow-hidden gap-[1px]">
            {features.map((feature, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] hover:bg-[var(--surface)] p-9 transition-colors group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                <h4 className="text-base font-semibold text-[var(--text)] mb-2">{feature.title}</h4>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
