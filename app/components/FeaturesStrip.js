"use client";
import { motion } from "framer-motion";
import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Eco Fast Delivery",
    desc: "Free on orders over ₹2000",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    icon: RefreshCw,
    title: "Perfect Quality",
    desc: "100% replacement guarantee",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    desc: "Protected by 256-bit SSL",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: Headphones,
    title: "Expert Design Lab",
    desc: "Custom consulting for brands",
    color: "bg-orange-50 text-orange-600"
  },
];

export default function FeaturesStrip() {
  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc, color }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group flex items-start gap-5 p-6 rounded-3xl transition-all duration-300 hover:bg-gray-50"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:rotate-12 ${color}`}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-950 mb-1 tracking-tight">
                  {title}
                </h4>
                <p className="text-sm font-medium text-gray-500 leading-snug">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </section>
  );
}

