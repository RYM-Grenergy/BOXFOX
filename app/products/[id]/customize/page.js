"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    ArrowLeft,
    Box,
    Sparkles,
    Ruler,
    RefreshCw,
    Download,
    Minus,
    Plus,
    Move,
    Search,
    ChevronDown,
    CheckCircle2,
    RotateCw,
    Maximize2,
    Zap,
    Upload,
    Type,
    Image as ImageIcon,
    Layout,
    Trash2,
    Palette,
    Layers,
    Scissors,
    Shield,
    Check
} from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

export default function CustomizePage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(10);
    const [viewMode, setViewMode] = useState('2D');

    // Customization States
    const [dimensions, setDimensions] = useState({ l: 12, w: 8, h: 4 });
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [customText, setCustomText] = useState("");

    // Neural Multi-Asset Pool (Max 3)
    const [assetPool, setAssetPool] = useState([]);
    const [activeAssetIndex, setActiveAssetIndex] = useState(0);
    const [boxTextures, setBoxTextures] = useState({
        front: null, back: null, top: null, bottom: null, left: null, right: null
    });
    const [boxColors, setBoxColors] = useState({
        front: '#059669', back: '#059669', top: '#059669', bottom: '#059669', left: '#059669', right: '#059669'
    });
    const [activeColor, setActiveColor] = useState('#059669');
    const [customMode, setCustomMode] = useState('texture'); // 'texture' or 'color'

    // Rotation State
    const [rotate, setRotate] = useState({ x: -20, y: 45 });
    const isDragging = useRef(false);

    const [isRestored, setIsRestored] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/products/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);

                const savedState = localStorage.getItem(`boxfox_custom_${params.id}`);
                if (savedState) {
                    try {
                        const parsed = JSON.parse(savedState);
                        setQuantity(parsed.quantity || data.minOrderQuantity || 10);
                        if (parsed.dimensions) setDimensions(parsed.dimensions);
                        if (parsed.aiPrompt) setAiPrompt(parsed.aiPrompt);
                        if (parsed.customText) setCustomText(parsed.customText);
                        if (parsed.assetPool) setAssetPool(parsed.assetPool);
                        if (parsed.activeAssetIndex !== undefined) setActiveAssetIndex(parsed.activeAssetIndex);
                        if (parsed.boxTextures) setBoxTextures(parsed.boxTextures);
                        if (parsed.boxColors) setBoxColors(parsed.boxColors);
                        if (parsed.activeColor) setActiveColor(parsed.activeColor);
                        if (parsed.customMode) setCustomMode(parsed.customMode);
                        if (parsed.rotate) setRotate(parsed.rotate);
                    } catch (e) {
                        console.error("Failed to restore state", e);
                        setQuantity(data.minOrderQuantity || 10);
                    }
                } else {
                    setQuantity(data.minOrderQuantity || 10);
                }

                setIsRestored(true);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    useEffect(() => {
        if (isRestored && product) {
            const stateToSave = {
                quantity, dimensions, aiPrompt, customText, assetPool,
                activeAssetIndex, boxTextures, boxColors, activeColor,
                customMode, rotate
            };
            localStorage.setItem(`boxfox_custom_${params.id}`, JSON.stringify(stateToSave));
        }
    }, [quantity, dimensions, aiPrompt, customText, assetPool, activeAssetIndex, boxTextures, boxColors, activeColor, customMode, rotate, isRestored, product, params.id]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newAsset = reader.result;
                setAssetPool(prev => {
                    const updated = [...prev, newAsset].slice(-3); // Keep last 3
                    setActiveAssetIndex(updated.length - 1);
                    return updated;
                });
                // Default apply to Front if it's the first asset
                if (assetPool.length === 0) {
                    setBoxTextures(prev => ({ ...prev, front: newAsset }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleFaceMapping = (face) => {
        if (customMode === 'texture') {
            const currentAsset = assetPool[activeAssetIndex];
            if (!currentAsset) return;
            setBoxTextures(prev => ({
                ...prev,
                [face]: prev[face] === currentAsset ? null : currentAsset
            }));
        } else {
            setBoxColors(prev => ({
                ...prev,
                [face]: activeColor
            }));
        }
    };

    const smartApplyAI = (imageSrc) => {
        setAssetPool(prev => {
            const updated = [...prev, imageSrc].slice(-3);
            setActiveAssetIndex(updated.length - 1);
            return updated;
        });
        // Auto-wrap all sides for AI results (Neural Smart Wrap)
        setBoxTextures({
            front: imageSrc, back: imageSrc, top: imageSrc,
            bottom: imageSrc, left: imageSrc, right: imageSrc
        });
    };

    // Advanced Scaling for 3D View - EXPANDED SCALE
    const maxVal = Math.max(dimensions.l, dimensions.w, dimensions.h);
    const factor = 320 / maxVal; // Increased from 240 to 320 for "LITTLE BIG" effect
    const L = dimensions.l * factor;
    const W = dimensions.w * factor;
    const H = dimensions.h * factor;

    const currentSA = 2 * (dimensions.l * dimensions.w + dimensions.w * dimensions.h + dimensions.h * dimensions.l);

    // Base min/max pricing from product
    const basePrice = typeof product?.price === 'number' ? product.price : parseFloat(String(product?.price || 15).replace(/[^0-9.]/g, '')) || 15;
    const minPrice = typeof product?.minPrice === 'number' ? product.minPrice : parseFloat(String(product?.minPrice || basePrice).replace(/[^0-9.]/g, '')) || basePrice;
    const maxPrice = typeof product?.maxPrice === 'number' ? product.maxPrice : parseFloat(String(product?.maxPrice || basePrice).replace(/[^0-9.]/g, '')) || basePrice;

    // Practical Tiered Step Pricing
    const diff = maxPrice - minPrice;
    let unitPriceVal = maxPrice;

    if (quantity >= 5000) unitPriceVal = minPrice;
    else if (quantity >= 1000) unitPriceVal = maxPrice - (diff * 0.4651);
    else if (quantity >= 500) unitPriceVal = maxPrice - (diff * 0.4205);
    else if (quantity >= 100) unitPriceVal = maxPrice - (diff * 0.3364);
    else if (quantity >= 50) unitPriceVal = maxPrice - (diff * 0.1682);
    else if (quantity >= 30) unitPriceVal = maxPrice - (diff * 0.10);
    else if (quantity >= 20) unitPriceVal = maxPrice - (diff * 0.05);
    else unitPriceVal = maxPrice;

    // Apply surface area multiplier
    const calculatedUnitPrice = (unitPriceVal * (currentSA / 288)).toFixed(2);

    if (loading || !product) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-emerald-500 font-black tracking-tighter text-4xl animate-pulse">SYNCHRONIZING_NEURAL_MAP...</div>;

    const faceStyle = (face) => ({
        backgroundImage: boxTextures[face] ? `url(${boxTextures[face]})` : 'none',
        backgroundColor: boxColors[face] || 'rgba(16, 185, 129, 0.05)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
    });

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500 selection:text-black">
            <Navbar />
            <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />

            <main className="pt-24 pb-8 px-6 lg:px-12 max-w-[1900px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* 3D SPATIAL CANVAS (LEFT) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-6 py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <span className="absolute inset-0 bg-emerald-500 blur-md opacity-50 animate-pulse" />
                                <span className="relative block w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-emerald-400 italic">Neural_Smart_Cube_v2.5_XL</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <RefreshCw size={10} className="animate-spin-slow text-emerald-500" />
                                SYSTEM_SYNC_ACTIVE
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative h-[780px] bg-[#030712] rounded-[5rem] border border-white/10 shadow-[0_60px_150px_rgba(0,0,0,0.8)] overflow-hidden cursor-grab active:cursor-grabbing group"
                        style={{ background: 'radial-gradient(circle at center, #064e3b 0%, #030712 70%)' }}
                        onMouseDown={() => { isDragging.current = true; }}
                        onMouseMove={(e) => {
                            if (isDragging.current) setRotate(r => ({ x: r.x - e.movementY * 0.4, y: r.y + e.movementX * 0.4 }));
                        }}
                        onMouseUp={() => { isDragging.current = false; }}
                        onMouseLeave={() => { isDragging.current = false; }}
                    >
                        {/* 3D Blueprint Engine */}
                        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '2500px' }}>
                            <motion.div
                                animate={{ rotateX: rotate.x, rotateY: rotate.y }}
                                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                                style={{ transformStyle: 'preserve-3d', width: L, height: H, position: 'relative' }}
                            >
                                {/* FRONT FACE */}
                                <div className={`absolute border border-white/10 flex items-center justify-center overflow-hidden`}
                                    style={{ ...faceStyle('front'), width: L, height: H, transform: `translateZ(${W / 2}px)` }}>
                                    {!boxTextures.front && <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">FRONT</div>}
                                    {customText && <div className="absolute font-black uppercase tracking-widest text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-center px-4" style={{ fontSize: `${H / 5}px`, transform: 'translateZ(1px)' }}>{customText}</div>}
                                </div>

                                {/* BACK FACE */}
                                <div className={`absolute border border-white/10 flex items-center justify-center overflow-hidden`}
                                    style={{ ...faceStyle('back'), width: L, height: H, transform: `rotateY(180deg) translateZ(${W / 2}px)` }}>
                                    {!boxTextures.back && <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">BACK</div>}
                                </div>

                                {/* RIGHT FACE */}
                                <div className={`absolute border border-white/10 flex items-center justify-center overflow-hidden`}
                                    style={{ ...faceStyle('right'), width: W, height: H, transform: `rotateY(90deg) translateZ(${L / 2}px)`, left: (L - W) / 2 }}>
                                    {!boxTextures.right && <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] rotate-[-90deg]">RIGHT</div>}
                                </div>

                                {/* LEFT FACE */}
                                <div className={`absolute border border-white/10 flex items-center justify-center overflow-hidden`}
                                    style={{ ...faceStyle('left'), width: W, height: H, transform: `rotateY(-90deg) translateZ(${L / 2}px)`, left: (L - W) / 2 }}>
                                    {!boxTextures.left && <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] rotate-[90deg]">LEFT</div>}
                                </div>

                                {/* TOP FACE */}
                                <div className={`absolute border border-white/10 flex items-center justify-center overflow-hidden`}
                                    style={{ ...faceStyle('top'), width: L, height: W, transform: `rotateX(90deg) translateZ(${H / 2}px)`, top: (H - W) / 2 }}>
                                    {!boxTextures.top && <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">TOP_LID</div>}
                                    {customText && <div className="absolute font-black uppercase tracking-[0.3em] text-white italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-center px-4" style={{ fontSize: `${L / 10}px`, transform: 'translateZ(1px)' }}>{customText}</div>}
                                </div>

                                {/* BOTTOM FACE */}
                                <div className={`absolute border border-white/10 flex items-center justify-center overflow-hidden`}
                                    style={{ ...faceStyle('bottom'), width: L, height: W, transform: `rotateX(-90deg) translateZ(${H / 2}px)`, top: (H - W) / 2 }}>
                                    {!boxTextures.bottom && <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">BOTTOM</div>}
                                </div>
                            </motion.div>
                        </div>

                        {/* HUD Elements */}
                        <div className="absolute top-10 left-10 pointer-events-none space-y-1">
                            <div className="text-[11px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-3 italic">
                                <Layers size={14} className="text-emerald-500" /> Neural_Texture_Wrapper
                            </div>
                        </div>

                        <div className="absolute bottom-12 left-10 right-10 flex items-center justify-between pointer-events-none">
                            <div className="flex gap-10">
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-emerald-500/40 uppercase mb-1 tracking-widest">Dimension_L</p>
                                    <p className="text-2xl font-black italic">{dimensions.l}"</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-emerald-500/40 uppercase mb-1 tracking-widest">Dimension_W</p>
                                    <p className="text-2xl font-black italic">{dimensions.w}"</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-emerald-500/40 uppercase mb-1 tracking-widest">Dimension_H</p>
                                    <p className="text-2xl font-black italic">{dimensions.h}"</p>
                                </div>
                            </div>
                            <div className="px-6 py-2.5 bg-black/60 border border-emerald-500/30 rounded-2xl flex items-center gap-3 backdrop-blur-xl">
                                <RotateCw size={14} className="text-emerald-500 animate-spin-slow" />
                                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase italic">Interactive_Lab</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTROL PANEL (RIGHT) */}
                <div className="lg:col-span-5 space-y-8 h-fit lg:sticky lg:top-24">
                    <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5 shadow-3xl space-y-8 backdrop-blur-md">
                        {/* Section 1: Dimensions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Ruler size={18} className="text-emerald-500" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] italic">01_Spatial_Geometry</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {['l', 'w', 'h'].map(d => (
                                    <div key={d} className="space-y-2">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest px-1">{d.toUpperCase()}</p>
                                        <input
                                            type="number"
                                            value={dimensions[d]}
                                            onChange={(e) => setDimensions({ ...dimensions, [d]: parseFloat(e.target.value) || 1 })}
                                            className="w-full h-16 bg-[#030712] border border-white/10 rounded-2xl px-6 text-xl font-black focus:border-emerald-500 outline-none transition-all shadow-inner text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Quantity Selection */}
                        <div className="space-y-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <Box size={18} className="text-emerald-500" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] italic">02_Quantity_Selection</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[10, 20, 30, 100, 200, 300, 500, 1000].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setQuantity(q)}
                                        className={`flex-[1_1_0%] min-w-[60px] py-3 rounded-xl border font-black text-xs transition-all ${quantity === q ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg' : 'bg-[#030712] text-white/40 border-white/10 hover:border-emerald-500/40 hover:text-white'}`}
                                    >
                                        {q}
                                    </button>
                                ))}
                                <div className="relative flex-[2_2_0%] min-w-[100px]">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 10))}
                                        className="w-full h-full py-3 px-4 rounded-xl bg-[#030712] border border-white/10 font-black text-xs text-white placeholder-white/20 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Custom..."
                                        min={10}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-white/20">MOQ: 10</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Asset Library & Color Lab */}
                        <div className="space-y-6 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                                        <button
                                            onClick={() => setCustomMode('texture')}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${customMode === 'texture' ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                                        >
                                            Neural_Maps
                                        </button>
                                        <button
                                            onClick={() => setCustomMode('color')}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${customMode === 'color' ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                                        >
                                            Solid_Lab
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Mapping_Active</span>
                                    <span className="text-[10px] font-black text-white/20 uppercase">{customMode === 'texture' ? `${assetPool.length}/3 Assets` : activeColor}</span>
                                </div>
                            </div>

                            {customMode === 'texture' ? (
                                <div className="grid grid-cols-4 gap-4">
                                    <label className="aspect-square border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 rounded-3xl flex items-center justify-center cursor-pointer hover:border-emerald-500/40 transition-all group relative overflow-hidden">
                                        <input type="file" className="hidden" onChange={handleFileUpload} />
                                        <Plus size={24} className="text-emerald-500/40 group-hover:text-emerald-500 transition-all" />
                                    </label>
                                    {assetPool.map((asset, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveAssetIndex(idx)}
                                            className={`relative aspect-square rounded-3xl overflow-hidden cursor-pointer border-2 transition-all ${activeAssetIndex === idx ? 'border-emerald-500 scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                                        >
                                            <img src={asset} className="w-full h-full object-cover" />
                                            {activeAssetIndex === idx && (
                                                <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                                    <div className="bg-emerald-500 rounded-full p-1"><Check size={12} className="text-black" /></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2.5">
                                    {['#000000', '#FFFFFF', '#059669', '#1D4ED8', '#B91C1C', '#D97706', '#7C3AED', '#DB2777', '#4B5563', '#111827'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setActiveColor(color)}
                                            style={{ backgroundColor: color }}
                                            className={`w-10 h-10 rounded-xl border-2 transition-all ${activeColor === color ? 'border-emerald-500 scale-90 ring-4 ring-emerald-500/20' : 'border-white/10 hover:border-white/30'}`}
                                        />
                                    ))}
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative group overflow-hidden">
                                        <input
                                            type="color"
                                            value={activeColor}
                                            onChange={(e) => setActiveColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                                        />
                                        <Plus size={16} className="text-white/20" />
                                    </div>
                                </div>
                            )}

                            {(assetPool.length > 0 || customMode === 'color') && (
                                <div className="space-y-5 pt-6 bg-white/5 rounded-[3rem] p-8 border border-white/5 backdrop-blur-sm">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Face_Mapping_Protocol</p>
                                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">Click side to apply {customMode}</p>
                                        </div>
                                        {customMode === 'color' && <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: activeColor }} />}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['front', 'back', 'left', 'right', 'top', 'bottom'].map(face => (
                                            <button
                                                key={face}
                                                onClick={() => toggleFaceMapping(face)}
                                                className={`px-4 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${(customMode === 'texture' && boxTextures[face] === assetPool[activeAssetIndex] && boxTextures[face]) ||
                                                    (customMode === 'color' && boxColors[face] === activeColor)
                                                    ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg'
                                                    : 'bg-black/40 text-white/40 border-white/5 hover:border-emerald-500/40'
                                                    }`}
                                            >
                                                {face}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Neural Generation */}
                        <div className="space-y-6 pt-4 border-t border-white/5 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Sparkles size={18} className="text-emerald-500" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] italic">03_Neural_Smart_Render</h3>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-[8px] font-black border border-emerald-500/20">AUTO_WRAP_ACTIVE</div>
                            </div>

                            <textarea
                                placeholder="Neural instructions... (e.g. Royal emerald velvet with silver calligraphy...)"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="w-full h-28 bg-[#030712] border border-white/10 rounded-2xl p-6 text-sm italic placeholder:text-white/10 focus:border-emerald-500 outline-none resize-none transition-all"
                            />

                            <button
                                onClick={async () => {
                                    if (!aiPrompt || !window.puter) return;
                                    setIsGenerating(true);
                                    try {
                                        // THE "CLEAN PATTERN" ARCHITECT: Stripping text and logos to allow custom text to shine
                                        const fullPrompt = `High-resolution ultra-seamless flat material pattern graphic for packaging. 
                                            Theme: ${aiPrompt}. 
                                            Visuals: Continuous professional luxury texture, edge-to-edge design, no perspective, flat wallpaper style. 
                                            Styling: ${aiPrompt.toLowerCase().includes('luxury') ? 'intricate gold foil filigree, deep velvet colors, high-contrast embossing' : 'clean minimalist geometric shapes, organic paper grain'}. 
                                            Technical: Perfectly tileable, sharp focus, 8k digital art, top-down view, centered composition. 
                                            Negative Prompt: text, logo, words, letters, font, typography, watermark, 3D box, perspective, shadow, box object, floor, background, room.`;

                                        const img = await window.puter.ai.txt2img(fullPrompt);
                                        smartApplyAI(img.src);
                                        setViewMode('3D');
                                    } catch (err) {
                                        console.error("Neural Render Error:", err);
                                    } finally { setIsGenerating(false); }
                                }}
                                disabled={isGenerating || !aiPrompt}
                                className="w-full h-20 bg-white text-black rounded-2xl font-black uppercase text-[12px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-emerald-500 hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-20"
                            >
                                {isGenerating ? <RefreshCw className="animate-spin" /> : <><Zap size={18} /> Ignite_Neural_Wrapper</>}
                            </button>
                        </div>
                    </div>

                    {/* Cart Trigger */}
                    <div className="bg-emerald-500 rounded-[3rem] p-10 text-black flex items-center justify-between shadow-[0_45px_100px_rgba(16,185,129,0.3)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-none opacity-60">Unit_Price_EST</p>
                            <h2 className="text-5xl font-black italic tracking-tighter">₹{calculatedUnitPrice}</h2>
                        </div>
                        <button onClick={() => addToCart(product, quantity)} className="h-20 px-12 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-4 hover:scale-105 transition-all shadow-2xl active:scale-95">
                            <ShoppingCart size={22} /> Deploy_to_Cart
                        </button>
                    </div>
                </div>
            </main >

            <style jsx global>{`
                .animate-spin-slow { animation: spin 10s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
            `}</style>
        </div >
    );
}
