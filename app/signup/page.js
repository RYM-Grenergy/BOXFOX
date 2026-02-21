"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, User as UserIcon, Box } from "lucide-react";
import Navbar from "../components/Navbar";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Signup failed");
            }

            setSuccessMsg("Account created! Redirecting...");

            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh text-gray-950 selection:bg-gray-950 selection:text-white">
            <Navbar />

            <main className="relative pt-32 pb-20 px-4 flex items-center justify-center min-h-screen">
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 noise-overlay pointer-events-none opacity-[0.4]" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="bg-white/80 backdrop-blur-2xl p-10 sm:p-14 rounded-[2rem] sm:rounded-[3rem] border border-white/40 shadow-2xl shadow-gray-200/50">

                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-gray-950 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-950/20 transform rotate-[5deg] hover:rotate-0 transition-transform duration-500">
                                <Box size={28} />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-gray-950 mb-3">
                                Join BoxFox
                            </h1>
                            <p className="text-gray-500 font-medium text-sm tracking-wide">
                                START YOUR PREMIUM PACKAGING JOURNEY
                            </p>

                            {errorMsg && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-bold uppercase tracking-wide rounded-xl border border-red-100">
                                    {errorMsg}
                                </div>
                            )}
                            {successMsg && (
                                <div className="mt-4 p-3 bg-emerald-50 text-emerald-600 text-sm font-bold uppercase tracking-wide rounded-xl border border-emerald-100">
                                    {successMsg}
                                </div>
                            )}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-5">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none text-gray-400 group-focus-within:text-gray-950 transition-colors">
                                        <UserIcon size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Full Name"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 outline-none transition-all duration-300 font-medium text-gray-950 placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none text-gray-400 group-focus-within:text-gray-950 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Email Address"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 outline-none transition-all duration-300 font-medium text-gray-950 placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center justify-center pointer-events-none text-gray-400 group-focus-within:text-gray-950 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Password"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:border-gray-950 focus:ring-4 focus:ring-gray-950/5 outline-none transition-all duration-300 font-medium text-gray-950 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-gray-950 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest hover:bg-gray-900 active:scale-[0.98] transition-all shadow-xl shadow-gray-950/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center px-4">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                By creating an account, you agree to our <br />
                                <Link href="#" className="text-gray-950 hover:underline">Terms of Service</Link> and <Link href="#" className="text-gray-950 hover:underline">Privacy Policy</Link>.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center border-t border-gray-100 pt-8">
                            <p className="text-sm font-medium text-gray-500">
                                ALREADY HAVE AN ACCOUNT?{" "}
                                <Link href="/login" className="text-gray-950 font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 ml-1">
                                    Sign In
                                </Link>
                            </p>
                        </div>

                    </div>
                </motion.div>
            </main>
        </div>
    );
}
