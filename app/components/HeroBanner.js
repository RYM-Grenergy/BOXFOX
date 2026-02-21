"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    label: "Corrugated Mailers",
    headline: "Engineered to\nProtect & Impress",
    sub: "125+ designs in sustainable 3-ply kraft and white corrugated boards. Perfect for shipping your premium brand.",
    cta: "Explore Mailers",
    img: "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
    color: "from-gray-950/80",
  },
  {
    id: 2,
    label: "Bakery & Food",
    headline: "Freshness\nMeets Luxury",
    sub: "Food-grade boxes for Cakes, Pastries & Pizza.",
    cta: "Shop Bakery",
    img: "https://boxfox.in/wp-content/uploads/2022/11/03-4.jpg",
    color: "from-gray-950/80",
  },
  {
    id: 3,
    label: "Custom Collection",
    headline: "Multi-Color\nPremium Prints",
    sub: "Vibrant designs on premium duplex board. Curated to add personality to every unboxing experience.",
    cta: "View Collection",
    img: "https://boxfox.in/wp-content/uploads/2022/11/55-copy.png",
    color: "from-gray-950/80",
  },
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const cursorX = useSpring(rawX, { stiffness: 150, damping: 18, mass: 0.6 });
  const cursorY = useSpring(rawY, { stiffness: 150, damping: 18, mass: 0.6 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % slides.length);
    }, 8000);
    return () => clearInterval(t);
  }, [active]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setActive(
      (prevActive) =>
        (prevActive + newDirection + slides.length) % slides.length,
    );
  };

  const slide = slides[active];

  return (
    <section
      className="relative h-screen min-h-[800px] w-full overflow-hidden"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={active}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.img
            src={slide.img}
            alt={slide.headline}
            className="w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 12, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
          <div className="absolute inset-0 bg-gray-50/10" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-10 sm:px-20 md:px-32">
        <div className="max-w-4xl pt-0 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={`label-${active}`}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[2px] w-12 bg-emerald-500 rounded-full" />
            <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em]">
              {slide.label}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            key={`head-${active}`}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black text-gray-950 leading-[0.9] tracking-[-0.04em] mb-8 whitespace-pre-line"
          >
            {slide.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={`sub-${active}`}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-12 max-w-xl font-medium tracking-tight"
          >
            {slide.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={`cta-${active}`}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-6"
          >
            <button className="px-10 py-5 bg-gray-950 text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
              {slide.cta}
            </button>
            <button className="px-10 py-5 bg-white border border-gray-100 text-gray-950 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
              Custom Orders
            </button>
          </motion.div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="absolute bottom-10 right-10 sm:right-20 md:right-32 z-20 flex gap-4">
        <button
          onClick={() => paginate(-1)}
          className="w-14 h-14 rounded-full border border-gray-100 bg-white/50 backdrop-blur-xl text-gray-950 flex items-center justify-center hover:bg-gray-950 hover:text-white transition-all active:scale-90 shadow-sm"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <button
          onClick={() => paginate(1)}
          className="w-14 h-14 rounded-full border border-gray-100 bg-white/50 backdrop-blur-xl text-gray-950 flex items-center justify-center hover:bg-gray-950 hover:text-white transition-all active:scale-90 shadow-sm"
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-10 sm:left-20 md:left-32 z-20 flex gap-4 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > active ? 1 : -1);
              setActive(i);
            }}
            className="relative h-1 rounded-full overflow-hidden bg-gray-200 transition-all"
            style={{ width: i === active ? "70px" : "30px" }}
          >
            {i === active && (
              <motion.div
                className="absolute inset-0 bg-gray-950"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 8, ease: "linear" }}
                style={{ originX: 0 }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
