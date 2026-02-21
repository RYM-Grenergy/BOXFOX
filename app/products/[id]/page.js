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
    CheckCircle2,
    Box,
    Eye
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
    const [viewMode, setViewMode] = useState('2D'); // '2D' or '3D'

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
                                        onClick={() => {
                                            setActiveImg(idx);
                                            setViewMode('2D');
                                        }}
                                        className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImg === idx && viewMode === '2D' ? 'border-accent shadow-lg shadow-accent/10 scale-105' : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-200'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}

                                {/* 3D Thumbnail Button */}
                                {product.pacdoraId && (
                                    <button
                                        onClick={() => setViewMode('3D')}
                                        className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 flex flex-col items-center justify-center gap-1 transition-all duration-300 ${viewMode === '3D' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-lg scale-105' : 'border-transparent bg-gray-50 text-gray-400 hover:border-emerald-200 hover:text-emerald-500'}`}
                                    >
                                        <Box size={24} />
                                        <span className="text-[9px] font-black tracking-widest uppercase">3D View</span>
                                    </button>
                                )}
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
                                    <div className="absolute top-8 right-8 flex flex-col items-end gap-3">
                                        <button className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm border border-white/40">
                                            <Heart size={20} />
                                        </button>
                                        {product.pacdoraId && (
                                            <button
                                                onClick={() => setViewMode(viewMode === '2D' ? '3D' : '2D')}
                                                className={`px-5 h-12 rounded-full flex items-center justify-center gap-3 transition-all shadow-2xl backdrop-blur-md border-2 hover:scale-[1.02] active:scale-95 ${viewMode === '3D' ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-white border-white/40 text-gray-950 hover:border-emerald-500/50'}`}
                                                title="Toggle 3D View"
                                            >
                                                <div className="relative">
                                                    <Box size={18} className={viewMode === '3D' ? 'animate-pulse' : ''} />
                                                    {viewMode !== '3D' && (
                                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white animate-ping" />
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{viewMode === '3D' ? 'VIEWING 3D' : 'OPEN 3D MODEL'}</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* 3D Viewer Iframe */}
                                    {viewMode === '3D' && product.pacdoraId && (
                                        <div className="absolute inset-0 bg-white z-10">
                                            <iframe
                                                src={product.pacdoraId.includes('http') ? product.pacdoraId : `https://www.pacdora.com/share?id=${product.pacdoraId}&mode=3d`}
                                                className="w-full h-full border-none"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                            {/* Fullscreen Tooltip Button */}
                                            <button
                                                onClick={() => window.open(product.pacdoraId.includes('http') ? product.pacdoraId : `https://www.pacdora.com/share?id=${product.pacdoraId}&mode=3d`, '_blank')}
                                                className="absolute bottom-6 right-6 px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-2xl"
                                            >
                                                <Maximize2 size={12} />
                                                View Fullscreen
                                            </button>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Thumbnails (Mobile) */}
                                <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setActiveImg(idx);
                                                setViewMode('2D');
                                            }}
                                            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImg === idx && viewMode === '2D' ? 'border-accent' : 'border-transparent opacity-60'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))}
                                    {/* 3D Thumbnail (Mobile) */}
                                    {product.pacdoraId && (
                                        <button
                                            onClick={() => setViewMode('3D')}
                                            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all flex flex-col items-center justify-center bg-gray-50 ${viewMode === '3D' ? 'border-emerald-500 text-emerald-600 scale-105 bg-emerald-50' : 'border-transparent text-gray-400'}`}
                                        >
                                            <Box size={16} />
                                            <span className="text-[8px] font-black uppercase">3D View</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                                        {product.category || 'Packaging'}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">By {product.brand || 'BoxFox'}</span>
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black text-gray-950 tracking-tighter leading-none mb-6 uppercase">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Calculator & Price Area */}
                            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Estimator</span>
                                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                                        <Zap size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Real-time Pricing</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated Unit Price</p>
                                        <h3 className="text-3xl font-black text-gray-950">
                                            ₹{((parseFloat(product.maxPrice) || unitPrice) - ((parseFloat(product.maxPrice) || unitPrice) - (parseFloat(product.minPrice) || unitPrice)) * Math.min(1, (quantity - (product.minOrderQuantity || 100)) / 5000)).toFixed(2)}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</p>
                                        <h3 className="text-4xl font-black text-emerald-500 tracking-tighter">
                                            ₹{(quantity * ((parseFloat(product.maxPrice) || unitPrice) - ((parseFloat(product.maxPrice) || unitPrice) - (parseFloat(product.minPrice) || unitPrice)) * Math.min(1, (quantity - (product.minOrderQuantity || 100)) / 5000))).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Adjust Volume</label>
                                        <span className="text-[10px] font-black text-gray-950 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">Min. Order: {product.minOrderQuantity || 100} units</span>
                                    </div>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-2 h-16 shadow-inner">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(product.minOrderQuantity || 100, q - 100))}
                                            className="w-12 h-full flex items-center justify-center rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-950"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(product.minOrderQuantity || 100, parseInt(e.target.value) || 0))}
                                            className="flex-1 text-center font-black text-gray-950 text-xl outline-none bg-transparent"
                                        />
                                        <button
                                            onClick={() => setQuantity(q => q + 100)}
                                            className="w-12 h-full flex items-center justify-center rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-950"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => addToCart(product, quantity)}
                                        className="h-16 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gray-800 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-gray-200"
                                    >
                                        <ShoppingCart size={18} />
                                        Update Cart
                                    </button>
                                    <button
                                        onClick={() => {
                                            addToCart(product, quantity);
                                            window.location.href = '/checkout';
                                        }}
                                        className="h-16 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-emerald-100"
                                    >
                                        Checkout Now
                                    </button>
                                </div>

                                {product.pacdoraId && (
                                    <button
                                        onClick={() => {
                                            const editorUrl = product.pacdoraId.includes('http')
                                                ? product.pacdoraId.replace('share', 'editor').replace('mode=3d', '')
                                                : `https://www.pacdora.com/editor?templateId=${product.pacdoraId}`;
                                            window.open(editorUrl, '_blank');
                                        }}
                                        className="w-full h-16 bg-white border-2 border-emerald-500 text-emerald-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-50 hover:scale-[1.01] active:scale-98 transition-all"
                                    >
                                        <Maximize2 size={18} />
                                        Customize Design in 3D
                                    </button>
                                )}
                            </div>

                            {/* Trust Markers */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                                {[
                                    { icon: <Truck size={18} />, label: 'Fast Express Shipping' },
                                    { icon: <ShieldCheck size={18} />, label: 'Structural Guarantee' },
                                    { icon: <RotateCcw size={18} />, label: 'Eco-Certified' },
                                    { icon: <Package size={18} />, label: 'Bulk Support' }
                                ].map((marker, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 text-center group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
                                            {marker.icon}
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-wider text-gray-400">{marker.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section for Deep Analytics */}
                <div className="mt-40 border-t border-gray-100 pt-20">
                    <div className="flex gap-12 mb-16 border-b border-gray-100">
                        {['description', 'specifications', 'shipping', (product.pacdoraId ? 'interactive-3d' : null)].filter(Boolean).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-8 text-xs font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-gray-950' : 'text-gray-300 hover:text-gray-500'}`}
                            >
                                {tab.replace('-', ' ')}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="min-h-[300px]"
                        >
                            {activeTab === 'description' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                                    <div className="prose prose-gray max-w-none">
                                        <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter mb-6">Product Story</h3>
                                        <p className="text-gray-500 leading-relaxed text-lg italic mb-6">"Crafted for brands that demand structural excellence and visual impact."</p>
                                        <div dangerouslySetInnerHTML={{ __html: product.description || product.short_description }} className="text-gray-600 leading-relaxed space-y-4" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        {product.tags?.map(tag => (
                                            <div key={tag} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-gray-50">
                                                    <CheckCircle2 size={18} />
                                                </div>
                                                <h4 className="text-sm font-black text-gray-950 uppercase tracking-widest">Premium {tag}</h4>
                                                <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase">Strictly quality tested in our production center for maximum durability.</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="max-w-4xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
                                        {(product.specifications?.length > 0 ? product.specifications : [
                                            { key: 'Material', value: '3-Ply Corrugated / Duplex' },
                                            { key: 'GSM', value: '350 - 450 GSM' },
                                            { key: 'Finish', value: 'Matte/Gloss Lamination' },
                                            { key: 'Printing', value: 'CMYK / Pantone' },
                                            { key: 'Brand', value: product.brand },
                                            { key: 'Origin', value: 'Made in India' }
                                        ]).map((spec, i) => (
                                            <div key={i} className="flex items-center justify-between py-5 border-b border-gray-50 group hover:border-emerald-500/20 transition-all">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{spec.key}</span>
                                                <span className="text-sm font-bold text-gray-950">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shipping' && (
                                <div className="max-w-2xl space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                <Truck className="text-emerald-500" size={24} />
                                            </div>
                                            <h4 className="text-xs font-black uppercase tracking-widest">Doorstep Delivery</h4>
                                            <p className="text-xs text-gray-400 font-medium tracking-tight">Standard delivery across all metro cities in India.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                <RotateCcw className="text-emerald-500" size={24} />
                                            </div>
                                            <h4 className="text-xs font-black uppercase tracking-widest">Design Support</h4>
                                            <p className="text-xs text-gray-400 font-medium tracking-tight">Dedicated team for artwork and structural approval.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                <ShieldCheck className="text-emerald-500" size={24} />
                                            </div>
                                            <h4 className="text-xs font-black uppercase tracking-widest">Order Tracking</h4>
                                            <p className="text-xs text-gray-400 font-medium tracking-tight">Real-time tracking available in your account dashboard.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'interactive-3d' && product.pacdoraId && (
                                <div className="w-full aspect-video rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl bg-mesh relative">
                                    <iframe
                                        src={product.pacdoraId.includes('http') ? product.pacdoraId : `https://www.pacdora.com/share?id=${product.pacdoraId}&mode=3d`}
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <div className="absolute top-8 left-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-2">3D Structural Review</h4>
                                        <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest max-w-[200px]">Rotate and interact with the professional grade structural model.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
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



