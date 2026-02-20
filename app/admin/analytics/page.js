"use client";
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/analytics')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading || !stats) {
        return <div className="p-20 text-center animate-pulse text-gray-400 font-black uppercase tracking-widest text-xs">Loading Analytics...</div>;
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-gray-950 tracking-tighter">Business Analytics</h1>
                <p className="text-gray-400 font-medium tracking-tight">Real-time performance metrics and growth insights.</p>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">+14.2%</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Conversion Rate</p>
                    <h3 className="text-3xl font-black text-gray-950">3.24%</h3>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full">+8.1%</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">New Customers</p>
                    <h3 className="text-3xl font-black text-gray-950">124</h3>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <ShoppingCart size={24} />
                        </div>
                        <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full">-2.4%</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Avg. Order Value</p>
                    <h3 className="text-3xl font-black text-gray-950">₹14,500</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Revenue Overview Mock */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-black text-gray-950 mb-10">Revenue Overview</h2>
                    <div className="flex items-end gap-4 h-64 h-full">
                        {stats.revenueByMonth.map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(item.value / 100000) * 100}%` }}
                                    className="w-full bg-gray-50 group-hover:bg-emerald-500 rounded-2xl transition-all min-h-[10px]"
                                />
                                <span className="text-[10px] font-black text-gray-400 uppercase">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-gray-950 p-10 rounded-[3rem] text-white">
                    <h2 className="text-xl font-black mb-10">Sales by Category</h2>
                    <div className="space-y-8">
                        {stats.topProducts.map((item, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                    <span>{item.name}</span>
                                    <span>{item.count}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.count}%` }}
                                        className={`h-full ${item.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
