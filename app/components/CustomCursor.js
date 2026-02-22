"use client";
import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const containerRef = useRef(null);
  const cubeRef = useRef(null);
  const [active, setActive] = useState(false);
  const [clicked, setClicked] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Show
      setActive(true);

      // Position
      if (containerRef.current) {
        containerRef.current.style.left = e.clientX + "px";
        containerRef.current.style.top = e.clientY + "px";
      }

      // 3D rotation
      const xPercent = (e.clientX / window.innerWidth) * 2 - 1;
      const yPercent = (e.clientY / window.innerHeight) * 2 - 1;

      const rotateY = xPercent * 35;
      const rotateX = -yPercent * 35;

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      // Hide after inactivity
      timeoutRef.current = setTimeout(() => {
        setActive(false);
      }, 1400);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setActive(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 will-change-transform ${active ? "opacity-100" : "opacity-0"
        }`}
      style={{ perspective: "600px" }}
    >
      <div
        ref={cubeRef}
        className={`relative w-7 h-7 preserve-3d transition-transform duration-[0.18s] ease-out ${clicked ? "scale-[0.75] duration-[0.12s]" : ""
          }`}
      >
        <div className="absolute w-7 h-7 bg-emerald-500/25 border-2 border-emerald-400 backdrop-blur-[4px] flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] translate-z-[14px]">
          B
        </div>
        <div className="absolute w-7 h-7 bg-emerald-500/15 border-2 border-emerald-400 backdrop-blur-[4px] flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] rotate-y-180 translate-z-[14px]"></div>
        <div className="absolute w-7 h-7 bg-emerald-500/25 border-2 border-emerald-400 backdrop-blur-[4px] flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] rotate-y-90 translate-z-[14px]"></div>
        <div className="absolute w-7 h-7 bg-emerald-500/25 border-2 border-emerald-400 backdrop-blur-[4px] flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] -rotate-y-90 translate-z-[14px]"></div>
        <div className="absolute w-7 h-7 bg-emerald-500/25 border-2 border-emerald-400 backdrop-blur-[4px] flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] rotate-x-90 translate-z-[14px]"></div>
        <div className="absolute w-7 h-7 bg-emerald-500/25 border-2 border-emerald-400 backdrop-blur-[4px] flex items-center justify-center text-emerald-400 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] -rotate-x-90 translate-z-[14px]"></div>
      </div>

      <style jsx global>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .translate-z-\\[14px\\] {
          transform: translateZ(14px);
        }
        .rotate-y-180 {
          transform: rotateY(180deg) translateZ(14px);
        }
        .rotate-y-90 {
          transform: rotateY(90deg) translateZ(14px);
        }
        .-rotate-y-90 {
          transform: rotateY(-90deg) translateZ(14px);
        }
        .rotate-x-90 {
          transform: rotateX(90deg) translateZ(14px);
        }
        .-rotate-x-90 {
          transform: rotateX(-90deg) translateZ(14px);
        }
      `}</style>
    </div>
  );
}
