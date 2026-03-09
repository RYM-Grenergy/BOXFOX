"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MatrixBackground from "./MatrixBackground";
import Image from "next/image";

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
            className="w-full h-[350px] relative rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl"
          >
            <Image
              src={src}
              alt="Packaging"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 0vw, 25vw"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function HeroBanner() {
  const [textIndex, setTextIndex] = React.useState(0);
  const words = ["Bakery", "Sweets", "Pizza", "Sandwich"];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[95vh] w-full flex items-center bg-white overflow-hidden pt-12 sm:pt-24 lg:pt-12">
      <MatrixBackground />

      {/* Decorative 'Packaging' text in background - Adjusted for better responsiveness */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-[0.02] sm:opacity-[0.03] select-none pointer-events-none hidden md:flex pr-2 sm:pr-4">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-[6rem] sm:text-[10rem] 2xl:text-[14rem] font-black leading-[0.8] rotate-90 origin-right tracking-tighter">PACKAGING</span>
        ))}
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 w-full pt-8 pb-10 sm:pb-32">
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


            {/* Headline */}
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-[115px] font-black text-gray-950 leading-[0.9] sm:leading-[0.85] tracking-[-0.05em] uppercase">
                Freshness<br />
                <span className="text-emerald-500 italic drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)]">Meets Luxury</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-xl font-medium tracking-tight mt-2 sm:mt-3">
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
              <Link href="/shop" className="relative px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 bg-white border-2 border-gray-100 text-gray-950 rounded-[1.5rem] sm:rounded-[2rem] font-bold text-base sm:text-lg md:text-xl hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center overflow-hidden min-w-[200px] sm:min-w-[260px] shadow-lg group">
                <div className="flex items-center justify-center translate-x-2">
                  <span className="mr-2">Shop</span>
                  <div className="relative h-[1.2em] w-20 sm:w-28 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={textIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 flex items-center"
                      >
                        <span className="text-emerald-600">{words[textIndex]}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <ArrowRight size={20} className="ml-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>


          </motion.div>

          {/* Mobile Horizontal Scroll Imagery */}
          <div className="flex lg:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 sm:gap-6 pb-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)]">
            {([...column1, ...column2]).map((src, i) => (
              <div
                key={i}
                className="min-w-[260px] sm:min-w-[320px] h-[320px] sm:h-[400px] shrink-0 snap-center relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl"
              >
                {i === 0 && (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-4 left-4 z-20 bg-emerald-500 text-white px-4 py-2 rounded-full font-black text-[8px] sm:text-[9px] uppercase tracking-widest shadow-lg flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping" />
                    Live_AI
                  </motion.div>
                )}
                <Image
                  src={src}
                  alt="Packaging"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 50vw"
                />
              </div>
            ))}
          </div>

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
      <div className="absolute bottom-0 left-0 right-0 py-3 sm:py-6 md:py-8 bg-gray-950 overflow-hidden whitespace-nowrap z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <motion.div
          animate={{ x: [0, -2500] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 sm:gap-16 items-center opacity-70 shrink-0"
        >
          {[...Array(30)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 sm:gap-16 shrink-0">
              <span className="text-white font-black text-lg sm:text-2xl md:text-3xl uppercase tracking-[0.3em] sm:tracking-[0.5em] italic">Packaging</span>
              <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
