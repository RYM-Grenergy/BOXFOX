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
    <section id="products" className="py-24 px-6 lg:px-12 bg-white min-h-[600px]">
      <div className="max-w-[1600px] mx-auto space-y-40">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8">
              <Search className="text-gray-200" size={32} />
            </div>
            <h3 className="text-3xl font-black text-gray-950 uppercase tracking-tighter">No items found</h3>
            <p className="text-gray-400 font-medium mt-2">Adjust your filters or search terms.</p>
          </div>
        ) : sections.map((section, sIdx) => (
          <div key={section.category} className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-gray-100 pb-16">
              <div className="space-y-6">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]"
                >
                  Curated Collection
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase leading-none"
                >
                  {section.category}
                </motion.h2>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-950 text-white hover:bg-emerald-500 transition-all shadow-xl shadow-gray-200">
                  Total Results ({section.items.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
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


