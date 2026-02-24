"use client";

import {
  Monitor, Layout, ImageIcon, Box, ArrowRight, Plus, X,
  Github, Smartphone, Globe, ExternalLink, Loader2,
  Laptop, Terminal, Cpu, Search, ChevronDown, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface Tool {
  id?: number | string;
  name: string;
  category: string;
  desc: string;
  icon?: any;
  color?: string;
  url?: string;
  type?: 'official' | 'community';
  screenshot?: string;
  nickname?: string;
  version?: string;
  app_desc?: string;
  recommend_reason?: string;
  platforms?: string;
  recommender?: string;
  pricing_type: 'free' | 'paid' | 'subscription';
  price_monthly?: number;
  price_yearly?: number;
  price_one_time?: number;
  currency?: string;
  created_at?: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

const PLATFORMS = [
  { id: "iOS", name: "iOS", icon: Smartphone },
  { id: "Android", name: "Android", icon: Smartphone },
  { id: "macOS", name: "macOS", icon: Laptop },
  { id: "Windows", name: "Windows", icon: Monitor },
  { id: "Linux", name: "Linux", icon: Terminal },
  { id: "Web", name: "Web", icon: Globe },
];

// 카테고리별 테마 컬러 설정
const categoryColors: { [key: string]: string } = {
  "촬영 기획": "#6496ff",
  "사진 편집": "#50c878",
  "자산 관리": "#ff7070",
  "기타": "#a0a0a0",
};

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader2 className="animate-spin text-amber" size={48} />
      </div>
    }>
      <ToolsPageContent />
    </Suspense>
  );
}

