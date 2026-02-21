"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Box,
    ShoppingBag,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const menuItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
        { label: 'Products', icon: <Box size={20} />, href: '/admin/products' },
        { label: 'Orders', icon: <ShoppingBag size={20} />, href: '/admin/orders' },
        { label: 'Customers', icon: <Users size={20} />, href: '/admin/customers' },
        { label: 'Analytics', icon: <BarChart3 size={20} />, href: '/admin/analytics' },
        { label: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-gray-950 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-2"
                                >
                                    <img src="/BOXFOX-1.png" alt="Logo" className="h-6 w-auto object-contain" />
                                    <span className="text-xs font-black tracking-widest text-emerald-500">ADMIN</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${pathname === item.href ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                            >
                                <div className="shrink-0">{item.icon}</div>
                                {isSidebarOpen && <span className="text-sm font-bold">{item.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-900">
                        <button className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm">
                            <LogOut size={20} />
                            {isSidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-96">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders, products..."
                            className="bg-transparent text-sm outline-none w-full font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-gray-950 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-gray-950">Harshavardhan</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center font-black">
                                H
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
