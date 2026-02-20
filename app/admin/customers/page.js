"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/customers')
            .then(res => res.json())
            .then(data => {
                setCustomers(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-950 tracking-tighter">Customers</h1>
                    <p className="text-gray-400 font-medium tracking-tight">Manage and view your user base and their activity.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input type="text" placeholder="Search customers..." className="bg-transparent outline-none w-full text-sm font-medium" />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-950 transition-all">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100" />)
                ) : (
                    customers.map((user, idx) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gray-950 text-white flex items-center justify-center text-2xl font-black">
                                    {user.name.charAt(0)}
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-950 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-950">{user.name}</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                                        {user.role}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Mail size={14} />
                                        <span className="text-xs font-bold">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Phone size={14} />
                                        <span className="text-xs font-bold">{user.phone || 'No phone'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <MapPin size={14} />
                                        <span className="text-xs font-bold line-clamp-1">{user.address || 'No address'}</span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-4 bg-gray-50 group-hover:bg-gray-950 group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    View Full Profile
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
