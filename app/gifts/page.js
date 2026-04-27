"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift, ArrowRight, CheckCircle2, Star, Zap, Shield, Heart } from "lucide-react";
import Link from "next/link";

const gifts = [
  {
    id: 1,
    name: "Azure Luxe",
    tagline: "High-End Luxury",
    description: "A minimalist teal aesthetic with subtle gold accents, perfect for jewelry or premium accessories.",
    features: ["Reinforced Board", "Gold Stamping", "Magnetic Closure"],
    image: "/images/gifts/azure-luxe.png",
    color: "from-teal-500/10 to-emerald-500/5",
    accent: "teal",
    icon: <Star className="text-teal-500" size={24} />
  },
  {
    id: 2,
    name: "Artisan Bakery",
    tagline: "Rustic Warmth",
    description: "Textured kraft paper with a modern structural design, ensuring pastries look as good as they taste.",
    features: ["Food-Grade", "Custom Ribbon Slot", "Grease-Resistant"],
    image: "/images/gifts/artisan-bakery.png",
    color: "from-orange-500/10 to-yellow-500/5",
    accent: "orange",
    icon: <Heart className="text-orange-500" size={24} />
  },
  {
    id: 3,
    name: "Midnight Exec",
    tagline: "Corporate Power",
    description: "Sleek matte black finish with silver precision foil stamping for a professional statement.",
    features: ["Matte Finish", "Silver Accents", "Rigid Construction"],
    image: "/images/gifts/midnight-exec.png",
    color: "from-gray-950/10 to-gray-500/5",
    accent: "gray",
    icon: <Zap className="text-gray-950" size={24} />
  },
  {
    id: 4,
    name: "Vivid Trio",
    tagline: "Joyful Celebration",
    description: "Vibrant patterns and a celebratory atmosphere, ideal for seasonal gifting and special events.",
    features: ["Vibrant Palette", "Glossy Finish", "Foldable Design"],
    image: "/images/gifts/vivid-trio.png",
    color: "from-pink-500/10 to-purple-500/5",
    accent: "pink",
    icon: <Sparkles className="text-pink-500" size={24} />
  },
  {
    id: 5,
    name: "Botanical Earth",
    tagline: "Eco-Friendly",
    description: "Sustainable materials and elegant illustrations for a packaging solution that respects the planet.",
    features: ["Recyclable", "Soy-Based Inks", "Natural Twine"],
    image: "/images/gifts/botanical-earth.png",
    color: "from-green-500/10 to-lime-500/5",
    accent: "green",
    icon: <Shield className="text-green-600" size={24} />
  },
  {
    id: 6,
    name: "Emerald Perfume",
    tagline: "Sensory Premium",
    description: "Deep velvet interior and a hyper-realistic premium finish for perfumes and cosmetics.",
    features: ["Velvet Lining", "Magnetic Lock", "Logo Embossing"],
    image: "/images/gifts/emerald-perfume.png",
    color: "from-emerald-600/10 to-teal-500/5",
    accent: "emerald",
    icon: <Gift className="text-emerald-500" size={24} />
  },
];

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-emerald-500 selection:text-white">

      {/* Hero Section */}
      <section className="pt-44 pb-24 px-6 lg:px-14 bg-gray-50/50">
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
            className="text-5xl lg:text-9xl font-black text-gray-950 uppercase tracking-tighter mb-8 leading-[0.85]"
          >
            Corporate Gifts:<br />
            <span className="text-emerald-500">Perfect Gifting.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-gray-500 text-base lg:text-xl font-medium leading-relaxed"
          >
            Premium packaging solutions engineered for the world's most discerning brands. 
            Discover boxes that protect, impress, and endure.
          </motion.p>
        </div>
      </section>

      {/* Alternating Content Sections */}
      <div className="bg-white">
        {gifts.map((gift, idx) => (
          <GiftSection key={gift.id} gift={gift} index={idx} />
        ))}
      </div>

      {/* Final CTA Section */}
      <section className="py-32 px-6 lg:px-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-950 rounded-[3rem] sm:rounded-[4.5rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-20 pointer-events-none mix-blend-overlay" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
                Ready to Create <br />
                <span className="text-emerald-400">Something Unique?</span>
              </h2>
              <p className="max-w-xl mx-auto text-gray-400 text-base lg:text-lg font-medium mb-12">
                Consult with our structural packaging experts to design the perfect box for your brand.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link 
                  href="/contact"
                  className="px-12 py-6 bg-white text-gray-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 hover:text-white transition-all shadow-xl active:scale-95"
                >
                  Consult Expert
                </Link>
                <Link 
                  href="/shop"
                  className="px-12 py-6 bg-transparent border border-white/20 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
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

function GiftSection({ gift, index }) {
  const isEven = index % 2 === 0;

  return (
    <section className={`py-20 lg:py-40 overflow-hidden ${isEven ? 'bg-white' : 'bg-gray-50/30'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-full lg:w-1/2"
          >
            <div className={`relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[3rem] lg:rounded-[5rem] overflow-hidden bg-gradient-to-br ${gift.color} flex items-center justify-center p-8 sm:p-16 group shadow-2xl shadow-gray-200/50`}>
              <img 
                src={gift.image} 
                alt={gift.name} 
                className="w-full h-full object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              {/* Floating Icon Decoration */}
              <div className="absolute top-8 right-8 lg:top-12 lg:right-12 bg-white/90 backdrop-blur-xl p-5 lg:p-7 rounded-[2rem] shadow-xl border border-white/50 animate-float">
                {gift.icon}
              </div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-full lg:w-1/2 space-y-10"
          >
            <div className="space-y-4">
              <span className="text-[10px] lg:text-[12px] font-black uppercase tracking-[0.4em] text-emerald-500">{gift.tagline}</span>
              <h2 className="text-4xl lg:text-7xl font-black text-gray-950 uppercase tracking-tighter leading-none">
                {gift.name}
              </h2>
            </div>

            <p className="text-gray-500 text-lg lg:text-xl font-medium leading-relaxed">
              {gift.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {gift.features.map((feature, i) => (
                <motion.div 
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-gray-100 group hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-[11px] lg:text-[13px] font-black text-gray-900 uppercase tracking-widest">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-8">
              <Link 
                href="/customize"
                className="inline-flex items-center gap-4 px-10 py-5 bg-gray-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-xl"
              >
                Start Customizing <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
