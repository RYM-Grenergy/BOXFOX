"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Banners can now be images or videos
const banners = [
  {
    id: 1,
    type: "image",
    image: "/banner/ChatGPT Image Mar 10, 2026, 11_10_18 AM.png",
    alt: "Boxfox Premium Packaging - Style 1",
  },
  {
    id: 2,
    type: "image",
    image: "/banner/ChatGPT Image Mar 10, 2026, 10_47_25 AM.png",
    alt: "Boxfox Premium Packaging - Style 2",
  },
  {
    id: 3,
    type: "image",
    image: "/banner/ChatGPT Image Mar 10, 2026, 10_28_18 AM.png",
    alt: "Boxfox Premium Packaging - Style 3",
  },
  {
    id: 4,
    type: "image",
    image: "/banner/ChatGPT Image Mar 10, 2026, 10_24_14 AM.png",
    alt: "Boxfox Premium Packaging - Style 4",
  },
  {
    id: 5,
    type: "video",
    src: "/banner/hero_video.mp4",
    alt: "Boxfox Premium Hero Video",
  }
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0.8
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + banners.length) % banners.length);
  }, []);

  // Autoplay Logic - Pauses if Hovered OR if it's currently a Video
  useEffect(() => {
    if (isHovered) return;

    // If it's a video, the video's "onEnded" event will trigger the next slide instead!
    if (banners[currentIndex].type === "video") return;

    const timer = setInterval(() => {
      paginate(1);
    }, 2800); // 2.0 second rest + 0.8s transition
    return () => clearInterval(timer);
  }, [isHovered, currentIndex, paginate]);

  // Restart video every time we slide back to it
  useEffect(() => {
    if (banners[currentIndex].type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentIndex]);

  return (
    <section className="relative w-full bg-slate-50 pt-[90px] sm:pt-[110px] lg:pt-[140px] pb-8 sm:pb-12 flex justify-center">
      <div
        className="relative w-full aspect-[4/3] sm:aspect-video max-h-[85vh] bg-[#f2f2f2] overflow-hidden group shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.8 },
                opacity: { duration: 0.8, ease: "easeInOut" }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              {banners[currentIndex].type === "image" ? (
                <Image
                  src={banners[currentIndex].image}
                  alt={banners[currentIndex].alt}
                  fill
                  className="object-contain object-top"
                  priority={currentIndex === 0}
                  sizes="100vw"
                  quality={100}
                />
              ) : (
                <video
                  ref={(el) => {
                    if (el) {
                      videoRef.current = el;
                      el.play().catch(e => console.log("Autoplay prevented by browser:", e));
                    }
                  }}
                  src={banners[currentIndex].src}
                  muted
                  playsInline
                  onEnded={() => paginate(1)}
                  className="w-full h-full object-contain object-center pointer-events-none"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 md:p-4 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all backdrop-blur-md opacity-0 scale-90 sm:opacity-100 lg:opacity-0 group-hover:opacity-100 group-hover:scale-100 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 md:p-4 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all backdrop-blur-md opacity-0 scale-90 sm:opacity-100 lg:opacity-0 group-hover:opacity-100 group-hover:scale-100 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </button>

          {/* Pagination Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 sm:gap-3 bg-white/20 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full backdrop-blur-md shadow-lg border border-white/30">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full shadow-sm ${idx === currentIndex
                  ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-white"
                  : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/60 hover:bg-white/90"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
