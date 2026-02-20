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
        price: '',
        originalPrice: '',
        discount: '',
        img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
        badge: '',
        hasVariants: true
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
                    id: `prod-${Date.now()}`,
                    originalPrice: parseFloat(formData.originalPrice) || undefined
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg('Product added successfully!');
                fetchProducts();
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMsg('');
                    setFormData({
                        name: '',
                        category: 'Packaging',
                        price: '',
                        originalPrice: '',
                        discount: '',
                        img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
                        badge: '',
                        hasVariants: true
                    });
                }, 1500);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
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
                                                    <p className="text-sm font-black text-gray-950 line-clamp-1">{product.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">ID: {product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                                {product.category}
                                            </span>
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
                                                <button className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
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
                                                        <option>Packaging</option>
                                                        <option>Duplex Boxes</option>
                                                        <option>3Ply n More</option>
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

                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Price Range/Price</label>
                                                    <input
                                                        required
                                                        value={formData.price}
                                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                        placeholder="₹12.00 - ₹25.00"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Orig. Price</label>
                                                    <input
                                                        type="number"
                                                        value={formData.originalPrice}
                                                        onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                                        placeholder="36"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Discount Label</label>
                                                    <input
                                                        value={formData.discount}
                                                        onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                                        placeholder="60%"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image URL</label>
                                                <div className="flex gap-4">
                                                    <input
                                                        required
                                                        value={formData.img}
                                                        onChange={e => setFormData({ ...formData, img: e.target.value })}
                                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
                                                    <div className="w-14 h-14 rounded-2xl border border-gray-100 overflow-hidden shrink-0">
                                                        <img src={formData.img} className="w-full h-full object-cover" alt="Preview" />
                                                    </div>
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
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
