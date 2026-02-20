"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    label: "Duplex Collection",
    headline: "Design Your Brand,\nPrint Your Story",
    sub: "Explore our curated packaging to discover the perfect boxes for your unique vision.",
    cta: "Explore Collection",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=90",
    color: "from-emerald-900/40",
  },
  {
    id: 2,
    label: "Rigid · Handmade",
    headline: "Premium Rigid\nGift Boxes",
    sub: "100% handmade luxury boxes — built for gifting, retail, and brand impressions that last.",
    cta: "Shop Rigid Boxes",
    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1600&q=90",
    color: "from-blue-900/40",
  },
  {
    id: 3,
    label: "Corrugated",
    headline: "Strong, Sustainable\nPackaging",
    sub: "Multiple designs, lots of options. Built to protect, designed to impress.",
    cta: "View Corrugated",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=90",
    color: "from-orange-900/40",
  },
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [active]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setActive((prevActive) => (prevActive + newDirection + slides.length) % slides.length);
  };

  const slide = slides[active];

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative rounded-[2rem] overflow-hidden group">
        <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.img
                src={slide.img}
                alt={slide.headline}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/40 to-transparent`} />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 sm:px-16 md:px-24">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`label-${active}`}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="h-[1px] w-8 bg-white/60" />
                <span className="text-sm font-medium text-white/90 uppercase tracking-[0.2em]">
                  {slide.label}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                key={`head-${active}`}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8 whitespace-pre-line"
              >
                {slide.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`sub-${active}`}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-lg text-balance"
              >
                {slide.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`cta-${active}`}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:pr-12">
                  <span className="relative z-10">{slide.cta}</span>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all">
                  Custom Orders
                </button>
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-12 right-12 z-20 hidden md:flex gap-4">
            <button
              onClick={() => paginate(-1)}
              className="p-4 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="p-4 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-12 left-8 sm:left-16 md:left-24 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > active ? 1 : -1);
                  setActive(i);
                }}
                className="relative h-1.5 rounded-full overflow-hidden bg-white/20 transition-all"
                style={{ width: i === active ? "60px" : "30px" }}
              >
                {i === active && (
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                    style={{ originX: 0 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

