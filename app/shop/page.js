"use client";
import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Filter } from "lucide-react";
import ProductSection from "../components/ProductSection";

export default function ShopPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [categories, setCategories] = useState(["All"]);

    React.useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                const cats = ["All", ...data.map(s => s.category)];
                setCategories(cats);
            });
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 sm:pt-40 pb-12 sm:pb-16">
                <header className="px-4 sm:px-6 lg:px-12 mb-4 sm:mb-6 max-w-[1600px] mx-auto border-b border-gray-100 pb-4 sm:pb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-950 tracking-tighter uppercase leading-[0.85] sm:leading-[0.8]"
                            >
                                The<br /><span className="text-emerald-500">Shop.</span>
                            </motion.h1>
                            <p className="text-base sm:text-xl text-gray-400 font-medium mt-3 sm:mt-4 leading-relaxed px-4 sm:px-0">Systematic access to 500+ structural packaging solutions. Filter by product category or search for specific kinetic properties.</p>
                        </div>

                        <div className="w-full lg:w-auto space-y-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative group w-full lg:w-[500px]"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-900 rounded-[1.6rem] sm:rounded-[2.1rem] opacity-20 group-hover:opacity-100 group-focus-within:opacity-100 blur transition duration-500 group-hover:duration-200"></div>
                                <div className="relative flex items-center gap-3 sm:gap-4 bg-white border border-emerald-800/20 rounded-[1.5rem] sm:rounded-[2rem] px-5 sm:px-8 py-4 sm:py-6 w-full shadow-sm group-hover:bg-white transition-all">
                                    <Search size={20} className="text-emerald-800 transition-colors sm:w-6 sm:h-6" />
                                    <input
                                        type="text"
                                        placeholder="Search specific models..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent outline-none w-full font-black text-[10px] sm:text-xs uppercase tracking-widest text-gray-950 placeholder:text-gray-400"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-10 flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all relative overflow-hidden group/btn ${category === cat
                                    ? 'bg-emerald-800 text-white shadow-[0_10px_25px_rgba(6,78,59,0.3)] scale-105 border-emerald-700'
                                    : 'bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200'
                                    } border-2 border-transparent`}
                            >
                                {category === cat && (
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '200%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        ))}
                    </div>
                </header>

                <div className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
                    <ProductSection searchQuery={searchQuery} category={category} />
                </div>
            </main>
            <Footer />
        </div>
    );
}

