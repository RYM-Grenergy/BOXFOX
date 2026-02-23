"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import ProductCard from "./ProductCard";

export default function TopSellingStrip() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                // Flatten all items from sections and take first 10
                const allItems = data.reduce((acc, section) => [...acc, ...section.items], []);
                setProducts(allItems.slice(0, 10));
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch top products:", err);
                setLoading(false);
            });
    }, []);

    if (loading || products.length === 0) return null;

    return (
        <section className="py-12 sm:py-24 bg-gray-50/50 relative overflow-hidden text-center sm:text-left">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-16 gap-4">
                    <div className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex items-center justify-center sm:justify-start gap-2"
                        >
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                                <TrendingUp size={10} className="text-emerald-600" />
                                <span className="text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                                    Best Sellers
                                </span>
                            </div>
                        </motion.div>
                        <h2 className="text-3xl sm:text-6xl font-black text-gray-950 uppercase tracking-tighter leading-[0.9]">
                            Top 10 <span className="text-emerald-500">Selling.</span>
                        </h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="hidden sm:flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm self-start md:self-auto"
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                            <Star fill="currentColor" size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <div>
                            <div className="text-[9px] sm:text-[10px] font-black text-gray-950 uppercase tracking-widest">Premium Quality</div>
                            <div className="text-[10px] sm:text-xs font-bold text-gray-400">Voted by 500+ Brands</div>
                        </div>
                    </motion.div>
                </div>

                {/* Horizontal Scroll for Products */}
                <div className="flex overflow-x-auto gap-4 sm:gap-8 pb-8 sm:pb-12 no-scrollbar snap-x snap-mandatory">
                    {products.map((product, idx) => (
                        <div key={product.id} className="min-w-[calc(50%-1rem)] sm:min-w-[320px] max-w-[320px] snap-center">
                            <ProductCard product={product} />
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="min-w-[calc(50%-1rem)] sm:min-w-[320px] snap-center">
                        <a
                            href="/shop"
                            className="group h-[300px] sm:h-[450px] w-full bg-gray-950 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 sm:p-12 hover:bg-emerald-600 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="grid grid-cols-4 gap-2 rotate-12 scale-150">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className="w-full aspect-square border-2 border-white rounded-lg" />
                                    ))}
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-45 transition-all duration-500">
                                    <ArrowRight size={32} className="sm:w-10 sm:h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-2">Explore All</h3>
                                    <p className="text-white/60 text-[10px] sm:text-sm font-bold tracking-widest uppercase">200+ Premium Designs</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
