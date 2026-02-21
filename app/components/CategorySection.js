"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Box, Layers, Zap, PenTool, ShieldCheck } from "lucide-react";

const categories = [
  {
    id: 1,
    index: "INDEX_01",
    name: "Structural Mailers",
    desc: "3-Ply Kraft & High-GSM White Liners for high-velocity logistics.",
    img: "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
    icon: <Box className="w-6 h-6" />,
    stats: "HIGH-VELOCITY"
  },
  {
    id: 2,
    index: "INDEX_02",
    name: "Confectionary Lab",
    desc: "Grease-resistant Duplex engineering for bakery and premium pastries.",
    img: "https://boxfox.in/wp-content/uploads/2022/11/03-4.jpg",
    icon: <Zap className="w-6 h-6" />,
    stats: "GREASE-RESISTANT"
  },
  {
    id: 3,
    index: "INDEX_03",
    name: "Kinetic Pizza Nodes",
    desc: "Ventilated thermal management systems for food delivery.",
    img: "https://boxfox.in/wp-content/uploads/2022/11/open-pizza-box.png",
    icon: <Layers className="w-6 h-6" />,
    stats: "THERMAL MGMT"
  },
  {
    id: 4,
    index: "INDEX_04",
    name: "Luxury Substrates",
    desc: "Complex UV & Foil-stamped structural finishes for brands.",
    img: "https://boxfox.in/wp-content/uploads/2022/11/55-copy.png",
    icon: <PenTool className="w-6 h-6" />,
    stats: "UV & FOIL"
  },
  {
    id: 5,
    index: "INDEX_05",
    name: "Sustainable Mono-cartons",
    desc: "100% Recyclable mono-material solutions for eco-conscious retail.",
    img: "https://boxfox.in/wp-content/uploads/2022/12/04.jpg",
    icon: <ShieldCheck className="w-6 h-6" />,
    stats: "MONO-MATERIAL"
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="py-24 md:py-40 px-4 md:px-12 bg-white text-gray-950 overflow-hidden selection:bg-emerald-500 selection:text-white">
      <div className="max-w-[1700px] mx-auto">
        {/* Technical Header */}
        <div className="flex flex-col lg:flex-row items-start justify-between mb-24 md:mb-32 gap-12">
          <div className="space-y-6 md:space-y-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                System Overview
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85]"
            >
              The<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">
                Collection Index.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-10 border border-gray-100 bg-gray-50/50 backdrop-blur-3xl rounded-[2.5rem] max-w-md shadow-sm"
          >
            <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-gray-950 text-[10px] font-black uppercase tracking-widest text-white rounded-full">
              CORE_v2.0
            </div>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed tracking-tight italic">
              "Categorical access to our entire structural directory. Each node is engineered for specific unboxing kinematics."
            </p>
            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">
              <span>Directory Status: Operational</span>
              <span>2024//FOX</span>
            </div>
          </motion.div>
        </div>

        {/* The Index Grid/List */}
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {categories.map((cat, idx) => (
            <motion.a
              key={cat.id}
              href="/shop"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="group relative flex flex-col md:flex-row items-stretch gap-0 md:gap-8 p-1.5 rounded-[3rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 md:hover:-translate-y-1"
            >
              {/* Image Container - Mobile: Top / Desktop: Left */}
              <div className="relative h-72 md:h-[26rem] md:w-[36rem] overflow-hidden rounded-[2.6rem] shrink-0 border border-gray-100/50">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4 md:hidden">
                  <div className="w-12 h-12 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-xl">
                    {cat.icon}
                  </div>
                  <span className="text-sm font-black uppercase tracking-wider text-white drop-shadow-md">{cat.index}</span>
                </div>
              </div>

              {/* Content Panel */}
              <div className="flex-1 flex flex-col justify-between p-8 md:p-12 md:pr-16">
                <div className="space-y-6">
                  <div className="hidden md:flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-600 tracking-[0.4em]">{cat.index}</span>
                    <span className="px-4 py-1.5 rounded-full border border-gray-100 bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">{cat.stats}</span>
                  </div>

                  <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-lg md:text-xl text-gray-500 font-medium max-w-xl leading-snug">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-10 flex items-end justify-between">
                  <div className="hidden md:flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-gray-100 group-hover:border-emerald-500/20 group-hover:bg-emerald-50/50 group-hover:text-emerald-600 transition-all shadow-sm">
                      {cat.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">STATUS</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Engineering: Certified</span>
                    </div>
                  </div>

                  <div className="group/btn flex items-center gap-6">
                    <span className="hidden sm:block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-gray-950 transition-colors">Explore Structural Tech</span>
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-200 flex items-center justify-center text-gray-950 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-500 group-hover:rotate-45 shadow-sm group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                      <ArrowUpRight size={32} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Decorative Elements */}
              <div className="absolute top-12 right-12 w-0.5 h-24 bg-gradient-to-b from-emerald-500/40 to-transparent hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-12 right-12 h-0.5 w-24 bg-gradient-to-l from-emerald-500/40 to-transparent hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Background Decorative Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
      </div>
    </section>
  );
}