function ToolsPageContent() {
  const [communityTools, setCommunityTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterPlatform, setFilterPlatform] = useState("전체");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeParam = searchParams.get('type') || 'all';
  const catParam = searchParams.get('category') || '전체';
  const platParam = searchParams.get('platform') || '전체';
  const pricingParam = searchParams.get('pricing') || '전체';
  const qParam = searchParams.get('q') || '';

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === '전체') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setFilterCategory(catParam);
    setFilterPlatform(platParam);
  }, [catParam, platParam]);
  const [newTool, setNewTool] = useState<Tool>({
    name: "",
    category: "촬영 기획",
    desc: "",
    url: "",
    screenshot: "",
    nickname: "",
    version: "",
    app_desc: "",
    recommend_reason: "",
    platforms: "Web",
    recommender: "",
    pricing_type: "free",
    price_monthly: 0,
    price_yearly: 0,
    price_one_time: 0,
    currency: "KRW"
  });

  // Fetch tools from Supabase
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setCommunityTools(data);
      }
      setIsLoading(false);
    };

    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (data) setCategories(data);
    };

    fetchTools();
    fetchCategories();

    // Real-time updates
    const subscription = supabase
      .channel('tools_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tools' }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setCommunityTools(prev => [payload.new as Tool, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filteredTools = communityTools.filter(tool => {
    const matchesType = typeParam === "all" || tool.type === typeParam;
    const matchesCategory = filterCategory === "전체" || tool.category === filterCategory;
    const matchesPlatform = filterPlatform === "전체" || tool.platforms?.includes(filterPlatform);
    const matchesPricing = pricingParam === "전체" || tool.pricing_type === pricingParam;
    const matchesSearch = tool.name.toLowerCase().includes(qParam.toLowerCase()) ||
      tool.desc.toLowerCase().includes(qParam.toLowerCase());
    return matchesType && matchesCategory && matchesPlatform && matchesPricing && matchesSearch;
  });

  const fetchMetadata = async (url: string) => {
    if (!url || (!url.includes('github.com') && !url.includes('apps.apple.com'))) return;
    setIsFetching(true);

    try {
      if (url.includes('github.com')) {
        const repoPath = url.split('github.com/')[1]?.split('?')[0];
        if (repoPath) {
          const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`);
          const repoData = await repoRes.json();

          let version = "";
          try {
            const releaseRes = await fetch(`https://api.github.com/repos/${repoPath}/releases/latest`);
            const releaseData = await releaseRes.json();
            version = releaseData.tag_name || "";
          } catch (e) {
            console.log("No release found");
          }

          if (repoData.name) {
            setNewTool(prev => ({
              ...prev,
              name: repoData.name,
              desc: repoData.description || prev.desc,
              screenshot: `https://opengraph.githubassets.com/1/${repoPath}`,
              version: version || prev.version,
              nickname: repoData.owner.login || prev.nickname,
              platforms: "Web, Mac, Windows" // GitHub은 보통 데스크탑/웹 기준
            }));
          }
        }
      } else if (url.includes('apps.apple.com')) {
        const appId = url.match(/id(\d+)/)?.[1];
        if (appId) {
          const res = await fetch(`https://itunes.apple.com/lookup?id=${appId}`);
          const data = await res.json();
          if (data.results && data.results[0]) {
            const app = data.results[0];
            const isSubscription = app.description.toLowerCase().includes('구독') ||
              app.description.toLowerCase().includes('subscription') ||
              app.description.toLowerCase().includes('in-app');

            setNewTool(prev => ({
              ...prev,
              name: app.trackName,
              desc: app.description.split('\n')[0],
              app_desc: app.description,
              screenshot: app.artworkUrl512 || app.artworkUrl100,
              version: app.version,
              nickname: app.artistName,
              category: "사진 편집",
              platforms: "iOS",
              pricing_type: isSubscription ? 'subscription' : (app.price > 0 ? 'paid' : 'free'),
              price_one_time: app.price > 0 ? app.price : 0,
              price_monthly: isSubscription ? app.price : 0,
              currency: app.currency
            }));
          }
        }
      }
    } catch (error) {
      console.error("Metadata fetch error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setNewTool(prev => ({ ...prev, url }));
    if (url.includes('github.com') || url.includes('apps.apple.com')) {
      const timeoutId = setTimeout(() => fetchMetadata(url), 800);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.name || !newTool.desc) return;

    const toolToAdd = {
      ...newTool,
      type: 'community',
      color: categoryColors[newTool.category] || "#a0a0a0",
    };

    const { error } = await supabase.from('tools').insert([toolToAdd]);

    if (!error) {
      setNewTool({
        name: "",
        category: categories[0]?.name || "기타",
        desc: "",
        url: "",
        screenshot: "",
        nickname: "",
        version: "",
        app_desc: "",
        recommend_reason: "",
        platforms: "Web",
        recommender: "",
        pricing_type: "free",
        price_monthly: 0,
        price_yearly: 0,
        price_one_time: 0,
        currency: "KRW"
      });
      setModalStep(1);
      setIsModalOpen(false);
      // 등록 성공 시 목록 새로고침 호출 (이미 useEffect에서 관리되지만 명시적 처리 가능)
      window.location.reload();
    } else {
      console.error("Error adding tool:", JSON.stringify(error, null, 2));
      alert(`도구 등록 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
    }
  };

  const getIcon = (tool: Tool) => {
    if (tool.type === 'official') {
      if (tool.name === "Nottie") return Layout;
      if (tool.name === "Paddie") return ImageIcon;
      return Box;
    }
    if (tool.url?.includes('github.com')) return Github;
    if (tool.url?.includes('apps.apple.com')) return Smartphone;
    return Globe;
  };

  const ToolCard = ({ tool }: { tool: Tool }) => {
    const Icon = getIcon(tool);
    const getCurrencySymbol = (currency?: string) => {
      switch (currency) {
        case 'USD': return '$';
        case 'KRW': return '₩';
        case 'JPY': return '¥';
        case 'EUR': return '€';
        default: return currency || '₩';
      }
    };
    const symbol = getCurrencySymbol(tool.currency);
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group p-5 rounded-3xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-amber transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
      >
        {tool.screenshot && (
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <img src={tool.screenshot} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl overflow-hidden shadow-inner border border-[var(--border)]/30" style={{ backgroundColor: `${tool.color}15`, color: tool.color }}>
              {tool.screenshot ? (
                <img src={tool.screenshot} alt={tool.name} className="w-full h-full object-cover p-[2px] rounded-2xl" />
              ) : (
                <Icon size={24} />
              )}
            </div>
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[var(--text-secondary)] hover:text-amber transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
          <div className="text-[9px] font-bold tracking-[1.5px] uppercase mb-1.5" style={{ color: tool.color }}>{tool.category}</div>
          <h3 className="text-xl font-serif text-[var(--text)] mb-2">{tool.name}</h3>

          {tool.platforms && (
            <div className="flex flex-wrap gap-4 mb-6">
              {tool.platforms.split(',').map((pName, idx) => {
                const platform = PLATFORMS.find(p => p.id === pName.trim());
                if (!platform) return null;
                const PIcon = platform.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-xl bg-amber/5 text-amber border border-amber/10">
                      <PIcon size={14} />
                    </div>
                    <span className="text-[9px] font-bold text-amber/60 uppercase tracking-tighter">{platform.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">{tool.desc}</p>

          {tool.recommend_reason && (
            <div className="mb-6 p-4 rounded-2xl bg-amber/5 border border-amber/10">
              <p className="text-[12px] text-[var(--text)] leading-relaxed italic">
                "{tool.recommend_reason}"
              </p>
            </div>
          )}

          <div className="flex justify-between items-center mt-auto pt-4 border-t border-[var(--border)]/30">
            <div className="flex items-center gap-2 text-amber text-sm font-bold group-hover:gap-3 transition-all">
              이동하기 <ArrowRight size={14} />
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <div className="flex gap-2 mb-1">
                {tool.pricing_type && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-tight ${tool.pricing_type === 'free'
                    ? 'bg-green-500/10 text-green-500'
                    : tool.pricing_type === 'subscription'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-amber/10 text-amber'
                    }`}>
                    {tool.pricing_type === 'free' ? 'FREE' : tool.pricing_type === 'subscription' ? 'SUBSCRIPTION' : 'PURCHASE'}
                    {tool.pricing_type !== 'free' && (
                      <span className="ml-1 opacity-80 font-mono">
                        {tool.pricing_type === 'paid'
                          ? `${symbol}${tool.price_one_time?.toLocaleString()}`
                          : `${symbol}${tool.price_monthly?.toLocaleString()}/mo`}
                      </span>
                    )}
                  </span>
                )}
                {tool.version && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--text-secondary)]/10 text-[var(--text-secondary)] font-medium">v{tool.version}</span>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                {tool.nickname && (
                  <span className="text-[11px] text-[var(--text-secondary)]/60 font-medium whitespace-nowrap uppercase tracking-tighter">Dev: {tool.nickname}</span>
                )}
                {tool.recommender && (
                  <span className="text-[11px] text-amber/60 font-bold whitespace-nowrap uppercase tracking-tighter">Rec: {tool.recommender}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-0 pb-24 min-h-screen bg-[var(--bg)]">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold tracking-[3px] uppercase text-amber mb-4 opacity-80">Software Curation</div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] tracking-tight text-[var(--text)] mb-6">
              사진가를 위한<br />워크플로우의 완성
            </h1>
            <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-medium">
              기획부터 보정, 자산 관리까지. 전 세계 사진가들이 검증한 전문 도구들을 만나보세요.
            </p>
          </div>

          <div className="flex flex-col items-end gap-6">
            {typeParam !== 'official' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-amber text-black hover:bg-amber/90 transition-all active:scale-[0.98] rounded-2xl flex items-center gap-3 shadow-xl shadow-amber/20 group"
              >
                <Plus size={24} strokeWidth={2.5} />
                <span className="font-bold text-lg">새 도구 추천하기</span>
              </button>
            )}
            <div className="relative w-full md:w-80 group">
              <input
                type="text"
                placeholder="도구 이름 또는 설명 검색..."
                value={qParam}
                onChange={(e) => updateSearchParam('q', e.target.value)}
                className="w-full bg-[var(--card-bg)] border border-[var(--border)] px-6 py-4 rounded-2xl text-[var(--text)] focus:outline-none focus:border-amber transition-all group-hover:border-amber/50 pr-12 text-sm"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">🔍</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12">

          {/* Tools Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-[var(--text-secondary)]">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-sm font-medium">도구 목록을 불러오는 중...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[var(--text)]">{filteredTools.length}</span>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">개의 도구를 찾았습니다</span>
                  </div>
                  {(typeParam !== 'all' || filterCategory !== "전체" || filterPlatform !== "전체" || pricingParam !== "전체" || qParam) && (
                    <button
                      onClick={() => {
                        router.push(pathname);
                      }}
                      className="text-[11px] font-bold text-amber hover:underline underline-offset-4 uppercase tracking-wider"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool: Tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </AnimatePresence>
                </div>

                {filteredTools.length === 0 && (
                  <div className="py-32 flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-[var(--border)]/50 bg-[var(--text-secondary)]/[0.02]">
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
                      <Search className="text-[var(--text-tertiary)]" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)] mb-2">검색 결과가 없습니다</h3>
                    <p className="text-[var(--text-secondary)] text-sm max-w-xs text-center leading-relaxed">
                      필터 조건을 변경하거나 다른 검색어를 입력해 보세요.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-[var(--card-bg)] border border-[var(--border)] w-full max-w-md rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
              {isFetching && (
                <div className="absolute inset-0 bg-[var(--card-bg)]/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-amber mb-3" size={32} />
                  <p className="text-sm font-bold text-amber">메타데이터를 가져오는 중...</p>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors z-30"
              >
                <X size={24} />
              </button>

              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif text-[var(--text)] mb-1">
                    {modalStep === 1 ? "새 도구 등록" : modalStep === 2 ? "추천 피드백" : "가격 정보"}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">
                    {modalStep === 1 ? "도구의 기본적인 정보를 입력해주세요." : modalStep === 2 ? "이 도구를 왜 추천하시나요?" : "사용을 위해 비용이 발생하나요?"}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${modalStep === 1 ? "bg-amber" : "bg-[var(--border)]"}`} />
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${modalStep === 2 ? "bg-amber" : "bg-[var(--border)]"}`} />
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${modalStep === 3 ? "bg-amber" : "bg-[var(--border)]"}`} />
                </div>
              </div>

              <form onSubmit={handleAddTool} className="space-y-6">
                <AnimatePresence mode="wait">
                  {modalStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="col-span-2">
                            <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">링크 (Github/App Store)</label>
                            <input
                              type="url"
                              value={newTool.url}
                              onChange={(e) => handleUrlChange(e.target.value)}
                              className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors text-lg"
                              placeholder="https://..."
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">도구 이름</label>
                            <input
                              type="text"
                              required
                              value={newTool.name}
                              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                              className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                              placeholder="이름"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">개발자</label>
                            <input
                              type="text"
                              required
                              value={newTool.nickname}
                              onChange={(e) => setNewTool({ ...newTool, nickname: e.target.value })}
                              className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                              placeholder="개발자 이름"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">최신 버전</label>
                            <input
                              type="text"
                              value={newTool.version}
                              onChange={(e) => setNewTool({ ...newTool, version: e.target.value })}
                              className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                              placeholder="v1.0.0"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">카테고리</label>
                            <select
                              value={newTool.category}
                              onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                              className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors appearance-none cursor-pointer"
                            >
                              {categories.length > 0 ? categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                              )) : (
                                <option value="촬영 기획">촬영 기획</option>
                              )}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">앱 상세 설명</label>
                          <textarea
                            value={newTool.app_desc}
                            onChange={(e) => setNewTool({ ...newTool, app_desc: e.target.value })}
                            rows={2}
                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors resize-none"
                            placeholder="앱의 상세 기능을 입력해주세요."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-4">지원 플랫폼</label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                            {PLATFORMS.map((platform) => {
                              const Icon = platform.icon;
                              const isSelected = newTool.platforms?.split(',').map(p => p.trim()).includes(platform.id);
                              return (
                                <button
                                  key={platform.id}
                                  type="button"
                                  onClick={() => {
                                    const currentPlatforms = newTool.platforms ? newTool.platforms.split(',').map(p => p.trim()) : [];
                                    const nextPlatforms = isSelected
                                      ? currentPlatforms.filter(p => p !== platform.id)
                                      : [...currentPlatforms, platform.id];
                                    setNewTool({ ...newTool, platforms: nextPlatforms.filter(Boolean).join(', ') });
                                  }}
                                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${isSelected
                                    ? 'bg-amber/10 border-amber text-amber shadow-lg shadow-amber/10'
                                    : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-amber/50'
                                    }`}
                                >
                                  <Icon size={20} />
                                  <span className="text-[10px] font-bold">{platform.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setModalStep(2)}
                          className="w-full p-6 flex items-center justify-center gap-3 text-amber hover:bg-amber/5 transition-all active:scale-[0.98] rounded-3xl group border border-amber/10"
                        >
                          <span className="font-bold tracking-tight text-xl">다음 단계로 (피드백)</span>
                          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-8 py-4"
                    >
                      <div>
                        <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">추천자 닉네임</label>
                        <input
                          type="text"
                          required
                          value={newTool.recommender}
                          onChange={(e) => setNewTool({ ...newTool, recommender: e.target.value })}
                          className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors text-lg"
                          placeholder="본인의 닉네임을 입력해 주세요"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">추천하는 이유 (피드백)</label>
                        <textarea
                          required
                          value={newTool.recommend_reason}
                          onChange={(e) => setNewTool({ ...newTool, recommend_reason: e.target.value })}
                          rows={5}
                          className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors resize-none leading-relaxed"
                          placeholder="이 도구를 왜 추천하시나요? 사진가들에게 어떤 도움이 되는지 알려주세요."
                        />
                      </div>

                      <div className="pt-6 flex flex-col gap-4">
                        <button
                          type="button"
                          onClick={() => setModalStep(3)}
                          className="w-full p-6 flex items-center justify-center gap-3 text-amber hover:bg-amber/5 transition-all active:scale-[0.98] rounded-3xl group border border-amber/10"
                        >
                          <span className="font-bold tracking-tight text-xl">마지막: 가격 정보 입력</span>
                          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalStep(1)}
                          className="w-full p-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors text-sm font-medium"
                        >
                          이전 단계 정보 수정
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {modalStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-6">가격 체계</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'free', label: '무료' },
                            { id: 'paid', label: '유료 (일시불)' },
                            { id: 'subscription', label: '구독제' }
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setNewTool({ ...newTool, pricing_type: type.id as any })}
                              className={`p-4 rounded-2xl border transition-all text-sm font-bold ${newTool.pricing_type === type.id
                                ? 'bg-amber/10 border-amber text-amber'
                                : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-amber/50'
                                }`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {newTool.pricing_type === 'paid' && (
                          <motion.div
                            key="paid_input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="pt-2"
                          >
                            <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">구매 가격 (단위: 원)</label>
                            <input
                              type="number"
                              value={newTool.price_one_time}
                              onChange={(e) => setNewTool({ ...newTool, price_one_time: Number(e.target.value) })}
                              className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors text-xl font-mono"
                              placeholder="0"
                            />
                          </motion.div>
                        )}
                        {newTool.pricing_type === 'subscription' && (
                          <motion.div
                            key="sub_input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-2 gap-6 pt-2"
                          >
                            <div>
                              <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">월 구독료</label>
                              <input
                                type="number"
                                value={newTool.price_monthly}
                                onChange={(e) => setNewTool({ ...newTool, price_monthly: Number(e.target.value) })}
                                className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors text-xl font-mono"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold tracking-[1px] text-[var(--text-secondary)]/60 uppercase mb-2">년 구독료</label>
                              <input
                                type="number"
                                value={newTool.price_yearly}
                                onChange={(e) => setNewTool({ ...newTool, price_yearly: Number(e.target.value) })}
                                className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-colors text-xl font-mono"
                                placeholder="0"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-8 flex flex-col gap-4">
                        <button
                          type="submit"
                          className="w-full p-6 flex items-center justify-center gap-3 bg-amber text-black hover:bg-amber/90 transition-all active:scale-[0.98] rounded-3xl group shadow-xl shadow-amber/20"
                        >
                          <span className="font-bold tracking-tight text-xl">등록 완료</span>
                          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalStep(2)}
                          className="w-full p-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors text-sm font-medium"
                        >
                          이전 단계 정보 수정
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
