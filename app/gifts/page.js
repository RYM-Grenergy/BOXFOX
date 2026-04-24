"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Gift, ArrowRight, CheckCircle2, Star, Zap, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const gifts = [
  {
    id: 1,
    name: "Azure Luxe Gift Box",
    tagline: "The Zenith of Luxury",
    description: "Experience the pinnacle of elegance with our Azure Luxe series. Designed for high-end gifting, this box features a minimalist teal aesthetic with subtle gold accents, perfect for luxury jewelry or premium accessories.",
    features: ["Reinforced Duplex Board", "Gold Foil Stamping", "Magnetic Closure", "Soft-Touch Finish"],
    image: "/images/gifts/gift1.png",
    color: "from-teal-500/20 to-emerald-500/20",
    icon: <Star className="text-teal-500" size={20} />
  },
  {
    id: 2,
    name: "Rustic Artisan Bakery Box",
    tagline: "Warmth in Every Detail",
    description: "Bring a touch of warmth to your baked goods. Our Rustic Artisan series combines textured kraft paper with a modern structural design, ensuring your pastries look as good as they taste.",
    features: ["Food-Grade Interior", "Custom Ribbon Slot", "Grease-Resistant", "Eco-Friendly Fiber"],
    image: "/images/gifts/gift2.png",
    color: "from-orange-500/20 to-amber-500/20",
    icon: <Heart className="text-orange-500" size={20} />
  },
  {
    id: 3,
    name: "Midnight Executive Suite",
    tagline: "Corporate Power Statement",
    description: "The ultimate choice for corporate branding. The Midnight Executive Suite offers a sleek matte black finish with silver precision foil stamping, delivering a powerful statement of professionalism.",
    features: ["Matte Black Finish", "Silver Foil Accents", "Customizable Inserts", "Rigid Box Construction"],
    image: "/images/gifts/gift3.png",
    color: "from-gray-900/40 to-gray-800/40",
    icon: <Zap className="text-gray-400" size={20} />
  },
  {
    id: 4,
    name: "Vivid Celebration Trio",
    tagline: "Joyful Moments Packaged",
    description: "Celebrate every milestone with a burst of color. This trio of festive boxes features vibrant patterns and a celebratory atmosphere, ideal for seasonal gifting and special events.",
    features: ["Vibrant Color Palette", "Glossy Finish", "Multiple Size Options", "Space-Saving Foldable Design"],
    image: "/images/gifts/gift4.png",
    color: "from-pink-500/20 to-purple-500/20",
    icon: <Sparkles className="text-pink-500" size={20} />
  },
  {
    id: 5,
    name: "Botanical Earth Pack",
    tagline: "Sustainably Stunning",
    description: "Pure, sustainable, and beautiful. The Botanical Earth Pack uses eco-friendly materials and elegant illustrations to create a packaging solution that respects the planet without compromising on style.",
    features: ["100% Recyclable", "Soy-Based Inks", "Natural Twine Closure", "Textured Kraft Paper"],
    image: "/images/gifts/gift5.png",
    color: "from-green-500/20 to-lime-500/20",
    icon: <Shield className="text-green-600" size={20} />
  },
  {
    id: 6,
    name: "Emerald Velvet Perfume Box",
    tagline: "A Sensory Masterpiece",
    description: "A sensory experience from the first touch. Our Emerald Velvet series is specifically crafted for high-end perfumes and cosmetics, featuring a deep velvet interior and a hyper-realistic premium finish.",
    features: ["Velvet Lining", "Magnetic Safety Lock", "Precision Logo Embossing", "High-Impact Protection"],
    image: "/images/gifts/gift6.png",
    color: "from-emerald-900/30 to-teal-900/30",
    icon: <Gift className="text-emerald-500" size={20} />
  },
];

