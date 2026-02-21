"use client";
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import Link from 'next/link';
import { ShieldCheck, Truck, Recycle, Award } from "lucide-react";

export default function AboutPage() {
    const values = [
        { title: 'Premium Quality', desc: 'We use high-grade 3-ply and duplex boards to ensure maximum product safety.', icon: <Award className="text-emerald-500" /> },
        { title: 'Eco-Friendly', desc: 'Our packaging is 100% recyclable and made from sustainable paper sources.', icon: <Recycle className="text-blue-500" /> },
        { title: 'Fast Delivery', desc: 'Optimized logistics to ensure your packaging reaches you on time, every time.', icon: <Truck className="text-orange-500" /> },
        { title: 'Design Innovation', desc: 'The Design Hub allows you to visualize structural integrity before you buy.', icon: <ShieldCheck className="text-purple-500" /> },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32">
                <section className="px-6 lg:px-12 py-24 max-w-[1600px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-gray-950 rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl"
                    >
                        <img src="/BOXFOX-1.png" className="w-16 h-auto" alt="BoxFox" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-9xl font-black text-gray-950 tracking-tighter leading-[0.85]"
                    >
                        Engineering <br /><span className="text-gray-300">The Future</span> <br /> Of Boxing.
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left"
                    >
                        {values.map((v, i) => (
                            <div key={v.title} className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200 transition-all group">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {v.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-950 mb-3">{v.title}</h3>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </section>

                <section className="bg-gray-950 py-32 text-center overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50"></div>
                    <div className="relative z-10 px-6 max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8">Ready to revolutionize your packaging?</h2>
                        <Link href="/shop" className="inline-block px-12 py-5 bg-emerald-500 text-gray-950 font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-sm">
                            Explore Our Collection
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
