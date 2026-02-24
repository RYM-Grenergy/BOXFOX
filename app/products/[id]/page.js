"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingCart,
    CheckCircle2,
    Box,
    Sparkles,
    ShieldCheck,
    Truck,
    Star,
    ArrowRight
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
    const [quantity, setQuantity] = useState(100);
    const [viewMode, setViewMode] = useState('2D');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/products/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                if (data.minOrderQuantity) setQuantity(data.minOrderQuantity);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    if (loading || !product) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-32 px-6 flex justify-center italic text-gray-400">Loading Product...</div>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : [product.img];
    const displayImage = images[activeImg];
    const unitPrice = parseFloat(product.price) || 15;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-8 px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Product Media */}
                        <div className="lg:col-span-5 lg:col-start-2 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-950/10 shadow-xl"
                            >
                                {viewMode === '3D' ? (
                                    <iframe
                                        src={product.pacdoraId?.includes('http')
                                            ? (product.pacdoraId.includes('?') ? `${product.pacdoraId}&embed=1` : `${product.pacdoraId}?embed=1`)
                                            : `https://www.pacdora.com/share?id=${product.pacdoraId}&mode=3d&embed=1`
                                        }
                                        className="w-full h-full border-none bg-gray-50"
                                        allow="accelerometer; gyroscope; vr; xr-spatial-tracking"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-8 md:p-16 text-center">
                                        <img src={displayImage} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                                    </div>
                                )}

                                {product.pacdoraId && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/90 backdrop-blur-xl p-1 rounded-2xl border border-gray-950/10 shadow-2xl">
                                        <button
                                            onClick={() => setViewMode('2D')}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === '2D' ? 'bg-gray-950 text-white shadow-lg' : 'text-gray-400 hover:text-gray-950'}`}
                                        >
                                            Gallery
                                        </button>
                                        <button
                                            onClick={() => setViewMode('3D')}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === '3D' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-950'}`}
                                        >
                                            3D View
                                        </button>
                                    </div>
                                )}
                            </motion.div>

                            <div className="flex gap-4 p-2 bg-gray-50/50 rounded-3xl w-fit">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setActiveImg(i); setViewMode('2D'); }}
                                        className={`relative w-24 h-24 rounded-2xl transition-all duration-300 shrink-0 ${activeImg === i && viewMode === '2D'
                                            ? 'ring-2 ring-gray-950 ring-offset-4 ring-offset-white scale-95 shadow-lg'
                                            : 'opacity-40 hover:opacity-100 hover:scale-105'
                                            }`}
                                    >
                                        <div className="w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-100 p-1">
                                            <img src={img} className="w-full h-full object-contain" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Details */}
                        <div className="lg:col-span-5 space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black tracking-widest uppercase">Premium Series</span>
                                    {product.inStock && <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1"><CheckCircle2 size={10} /> In Stock</span>}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter uppercase">{product.name}</h1>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{product.description || "The ultimate professional packaging solution for your premium brand. Structural integrity meets aesthetic perfection."}</p>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-950/10 space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Starts At</p>
                                        <p className="text-4xl font-black text-gray-950 tracking-tighter">₹{unitPrice}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MOQ</p>
                                        <p className="text-xl font-black text-gray-950">{product.minOrderQuantity || 100} Units</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href={`/customize?length=${product.dimensions?.length || 12}&width=${product.dimensions?.width || 8}&height=${product.dimensions?.height || 4}`}
                                        className="w-full py-6 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex flex-col items-center justify-center gap-1 hover:bg-emerald-400 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] active:scale-95"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Sparkles size={18} /> AI Design & Custom Size
                                        </div>
                                    </Link>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase text-center tracking-widest">OR Order Standard Size</p>
                                    <button
                                        onClick={() => addToCart(product, quantity)}
                                        className="w-full py-5 border-2 border-gray-950 text-gray-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-950 hover:text-white transition-all flex items-center justify-center gap-3"
                                    >
                                        <ShoppingCart size={18} /> Standard Checkout
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><Truck size={18} className="text-emerald-500" /></div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-950">Express Shipping</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Pan India Delivery</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><ShieldCheck size={18} className="text-emerald-500" /></div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-950">Secure Payment</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">100% Encrypted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
