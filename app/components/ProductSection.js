"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";

const allProducts = {
  bestSeller: [
    {
      id: "pizza-premium-12",
      name: "Premium 3-Ply Custom Printed Pizza Box 12x12x1.5\"",
      img: "https://images.unsplash.com/photo-1607246532821-04a33934f0e0?w=600&q=80",
      price: 14.50,
      originalPrice: 38.00,
      badge: "Best Seller",
    },
    {
      id: "sweet-box-500g",
      name: "Laminated Sweet Box for 500g — High Gloss Finish",
      img: "https://images.unsplash.com/photo-1581539222482-c6a661bb1cae?w=600&q=80",
      price: 12.00,
      originalPrice: 28.00,
    },
    {
      id: "rigid-gift-luxury",
      name: "Handmade Luxury Rigid Gift Box with Satin Lining",
      img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
      price: 45.00,
      originalPrice: 90.00,
      badge: "Premium",
    },
    {
      id: "corrugated-shipping-m",
      name: "Heavy-Duty Corrugated Shipping Box (Medium)",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
      price: 18.00,
      originalPrice: 32.00,
    },
    {
      id: "bakery-cake-1kg",
      name: "Telescopic Cake Box for 1kg — Custom Pattern",
      img: "https://images.unsplash.com/photo-1614264624138-038cbece871f?w=600&q=80",
      price: 22.00,
      originalPrice: 55.00,
    },
    {
      id: "duplex-white-7",
      name: "Plain White Duplex Pizza Box 7x7x1.5\"",
      img: "https://images.unsplash.com/photo-1620959418659-36195e0c50d4?w=600&q=80",
      price: 5.00,
      originalPrice: 24.00,
      badge: "Hot Deal",
    },
  ],
  newArrivals: [
    {
      id: "magnet-rigid-box",
      name: "Magnetic Closure Rigid Box — Midnight Black",
      img: "https://images.unsplash.com/photo-1549463327-3d168e4ee003?w=600&q=80",
      price: 65.00,
      originalPrice: 120.00,
      badge: "New",
    },
    {
      id: "mailer-custom-print",
      name: "E-Commerce Custom Printed Mailer Box",
      img: "https://images.unsplash.com/photo-1522075676239-253c40130dcf?w=600&q=80",
      price: 32.00,
      originalPrice: 58.00,
      badge: "New",
    },
  ],
  bakery: [
    {
      id: "bakery-cake-2kg",
      name: "Premium 2kg Cake Box — Floral Print",
      img: "https://images.unsplash.com/photo-1633519125181-0021f709598f?w=600&q=80",
      price: 35.00,
      originalPrice: 65.00,
    },
  ]
};

const tabs = [
  { key: "bestSeller", label: "Best Seller" },
  { key: "newArrivals", label: "New Arrivals" },
  { key: "bakery", label: "Bakery" },
];

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("bestSeller");
  const products = allProducts[activeTab];

  return (
    <section id="products" className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-[1600px] mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 block"
            >
              Our Products
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-gray-950 tracking-tighter leading-[0.9]"
            >
              Featured <span className="text-gray-400">Packaging</span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-[2rem] h-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === tab.key
                    ? "bg-white text-gray-950 shadow-xl scale-105"
                    : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 flex justify-center">
          <button className="group px-12 py-5 bg-gray-50 border border-gray-200 text-gray-950 font-bold rounded-full flex items-center gap-3 hover:bg-white transition-all hover:scale-105">
            LOAD MORE PRODUCTS
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

