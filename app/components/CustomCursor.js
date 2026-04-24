"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Motion values for ultra-low latency tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Follower ring spring (organic delay)
  const ringSpringConfig = { damping: 35, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  // Precision core spring (instant tracking)
  const dotSpringConfig = { damping: 45, stiffness: 600 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      if (!active) setActive(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

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
    document.addEventListener("mouseleave", () => setActive(false));
    document.addEventListener("mouseenter", () => setActive(true));

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleHoverStart);
    };
  }, [active, mouseX, mouseY]);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      <AnimatePresence>
        {active && (
          <>
            {/* 1. Follower Ring (The "Premium" Feel) */}
            <motion.div
              style={{
                x: ringX,
                y: ringY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isClicked ? 0.8 : isHovering ? 1.5 : 1,
                opacity: isHovering ? 0.4 : 0.2,
                borderColor: "#10b981",
              }}
              transition={{
                scale: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="absolute w-10 h-10 border-[1.5px] rounded-full mix-blend-difference"
            />

            {/* 2. Precision Core Dot */}
            <motion.div
              style={{
                x: dotX,
                y: dotY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                scale: isClicked ? 0.6 : isHovering ? 0.4 : 1,
                backgroundColor: "#10b981",
                boxShadow: isHovering 
                    ? "0 0 20px rgba(16, 185, 129, 0.8)" 
                    : "0 0 10px rgba(16, 185, 129, 0.4)"
              }}
              className="absolute w-2.5 h-2.5 rounded-full z-10"
            />

            {/* 3. Interaction Glow (Subtle pulse on hover) */}
            {isHovering && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  x: dotX,
                  y: dotY,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                className="absolute w-16 h-16 bg-emerald-400 rounded-full blur-2xl"
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
