"use client";
import React, { useState, useEffect, useMemo } from 'react';
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
    CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import dynamic from 'next/dynamic';
import { useCart } from '@/app/context/CartContext';
import { useParams } from 'next/navigation';

// Dynamic import for 3D component to avoid SSR issues with Three.js
const Box3D = dynamic(() => import('../../components/Box3D'), {
    ssr: false,
    loading: () => <div className="w-full aspect-square bg-gray-50 animate-pulse rounded-[2.5rem] flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-[10px]">Initializing 3D Lab...</div>
});

const BOX_TYPES = [
    { id: 'corrugated', name: 'Mailer Box', defaultSize: { w: 8.5, h: 2, d: 6.5 } },
    { id: 'pizza', name: 'Pizza Box', defaultSize: { w: 7, h: 1.5, d: 7 } },
    { id: 'rigid', name: 'Rigid Box', defaultSize: { w: 8, h: 4, d: 8 } },
    { id: 'bakery', name: 'Cake Box', defaultSize: { w: 10, h: 5, d: 10 } }
];

export default function ProductPage() {
    const params = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('image');
    const [activeImg, setActiveImg] = useState(0);
    const [currentBox, setCurrentBox] = useState(BOX_TYPES[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeMoq, setActiveMoq] = useState(100);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/products/${params.id}`)
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`API Error ${res.status}: ${text.slice(0, 100)}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [params.id]);

    const handleTypeChange = (type) => {
        setCurrentBox(type);
        setViewMode('3d');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 animate-pulse">
                        <div className="aspect-square bg-gray-50 rounded-[2.5rem]" />
                        <div className="space-y-8">
                            <div className="h-20 bg-gray-50 rounded-2xl w-3/4" />
                            <div className="h-10 bg-gray-50 rounded-2xl w-1/2" />
                            <div className="h-48 bg-gray-50 rounded-[2rem]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 lg:px-12">
                <div className="max-w-[1600px] mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">
                        <Link href="/" className="hover:text-gray-950 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link href="/shop" className="hover:text-gray-950 transition-colors">Products</Link>
                        <ChevronRight size={12} />
                        <span className="text-gray-950">{product.name}</span>
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
                                            className="w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm"
                                        >
                                            <img src={product.img} className="w-full h-full object-cover" alt="" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="3d-view"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="w-full h-full"
                                        >
                                            <Box3D type={currentBox.id} size={currentBox.defaultSize} />
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
                                        <span className="text-xs font-bold px-1 uppercase tracking-widest text-[10px]">Gallery</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('3d')}
                                        className={`p-4 rounded-2xl backdrop-blur-md transition-all shadow-xl flex items-center gap-2 ${viewMode === '3d' ? 'bg-gray-950 text-white' : 'bg-white/80 text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <BoxSelect size={20} />
                                        <span className="text-xs font-bold px-1 uppercase tracking-widest text-[10px]">3D Lab</span>
                                    </button>
                                </div>
                            </div>

                            {/* View Selection Row */}
                            <div className="flex gap-4">
                                <div className="w-full p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-950 uppercase tracking-tighter leading-none mb-1">Structural Verified</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Internal dimensions accurately modeled</p>
                                        </div>
                                    </div>
                                    <Truck size={24} className="text-gray-200" />
                                </div>
                            </div>
                        </div>

                        {/* Right: Product Info */}
                        <div className="flex flex-col">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="max-w-xl"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-gray-950 text-white rounded-full text-[10px] font-black tracking-widest uppercase">
                                        {product.category}
                                    </span>
                                    <div className="h-[2.5px] flex-1 bg-gray-50 rounded-full" />
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black text-gray-950 tracking-tighter leading-[1.1] mb-6">
                                    {product.name}
                                </h1>
                                <div className="flex items-end gap-3 mb-10">
                                    <p className="text-4xl font-black text-gray-950 tracking-tighter">
                                        {product.price}
                                    </p>
                                    <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-2 px-3 py-1 bg-emerald-50 rounded-full">In Stock</span>
                                </div>

                                <div className="space-y-10 mb-12">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Dimensions ({product.dimensions?.unit || 'cm'})</label>
                                            <p className="text-sm font-black text-gray-950 uppercase">
                                                {product.dimensions?.length} x {product.dimensions?.width} x {product.dimensions?.height}
                                            </p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Lead Time</label>
                                            <p className="text-sm font-black text-gray-950 uppercase">4-6 Working Days</p>
                                        </div>
                                    </div>

                                    {product.attributes && product.attributes.length > 0 && product.attributes.map((attr, idx) => (
                                        <div key={idx}>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Select {attr.name}:</label>
                                            <div className="flex flex-wrap gap-2">
                                                {attr.options.map(option => (
                                                    <button
                                                        key={option}
                                                        onClick={() => setActiveMoq(option)}
                                                        className={`px-8 py-4 rounded-2xl border-2 font-black text-sm transition-all ${activeMoq == option ? 'border-gray-950 bg-gray-950 text-white shadow-xl shadow-gray-200' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 h-16 w-32 shrink-0 border border-gray-200">
                                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all"><Minus size={16} /></button>
                                            <span className="flex-1 text-center font-black text-gray-950 tracking-tighter">{quantity}</span>
                                            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all"><Plus size={16} /></button>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product, quantity)}
                                            className="flex-1 h-16 bg-gray-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gray-200"
                                        >
                                            <ShoppingCart size={18} />
                                            Add to Lab Cart
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart(product, quantity);
                                            window.location.href = '/checkout';
                                        }}
                                        className="h-16 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-100"
                                    >
                                        Place Selection Now
                                    </button>
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

const Link = ({ children, href, className, onClick }) => (
    <a href={href} className={className} onClick={onClick}>{children}</a>
);
