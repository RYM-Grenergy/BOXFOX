"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    ShoppingCart,
    Heart,
    ChevronRight,
    ShieldCheck,
    Truck,
    Plus,
    Minus,
    Star,
    Maximize2,
    BoxSelect,
    Ruler
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import dynamic from 'next/dynamic';

// Dynamic import for 3D component to avoid SSR issues with Three.js
const Box3D = dynamic(() => import('../../components/Box3D'), {
    ssr: false,
    loading: () => <div className="w-full aspect-square bg-gray-50 animate-pulse rounded-[2.5rem] flex items-center justify-center text-gray-300 font-bold">Initializing 3D Lab...</div>
});

const productData = {
    id: 1,
    name: "Premium Duplex Series",
    subtitle: "Custom Engineered Packaging Solutions",
    price: 14.50,
    originalPrice: 38.00,
    description: "Experience the pinnacle of packaging design in 3D. Our Duplex Series combines high-tensile strength with premium multi-color offset printing. Use our interactive lab below to verify dimensions for your brand.",
    images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=90",
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=90"
    ]
};

const BOX_TYPES = [
    { id: 'pizza', name: 'Pizza Box', defaultSize: { w: 12, h: 1.5, d: 12 } },
    { id: 'rigid', name: 'Rigid Gift Box', defaultSize: { w: 8, h: 4, d: 8 } },
    { id: 'corrugated', name: 'Mailer Box', defaultSize: { w: 10, h: 3, d: 12 } },
    { id: 'bakery', name: 'Cake Box', defaultSize: { w: 10, h: 5, d: 10 } }
];

export default function ProductPage() {
    const [viewMode, setViewMode] = useState('image'); // 'image' or '3d'
    const [activeImg, setActiveImg] = useState(0);
    const [currentBox, setCurrentBox] = useState(BOX_TYPES[0]);
    const [boxSize, setBoxSize] = useState(BOX_TYPES[0].defaultSize);
    const [quantity, setQuantity] = useState(1);

    const handleTypeChange = (type) => {
        setCurrentBox(type);
        setBoxSize(type.defaultSize);
        setViewMode('3d');
    };

    const updateSize = (dim, val) => {
        setBoxSize(prev => ({ ...prev, [dim]: parseFloat(val) || 0 }));
        setViewMode('3d');
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 lg:px-12">
                <div className="max-w-[1600px] mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-12">
                        <a href="/" className="hover:text-gray-950 transition-colors">Home</a>
                        <ChevronRight size={14} />
                        <span className="text-gray-950">Packaging Lab</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Left: Viewport */}
                        <div className="space-y-6">
                            <div className="relative aspect-square">
                                <AnimatePresence mode="wait">
                                    {viewMode === 'image' ? (
                                        <motion.div
                                            key="image-view"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            className="w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-inner"
                                        >
                                            <img src={productData.images[activeImg]} className="w-full h-full object-cover" alt="" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="3d-view"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="w-full h-full"
                                        >
                                            <Box3D type={currentBox.id} size={boxSize} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Switcher */}
                                <div className="absolute top-6 right-6 z-20 flex gap-2">
                                    <button
                                        onClick={() => setViewMode('image')}
                                        className={`p-4 rounded-2xl backdrop-blur-md transition-all shadow-xl flex items-center gap-2 ${viewMode === 'image' ? 'bg-gray-950 text-white' : 'bg-white/80 text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Maximize2 size={20} />
                                        <span className="text-xs font-bold px-1">Gallery</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('3d')}
                                        className={`p-4 rounded-2xl backdrop-blur-md transition-all shadow-xl flex items-center gap-2 ${viewMode === '3d' ? 'bg-gray-950 text-white' : 'bg-white/80 text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <BoxSelect size={20} />
                                        <span className="text-xs font-bold px-1">3D Lab</span>
                                    </button>
                                </div>
                            </div>

                            {/* View Selection Row */}
                            <div className="flex gap-4">
                                {viewMode === 'image' ? (
                                    productData.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImg(i)}
                                            className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-gray-950' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="w-full p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-950">Structural Integrity Verified</p>
                                                <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Dimensions match 3D rendering to 0.1mm accuracy</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Lab Controls */}
                        <div className="flex flex-col">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="max-w-xl"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-gray-950 text-white rounded-full text-[10px] font-black tracking-widest uppercase">
                                        Boxfox Lab
                                    </span>
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                </div>

                                <h1 className="text-5xl lg:text-7xl font-black text-gray-950 tracking-tighter leading-[0.9] mb-6">
                                    {currentBox.name}
                                </h1>
                                <p className="text-lg text-gray-500 font-medium mb-12 leading-relaxed">
                                    {productData.description}
                                </p>

                                {/* Lab Interface */}
                                <div className="space-y-10 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                    {/* Type Selector */}
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6 block">1. Select Box Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {BOX_TYPES.map(type => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => handleTypeChange(type)}
                                                    className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${currentBox.id === type.id ? 'border-gray-950 bg-gray-950 text-white shadow-lg' : 'border-white bg-white text-gray-400 hover:border-gray-200'}`}
                                                >
                                                    {type.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Configurator */}
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">2. Configure Dimensions (Inches)</label>
                                            <Ruler size={16} className="text-gray-300" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['w', 'h', 'd'].map(dim => (
                                                <div key={dim} className="space-y-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{dim === 'w' ? 'Width' : dim === 'h' ? 'Height' : 'Depth'}</span>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={boxSize[dim]}
                                                            onChange={(e) => updateSize(dim, e.target.value)}
                                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-gray-950/10 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center bg-gray-100 rounded-2xl p-1 h-14">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition-colors"><Minus size={18} /></button>
                                        <span className="w-12 text-center font-bold">{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition-colors"><Plus size={18} /></button>
                                    </div>
                                    <button className="flex-1 h-14 bg-gray-950 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200">
                                        <ShoppingCart size={20} />
                                        ADD TO CART — ₹{(productData.price * quantity).toFixed(2)}
                                    </button>
                                </div>

                                <div className="mt-10 flex items-center gap-8 text-xs font-bold text-gray-400">
                                    <div className="flex items-center gap-2"><Truck size={14} /> FREE EXPRESS</div>
                                    <div className="flex items-center gap-2"><ShieldCheck size={14} /> QUALITY ASSURED</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
