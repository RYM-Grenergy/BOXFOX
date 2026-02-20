"use client";
import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Box,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard fetch error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="space-y-10 animate-pulse">
                <div className="h-10 bg-gray-100 rounded-xl w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-gray-100 rounded-[2rem]" />)}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 h-96 bg-gray-100 rounded-[2.5rem]" />
                    <div className="h-96 bg-gray-950 rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Sales', value: data.totalSales, growth: data.totalSalesGrowth, icon: <DollarSign className="text-emerald-500" />, trend: 'up' },
        { label: 'Total Orders', value: data.totalOrders, growth: data.totalOrdersGrowth, icon: <ShoppingBag className="text-blue-500" />, trend: 'up' },
        { label: 'Products Sold', value: data.productsSold, growth: data.productsSoldGrowth, icon: <Box className="text-orange-500" />, trend: 'down' },
        { label: 'Active Lab Sessions', value: data.activeSessions, growth: data.activeSessionsGrowth, icon: <Clock className="text-purple-500" />, trend: 'up' },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-950 tracking-tighter">Dashboard Overview</h1>
                <p className="text-gray-400 font-medium">Welcome back! Here's what's happening with BoxFox today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.growth}
                            </div>
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-950 tracking-tight">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-950">Recent Orders</h2>
                        <button className="text-xs font-black text-emerald-500 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Order ID</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Customer</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Product</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5 text-sm font-black text-gray-950 whitespace-nowrap">{order.id}</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <p className="text-sm font-bold text-gray-950">{order.customer}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{order.time}</p>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-gray-500 whitespace-nowrap">{order.product}</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                                        order.status === 'Shipped' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-gray-950 whitespace-nowrap">{order.amount}</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <button className="p-2 hover:bg-white rounded-lg transition-all"><MoreHorizontal size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Lab Utilization */}
                <div className="bg-gray-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                            <TrendingUp className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">3D Lab Performance</h2>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-10">Real-time Analytics</p>

                        <div className="space-y-6">
                            {data.labUtilization.map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                        <span>{item.label}</span>
                                        <span>{item.percent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percent}%` }}
                                            className={`h-full ${item.color}`}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="mt-12 w-full py-4 bg-emerald-500 text-gray-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all">
                        Deep Analytics Report
                    </button>
                </div>
            </div>
        </div>
    );
}
