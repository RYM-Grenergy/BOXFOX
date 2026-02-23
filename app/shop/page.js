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
            <main className="pt-24 sm:pt-32 pb-16 sm:pb-24">
                <header className="px-4 sm:px-6 lg:px-12 mb-10 sm:mb-16 max-w-[1600px] mx-auto border-b border-gray-100 pb-10 sm:pb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-950 tracking-tighter uppercase leading-[0.85] sm:leading-[0.8]"
                            >
                                The<br /><span className="text-emerald-500">Shop.</span>
                            </motion.h1>
                            <p className="text-base sm:text-xl text-gray-400 font-medium mt-6 sm:mt-8 leading-relaxed px-4 sm:px-0">Systematic access to 500+ structural packaging solutions. Filter by product category or search for specific kinetic properties.</p>
                        </div>

                        <div className="w-full lg:w-auto space-y-6">
                            <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] sm:rounded-[2rem] px-5 sm:px-8 py-4 sm:py-6 w-full lg:w-[450px] shadow-sm hover:shadow-xl hover:bg-white transition-all group">
                                <Search size={20} className="text-gray-300 group-hover:text-emerald-500 transition-colors sm:w-6 sm:h-6" />
                                <input
                                    type="text"
                                    placeholder="Search specific models..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent outline-none w-full font-black text-[10px] sm:text-xs uppercase tracking-widest text-gray-950 placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-16 flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all ${category === cat
                                    ? 'bg-gray-950 text-white shadow-xl sm:shadow-2xl shadow-gray-200 scale-105'
                                    : 'bg-gray-50 text-gray-400 hover:bg-white hover:text-gray-950 hover:shadow-lg'
                                    }`}
                            >
                                {cat}
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

