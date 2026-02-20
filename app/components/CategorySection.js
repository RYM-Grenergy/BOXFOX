"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Corrugated Boxes",
    desc: "3 Ply Kraft & White Mailers",
    img: "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
  },
  {
    id: 2,
    name: "Bakery Packaging",
    desc: "Cake, Pastry & Brownie Boxes",
    img: "https://boxfox.in/wp-content/uploads/2022/11/03-4.jpg",
  },
  {
    id: 3,
    name: "Pizza Boxes",
    desc: "Food-grade specialized",
    img: "https://boxfox.in/wp-content/uploads/2022/11/open-pizza-box.png",
  },
  {
    id: 4,
    name: "Luxury Duplex",
    desc: "Multi-color premium prints",
    img: "https://boxfox.in/wp-content/uploads/2022/11/55-copy.png",
  },
  {
    id: 5,
    name: "Sweet Boxes",
    desc: "Eco-friendly Mithai packaging",
    img: "https://boxfox.in/wp-content/uploads/2022/12/04.jpg",
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="py-32 px-6 lg:px-12 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-4 block"
            >
              Curated Collections
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter leading-none"
            >
              Shop by Category
            </motion.h2>
          </div>
          <button className="text-xs font-black uppercase tracking-widest flex items-center gap-3 group bg-gray-950 text-white px-8 py-5 rounded-full transition-all hover:scale-105 active:scale-95">
            View All Categories
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="flex flex-col border-t border-gray-100">
          {categories.map((cat, idx) => (
            <motion.a
              key={cat.id}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative border-b border-gray-100 py-12 md:py-20 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all hover:px-8"
            >
              <div className="relative z-10 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                <span className="text-sm font-black text-gray-300 group-hover:text-gray-950 transition-colors">
                  0{idx + 1}
                </span>
                <h3 className="text-4xl md:text-7xl font-black text-gray-950 tracking-tight group-hover:translate-x-4 transition-transform duration-500">
                  {cat.name}
                </h3>
              </div>

              <div className="relative z-10 flex items-center justify-between md:justify-end gap-12 w-full md:w-auto">
                <p className="text-lg md:text-xl font-medium text-gray-400 group-hover:text-gray-950 transition-colors max-w-xs md:text-right leading-tight">
                  {cat.desc}
                </p>
                <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-950 group-hover:border-gray-950 group-hover:text-white transition-all duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={24} />
                </div>
              </div>

              {/* Hover Image Reveal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 md:w-96 md:h-60 rounded-3xl overflow-hidden pointer-events-none opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out z-0">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

