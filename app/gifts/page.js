"use client";
import { motion } from "framer-motion";
import { Sparkles, Gift, ArrowRight, CheckCircle2, Star, Zap, Shield, Heart } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const gifts = [
  {
    id: 1,
    name: "Azure Luxe",
    tagline: "High-End Luxury",
    description: "A minimalist teal aesthetic with subtle gold accents, perfect for jewelry or premium accessories.",
    features: ["Reinforced Board", "Gold Stamping", "Magnetic Closure"],
    image: "/images/gifts/gift1.png",
    color: "bg-teal-50",
    icon: <Star className="text-teal-500" size={18} />
  },
  {
    id: 2,
    name: "Artisan Bakery",
    tagline: "Rustic Warmth",
    description: "Textured kraft paper with a modern structural design, ensuring pastries look as good as they taste.",
    features: ["Food-Grade", "Custom Ribbon Slot", "Grease-Resistant"],
    image: "/images/gifts/gift2.png",
    color: "bg-orange-50",
    icon: <Heart className="text-orange-500" size={18} />
  },
  {
    id: 3,
    name: "Midnight Exec",
    tagline: "Corporate Power",
    description: "Sleek matte black finish with silver precision foil stamping for a professional statement.",
    features: ["Matte Finish", "Silver Accents", "Rigid Construction"],
    image: "/images/gifts/gift3.png",
    color: "bg-gray-100",
    icon: <Zap className="text-gray-400" size={18} />
  },
  {
    id: 4,
    name: "Vivid Trio",
    tagline: "Joyful Celebration",
    description: "Vibrant patterns and a celebratory atmosphere, ideal for seasonal gifting and special events.",
    features: ["Vibrant Palette", "Glossy Finish", "Foldable Design"],
    image: "/images/gifts/gift4.png",
    color: "bg-pink-50",
    icon: <Sparkles className="text-pink-500" size={18} />
  },
  {
    id: 5,
    name: "Botanical Earth",
    tagline: "Eco-Friendly",
    description: "Sustainable materials and elegant illustrations for a packaging solution that respects the planet.",
    features: ["Recyclable", "Soy-Based Inks", "Natural Twine"],
    image: "/images/gifts/gift5.png",
    color: "bg-green-50",
    icon: <Shield className="text-green-600" size={18} />
  },
  {
    id: 6,
    name: "Emerald Perfume",
    tagline: "Sensory Premium",
    description: "Deep velvet interior and a hyper-realistic premium finish for perfumes and cosmetics.",
    features: ["Velvet Lining", "Magnetic Lock", "Logo Embossing"],
    image: "/images/gifts/gift6.png",
    color: "bg-emerald-50",
    icon: <Gift className="text-emerald-500" size={18} />
  },
];

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-500 selection:text-white pb-20">

      {/* Hero Section - Clean & High Impact */}
      <section className="pt-44 pb-20 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-8"
          >
            Curated Gift Collection 2026
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black text-gray-950 uppercase tracking-tighter mb-8 leading-[0.9]"
          >
            The Art of <br />
            <span className="text-emerald-500">Perfect Gifting.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 text-base lg:text-lg font-medium leading-relaxed"
          >
            Premium packaging solutions engineered for the world's most discerning brands. 
            Discover boxes that protect, impress, and endure.
          </motion.p>
        </div>
      </section>

      {/* Simplified Product Grid */}
      <section className="px-6 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gifts.map((gift, idx) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-gray-50 rounded-[2.5rem] p-4 border border-gray-100 hover:border-emerald-200 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className={`relative aspect-square rounded-[2rem] overflow-hidden ${gift.color} mb-6 flex items-center justify-center p-8`}>
                  <img 
                    src={gift.image} 
                    alt={gift.name} 
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/50">
                    {gift.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 flex flex-col flex-1">
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">{gift.tagline}</span>
                    <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tight">{gift.name}</h3>
                  </div>
                  
                  <p className="text-xs font-medium text-gray-500 leading-relaxed mb-6 flex-1">
                    {gift.description}
                  </p>

                  <div className="space-y-2 mb-8">
                    {gift.features.map(feature => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-gray-950 uppercase tracking-widest">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href="/customize"
                    className="w-full py-4 bg-gray-950 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group active:scale-95"
                  >
                    Customize <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean CTA Section */}
      <section className="mt-40 px-6 lg:px-14">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-950 rounded-[3.5rem] p-12 lg:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                Ready to Create <br />
                <span className="text-emerald-400 text-gradient">Something Unique?</span>
              </h2>
              <p className="max-w-xl mx-auto text-gray-400 text-sm font-medium mb-12">
                Consult with our structural packaging experts to design the perfect box for your brand.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/contact"
                  className="px-10 py-5 bg-white text-gray-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 hover:text-white transition-all shadow-xl active:scale-95"
                >
                  Consult Expert
                </Link>
                <Link 
                  href="/shop"
                  className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
                >
                  Explore All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

