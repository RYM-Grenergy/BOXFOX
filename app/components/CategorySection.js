"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Luxury Duplex",
    desc: "Premium multi-colour packaging",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    grid: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    name: "Artisan Rigid",
    desc: "100% handmade luxury",
    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    grid: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    name: "Eco Corrugated",
    desc: "Sustainable & strong",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    grid: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    name: "Gourmet Bakery",
    desc: "Cakes & pastries",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    grid: "md:col-span-1 md:row-span-2",
  },
  {
    id: 5,
    name: "Custom Pizza",
    desc: "Food-grade specialized",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    grid: "md:col-span-1 md:row-span-1",
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="py-24 px-6 lg:px-12 bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 block"
            >
              Curated Collections
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-gray-950 tracking-tighter leading-[0.9]"
            >
              Shop by <span className="text-gray-400">Category</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button className="text-sm font-bold flex items-center gap-2 group border-b-2 border-gray-950 pb-1">
              View All Categories
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-full md:h-[900px]">
          {categories.map((cat, idx) => (
            <motion.a
              key={cat.id}
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative rounded-[2.5rem] overflow-hidden ${cat.grid}`}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <p className="text-white text-2xl font-black tracking-tighter mb-2">
                    {cat.name}
                  </p>
                  <p className="text-white/60 text-sm font-medium transition-colors group-hover:text-white">
                    {cat.desc}
                  </p>
                </motion.div>

                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

