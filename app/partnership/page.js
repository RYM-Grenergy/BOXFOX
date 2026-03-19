"use client";
import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe } from "lucide-react";

export default function PartnershipPage() {
    const perks = [
        {
            title: "Market Reach",
            desc: "Access a global network of buyers seeking premium packaging solutions.",
            icon: <Globe className="text-emerald-500" />
        },
        {
            title: "Design Support",
            desc: "Leverage our advanced 3D and AI design tools for your clients.",
            icon: <Zap className="text-blue-500" />
        },
        {
            title: "Priority Flow",
            desc: "Enjoy faster production cycles and dedicated account management.",
            icon: <ShieldCheck className="text-purple-500" />
        }
    ];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        contactNumber: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/partnership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', location: '', contactNumber: '', message: '' });
            }
        } catch (error) {
            console.error("Submission failed");
        }
        setSubmitting(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-white text-gray-950 font-sans selection:bg-emerald-500 selection:text-white">
            <Navbar />

            <main className="pt-24 lg:pt-32">
                {/* Hero Header */}
                <section className="px-6 lg:px-12 py-16 md:py-24 bg-gray-950 text-white rounded-b-[3rem] md:rounded-b-[5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-emerald-500/10 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
                    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 md:mb-8 block">Partner_Program</span>
                            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 md:mb-10 text-white">
                                Be with <br /> <span className="text-emerald-500 italic">BoxFox.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed italic max-w-xl mx-auto lg:mx-0">
                                Join our Sales Partnership Program and help us redefine the packaging industry while growing your business.
                            </p>
                        </motion.div>

                        <div className="grid gap-4 md:gap-6">
                            {perks.map((p, i) => (
                                <motion.div
                                    key={p.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 + 0.5 }}
                                    className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-md flex items-center gap-6 md:gap-8 group hover:bg-white/10 transition-all"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        {p.icon}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-xs md:text-sm font-black uppercase tracking-widest mb-1.5 md:mb-2 text-white/90">{p.title}</h4>
                                        <p className="text-[10px] md:text-xs text-gray-400 font-medium leading-relaxed">{p.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="px-4 md:px-6 lg:px-12 py-20 md:py-32">
                    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 md:gap-20">
                        <div className="lg:col-span-5">
                            <div className="lg:sticky lg:top-40 space-y-8 md:space-y-12">
                                <div className="p-8 md:p-12 bg-gray-50 rounded-[3rem] md:rounded-[4rem] border border-gray-100 shadow-sm">
                                    <Sparkles className="text-emerald-500 mb-6 md:mb-8" size={36} />
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-tight italic">Why Partner <br /> <span className="text-emerald-500">With Us?</span></h3>
                                    <ul className="space-y-4 md:space-y-6">
                                        {[
                                            "Generous commission structures",
                                            "Full marketing collateral access",
                                            "Dedicated partner dashboard",
                                            "Wholesale pricing benefits"
                                        ].map(text => (
                                            <li key={text} className="flex items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-600">
                                                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-emerald-50 p-8 sm:p-12 md:p-16 lg:p-20 rounded-[3rem] md:rounded-[4rem] border border-emerald-100 shadow-2xl shadow-emerald-500/5"
                            >
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-950 mb-4">Application Sent!</h2>
                                        <p className="text-gray-500 font-medium italic">Our partnership team will review your data and reach out via encrypted voice or email soon.</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="mt-10 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 underline"
                                        >
                                            Submit another application
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-10 md:mb-14">
                                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-950 mb-4 italic leading-none text-center md:text-left">Apply for Partnership.</h2>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 text-center md:text-left">Secure Application Portal</p>
                                        </div>

                                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10" onSubmit={handleSubmit}>
                                            <div className="space-y-2 md:space-y-3">
                                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 md:ml-6">Name*</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-emerald-100 focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                                                    placeholder="Enter Full Name"
                                                />
                                            </div>
                                            <div className="space-y-2 md:space-y-3">
                                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 md:ml-6">Email*</label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-emerald-100 focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                                                    placeholder="name@company.com"
                                                />
                                            </div>
                                            <div className="space-y-2 md:space-y-3">
                                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 md:ml-6">Location (Optional)</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-emerald-100 focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                                                    placeholder="City / State"
                                                />
                                            </div>
                                            <div className="space-y-2 md:space-y-3">
                                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 md:ml-6">Contact Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="contactNumber"
                                                    value={formData.contactNumber}
                                                    onChange={handleChange}
                                                    className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-emerald-100 focus:border-emerald-500 outline-none font-bold text-sm transition-all shadow-sm"
                                                    placeholder="Direct Number"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex items-center gap-4 md:gap-6 py-4 md:py-5 bg-white/50 px-5 md:px-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-emerald-100/50">
                                                <input type="checkbox" id="partnership_check" className="w-5 h-5 md:w-6 md:h-6 accent-emerald-500 cursor-pointer" defaultChecked />
                                                <label htmlFor="partnership_check" className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-tight cursor-pointer">I am interested in BoxFox Sales Partnership</label>
                                            </div>
                                            <div className="space-y-2 md:space-y-3 md:col-span-2">
                                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 md:ml-6">Message</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className="w-full px-6 md:px-8 py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] bg-white border border-emerald-100 focus:border-emerald-500 outline-none font-bold text-sm transition-all resize-none shadow-sm"
                                                    placeholder="Tell us about your background..."
                                                ></textarea>
                                            </div>
                                            <div className="md:col-span-2 pt-6 md:pt-10">
                                                <button
                                                    disabled={submitting}
                                                    type="submit"
                                                    className="w-full py-6 md:py-8 bg-emerald-500 text-white rounded-[2rem] md:rounded-[3rem] flex items-center justify-center gap-4 md:gap-6 font-black text-[12px] md:text-[13px] uppercase tracking-[0.4em] md:tracking-[0.5em] hover:bg-gray-950 transition-all shadow-2xl shadow-emerald-500/30 active:scale-[0.98] group disabled:opacity-50"
                                                >
                                                    {submitting ? "Applying..." : "Apply for Partnership"}
                                                    <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" />
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}
