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
            <main className="pt-32 pb-24">
                <header className="px-6 lg:px-12 mb-16 max-w-[1600px] mx-auto border-b border-gray-100 pb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-7xl md:text-9xl font-black text-gray-950 tracking-tighter uppercase leading-[0.8]"
                            >
                                The<br /><span className="text-emerald-500">Shop.</span>
                            </motion.h1>
                            <p className="text-xl text-gray-400 font-medium mt-8 leading-relaxed">Systematic access to 500+ structural packaging solutions. Filter by product category or search for specific kinetic properties.</p>
                        </div>

                        <div className="w-full md:w-auto space-y-6">
                            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-6 w-full md:w-[450px] shadow-sm hover:shadow-xl hover:bg-white transition-all group">
                                <Search size={24} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search specific models..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent outline-none w-full font-black text-xs uppercase tracking-widest text-gray-950 placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${category === cat
                                    ? 'bg-gray-950 text-white shadow-2xl shadow-gray-200 scale-105'
                                    : 'bg-gray-50 text-gray-400 hover:bg-white hover:text-gray-950 hover:shadow-lg'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <ProductSection searchQuery={searchQuery} category={category} />
            </main>
            <Footer />
        </div>
    );
}

