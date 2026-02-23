"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MatrixBackground from "./MatrixBackground";


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
    <section className="relative min-h-[90vh] sm:min-h-[95vh] w-full flex items-center bg-white overflow-hidden pt-20 sm:pt-24 lg:pt-12">
      <MatrixBackground />

      {/* Decorative 'Packaging' text in background - Adjusted for better responsiveness */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-[0.02] sm:opacity-[0.03] select-none pointer-events-none hidden md:flex pr-2 sm:pr-4">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-[6rem] sm:text-[10rem] 2xl:text-[14rem] font-black leading-[0.8] rotate-90 origin-right tracking-tighter">PACKAGING</span>
        ))}
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 w-full py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">

          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 sm:gap-8 lg:gap-10 z-10 items-center lg:items-start text-center lg:text-left"
          >
            {/* Tag/Label */}
            <div className="flex items-center gap-3">
              <div className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gray-50 border border-gray-100">
                <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Bakery & Food — 2026 Collection
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-[115px] font-black text-gray-950 leading-[0.9] sm:leading-[0.85] tracking-[-0.05em] uppercase">
                Freshness<br />
                <span className="text-emerald-500 italic drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)]">Meets Luxury</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-xl font-medium tracking-tight mt-4 sm:mt-6">
                Premium food-safe boxes for Cakes, Pastries & Pizza. <span className="text-emerald-500 font-black">High Quality Food Grade</span> design tools to keep food fresh and your brand looking beautiful.
              </p>
            </div>

            {/* CTAs - AI LAB FOCUS */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center w-full sm:w-auto">
              <Link href="/customize" className="px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 bg-gray-950 text-white rounded-[1.5rem] sm:rounded-[2rem] font-bold text-base sm:text-lg md:text-xl hover:shadow-[0_25px_60px_rgba(16,185,129,0.4)] hover:bg-emerald-600 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 group relative overflow-hidden text-center shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex items-center gap-4">
                  Launch AI Lab
                  <ArrowRight size={20} className="sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link href="/shop" className="px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 bg-white border-2 border-gray-100 text-gray-950 rounded-[1.5rem] sm:rounded-[2rem] font-bold text-base sm:text-lg md:text-xl hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-3 justify-center text-center shadow-lg">
                Shop Bakery
              </Link>
            </div>

            {/* Viral Metrics */}
            <div className="flex items-center gap-8 sm:gap-12 pt-8 sm:pt-10 border-t border-gray-50 w-full lg:w-fit justify-center lg:justify-start">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-gray-950">1.2M+</span>
                <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Neural_Generations</span>
              </div>
              <div className="w-[1px] h-8 sm:h-10 bg-gray-100" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-emerald-600 tracking-[-0.05em]">0.1s</span>
                <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Real_Time_3D_Sim</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Infinite Scroll Imagery */}
          <div className="relative h-[600px] lg:h-[850px] w-full hidden lg:block overflow-hidden rounded-[3rem] lg:rounded-[5rem] shadow-[0_60px_120px_rgba(0,0,0,0.15)] border border-gray-100">
            {/* Fade Overlays */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

            <div className="grid grid-cols-2 gap-4 lg:gap-6 h-full p-4 lg:p-6">
              <InfiniteColumn images={column1} speed={35} />
              <InfiniteColumn images={column2} speed={40} reverse={true} />
            </div>

            {/* Live AI Pulse - Top Left */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-8 lg:top-12 left-8 lg:left-12 z-20 bg-emerald-500 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full font-black text-[8px] lg:text-[10px] uppercase tracking-widest shadow-[0_20px_40px_rgba(16,185,129,0.5)] flex items-center gap-3 lg:gap-4"
            >
              <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-white animate-ping" />
              Live_AI_Generation_Online
            </motion.div>
          </div>

        </div>
      </div>

      {/* VIRAL PACKAGING MARQUEE */}
      <div className="absolute bottom-0 left-0 right-0 py-8 bg-gray-950 overflow-hidden whitespace-nowrap z-30">
        <motion.div
          animate={{ x: [0, -2500] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 items-center opacity-70 shrink-0"
        >
          {[...Array(30)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 shrink-0">
              <span className="text-white font-black text-3xl uppercase tracking-[0.5em] italic">Packaging</span>
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
