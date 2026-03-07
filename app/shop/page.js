"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Filter, ChevronDown } from "lucide-react";
import ProductSection from "../components/ProductSection";

export default function ShopPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [categories, setCategories] = useState(["All"]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showFilter, setShowFilter] = useState(false);

    // Optimized Search: Debounce search to reduce DB hits for 10k+ scalability
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400); // 400ms delay
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetch('/api/products?all=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const cats = ["All", ...data.map(s => s.category)];
                    setCategories(cats);

                    // Calculate total count
                    const total = data.reduce((acc, section) => acc + (section.items?.length || 0), 0);
                    setTotalProducts(total);
                } else if (data.error) {
                    console.warn("Shop Filter: API returned connection error, showing empty state.");
                } else {
                    console.error("ShopPage: API returned unexpected format", data);
                }
            })
            .catch(err => {
                console.warn("Shop Fetch Blocked:", err);
            });
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <main className="pt-24 sm:pt-40 pb-12 sm:pb-16">
                <header className="px-4 sm:px-6 lg:px-12 mb-2 sm:mb-6 max-w-[1600px] mx-auto border-b border-gray-100 pb-4 sm:pb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-950 tracking-tighter uppercase leading-[0.85] sm:leading-[0.8]"
                            >
                                The<br /><span className="text-emerald-500">Shop.</span>
                            </motion.h1>
                            <p className="text-[10px] sm:text-xl text-gray-400 font-medium mt-2 sm:mt-4 leading-relaxed px-4 sm:px-0 max-w-xl">
                                Engineered for Freshness. Access <span className="text-emerald-600 font-black">{totalProducts}+</span> precision-crafted packaging solutions optimized for food safety and brand dominance.
                            </p>
                        </div>

                        <div className="w-full lg:w-auto space-y-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative group w-full lg:w-[500px]"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-900 rounded-[1.6rem] sm:rounded-[2.1rem] opacity-20 group-hover:opacity-100 group-focus-within:opacity-100 blur transition duration-500 group-hover:duration-200"></div>
                                <div className="relative flex items-center gap-3 sm:gap-4 bg-white border border-emerald-800/20 rounded-[1.5rem] sm:rounded-[2rem] px-5 sm:px-8 py-3 sm:py-6 w-full shadow-sm group-hover:bg-white transition-all">
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

                    {/* Desktop Category View */}
                    <div className="hidden lg:flex flex-col mt-10 gap-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Select Packaging Category</h2>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group/btn ${category === cat
                                        ? 'bg-emerald-800 text-white shadow-[0_10px_25px_rgba(6,78,59,0.3)] scale-105'
                                        : 'bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-800'
                                        } border-2 border-transparent`}
                                >
                                    <span className="relative z-10">{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Filter UI */}
                    <div className="lg:hidden mt-6 relative z-50">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                        >
                            <span className="flex items-center gap-3">
                                <Filter size={16} className="text-emerald-500" />
                                {category === "All" ? "Filter Categories" : `Category: ${category}`}
                            </span>
                            <motion.div
                                animate={{ rotate: showFilter ? 180 : 0 }}
                            >
                                <ChevronDown size={14} className="opacity-50" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {showFilter && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden p-2 grid grid-cols-2 gap-2"
                                >
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setCategory(cat);
                                                setShowFilter(false);
                                            }}
                                            className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${category === cat
                                                ? 'bg-emerald-500 text-white shadow-lg'
                                                : 'bg-gray-50 text-gray-500 active:bg-emerald-50 active:text-emerald-600'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <div className="px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
                    <ProductSection searchQuery={debouncedSearch} category={category} />
                </div>
            </main>
        </div>
    );
}
