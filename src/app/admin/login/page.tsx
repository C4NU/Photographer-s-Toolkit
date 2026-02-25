"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2, Key } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/admin");
            }
        };
        checkUser();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--border)_1px,_transparent_1px)] bg-[size:40px_40px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber/10 text-amber mb-6 border border-amber/20">
                        <Lock size={32} />
                    </div>
                    <div className="text-[11px] font-bold tracking-[3px] uppercase text-amber mb-3 text-mono">System Access</div>
                    <h1 className="text-4xl font-serif text-[var(--text)] tracking-tight">관제실 로그인</h1>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[40px] p-10 shadow-2xl backdrop-blur-md">
                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)] ml-1 flex items-center gap-2">
                                    <Mail size={12} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-all duration-300 placeholder:text-[var(--text-secondary)]/30"
                                    required
                                />
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)] ml-1 flex items-center gap-2">
                                    <Key size={12} /> Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border-b border-[var(--border)] px-1 py-3 text-[var(--text)] focus:outline-none focus:border-amber transition-all duration-300 placeholder:text-[var(--text-secondary)]/30"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xs text-red-400 font-medium bg-red-400/10 p-4 rounded-2xl border border-red-400/20 text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-amber text-black rounded-2xl font-bold text-sm hover:bg-amber/90 transition-all shadow-xl shadow-amber/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    접속하기
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center text-[var(--text-secondary)]">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Secure Connection Established</p>
                </div>
            </motion.div>
        </div>
    );
}
