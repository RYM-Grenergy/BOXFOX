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
    CheckCircle2,
    UploadCloud,
    Loader2,
    Copy,
    Download,
    Star,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        patternImg: '',
        patternFormat: '',
        dielineImg: '',
        dielineFormat: '',
        category: 'CupCake',
        minPrice: '',
        maxPrice: '',
        originalPrice: '',
        discount: '',
        images: 'https://res.cloudinary.com/dklavcjrl/image/upload/v1774544987/boxfox/products/large_burrito_box_1_1774544835718.jpg, https://res.cloudinary.com/dklavcjrl/image/upload/v1774544989/boxfox/products/large_burrito_box_2_1774544858239.jpg',
        badge: '',
        hasVariants: true,
        description: '',
        short_description: '',
        brand: 'BoxFox',
        minOrderQuantity: 10,
        tags: '',
        specifications: [],
        length: '',
        width: '',
        height: '',
        unit: 'inch',
        pacdoraId: '',
        isActive: true,
        isFeatured: false
    });

    const fetchProducts = () => {
        setLoading(true);
        fetch('/api/products?admin=true&all=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Admin: Failed to fetch products", data);
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setIsUploading(true);
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                await new Promise((resolve) => {
                    reader.onload = async () => {
                        const base64Data = reader.result;
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ image: base64Data })
                        });
                        const data = await response.json();
                        if (data.url) uploadedUrls.push(data.url);
                        resolve();
                    };
                });
            }
            if (uploadedUrls.length > 0) {
                const currentImages = formData.images ? formData.images.split(',').map(u => u.trim()).filter(Boolean) : [];
                setFormData({ ...formData, images: [...currentImages, ...uploadedUrls].join(', ') });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload images');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handlePatternUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve) => {
                reader.onload = async () => {
                    const base64Data = reader.result;
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: base64Data })
                    });
                    const data = await response.json();
                    if (data.url) {
                        setFormData(prev => ({
                            ...prev,
                            patternImg: data.url,
                            patternFormat: data.format || (file.type.includes('pdf') ? 'pdf' : 'image')
                        }));
                    }
                    resolve();
                };
            });
        } catch (error) {
            console.error('Pattern upload failed:', error);
            alert('Failed to upload pattern');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleDielineUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve) => {
                reader.onload = async () => {
                    const base64Data = reader.result;
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: base64Data })
                    });
                    const data = await response.json();
                    if (data.url) {
                        setFormData(prev => ({
                            ...prev,
                            dielineImg: data.url,
                            dielineFormat: data.format || (file.type.includes('pdf') ? 'pdf' : 'image')
                        }));
                    }
                    resolve();
                };
            });
        } catch (error) {
            console.error('Dieline upload failed:', error);
            alert('Failed to upload dieline');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

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
                        sku: '',
                        patternImg: '',
                        patternFormat: '',
                        dielineImg: '',
                        dielineFormat: '',
                        category: 'Packaging',
                        minPrice: '',
                        maxPrice: '',
                        originalPrice: '',
                        discount: '',
                        images: 'https://res.cloudinary.com/dklavcjrl/image/upload/v1774544987/boxfox/products/large_burrito_box_1_1774544835718.jpg, https://res.cloudinary.com/dklavcjrl/image/upload/v1774544989/boxfox/products/large_burrito_box_2_1774544858239.jpg',
                        badge: '',
                        hasVariants: true,
                        description: '',
                        short_description: '',
                        brand: 'BoxFox',
                        minOrderQuantity: 10,
                        tags: '',
                        specifications: [],
                        length: '',
                        width: '',
                        height: '',
                        unit: 'inch',
                        pacdoraId: '',
                        isActive: true
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

    const handleDownload = async (url, filename) => {
        if (!url) return;
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename || url.split('/').pop().split('?')[0];
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
            window.open(url, '_blank');
        }
    };

    const handleDownloadProductAssets = async (p) => {
        const images = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? p.images.split(',').map(i => i.trim()).filter(Boolean) : []);

        // Product Images
        for (let i = 0; i < images.length; i++) {
            await handleDownload(images[i], `${p.name.replace(/\s+/g, '_')}_p${i + 1}`);
        }

        // Pattern
        if (p.patternImg) {
            await handleDownload(p.patternImg, `${p.name.replace(/\s+/g, '_')}_pattern`);
        }

        // Dieline
        if (p.dielineImg) {
            await handleDownload(p.dielineImg, `${p.name.replace(/\s+/g, '_')}_dieline`);
        }
    };


    const handleEdit = (product) => {
        setFormData({
            _id: product._id,
            name: product.name,
            sku: product.sku || '',
            patternImg: product.patternImg || '',
            patternFormat: product.patternFormat || '',
            dielineImg: product.dielineImg || '',
            dielineFormat: product.dielineFormat || '',
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
            minOrderQuantity: product.minOrderQuantity || 10,
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            specifications: product.specifications || [],
            length: product.dimensions?.length || '',
            width: product.dimensions?.width || '',
            height: product.dimensions?.height || '',
            unit: product.dimensions?.unit || 'inch',
            pacdoraId: product.pacdoraId || '',
            isActive: product.isActive !== false,
            isFeatured: product.isFeatured || false
        });
        setIsModalOpen(true);
    };

    const handleDuplicate = (product) => {
        setFormData({
            name: product.name + " (Copy)",
            sku: (product.sku ? product.sku + "-copy" : ''),
            patternImg: product.patternImg || '',
            patternFormat: product.patternFormat || '',
            dielineImg: product.dielineImg || '',
            dielineFormat: product.dielineFormat || '',
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
            minOrderQuantity: product.minOrderQuantity || 10,
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            specifications: product.specifications || [],
            length: product.dimensions?.length || '',
            width: product.dimensions?.width || '',
            height: product.dimensions?.height || '',
            unit: product.dimensions?.unit || 'inch',
            pacdoraId: product.pacdoraId || '',
            isActive: product.isActive !== false,
            isFeatured: false
        });
        setIsModalOpen(true);
    };

    const handleToggleFeatured = async (product) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...product,
                    isFeatured: !product.isFeatured
                })
            });
            if (res.ok) {
                fetchProducts();
            }
        } catch (err) {
            console.error("Failed to toggle featured status", err);
        }
    };

    const formatDimensions = (dim) => {
        if (!dim || (!dim.length && !dim.width && !dim.height)) return null;
        const { length: l, width: w, height: h, unit = 'inch' } = dim;
        const toInch = (v) => unit === 'inch' ? v : unit === 'cm' ? v / 2.54 : v / 25.4;
        const toCm = (v) => unit === 'cm' ? v : unit === 'inch' ? v * 2.54 : v / 10;
        const toMm = (v) => unit === 'mm' ? v : unit === 'inch' ? v * 25.4 : v * 10;
        const fmt = (v) => parseFloat(v.toFixed(1));
        return {
            inch: `${fmt(toInch(l))} × ${fmt(toInch(w))} × ${fmt(toInch(h))} in`,
            cm: `${fmt(toCm(l))} × ${fmt(toCm(w))} × ${fmt(toCm(h))} cm`,
            mm: `${fmt(toMm(l))} × ${fmt(toMm(w))} × ${fmt(toMm(h))} mm`,
        };
    };

    const flatProducts = products.filter(p => {
        const matchesSearch = searchQuery.trim() === '' ||
            (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.categories && p.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesCategory = selectedCategory === 'All'
            ? true
            : selectedCategory === 'Pending SKU'
                ? (!p.sku || !p.sku.startsWith('BFX-'))
                : p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-950 tracking-tighter flex items-center gap-4">
                        Product Inventory
                        <span className="text-sm bg-gray-100 px-4 py-2 rounded-2xl text-gray-400 font-black">
                            {flatProducts.length}
                        </span>
                    </h1>
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
                    <input type="text" placeholder="Search by name or category..." className="bg-transparent outline-none w-full text-sm font-medium" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-950 transition-all appearance-none outline-none pr-10 cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        <option value="Pending SKU">Pending SKU</option>
                        <option value="CupCake">CupCake</option>
                        <option value="Brownie">Brownie</option>
                        <option value="Hamper Box">Hamper Box</option>
                        <option value="Macaron">Macaron</option>
                        <option value="Chocolate Box">Chocolate Box</option>
                        <option value="Pastry">Pastry</option>
                        <option value="Gifting">Gifting</option>
                        <option value="Loaf">Loaf</option>
                        <option value="Platter">Platter</option>
                        <option value="Cake Box">Cake Box</option>
                        <option value="Burger Box">Burger Box</option>
                        <option value="Food Box">Food Box</option>
                        <option value="Pizza Box">Pizza Box</option>
                        <option value="Wok Box">Wok Box</option>
                        <option value="Wrap Box">Wrap Box</option>
                        <option value="Popcorn">Popcorn</option>
                    </select>
                    <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
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
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">SKU</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Price Range</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Size</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
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
                                                    <div className="flex gap-2 mt-1">
                                                        {product.patternImg && (
                                                            <span title="Internal Pattern Attached" className="flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                                                <FileText size={10} /> Pattern
                                                            </span>
                                                        )}
                                                        {product.dielineImg && (
                                                            <span title="Dieline Attached" className="flex items-center gap-1 text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                                                <Download size={10} /> Dieline
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[11px] font-black text-gray-950 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm whitespace-nowrap block w-fit">
                                                {product.sku || 'PENDING'}
                                            </span>
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
                                            {(() => {
                                                const d = formatDimensions(product.dimensions);
                                                if (!d) return <span className="text-[10px] text-gray-300 font-bold">—</span>;
                                                return (
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{d.inch}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{d.cm}</span>
                                                        <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap">{d.mm}</span>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.isActive === false ? 'bg-gray-100 text-gray-400' : (product.outOfStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600')
                                                }`}>
                                                {product.isActive === false ? 'Inactive' : (product.outOfStock ? 'Out of Stock' : 'Active')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(product)} title="Edit" className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"><Edit size={16} /></button>
                                                {product.patternImg && (
                                                    <button onClick={() => window.open(product.patternImg, '_blank')} title="View Internal Pattern" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                                        <FileText size={16} />
                                                    </button>
                                                )}
                                                {product.dielineImg && (
                                                    <button onClick={() => window.open(product.dielineImg, '_blank')} title="View Dieline" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                        <Download size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDownloadProductAssets(product)} title="Download All Assets" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Download size={16} /></button>
                                                <button onClick={() => handleDuplicate(product)} title="Duplicate" className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"><Copy size={16} /></button>
                                                <button onClick={() => handleDelete(product._id || product.id)} title="Delete" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
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
                                            <div className="grid grid-cols-2 gap-6">
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
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Product SKU</label>
                                                    <div className="relative">
                                                        <input
                                                            readOnly
                                                            value={formData.sku}
                                                            placeholder="Auto-generated on save"
                                                            className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-400 cursor-not-allowed outline-none transition-all"
                                                        />
                                                        {!formData.sku && (
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                                                                AUTO GENERATE
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all appearance-none"
                                                    >
                                                        <option value="CupCake">CupCake</option>
                                                        <option value="Brownie">Brownie</option>
                                                        <option value="Hamper Box">Hamper Box</option>
                                                        <option value="Macaron">Macaron</option>
                                                        <option value="Chocolate Box">Chocolate Box</option>
                                                        <option value="Pastry">Pastry</option>
                                                        <option value="Gifting">Gifting</option>
                                                        <option value="Loaf">Loaf</option>
                                                        <option value="Platter">Platter</option>
                                                        <option value="Cake Box">Cake Box</option>
                                                        <option value="Burger Box">Burger Box</option>
                                                        <option value="Food Box">Food Box</option>
                                                        <option value="Pizza Box">Pizza Box</option>
                                                        <option value="Wok Box">Wok Box</option>
                                                        <option value="Wrap Box">Wrap Box</option>
                                                        <option value="Popcorn">Popcorn</option>
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

                                            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-black text-gray-950 uppercase tracking-tighter">Active Status</p>
                                                        <p className="text-[10px] font-medium text-gray-400">Visibility in store</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${formData.isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-200'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${formData.isActive ? 'right-0.5' : 'left-0.5'}`} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-black text-gray-950 uppercase tracking-tighter">Featured</p>
                                                        <p className="text-[10px] font-medium text-gray-400">Show in Best Sellers</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${formData.isFeatured ? 'bg-amber-400 shadow-lg shadow-amber-500/20' : 'bg-gray-200'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${formData.isFeatured ? 'right-0.5' : 'left-0.5'}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Min Order Qty</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={formData.minOrderQuantity}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            if (val === '' || Number(val) >= 0) {
                                                                setFormData({ ...formData, minOrderQuantity: val });
                                                            }
                                                        }}
                                                        placeholder="100"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all"
                                                    />
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
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Product Images</label>
                                                <div className="space-y-4">
                                                    <div className="flex gap-4">
                                                        <textarea
                                                            required
                                                            rows="3"
                                                            value={formData.images}
                                                            onChange={e => setFormData({ ...formData, images: e.target.value })}
                                                            placeholder="Add image URLs separated by commas..."
                                                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all resize-none"
                                                        />
                                                        <label className={`w-32 shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                            {isUploading ? <Loader2 size={24} className="text-emerald-500 animate-spin" /> : <UploadCloud size={24} className="text-gray-400" />}
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center px-2">{isUploading ? 'Uploading...' : 'Upload Images'}</span>
                                                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                        </label>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4">
                                                        {formData.images.split(',').map((url, i) => url.trim() && (
                                                            <div key={i} className="w-20 h-20 rounded-2xl border border-gray-100 overflow-hidden shrink-0 relative group">
                                                                <img src={url.trim()} className="w-full h-full object-cover" alt={`Preview ${i + 1}`} />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDownload(url.trim(), `${formData.name}_img_${i + 1}`)}
                                                                        className="w-7 h-7 bg-white text-gray-900 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 shadow-lg"
                                                                        title="Download"
                                                                    >
                                                                        <Download size={14} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newUrls = formData.images.split(',').map(u => u.trim()).filter(Boolean);
                                                                            newUrls.splice(i, 1);
                                                                            setFormData({ ...formData, images: newUrls.join(', ') });
                                                                        }}
                                                                        className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 shadow-lg"
                                                                        title="Remove"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Internal Pattern Overlay (Admin Only)</label>
                                                    <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Order Processing Only</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">The following pattern image is for internal use by the admin team and will be attached to customer orders for reproduction purposes. It is not publicly visible on the main catalog.</p>
                                                <div className="space-y-2">
                                                    <div className="flex gap-4">
                                                        <div className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4">
                                                            {formData.patternImg ? (
                                                                <div className="w-20 h-20 rounded-2xl border border-gray-200 overflow-hidden shrink-0 relative group flex items-center justify-center bg-gray-50 shadow-sm">
                                                                    {formData.patternFormat === 'pdf' || (typeof formData.patternImg === 'string' && formData.patternImg.toLowerCase().endsWith('.pdf')) ? (
                                                                        <div className="flex flex-col items-center justify-center text-red-500 scale-90">
                                                                            <FileText size={32} strokeWidth={2.5} />
                                                                            <span className="text-[7px] font-black uppercase mt-1">PDF DOC</span>
                                                                        </div>
                                                                    ) : (
                                                                        <img src={formData.patternImg} className="w-full h-full object-cover" alt="Pattern" />
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-1.5 p-1">
                                                                        <a
                                                                            href={formData.patternImg}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-1.5 bg-white text-gray-900 rounded-lg hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                                                                            title="View"
                                                                        >
                                                                            <ImageIcon size={14} />
                                                                        </a>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDownload(formData.patternImg, `${formData.name}_pattern`)}
                                                                            className="p-1.5 bg-white text-gray-900 rounded-lg hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                                            title="Download"
                                                                        >
                                                                            <Download size={14} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setFormData({ ...formData, patternImg: '', patternFormat: '' })}
                                                                            className="p-1.5 bg-red-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                                            title="Remove"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-100 shadow-inner">
                                                                    <ImageIcon size={24} className="text-gray-300" />
                                                                </div>
                                                            )}
                                                            <input
                                                                value={formData.patternImg}
                                                                onChange={e => setFormData({ ...formData, patternImg: e.target.value })}
                                                                placeholder="Pattern URL or upload ->"
                                                                className="flex-1 bg-transparent font-bold text-gray-950 outline-none text-sm"
                                                            />
                                                            {formData.patternImg && (
                                                                <div className="flex gap-1">
                                                                    <a
                                                                        href={formData.patternImg}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex items-center justify-center"
                                                                        title="View"
                                                                    >
                                                                        <ImageIcon size={16} />
                                                                    </a>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(formData.patternImg);
                                                                            alert('Link copied!');
                                                                        }}
                                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                        title="Copy Link"
                                                                    >
                                                                        <Copy size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <label className={`w-32 shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                            {isUploading ? <Loader2 size={24} className="text-emerald-500 animate-spin" /> : <UploadCloud size={24} className="text-gray-400" />}
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center px-2">Upload Pattern</span>
                                                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handlePatternUpload} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Dieline (Admin Only)</label>
                                                    <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Admin Reference</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">Upload the dieline file for this product. This is strictly for admin reference and internal use.</p>
                                                <div className="space-y-2">
                                                    <div className="flex gap-4">
                                                        <div className="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4">
                                                            {formData.dielineImg ? (
                                                                <div className="w-20 h-20 rounded-2xl border border-gray-200 overflow-hidden shrink-0 relative group flex items-center justify-center bg-gray-50 shadow-sm">
                                                                    {formData.dielineFormat === 'pdf' || (typeof formData.dielineImg === 'string' && formData.dielineImg.toLowerCase().endsWith('.pdf')) ? (
                                                                        <div className="flex flex-col items-center justify-center text-red-500 scale-90">
                                                                            <FileText size={32} strokeWidth={2.5} />
                                                                            <span className="text-[7px] font-black uppercase mt-1">PDF DOC</span>
                                                                        </div>
                                                                    ) : (
                                                                        <img src={formData.dielineImg} className="w-full h-full object-cover" alt="Dieline" />
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-1.5 p-1">
                                                                        <a
                                                                            href={formData.dielineImg}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-1.5 bg-white text-gray-900 rounded-lg hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                                                                            title="View"
                                                                        >
                                                                            <ImageIcon size={14} />
                                                                        </a>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDownload(formData.dielineImg, `${formData.name}_dieline`)}
                                                                            className="p-1.5 bg-white text-gray-900 rounded-lg hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                                            title="Download"
                                                                        >
                                                                            <Download size={14} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setFormData({ ...formData, dielineImg: '', dielineFormat: '' })}
                                                                            className="p-1.5 bg-red-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-all shadow-sm"
                                                                            title="Remove"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-100 shadow-inner">
                                                                    <ImageIcon size={24} className="text-gray-300" />
                                                                </div>
                                                            )}
                                                            <input
                                                                value={formData.dielineImg}
                                                                onChange={e => setFormData({ ...formData, dielineImg: e.target.value })}
                                                                placeholder="Dieline URL or upload ->"
                                                                className="flex-1 bg-transparent font-bold text-gray-950 outline-none text-sm"
                                                            />
                                                            {formData.dielineImg && (
                                                                <div className="flex gap-1">
                                                                    <a
                                                                        href={formData.dielineImg}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center"
                                                                        title="View"
                                                                    >
                                                                        <ImageIcon size={16} />
                                                                    </a>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(formData.dielineImg);
                                                                            alert('Link copied!');
                                                                        }}
                                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                        title="Copy Link"
                                                                    >
                                                                        <Copy size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <label className={`w-32 shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                            {isUploading ? <Loader2 size={24} className="text-emerald-500 animate-spin" /> : <UploadCloud size={24} className="text-gray-400" />}
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center px-2">Upload Dieline</span>
                                                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleDielineUpload} />
                                                        </label>
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


