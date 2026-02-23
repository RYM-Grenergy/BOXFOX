"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductSection({ searchQuery = "", category = "All" }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products`;
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);

    // If not "All", we might want to filter, but our API returns sections.
    // Let's assume the API handles it or we filter client-side.
    // For now, let's fetch all and filter in UI if category != "All"

    fetch(url + (params.toString() ? `?${params.toString()}` : ''))
      .then(res => res.json())
      .then(data => {
        if (category !== "All") {
          setSections(data.filter(s => s.category === category));
        } else {
          setSections(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [searchQuery, category]);

  if (loading) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto space-y-32">
          {[1].map(i => (
            <div key={i} className="animate-pulse space-y-12">
              <div className="h-20 bg-gray-50 rounded-3xl w-1/3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="aspect-[4/5] bg-gray-50 rounded-[2.5rem]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 md:py-32 px-4 sm:px-6 md:px-12 bg-white min-h-[600px]">
      <div className="max-w-[1600px] mx-auto space-y-20 md:space-y-40">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40 text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 sm:mb-8">
              <Search className="text-gray-200" size={24} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tighter">No items found</h3>
            <p className="text-sm sm:text-base text-gray-400 font-medium mt-2">Adjust your filters or search terms.</p>
          </div>
        ) : sections.map((section, sIdx) => (
          <div key={section.category} className="space-y-12 sm:space-y-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12 border-b border-gray-100 pb-10 sm:pb-16 text-center lg:text-left">
              <div className="space-y-4 sm:space-y-6">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-emerald-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em]"
                >
                  Our Favorites
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase leading-none"
                >
                  {section.category}
                </motion.h2>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-gray-950 text-white hover:bg-emerald-500 transition-all shadow-lg active:scale-95">
                  {section.items.length} Products Found
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-10 gap-y-10 sm:gap-y-20 px-2 sm:px-0">
              {section.items.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.8 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


