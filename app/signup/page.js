"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, User as UserIcon, Phone, Building2, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        businessName: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const { signup } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        const result = await signup(formData);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else {
            setErrorMsg(result.error || "Registry error. Verify parameters.");
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <Navbar />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-8 max-w-md"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/40">
                        <CheckCircle2 size={48} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-950 mb-4">Account_Created</h1>
                        <p className="text-gray-500 font-medium leading-relaxed italic">"Your profile has been successfully set up. Redirecting to the login portal..."</p>
                    </div>
                    <div className="flex justify-center gap-2">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 bg-emerald-500 rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-950 selection:bg-emerald-500 selection:text-white overflow-hidden">
            <Navbar />

            <main className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-4">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-12 bg-white rounded-[3rem] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden">

                    {/* Perspective Panel - Left */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-16 bg-emerald-500 text-white relative">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] bg-[length:40px_40px]" />
                        </div>

                        <div className="relative z-10">
                            <div className="mb-12">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60">BoxFox_Community</span>
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
                                Start<br />
                                Your<br />
                                <span className="text-emerald-900/40">Journey.</span>
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center"><ShieldCheck size={20} /></div>
                                    <p className="text-xs font-black uppercase tracking-widest text-emerald-950/70">Secure_Profile_Shield</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center"><CheckCircle2 size={20} /></div>
                                    <p className="text-xs font-black uppercase tracking-widest text-emerald-950/70">Verified_Brand_Access</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-12 border-t border-white/20">
                            <p className="text-sm font-bold leading-relaxed italic opacity-80">
                                "Join thousands of brands creating exceptional unboxing experiences with BoxFox."
                            </p>
                        </div>
                    </div>

                    {/* Form Panel - Right */}
                    <div className="lg:col-span-12 lg:col-start-6 p-8 sm:p-14 md:p-16 flex flex-col justify-center bg-white">
                        <div className="max-w-xl mx-auto w-full">
                            <div className="mb-10">
                                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-950 mb-2">Create Account.</h1>
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">Configure your account access parameters</p>
                            </div>

                            <AnimatePresence>
                                {errorMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-red-100"
                                    >
                                        <AlertCircle size={14} />
                                        {errorMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full_Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                            <UserIcon size={16} />
                                        </div>
                                        <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-[10px] focus:ring-emerald-500/5 outline-none transition-all font-black text-[11px] uppercase tracking-widest text-gray-950" placeholder="e.g. John Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Business_Name (Optional)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                            <Building2 size={16} />
                                        </div>
                                        <input name="businessName" value={formData.businessName} onChange={handleChange} type="text" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-[10px] focus:ring-emerald-500/5 outline-none transition-all font-black text-[11px] uppercase tracking-widest text-gray-950" placeholder="Company Ltd." />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email_Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                            <Mail size={16} />
                                        </div>
                                        <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-[10px] focus:ring-emerald-500/5 outline-none transition-all font-black text-[11px] uppercase tracking-widest text-gray-950" placeholder="your@email.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone_Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                            <Phone size={16} />
                                        </div>
                                        <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-[10px] focus:ring-emerald-500/5 outline-none transition-all font-black text-[11px] uppercase tracking-widest text-gray-950" placeholder="+91 XXXXX XXXXX" />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                                            <Lock size={16} />
                                        </div>
                                        <input required name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-[10px] focus:ring-emerald-500/5 outline-none transition-all font-black text-[11px] uppercase tracking-widest text-gray-950" placeholder="Minimum 8 characters" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-300 hover:text-emerald-500 transition-colors">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full relative py-6 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] overflow-hidden group active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-emerald-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                        <span className="relative z-10 flex items-center justify-center gap-4">
                                            {isLoading ? "Starting_Session..." : "Complete_Signup"}
                                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />}
                                        </span>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 text-center flex flex-col gap-6">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                                    By executing this sequence, you agree to our <br />
                                    <Link href="#" className="text-gray-900 underline decoration-emerald-500/30">Data Protocols</Link> and <Link href="#" className="text-gray-900 underline decoration-emerald-500/30">Manufacturing Terms</Link>.
                                </p>
                                <div className="w-12 h-[1px] bg-gray-100 mx-auto" />
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    ALREADY RECOGNIZED?{" "}
                                    <Link href="/login" className="text-emerald-500 hover:text-emerald-600 ml-2">
                                        Login_Here
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

