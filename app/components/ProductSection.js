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
    params.append('all', 'true');
    if (searchQuery) params.append('search', searchQuery);
    if (category && category !== "All") params.append('category', category);

    // Efficient server-side fetching with scaling support
    fetch(url + (params.toString() ? `?${params.toString()}` : ''))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          if (category !== "All") {
            setSections(data.filter(s => s.category === category));
          } else {
            setSections(data);
          }
        } else {
          console.warn("ProductSection: API returned non-array data", data);
          setSections([]);
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
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(j => (
              <div key={j} className="animate-pulse aspect-square bg-gray-50 rounded-[2rem]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Flatten all products from all sections into one array
  const allProducts = sections.reduce((acc, section) => [...acc, ...section.items], []);

  return (
    <section id="products" className="py-4 md:py-8 px-4 sm:px-6 md:px-12 bg-white min-h-[600px]">
      <div className="max-w-[1600px] mx-auto">
        {allProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40 text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 sm:mb-8">
              <Search className="text-gray-200" size={24} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tighter">No items found</h3>
            <p className="text-sm sm:text-base text-gray-400 font-medium mt-2">Adjust your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12 px-2 sm:px-0">
            {allProducts.map((product, idx) => (
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
        )}
      </div>
    </section>
  );
}


