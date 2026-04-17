"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isRightClicked, setIsRightClicked] = useState(false);

  // Motion values for ultra-low latency tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-frequency spring configurations for organic movement
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  // Faster spring for the main dot for precision
  const dotSpringConfig = { damping: 45, stiffness: 500 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      if (!active) setActive(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = (e) => {
      if (e.button === 0) setIsClicked(true);
      if (e.button === 2) setIsRightClicked(true);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
      setIsRightClicked(false);
    };

    const handleMouseLeave = () => setActive(false);
    const handleMouseEnter = () => setActive(true);

    // Dynamic hover detection for all interactive elements
    const handleHoverStart = (e) => {
      const target = e.target;
      if (
        target.closest('a, button, input, select, textarea, [role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleHoverStart);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    
    // Disable context menu visual conflict
    const handleContextMenu = (e) => {
        // We don't preventDefault as it's annoying, but we track state
    };
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleHoverStart);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [active, mouseX, mouseY]);

  // Don't render on mobile/tablet or if inactive
  if (typeof window !== "undefined" && window.innerWidth < 768) return null;
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      <AnimatePresence>
        {active && (
          <>
            {/* 1. The Dynamic Outer Ring (Organic Follower) */}
            <motion.div
              style={{
                x: ringX,
                y: ringY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isClicked ? 1.2 : isHovering ? 1.8 : 1,
                opacity: isHovering ? 0.3 : 0.6,
                borderColor: isHovering ? "#10b981" : "#000000",
                rotate: isClicked ? 90 : 0
              }}
              transition={{
                  scale: { type: "spring", stiffness: 300, damping: 20 },
                  opacity: { duration: 0.2 }
              }}
              className="absolute w-10 h-10 border-[1.5px] rounded-full mix-blend-difference"
            />

            {/* 2. The Precision Core (Instant Tracking) */}
            <motion.div
              style={{
                x: dotX,
                y: dotY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isClicked ? 0.6 : isHovering ? 0.4 : 1,
                backgroundColor: isHovering ? "#10b981" : "#10b981",
                boxShadow: isHovering 
                    ? "0 0 20px rgba(16, 185, 129, 0.8)" 
                    : "0 0 10px rgba(16, 185, 129, 0.4)"
              }}
              className="absolute w-2.5 h-2.5 rounded-full z-10"
            />

            {/* 3. The Fox Tail Particle System (Ambient Premium) */}
            <motion.div
              style={{
                x: ringX,
                y: ringY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                rotate: isHovering ? 45 : 0,
                opacity: isHovering ? 0 : 0.8,
                scale: isHovering ? 0 : 1
              }}
              className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[1px] ml-6 mt-6 opacity-40 mix-blend-screen"
            />
            
            <motion.div
              style={{
                x: ringX,
                y: ringY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                rotate: isHovering ? -45 : 0,
                opacity: isHovering ? 0 : 0.6,
                scale: isHovering ? 0 : 1
              }}
              className="absolute w-1 h-1 bg-teal-300 rounded-full blur-[2px] -ml-6 -mt-6 opacity-40 mix-blend-screen"
            />

            {/* 4. "Magnetic" Hover Glow (Subtle UI interaction) */}
            {isHovering && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.15 }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{
                        x: dotX,
                        y: dotY,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                    className="absolute w-20 h-20 bg-emerald-500 rounded-full blur-2xl"
                />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
