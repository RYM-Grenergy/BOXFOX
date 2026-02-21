"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Heart,
    ChevronRight,
    ShieldCheck,
    Truck,
    Plus,
    Minus,
    Star,
    Info,
    Package,
    RotateCcw,
    Zap,
    CheckCircle2
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useCart } from '@/app/context/CartContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductPage() {
    const params = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeAttribute, setActiveAttribute] = useState({});
    const [activeTab, setActiveTab] = useState('description');

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
                // Initialize active attributes if any
                if (data.attributes && data.attributes.length > 0) {
                    const initialAttrs = {};
                    data.attributes.forEach(attr => {
                        initialAttrs[attr.name] = attr.options[0];
                    });
                    setActiveAttribute(initialAttrs);
                }
                // Set initial quantity to MOQ if available
                if (data.minOrderQuantity) {
                    setQuantity(data.minOrderQuantity);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [params.id]);

    const unitPrice = product ? parseFloat(String(product.price).replace(/[^\d.]/g, '')) || 0 : 0;
    const totalPrice = (unitPrice * quantity).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
                        <div className="lg:col-span-7 aspect-square bg-gray-50 rounded-[2.5rem]" />
                        <div className="lg:col-span-5 space-y-8">
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

    const images = product.images && product.images.length > 0 ? product.images : [product.img];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 lg:px-12 bg-mesh noise-overlay mb-24">
                <div className="max-w-[1400px] mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-12">
                        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
                        <ChevronRight size={10} className="text-gray-300" />
                        <Link href="/shop" className="hover:text-accent transition-colors">Collection</Link>
                        <ChevronRight size={10} className="text-gray-300" />
                        <span className="text-gray-950">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
                        {/* Left Column: Gallery */}
                        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
                            {/* Thumbnails (Desktop) */}
                            <div className="hidden md:flex flex-col gap-4 order-1 md:order-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImg === idx ? 'border-accent shadow-lg shadow-accent/10 scale-105' : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-200'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 order-2">
                                <motion.div
                                    key={activeImg}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative aspect-square w-full rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-2xl glass-card"
                                >
                                    <img
                                        src={images[activeImg]}
                                        className="w-full h-full object-cover p-8 md:p-12 hover:scale-105 transition-transform duration-700"
                                        alt={product.name}
                                    />

                                    {/* Badges Overlay */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-3">
                                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm flex items-center gap-2">
                                            <ShieldCheck size={16} className="text-accent" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Structural Verified</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-8 right-8">
                                        <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm border border-white/40">
                                            <Heart size={20} />
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Thumbnails (Mobile) */}
                                <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImg(idx)}
                                            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImg === idx ? 'border-accent' : 'border-transparent opacity-60'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Info */}
                        <div className="lg:col-span-5 flex flex-col space-y-10">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                                        {product.category || 'Packaging'}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">By {product.brand || 'BoxFox'}</span>
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.1] mb-6 font-display uppercase">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-4 mb-8">
                                    <p className="text-5xl font-bold text-gray-950 tracking-tight">
                                        {product.price}
                                    </p>
                                    <span className="text-accent font-bold uppercase text-[10px] tracking-[0.2em] px-4 py-1.5 bg-accent/5 rounded-full border border-accent/20">
                                        In Stock
                                    </span>
                                </div>

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {product.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-50 text-[9px] font-bold uppercase tracking-widest text-gray-400 rounded-lg border border-gray-100">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="text-gray-500 text-lg leading-relaxed max-w-lg mb-8">
                                    {product.short_description || `Premium quality ${product.name.toLowerCase()} designed for durability and aesthetic appeal. Perfect for your business packaging needs.`}
                                </p>

                                {/* Features Quick View */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Maximize2 size={16} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Dimensions</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-950 tabular-nums">
                                            {product.dimensions?.length} x {product.dimensions?.width} x {product.dimensions?.height} {product.dimensions?.unit || 'inch'}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Zap size={16} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Lead Time</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-950 uppercase">4-6 Working Days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Attributes / Options */}
                            {product.attributes && product.attributes.length > 0 && (
                                <div className="space-y-8">
                                    {product.attributes.map((attr, idx) => (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 block">Select {attr.name}</label>
                                                <span className="text-[10px] text-accent font-bold uppercase underline cursor-pointer">Size Guide</span>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {attr.options.map(option => (
                                                    <button
                                                        key={option}
                                                        onClick={() => setActiveAttribute(prev => ({ ...prev, [attr.name]: option }))}
                                                        className={`px-8 py-4 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${activeAttribute[attr.name] === option ? 'border-gray-950 bg-gray-950 text-white shadow-xl shadow-gray-200' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* CTAs */}
                            <div className="flex flex-col gap-6 pt-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-white border-2 border-gray-100 rounded-3xl p-2 h-20 w-36 shrink-0 shadow-sm">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-950"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="flex-1 text-center font-bold text-gray-950 text-lg tabular-nums">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-950"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product, quantity)}
                                        className="flex-1 h-20 bg-gray-950 text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-gray-800 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-gray-200"
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        addToCart(product, quantity);
                                        window.location.href = '/checkout';
                                    }}
                                    className="h-20 bg-accent text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-accent/20"
                                >
                                    Instant Purchase
                                </button>
                            </div>

                            {/* Trust Markers */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-100">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-accent">
                                        <Truck size={18} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Free Shipping</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-accent">
                                        <RotateCcw size={18} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Easy Returns</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-accent">
                                        <Package size={18} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Bulk Discounts</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-accent">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section className="bg-gray-50 py-24 px-6 lg:px-12 rounded-[5rem] mx-4 lg:mx-8 mb-24">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl font-extrabold mb-8 font-display uppercase tracking-tight">Accurate Dimensions.<br /><span className="text-accent underline">Guaranteed.</span></h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                                    <CheckCircle2 className="text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-950 uppercase text-xs tracking-widest mb-1">Precision Modeling</h4>
                                    <p className="text-sm text-gray-500">All internal and external dimensions are modeled with sub-millimeter precision for a perfect fit.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                                    <CheckCircle2 className="text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-950 uppercase text-xs tracking-widest mb-1">Material Durability</h4>
                                    <p className="text-sm text-gray-500">We use high-grade corrugated and duplex board to ensure your products stay safe during transit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                        <img
                            src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1000"
                            className="w-full h-full object-cover"
                            alt="Quality verification"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    );
}

// Helper to use Maximize2 since I noticed it wasn't in the list
function Maximize2(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
    )
}



