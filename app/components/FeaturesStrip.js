"use client";
import { motion } from "framer-motion";
import { Truck, RefreshCw, ShieldCheck, Headphones, Award, Globe, Zap, Cpu } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Velocity Logistics",
    desc: "Optimized shipping for mission-critical timelines.",
    tag: "FAST_TRACK"
  },
  {
    icon: ShieldCheck,
    title: "Structural Integrity",
    desc: "100% replacement guarantee on all shipments.",
    tag: "CERTIFIED"
  },
  {
    icon: Cpu,
    title: "Precision Engineering",
    desc: "CAD-perfect dimensions for every structural node.",
    tag: "AUTO_SPEC"
  },
  {
    icon: Headphones,
    title: "Support Protocol",
    desc: "Dedicated engineering consultants for your brand.",
    tag: "24/7_INTEL"
  },
];

export default function FeaturesStrip() {
  return (
    <section className="py-16 md:py-24 bg-white border-y border-gray-100 relative overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2" />
      </div>

      <div className="max-w-[1700px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map(({ icon: Icon, title, desc, tag }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative p-10 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 hover:border-emerald-500/30 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500"
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-950 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm">
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-black text-gray-300 group-hover:text-emerald-500 tracking-[0.3em] transition-colors">
                    {tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-gray-950 mb-3 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                    {title}
                  </h4>
                  <p className="text-base font-medium text-gray-400 leading-relaxed max-w-[220px]">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Technical Corner */}
              <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


