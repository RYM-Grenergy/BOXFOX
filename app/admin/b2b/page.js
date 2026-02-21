"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Save, ChevronRight, LayoutGrid, Box,
    Printer, Palette, Leaf, Clock, ArrowLeft, Loader2
} from "lucide-react";
import Link from "next/link";

const categories = [
    { id: 'boxTypes', label: 'Box Types', icon: <Box size={18} /> },
    { id: 'printingOptions', label: 'Printing', icon: <Printer size={18} /> },
    { id: 'finishOptions', label: 'Finishes', icon: <Palette size={18} /> },
    { id: 'sustainabilityOptions', label: 'Sustainability', icon: <Leaf size={18} /> },
    { id: 'timelines', label: 'Timelines', icon: <Clock size={18} /> }
];

export default function B2BAdmin() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('boxTypes');
    const [newItem, setNewItem] = useState({ label: '', value: '' });

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/admin/b2b/config');
            const data = await res.json();
            setConfigs(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load configs");
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newItem.label || !newItem.value) return;
        try {
            const res = await fetch('/api/admin/b2b/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newItem, category: activeTab })
            });
            if (res.ok) {
                setNewItem({ label: '', value: '' });
                fetchConfigs();
            }
        } catch (err) {
            console.error("Add error", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/admin/b2b/config?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchConfigs();
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const filteredConfigs = configs.filter(c => c.category === activeTab);

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-950 selection:bg-emerald-500 selection:text-white">
            {/* Admin Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gray-950 rounded-lg flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Back to Store</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-100" />
                        <h1 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            B2B <span className="text-gray-400">Control Unit</span>
                        </h1>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Controls */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Select Sub-System</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm ${activeTab === cat.id
                                            ? 'bg-gray-950 text-white shadow-xl translate-x-2'
                                            : 'bg-transparent text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {cat.icon}
                                        {cat.label}
                                    </div>
                                    <ChevronRight size={14} className={activeTab === cat.id ? 'opacity-100' : 'opacity-0'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-500 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-500/20">
                        <h4 className="font-black uppercase tracking-tighter text-xl mb-2">Live Status</h4>
                        <p className="text-emerald-50/70 text-sm font-medium leading-relaxed">System is operational. Dropdown changes reflect in real-time across the B2B portal.</p>
                    </div>
                </aside>

                {/* Main Content Areas */}
                <section className="lg:col-span-3 space-y-8">
                    {/* Add New Entry */}
                    <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                        <div className="flex flex-col md:flex-row items-end gap-6">
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Option Label</label>
                                <input
                                    value={newItem.label}
                                    onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                                    type="text"
                                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-950"
                                    placeholder="e.g. Kinetic Pizza Nodes"
                                />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Backend Value (slug)</label>
                                <input
                                    value={newItem.value}
                                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                                    type="text"
                                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-gray-950"
                                    placeholder="e.g. pizza_nodes"
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                className="px-8 py-4 bg-gray-950 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-colors flex items-center gap-2 h-[58px]"
                            >
                                <Plus size={16} /> Deploy Option
                            </button>
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                {categories.find(c => c.id === activeTab)?.label} <span className="text-gray-300">Index</span>
                            </h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{filteredConfigs.length} Registered Nodes</span>
                        </div>

                        {loading ? (
                            <div className="p-20 flex items-center justify-center">
                                <Loader2 className="animate-spin text-emerald-500" size={40} />
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                <AnimatePresence mode="popLayout">
                                    {filteredConfigs.map((config, idx) => (
                                        <motion.div
                                            key={config._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-10">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-100">
                                                    {idx + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-sm font-black uppercase tracking-tight text-gray-950">{config.label}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protocol: <span className="text-emerald-600">{config.value}</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(config._id)}
                                                className="p-4 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {filteredConfigs.length === 0 && (
                                    <div className="p-20 text-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                            <LayoutGrid size={32} />
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No entries found for this category</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
