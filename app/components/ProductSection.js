"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 20;

export default function ProductSection({ searchQuery = "", category = "All", priceRange = "all", sortBy = "default" }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever filters/search/sort change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category, priceRange, sortBy]);

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
  let allProducts = sections.reduce((acc, section) => [...acc, ...section.items], []);

  // Price range filter
  if (priceRange !== "all") {
    allProducts = allProducts.filter((p) => {
      const price = parseFloat(p.price) || 0;
      if (priceRange === "0-100")    return price < 100;
      if (priceRange === "100-300")  return price >= 100 && price < 300;
      if (priceRange === "300-500")  return price >= 300 && price < 500;
      if (priceRange === "500-1000") return price >= 500 && price < 1000;
      if (priceRange === "1000+")    return price >= 1000;
      return true;
    });
  }

  // Sort
  if (sortBy === "price-asc")  allProducts = [...allProducts].sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
  if (sortBy === "price-desc") allProducts = [...allProducts].sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
  if (sortBy === "name-asc")   allProducts = [...allProducts].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  if (sortBy === "name-desc")  allProducts = [...allProducts].sort((a, b) => (b.name || "").localeCompare(a.name || ""));

  const totalPages = Math.ceil(allProducts.length / PAGE_SIZE);
  const pageProducts = allProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build page number array with ellipsis logic
  function getPageNumbers() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

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
          <>
            {/* Results info */}
            <div className="flex items-center justify-between mb-6 px-2 sm:px-0">
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">
                Showing <span className="text-gray-950">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, allProducts.length)}</span> of <span className="text-emerald-600">{allProducts.length}</span> products
              </p>
              {totalPages > 1 && (
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">
                  Page <span className="text-gray-950">{page}</span> / {totalPages}
                </p>
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12 px-2 sm:px-0">
              {pageProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04, duration: 0.6 }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-12 sm:mt-16 pb-4">
                {/* Prev */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-300 font-black text-xs">···</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                          p === page
                            ? "bg-emerald-800 text-white shadow-[0_8px_20px_rgba(6,78,59,0.25)] scale-105"
                            : "bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


