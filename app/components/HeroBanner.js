"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";


const column1 = [
  "https://plus.unsplash.com/premium_photo-1683133263716-731795d25343?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1623668514914-ab262971bc88?q=80&w=800&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1681776287623-c697518f5e5b?q=80&w=800&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1731768965526-4b5f1a0a18fc?q=80&w=800&auto=format&fit=crop",
];

const column2 = [
  "https://images.unsplash.com/photo-1579299676230-4ae32e2ce4c1?q=80&w=800&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1731865337145-c784987cc41a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1673257042285-157546f25933?q=80&w=800&auto=format&fit=crop",
];

const InfiniteColumn = ({ images, speed = 20, reverse = false }) => {
  return (
    <div className="flex flex-col gap-6 overflow-hidden h-full relative">
      <motion.div
        animate={{
          y: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-6"
      >
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="w-full rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl"
          >
            <img
              src={src}
              alt="Packaging"
              className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function HeroBanner() {
  return (
    <section className="relative min-h-[95vh] w-full flex items-center bg-white overflow-hidden pt-24 lg:pt-12">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8 lg:gap-10 z-10"
          >
            {/* Tag/Label */}
            <div className="flex items-center gap-3">
              <div className="px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                  Bakery & Food — 2026 Collection
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-2">
              <h1 className="text-6xl md:text-8xl xl:text-[115px] font-black text-gray-950 leading-[0.85] tracking-[-0.05em]">
                Freshness<br />
                <span className="text-emerald-500 underline decoration-gray-100 underline-offset-[10px]">Meets Luxury</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-xl font-medium tracking-tight mt-6">
                Premium food-grade boxes for Cakes, Pastries & Pizza. Engineered for flavor preservation and premium presentation.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-5 items-center">
              <button className="px-12 py-6 bg-gray-950 text-white rounded-[1.8rem] font-bold text-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95 group">
                Shop Bakery
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-12 py-6 bg-white border-2 border-gray-100 text-gray-950 rounded-[1.8rem] font-bold text-xl hover:bg-gray-50 transition-all active:scale-95">
                Custom Orders
              </button>
            </div>

          </motion.div>

          {/* Right Column: Infinite Scroll Imagery */}
          <div className="relative h-[800px] w-full hidden lg:block overflow-hidden rounded-[4rem]">
            {/* Fade Overlays */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

            <div className="grid grid-cols-2 gap-6 h-full p-4">
              <InfiniteColumn images={column1} speed={30} />
              <InfiniteColumn images={column2} speed={35} reverse={true} />
            </div>

            {/* Quality Badge - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 right-10 z-20 bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4 max-w-[280px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                <Star fill="currentColor" size={24} />
              </div>
              <div>
                <div className="font-black text-gray-950 uppercase text-xs tracking-widest">Certified</div>
                <div className="text-sm font-bold text-gray-500 leading-tight mt-0.5">A-Grade Food Safe Materials</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
