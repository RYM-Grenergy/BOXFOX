"use client";
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    RefreshCw,
    X,
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: 'Packaging',
        minPrice: '',
        maxPrice: '',
        originalPrice: '',
        discount: '',
        images: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
        badge: '',
        hasVariants: true,
        description: '',
        short_description: '',
        brand: 'BoxFox',
        minOrderQuantity: 100,
        tags: '',
        specifications: [],
        length: 8.5,
        width: 6.5,
        height: 2,
        unit: 'inch',
        pacdoraId: ''
    });

    const fetchProducts = () => {
        setLoading(true);
        fetch('/api/products?admin=true')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: formData.id || `prod-${Date.now()}`,
                    originalPrice: parseFloat(formData.originalPrice) || undefined
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg('Product saved successfully!');
                fetchProducts();
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMsg('');
                    setFormData({
                        name: '',
                        category: 'Packaging',
                        minPrice: '',
                        maxPrice: '',
                        originalPrice: '',
                        discount: '',
                        images: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
                        badge: '',
                        hasVariants: true,
                        description: '',
                        short_description: '',
                        brand: 'BoxFox',
                        minOrderQuantity: 100,
                        tags: '',
                        specifications: [],
                        length: 8.5,
                        width: 6.5,
                        height: 2,
                        unit: 'inch',
                        pacdoraId: ''
                    });
                }, 1500);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProducts();
            }
        } catch (e) {
            console.error('Failed to delete product', e);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            _id: product._id,
            id: product.id,
            name: product.name,
            category: product.category,
            minPrice: product.minPrice || '',
            maxPrice: product.maxPrice || '',
            originalPrice: product.originalPrice || '',
            discount: product.discount || '',
            images: Array.isArray(product.images) ? product.images.join(', ') : (product.img || ''),
            badge: product.badge || '',
            hasVariants: product.hasVariants,
            description: product.description || '',
            short_description: product.short_description || '',
            brand: product.brand || 'BoxFox',
            minOrderQuantity: product.minOrderQuantity || 100,
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            specifications: product.specifications || [],
            length: product.dimensions?.length || 8.5,
            width: product.dimensions?.width || 6.5,
            height: product.dimensions?.height || 2,
            unit: product.dimensions?.unit || 'inch',
            pacdoraId: product.pacdoraId || ''
        });
        setIsModalOpen(true);
    };

    const flatProducts = products;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-950 tracking-tighter">Product Inventory</h1>
                    <p className="text-gray-400 font-medium tracking-tight">Manage your real-time packaging catalog synced with the backend.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchProducts}
                        className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:text-gray-950 transition-all active:rotate-180"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-8 py-4 bg-gray-950 text-white rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200"
                    >
                        <Plus size={20} />
                        ADD NEW PRODUCT
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input type="text" placeholder="Search by name or category..." className="bg-transparent outline-none w-full text-sm font-medium" />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-950 transition-all">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center animate-pulse space-y-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Live Inventory...</p>
                        </div>
                    ) : flatProducts.length === 0 ? (
                        <div className="p-20 text-center space-y-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                <Plus size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-950">No products found</h3>
                                <p className="text-gray-400 font-medium">Your database is empty. Add your first product to see it here.</p>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Product</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Price Range</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {flatProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                                    <img src={product.img} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-black text-gray-950 line-clamp-1">{product.name}</p>
                                                        {product.badge && (
                                                            <span className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-[8px] font-black uppercase tracking-tighter">
                                                                {product.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">ID: {product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                    {product.category}
                                                </span>
                                                {product.pacdoraId && (
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest text-center">
                                                        3D READY
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-gray-950">{product.price}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.outOfStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                {product.outOfStock ? 'Out of Stock' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(product._id || product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-2xl h-full bg-white shadow-2xl p-10 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-950 tracking-tighter">Add New Product</h2>
                                    <p className="text-gray-400 font-medium">Create a new entry in your global inventory.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {successMsg ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-950">Success!</h3>
                                    <p className="text-gray-400 font-medium">{successMsg}</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSave} className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Product Name</label>
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="e.g. 3 Ply Luxury Pizza Box"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all appearance-none"
                                                    >
                                                        <option value="Packaging">Packaging</option>
                                                        <option value="Pizza Boxes">Pizza Boxes</option>
                                                        <option value="Cake Boxes">Cake Boxes</option>
                                                        <option value="Sweet Boxes">Sweet Boxes</option>
                                                        <option value="Mailer Boxes">Mailer Boxes</option>
                                                        <option value="Carry Bags">Carry Bags / Paper Bags</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Badge (Optional)</label>
                                                    <input
                                                        value={formData.badge}
                                                        onChange={e => setFormData({ ...formData, badge: e.target.value })}
                                                        placeholder="e.g. New"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Min Price</label>
                                                    <input
                                                        required
                                                        value={formData.minPrice}
                                                        onChange={e => setFormData({ ...formData, minPrice: e.target.value })}
                                                        placeholder="₹12.00"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Max Price (Optional)</label>
                                                    <input
                                                        value={formData.maxPrice}
                                                        onChange={e => setFormData({ ...formData, maxPrice: e.target.value })}
                                                        placeholder="₹25.00"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Brand</label>
                                                    <input
                                                        value={formData.brand}
                                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                                        placeholder="e.g. BoxFox"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Min Order Qty</label>
                                                    <input
                                                        type="number"
                                                        value={formData.minOrderQuantity}
                                                        onChange={e => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                                                        placeholder="100"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Tags (Comma separated)</label>
                                                <input
                                                    value={formData.tags}
                                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                                    placeholder="Pizza, Eco-friendly, Premium"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Pacdora ID / URL (For 3D View)</label>
                                                <input
                                                    value={formData.pacdoraId}
                                                    onChange={e => setFormData({ ...formData, pacdoraId: e.target.value })}
                                                    placeholder="e.g. 5x2x8-mailer-box or full share URL"
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Short Description</label>
                                                <textarea
                                                    rows="2"
                                                    value={formData.short_description}
                                                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                                                    placeholder="Brief overview for product cards..."
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all resize-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Description</label>
                                                <textarea
                                                    required
                                                    rows="4"
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Detailed description of the product..."
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all resize-none"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Specifications</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            ...formData,
                                                            specifications: [...(formData.specifications || []), { key: '', value: '' }]
                                                        })}
                                                        className="text-[10px] font-black text-emerald-600 uppercase tracking-widest"
                                                    >
                                                        + Add Spec
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {(formData.specifications || []).map((spec, i) => (
                                                        <div key={i} className="flex gap-3">
                                                            <input
                                                                placeholder="Key (e.g. Material)"
                                                                value={spec.key}
                                                                onChange={e => {
                                                                    const newSpecs = [...formData.specifications];
                                                                    newSpecs[i].key = e.target.value;
                                                                    setFormData({ ...formData, specifications: newSpecs });
                                                                }}
                                                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold"
                                                            />
                                                            <input
                                                                placeholder="Value (e.g. Corrugated)"
                                                                value={spec.value}
                                                                onChange={e => {
                                                                    const newSpecs = [...formData.specifications];
                                                                    newSpecs[i].value = e.target.value;
                                                                    setFormData({ ...formData, specifications: newSpecs });
                                                                }}
                                                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSpecs = formData.specifications.filter((_, idx) => idx !== i);
                                                                    setFormData({ ...formData, specifications: newSpecs });
                                                                }}
                                                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Length</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={formData.length}
                                                        onChange={e => setFormData({ ...formData, length: e.target.value })}
                                                        placeholder="8.5"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Width</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={formData.width}
                                                        onChange={e => setFormData({ ...formData, width: e.target.value })}
                                                        placeholder="6.5"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Height</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={formData.height}
                                                        onChange={e => setFormData({ ...formData, height: e.target.value })}
                                                        placeholder="2"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Unit</label>
                                                    <select
                                                        value={formData.unit}
                                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all appearance-none"
                                                    >
                                                        <option value="inch">Inch</option>
                                                        <option value="cm">CM</option>
                                                        <option value="mm">MM</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image URLs (Comma separated)</label>
                                                <div className="space-y-4">
                                                    <textarea
                                                        required
                                                        rows="3"
                                                        value={formData.images}
                                                        onChange={e => setFormData({ ...formData, images: e.target.value })}
                                                        placeholder="Add image URLs separated by commas..."
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all resize-none"
                                                    />
                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                        {formData.images.split(',').map((url, i) => url.trim() && (
                                                            <div key={i} className="w-20 h-20 rounded-2xl border border-gray-100 overflow-hidden shrink-0">
                                                                <img src={url.trim()} className="w-full h-full object-cover" alt={`Preview ${i + 1}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-gray-100 flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 hover:text-gray-950 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={isSaving}
                                                className="flex-[2] py-5 bg-gray-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                                            >
                                                {isSaving ? 'Saving...' : 'Save Product'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


