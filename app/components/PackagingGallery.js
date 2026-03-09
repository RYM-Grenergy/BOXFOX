"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const images = [
    "https://plus.unsplash.com/premium_photo-1683133263716-731795d25343?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1623668514914-ab262971bc88?q=80&w=800&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1681776287623-c697518f5e5b?q=80&w=800&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1731768965526-4b5f1a0a18fc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579299676230-4ae32e2ce4c1?q=80&w=800&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1731865337145-c784987cc41a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1673257042285-157546f25933?q=80&w=800&auto=format&fit=crop",
];

export default function PackagingGallery() {
    return (
        <section className="py-6 sm:py-8 bg-white overflow-hidden w-full relative">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                className="flex w-max gap-4 sm:gap-6 pb-6 pt-4 px-4 sm:px-6 lg:px-12"
            >
                {[...images, ...images].map((src, i) => (
                    <div
                        key={i}
                        className="w-[160px] sm:w-[200px] md:w-[240px] h-[200px] sm:h-[240px] md:h-[300px] shrink-0 relative rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-md group"
                    >
                        {(i === 0 || i === images.length) && (
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 bg-emerald-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-black text-[6px] sm:text-[8px] uppercase tracking-widest shadow-lg flex items-center gap-1.5 sm:gap-2"
                            >
                                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-ping" />
                                LIVE_AI_GENERATION_ONLINE
                            </motion.div>
                        )}
                        <Image
                            src={src}
                            alt="Packaging"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 1024px) 80vw, 33vw"
                        />
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
