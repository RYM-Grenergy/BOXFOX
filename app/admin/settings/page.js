"use client";
import React from 'react';
import { Settings, Shield, Bell, CreditCard, ExternalLink, Globe, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = React.useState('General');

    const tabs = [
        { icon: <Globe size={18} />, label: 'General' },
        { icon: <Shield size={18} />, label: 'Security' },
        { icon: <Bell size={18} />, label: 'Notifications' },
        { icon: <CreditCard size={18} />, label: 'Billing' },
        { icon: <Layout size={18} />, label: 'Theme' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'General':
                return (
                    <>
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-950 mb-2">Store Profile</h2>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Public information and branding</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Store Name</label>
                                    <input className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" defaultValue="BoxFox Packaging" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Public Email</label>
                                    <input className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" defaultValue="hello@boxfox.in" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Logo URL</label>
                                    <div className="flex gap-4">
                                        <input className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" defaultValue="/BOXFOX-1.png" />
                                        <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                            <img src="/BOXFOX-1.png" alt="Logo" className="w-10 h-auto object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-400 italic">Last auto-saved: 5 minutes ago</p>
                                <button className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                            <div>
                                <h2 className="text-xl font-black text-gray-950 mb-2">Integrations</h2>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Connect with your ecosystem</p>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-950">Razorpay Gateway</p>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase">Live & Connected</p>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-950 transition-colors"><ExternalLink size={18} /></button>
                            </div>
                        </div>
                    </>
                );
            case 'Security':
                return (
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-950 mb-2">Admin Security</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Manage your password and authentication</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2 max-w-md">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Current Password</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Confirm New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-gray-50 space-y-6">
                            <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-950">Two-Factor Authentication</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Recommended for all admins</p>
                                    </div>
                                </div>
                                <button className="px-6 py-2 bg-gray-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">Enable</button>
                            </div>
                        </div>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-950 mb-2">Communication Hub</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Configure alerts and system messages</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'New Order Alerts', desc: 'Notify team when a new order is received', active: true },
                                { title: 'Stock Exhaustion', desc: 'Alert when a product goes below MOQ', active: true },
                                { title: 'Customer Signups', desc: 'Weekly digest of new business accounts', active: false },
                                { title: 'Critical System Logs', desc: 'Immediate alert on potential server failures', active: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${item.active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-200 text-gray-400'}`}>
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-950">{item.title}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all ${item.active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                        onClick={() => { }}
                                    >
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${item.active ? 'translate-x-[24px]' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Billing':
                return (
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-950 mb-2">Lab Subscription</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Manage your BoxFox SaaS tier and invoices</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2.5rem] bg-gray-950 text-white relative overflow-hidden group border-4 border-gray-950 hover:border-emerald-500/20 transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6">Current Plan</p>
                                <h3 className="text-4xl font-black tracking-tighter mb-2">BoxFox Enterprise</h3>
                                <p className="text-gray-400 text-sm font-bold">Unlimited SKU & Priority Support</p>
                                <div className="mt-8 pt-8 border-t border-white/10 flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-black leading-none">₹2,499<span className="text-sm text-gray-500 font-bold tracking-normal italic">/mo</span></p>
                                        <p className="text-[10px] font-black uppercase text-emerald-500 mt-2">Next Renewal: March 15, 2026</p>
                                    </div>
                                    <button className="px-6 py-2 bg-white text-gray-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Upgrade</button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest ml-2">Recent Invoices</h3>
                                {[
                                    { date: 'Feb 15, 2026', id: '#INV-001', amt: '₹2,499', status: 'Paid' },
                                    { date: 'Jan 15, 2026', id: '#INV-002', amt: '₹2,499', status: 'Paid' },
                                    { date: 'Dec 15, 2025', id: '#INV-003', amt: '₹2,499', status: 'Paid' },
                                ].map((inv, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 italic transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                                                <ExternalLink size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-950">{inv.id}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{inv.date}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-black text-gray-950">{inv.amt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'Theme':
                return (
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-950 mb-2">Visual Identity</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Customize the admin dashboard aesthetics</p>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Accent Color</h3>
                                <div className="flex gap-4">
                                    {[
                                        { label: 'Emerald', color: 'bg-emerald-500' },
                                        { label: 'Royal Blue', color: 'bg-blue-600' },
                                        { label: 'Deep Purple', color: 'bg-purple-600' },
                                        { label: 'Sunset Orange', color: 'bg-orange-500' },
                                        { label: 'Jet Black', color: 'bg-gray-950' },
                                    ].map((c, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                                            <div className={`w-14 h-14 rounded-2xl ${c.color} shadow-lg ring-4 ring-transparent hover:ring-gray-100 transition-all ${i === 0 ? 'ring-emerald-500/20 scale-110' : ''}`}></div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{c.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Interface Mode</h3>
                                <div className="grid grid-cols-2 gap-8 max-w-xl">
                                    <div className="p-6 bg-white border-2 border-emerald-500 rounded-3xl shadow-xl shadow-gray-100 cursor-pointer">
                                        <div className="w-full aspect-[4/3] bg-gray-50 rounded-xl mb-4 p-2 space-y-2">
                                            <div className="w-1/2 h-2 bg-gray-200 rounded-full"></div>
                                            <div className="w-full h-8 bg-white border border-gray-100 rounded-lg"></div>
                                        </div>
                                        <p className="text-center text-xs font-black uppercase tracking-widest text-gray-950">High Gloss Light</p>
                                    </div>
                                    <div className="p-6 bg-gray-950 border-2 border-transparent rounded-3xl cursor-not-allowed group relative opacity-50">
                                        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] rounded-3xl z-10 flex items-center justify-center">
                                            <div className="bg-emerald-500 text-gray-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Coming Soon</div>
                                        </div>
                                        <div className="w-full aspect-[4/3] bg-gray-900 rounded-xl mb-4 p-2 space-y-2">
                                            <div className="w-1/2 h-2 bg-gray-800 rounded-full"></div>
                                            <div className="w-full h-8 bg-gray-800 rounded-lg"></div>
                                        </div>
                                        <p className="text-center text-xs font-black uppercase tracking-widest text-white">Midnight Vault</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-gray-950 tracking-tighter uppercase leading-none">System Settings</h1>
                <p className="text-gray-400 font-medium tracking-tight mt-1">Configure your lab storefront, integrations, and administration.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                <div className="xl:col-span-1 space-y-2">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.label ? 'bg-gray-950 text-white shadow-2xl shadow-gray-200 scale-105 z-10' : 'text-gray-400 hover:bg-white hover:text-gray-950 hover:px-8'}`}
                        >
                            <span className="flex items-center gap-4">
                                {tab.icon} {tab.label}
                            </span>
                            {activeTab === tab.label && <motion.div layoutId="dot" className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />}
                        </button>
                    ))}
                </div>

                <div className="xl:col-span-3 space-y-10">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="space-y-10"
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

