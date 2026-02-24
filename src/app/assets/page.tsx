"use client";

import { Layers, Type, ImageIcon, Download, Plus } from "lucide-react";
import { motion } from "framer-motion";

const assets = [
  { name: "Space Mono", type: "Font", desc: "코딩과 데이터를 위한 세련된 모노타입", provider: "Google Fonts" },
  { name: "DM Serif Display", type: "Font", desc: "우아하고 고전적인 잡지 스타일 폰트", provider: "Google Fonts" },
  { name: "Film Grain Texture", type: "Image", desc: "아날로그 감성을 더하는 고해상도 노이즈", provider: "Toolkit Exclusive" },
  { name: "Golden Hour Preset", type: "Lightroom", desc: "노을 빛을 극대화하는 원클릭 프리셋", provider: "Toolkit Exclusive" },
];

export default function AssetsPage() {
  return (
    <div className="pt-0 pb-24">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="mb-14">
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3">Asset Recommendations</div>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight text-[var(--text)] mb-4">
            작품의 완성도를<br />높이는 에셋 추천
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-[500px]">
            작가의 시선을 돋보이게 하는 폰트, 텍스처, 그리고 프리셋을 엄선하여 추천합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.map((asset, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--surface)] hover:border-amber transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-dim flex items-center justify-center text-amber">
                  {asset.type === "Font" ? <Type size={20} /> : asset.type === "Image" ? <ImageIcon size={20} /> : <Layers size={20} />}
                </div>
                <button className="text-[var(--text-tertiary)] hover:text-amber transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <div className="text-[10px] font-bold text-amber/60 tracking-wider uppercase mb-1">{asset.type}</div>
              <h3 className="text-lg font-bold text-[var(--text)] mb-2">{asset.name}</h3>
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mb-4">{asset.desc}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]">
                <span className="text-[11px] text-[var(--text-tertiary)]">{asset.provider}</span>
                <Download size={14} className="text-[var(--text-tertiary)] group-hover:text-amber transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
