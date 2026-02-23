"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, Box, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        const result = await login(email, password);

        if (result.success) {
            if (result.user?.role === 'admin') {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } else {
            setErrorMsg(result.error || "Login sequence failed. Verify credentials.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-950 selection:bg-emerald-500 selection:text-white overflow-hidden">
            <Navbar />

            <main className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6">
                {/* Immersive Background Particles/Grid */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.15, 0.1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-emerald-500/20 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.05, 0.1, 0.05],
                            rotate: [0, -45, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gray-900/10 blur-[100px] rounded-full"
                    />
                </div>

                <div className="relative z-10 w-full max-w-[1200px] grid lg:grid-cols-2 bg-white rounded-[3rem] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden">

                    {/* Visual Section - Left (Hidden on Mobile) */}
                    <div className="hidden lg:flex flex-col justify-between p-16 bg-gray-950 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.4),transparent)]" />
                        </div>

                        <div className="relative z-10">
                            <Link href="/" className="inline-block mb-12">
                                <img src="/BOXFOX-1.png" alt="Logo" className="h-8 invert brightness-0" />
                            </Link>
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure_Access_Portal</span>
                                </motion.div>
                                <h2 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
                                    Premium<br />
                                    <span className="text-gray-500 italic">Experience.</span>
                                </h2>
                                <p className="text-gray-400 text-lg font-medium max-w-sm leading-relaxed tracking-tight">
                                    Access your dashboard to manage orders and explore premium packaging solutions.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-4xl font-black italic tracking-tighter">5000+</p>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Happy_Customers</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black italic tracking-tighter text-emerald-500">24/7</p>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Priority_Support</p>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                                <span>BoxFox_Customer_Portal</span>
                                <span>2026_EST</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Section - Right */}
                    <div className="p-8 sm:p-14 md:p-20 flex flex-col justify-center bg-white relative">
                        <div className="lg:hidden text-center mb-8">
                            <img src="/BOXFOX-1.png" alt="Logo" className="h-7 mx-auto" />
                        </div>

                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-12">
                                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-950 mb-3">
                                    Welcome Back.
                                </h1>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
                                    Enter your account details below
                                </p>
                            </div>

                            <AnimatePresence>
                                {errorMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-widest"
                                    >
                                        <AlertCircle size={16} />
                                        {errorMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:ring-[12px] focus:ring-emerald-500/5 outline-none transition-all duration-500 font-black text-xs uppercase tracking-widest text-gray-950 placeholder:text-gray-300"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Your Password"
                                            className="w-full pl-14 pr-14 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white focus:ring-[12px] focus:ring-emerald-500/5 outline-none transition-all duration-500 font-black text-xs uppercase tracking-widest text-gray-950 placeholder:text-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-300 hover:text-emerald-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" className="peer w-5 h-5 opacity-0 absolute cursor-pointer" />
                                            <div className="w-5 h-5 rounded-lg border-2 border-gray-100 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-950 transition-colors">Remember_Me</span>
                                    </label>
                                    <Link href="#" className="text-[10px] font-black text-gray-950 uppercase tracking-widest hover:text-emerald-500 transition-colors">
                                        Forgot_Password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full py-6 bg-gray-950 text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs uppercase tracking-[0.3em] overflow-hidden group shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all disabled:opacity-70"
                                >
                                    <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10 flex items-center gap-4">
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="animate-spin" size={18} />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                Secure_Login
                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            <div className="mt-12 text-center">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    NO ACCOUNT?{" "}
                                    <Link href="/signup" className="text-emerald-500 hover:text-emerald-600 ml-2 border-b-2 border-emerald-500/20 hover:border-emerald-500 transition-all">
                                        Create_Account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function RefreshCw({ className, size }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
    );
}

