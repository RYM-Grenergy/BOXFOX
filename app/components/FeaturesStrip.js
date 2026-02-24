"use client";
import React from "react";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Cpu, Headphones } from "lucide-react";
import MatrixBackground from "./MatrixBackground";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Quick and reliable shipping for all your orders.",
    tag: "PRIORITY"
  },
  {
    icon: ShieldCheck,
    title: "Top Quality",
    desc: "Durable boxes that protect your goods perfectly.",
    tag: "TRUSTED"
  },
  {
    icon: Cpu,
    title: "Custom Designs",
    desc: "Your brand, your design—exactly how you want it.",
    tag: "UNIQUE"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our friendly team is always here to help you.",
    tag: "ONLINE"
  },
];

export default function FeaturesStrip() {
  return (
    <section className="py-8 sm:pt-16 sm:pb-4 bg-gray-50/50 relative overflow-hidden text-center sm:text-left">
      <MatrixBackground />

      {/* Continuing the 'Packaging' labels from Hero */}
      <div className="absolute right-0 top-0 flex flex-col gap-2 opacity-[0.02] sm:opacity-[0.04] select-none pointer-events-none hidden md:flex pr-2 sm:pr-4">
        {[...Array(18)].map((_, i) => (
          <span key={i} className="text-[10rem] sm:text-[14rem] font-black leading-[0.8] rotate-90 origin-right tracking-tighter">
            PACKAGING
          </span>
        ))}
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {features.map(({ icon: Icon, title, desc, tag }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group relative p-4 sm:p-8 md:p-12 rounded-[1.2rem] sm:rounded-[2.5rem] bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-emerald-500/30 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
            >
              <div className="flex flex-col gap-4 sm:gap-10">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-950 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Icon className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2} />
                  </div>
                  <span className="text-[7px] sm:text-[11px] font-black text-gray-300 group-hover:text-emerald-500 tracking-[0.2em] sm:tracking-[0.3em] transition-colors">
                    {tag}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm sm:text-xl md:text-2xl font-black text-gray-950 mb-1 sm:mb-4 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                    {title}
                  </h4>
                  <p className="text-[10px] sm:text-base md:text-lg font-medium text-gray-500 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Technical active indicator */}
              <div className="absolute top-4 right-4 flex gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


