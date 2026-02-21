"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductSection({ searchQuery = "" }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = searchQuery ? `/api/products?search=${encodeURIComponent(searchQuery)}` : '/api/products';
    fetch(url)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error ${res.status}: ${text.slice(0, 100)}`);
        }
        return res.json();
      })
      .then(data => {
        setSections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [searchQuery]);

  if (loading) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto space-y-32">
          {[1, 2].map(i => (
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
    <section id="products" className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-[1600px] mx-auto space-y-40">
        {sections.map((section, sIdx) => (
          <div key={section.category} className="space-y-16">
            {/* Minimalist Header Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-gray-100 pb-16">
              <div className="space-y-6">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-xs font-black tracking-[0.4em] text-gray-400 uppercase block"
                >
                  Explore {section.category}
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter leading-none"
                >
                  {section.category}
                </motion.h2>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex bg-gray-50 p-1.5 rounded-full border border-gray-100">
                  {section.tabs.map((tab) => (
                    <button
                      key={tab}
                      className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-950"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest bg-gray-950 text-white hover:bg-emerald-500 hover:scale-105 transition-all shadow-xl shadow-gray-200">
                  View All <ArrowRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
              {section.items.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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

