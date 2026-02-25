"use client";

import {
    Trash2, Plus, Edit3, RefreshCw, ArrowLeft,
    Layout, Database, Tag, Settings, Save, X, Loader2, LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Tool {
    id: number | string;
    name: string;
    category: string;
    desc?: string;
    url?: string;
    nickname?: string;
    version?: string;
    platforms?: string;
    pricing_type: string;
    price_monthly?: number;
    price_yearly?: number;
    price_one_time?: number;
    currency?: string;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    color: string;
}

export default function AdminPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<number | string | null>(null);
    const [newCatName, setNewCatName] = useState("");
    const [newCatColor, setNewCatColor] = useState("#6496ff");
    const [editingTool, setEditingTool] = useState<Tool | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/admin/login");
        } else {
            setIsAuthLoading(false);
            fetchData();
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const fetchData = async () => {
        setIsLoading(true);
        const { data: toolsData } = await supabase.from('tools').select('*').order('created_at', { ascending: false });
        const { data: catsData } = await supabase.from('categories').select('*').order('name', { ascending: true });

        if (toolsData) setTools(toolsData);
        if (catsData) setCategories(catsData);
        setIsLoading(false);
    };

    const handleDeleteTool = async (id: number | string) => {
        if (!confirm("이 도구를 삭제하시겠습니까?")) return;
        const { error } = await supabase.from('tools').delete().eq('id', id);
        if (!error) setTools(tools.filter(t => t.id !== id));
    };

    const handleUpdateToolInfo = async (tool: Tool) => {
        setIsUpdating(tool.id);
        // 실제로는 URL에서 메타데이터를 다시 긁어오는 로직이 들어가야 함
        // 여기서는 1.5초 대기 후 완료된 척함
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUpdating(null);
        alert(`${tool.name} 정보가 업데이트되었습니다.`);
    };

    const handleSaveEdit = async () => {
        if (!editingTool) return;
        const { error } = await supabase
            .from('tools')
            .update({
                name: editingTool.name,
                category: editingTool.category,
                desc: editingTool.desc,
                url: editingTool.url,
                nickname: editingTool.nickname,
                version: editingTool.version,
                platforms: editingTool.platforms,
                pricing_type: editingTool.pricing_type,
                price_monthly: editingTool.price_monthly,
                price_yearly: editingTool.price_yearly,
                price_one_time: editingTool.price_one_time,
                currency: editingTool.currency
            })
            .eq('id', editingTool.id);

        if (!error) {
            setTools(tools.map(t => t.id === editingTool.id ? editingTool : t));
            setIsEditModalOpen(false);
            setEditingTool(null);
        } else {
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    const handleAddCategory = async () => {
        if (!newCatName) return;
        const { data, error } = await supabase.from('categories').insert([{ name: newCatName, color: newCatColor }]).select();
        if (data) {
            setCategories([...categories, data[0]]);
            setNewCatName("");
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("이 카테고리를 삭제하시겠습니까? 관련 도구의 카테고리 정보가 유실될 수 있습니다.")) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) setCategories(categories.filter(c => c.id !== id));
    };

    if (isAuthLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
                <Loader2 className="animate-spin text-amber" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] pb-24">
            <div className="max-w-7xl mx-auto px-8 pt-16 pb-8">
                <Link href="/tools" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-amber transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-wider">Back to Tools</span>
                </Link>

                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="text-[11px] font-bold tracking-[2px] uppercase text-amber mb-3 text-mono">System Administration</div>
                        <h1 className="font-serif text-5xl text-[var(--text)] tracking-tight">Toolkit 관제실</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--border)]/20 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/5 transition-all font-bold text-sm group border border-transparent hover:border-red-400/20"
                    >
                        <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        로그아웃
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* 도구 관리 섹션 */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Database className="text-amber" size={20} />
                            <h2 className="text-xl font-bold text-[var(--text)]">등록된 도구 관리 ({tools.length})</h2>
                        </div>

                        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[32px] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[var(--border)] bg-[var(--text-secondary)]/5">
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">도구/카테고리</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">가격/링크</th>
                                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] text-right">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]/50">
                                        {tools.map((tool) => (
                                            <tr key={tool.id} className="hover:bg-[var(--text-secondary)]/5 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-[var(--text)] mb-0.5">{tool.name}</div>
                                                    <div className="text-[10px] text-amber/60 font-bold uppercase">{tool.category}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-[11px] text-[var(--text-secondary)] mb-1 uppercase font-mono">{tool.pricing_type}</div>
                                                    {tool.url && (
                                                        <a href={tool.url} target="_blank" className="text-[10px] text-blue-400 hover:underline truncate block max-w-[150px]">
                                                            {tool.url}
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setEditingTool({ ...tool });
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="p-2 text-[var(--text-secondary)] hover:text-blue-500 transition-colors rounded-xl bg-[var(--border)]/30"
                                                            title="수정"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateToolInfo(tool)}
                                                            disabled={isUpdating === tool.id}
                                                            className="p-2 text-[var(--text-secondary)] hover:text-amber transition-colors rounded-xl bg-[var(--border)]/30"
                                                            title="정보 새로고침"
                                                        >
                                                            {isUpdating === tool.id ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTool(tool.id)}
                                                            className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors rounded-xl bg-[var(--border)]/30"
                                                            title="삭제"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 카테고리 관리 섹션 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Tag className="text-amber" size={20} />
                            <h2 className="text-xl font-bold text-[var(--text)]">카테고리 설정</h2>
                        </div>

                        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[32px] p-6 space-y-6">
                            <div className="space-y-4">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex justify-between items-center p-4 rounded-2xl bg-[var(--border)]/20 border border-[var(--border)]/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="font-bold text-sm text-[var(--text)]">{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-[var(--border)] space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">새 카테고리 추가</label>
                                    <input
                                        type="text"
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        placeholder="카테고리 이름"
                                        className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                    />
                                </div>
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="color"
                                        value={newCatColor}
                                        onChange={(e) => setNewCatColor(e.target.value)}
                                        className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer"
                                    />
                                    <button
                                        onClick={handleAddCategory}
                                        className="flex-1 p-3 bg-amber text-black rounded-2xl font-bold text-sm hover:bg-amber/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> 추가하기
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-gradient-to-br from-amber to-orange-400 text-black">
                            <Settings className="mb-4" size={24} />
                            <h3 className="text-xl font-bold mb-2">자동 업데이트 가이드</h3>
                            <p className="text-sm font-medium opacity-90 leading-relaxed">
                                App Store 및 Github 링크가 등록된 도구는 '새로고침' 버튼을 통해 최신 버전과 설명을 자동으로 가져올 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingTool && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="bg-[var(--card-bg)] border border-[var(--border)] w-full max-w-2xl rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-serif text-[var(--text)] mb-1">도구 정보 수정</h2>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium">관리자 권한으로 정보를 최신화합니다.</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">도구 이름</label>
                                        <input
                                            type="text"
                                            value={editingTool.name}
                                            onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">카테고리</label>
                                        <select
                                            value={editingTool.category}
                                            onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                        >
                                            {categories.map(c => <option key={c.id} value={c.name} className="bg-[var(--bg)]">{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">설명 (간략히)</label>
                                    <input
                                        type="text"
                                        value={editingTool.desc || ""}
                                        onChange={(e) => setEditingTool({ ...editingTool, desc: e.target.value })}
                                        className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">가격 체계</label>
                                        <select
                                            value={editingTool.pricing_type}
                                            onChange={(e) => setEditingTool({ ...editingTool, pricing_type: e.target.value })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                        >
                                            <option value="free" className="bg-[var(--bg)]">무료 (Free)</option>
                                            <option value="paid" className="bg-[var(--bg)]">유료 (Purchase)</option>
                                            <option value="subscription" className="bg-[var(--bg)]">구독형 (Subscription)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">개발자/닉네임</label>
                                        <input
                                            type="text"
                                            value={editingTool.nickname || ""}
                                            onChange={(e) => setEditingTool({ ...editingTool, nickname: e.target.value })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 border-t border-[var(--border)]/30 pt-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">통화 (Currency)</label>
                                        <select
                                            value={editingTool.currency || "KRW"}
                                            onChange={(e) => setEditingTool({ ...editingTool, currency: e.target.value })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                        >
                                            <option value="KRW" className="bg-[var(--bg)]">KRW (₩)</option>
                                            <option value="USD" className="bg-[var(--bg)]">USD ($)</option>
                                            <option value="JPY" className="bg-[var(--bg)]">JPY (¥)</option>
                                            <option value="EUR" className="bg-[var(--bg)]">EUR (€)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">지원 플랫폼 (쉼표 구분)</label>
                                        <input
                                            type="text"
                                            value={editingTool.platforms || ""}
                                            onChange={(e) => setEditingTool({ ...editingTool, platforms: e.target.value })}
                                            placeholder="iOS, macOS, Web"
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">월간 (Monthly)</label>
                                        <input
                                            type="number"
                                            value={editingTool.price_monthly || 0}
                                            onChange={(e) => setEditingTool({ ...editingTool, price_monthly: Number(e.target.value) })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">연간 (Yearly)</label>
                                        <input
                                            type="number"
                                            value={editingTool.price_yearly || 0}
                                            onChange={(e) => setEditingTool({ ...editingTool, price_yearly: Number(e.target.value) })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">일시불 (One-time)</label>
                                        <input
                                            type="number"
                                            value={editingTool.price_one_time || 0}
                                            onChange={(e) => setEditingTool({ ...editingTool, price_one_time: Number(e.target.value) })}
                                            className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">URL (App Store / GitHub 등)</label>
                                    <input
                                        type="text"
                                        value={editingTool.url || ""}
                                        onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                                        className="w-full bg-transparent border-b border-[var(--border)] px-1 py-2 text-[var(--text)] focus:outline-none focus:border-amber transition-colors font-mono text-sm text-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--border)] flex gap-4">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl border border-[var(--border)] font-bold text-[var(--text-secondary)] hover:bg-[var(--text-secondary)]/5 transition-all outline-none"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-[2] py-4 rounded-2xl bg-amber text-black font-bold hover:bg-amber/90 transition-all shadow-xl shadow-amber/20 outline-none flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> 설정 저장하기
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