export default function GiftsPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-mesh noise-overlay pt-32 pb-32 overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[100vw] h-[100vw] bg-emerald-500/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[100vw] h-[100vw] bg-teal-500/5 blur-[120px] rounded-full"
        />
      </div>

      {/* Hero Section with Parallax */}
      <section className="px-6 lg:px-14 mb-40 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/50 backdrop-blur-md border border-white/20 shadow-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-float"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
              ))}
            </div>
            <span className="text-gray-900">Elite Curation 2026</span>
          </motion.div>

          <div className="relative inline-block">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl lg:text-[10rem] font-black text-gray-950 uppercase tracking-tighter mb-12 leading-[0.8] relative z-10"
            >
              Art of <br />
              <span className="text-gradient">Gifting.</span>
            </motion.h1>
            
            {/* Decorative Floating Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-20 hidden lg:block opacity-20"
            >
              <Sparkles size={120} className="text-emerald-500" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl mx-auto text-gray-500 text-lg lg:text-xl font-medium leading-relaxed text-balance"
          >
            Where structural integrity meets aesthetic brilliance. Discover our curated collection of packaging masterpieces, engineered for the world's most discerning brands.
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Scroll to Explore</span>
            <div className="w-[1px] h-20 bg-gradient-to-b from-emerald-500 to-transparent relative">
              <motion.div 
                animate={{ y: [0, 80, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full blur-[2px]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Alternating Product Showcase */}
      <section className="space-y-40 lg:space-y-72 relative z-10">
        {gifts.map((gift, index) => (
          <div key={gift.id} className="px-6 lg:px-14">
            <div className={`max-w-[1400px] mx-auto flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32`}>
              
              {/* Premium Image Side with Parallax Effect */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[55%] relative group"
              >
                {/* Decorative Background Blob */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gift.color} blur-[80px] -z-10 opacity-60 rounded-full group-hover:scale-125 transition-transform duration-1000`} />
                
                <div className="relative aspect-[16/10] lg:aspect-[16/9] overflow-hidden rounded-[3rem] bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-white/40 p-4 lg:p-8 backdrop-blur-sm group-hover:shadow-[0_80px_150px_rgba(0,0,0,0.15)] transition-all duration-700">
                  <div className="w-full h-full overflow-hidden rounded-[2rem]">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      src={gift.image} 
                      alt={gift.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Glass Card Overlay (Stats/Info) */}
                  <div className={`absolute bottom-8 ${index % 2 === 0 ? 'right-8' : 'left-8'} glass-card p-6 rounded-3xl hidden lg:block translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center text-white">
                        <ArrowRight size={20} className="-rotate-45" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Model Series</p>
                        <p className="text-sm font-black text-gray-950">V.2026.0{gift.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text Side with Refined Typography */}
              <div className="w-full lg:w-[45%]">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white shadow-lg rounded-2xl border border-gray-100">
                      {gift.icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">{gift.tagline}</span>
                  </div>

                  <h2 className="text-5xl lg:text-7xl font-black text-gray-950 uppercase tracking-tighter mb-8 leading-[0.9]">
                    {gift.name.split(' ').map((word, i) => (
                      <span key={i} className={i === gift.name.split(' ').length - 1 ? 'text-gradient' : ''}>
                        {word}{' '}
                      </span>
                    ))}
                  </h2>

                  <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                    {gift.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                    {gift.features.map((feature, fIdx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (fIdx * 0.1) }}
                        key={feature} 
                        className="flex items-center gap-3 py-3 border-b border-gray-100/50 group"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                          <CheckCircle2 size={12} className="text-emerald-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <Link 
                      href="/customize"
                      className="px-10 py-5 bg-gray-950 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center gap-4 shadow-2xl shadow-gray-200 group active:scale-95"
                    >
                      Start Designing <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/contact"
                      className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-950 transition-all"
                    >
                      <span>Bulk Quote</span>
                      <div className="w-8 h-[1px] bg-gray-200 group-hover:w-12 group-hover:bg-gray-950 transition-all" />
                    </Link>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* Advanced Call to Action */}
      <section className="mt-60 px-6 lg:px-14 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1200px] mx-auto relative group"
        >
          {/* Main Card */}
          <div className="bg-gray-950 rounded-[4rem] p-12 lg:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
            {/* Animated Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-ai-glow opacity-30" />
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full"
            />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/10"
              >
                <Sparkles className="text-emerald-400" size={32} />
              </motion.div>

              <h2 className="text-5xl lg:text-[5.5rem] font-black text-white uppercase tracking-tighter mb-10 leading-[0.85]">
                Tailored for <br />
                <span className="text-emerald-400">Excellence.</span>
              </h2>
              
              <p className="max-w-2xl mx-auto text-gray-400 text-lg lg:text-xl font-medium mb-16 opacity-80">
                Unlock the potential of your brand with packaging that speaks volumes. Our consultants are ready to bring your vision to life.
              </p>

              <div className="flex flex-wrap justify-center items-center gap-8">
                <Link 
                  href="/contact"
                  className="px-12 py-6 bg-white text-gray-950 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-400 hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  Consult an Expert
                </Link>
                <Link 
                  href="/shop"
                  className="px-12 py-6 bg-transparent border border-white/20 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
                >
                  Explore All
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative Corner Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 blur-3xl -z-10" />
        </motion.div>
      </section>

      {/* Floating Progress Bar (Advanced UX) */}
      <motion.div 
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-[200] shadow-[0_0_20px_rgba(16,185,129,0.5)]"
      />
    </div>
  );
}
