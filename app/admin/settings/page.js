"use client";
import React from 'react';
import { Settings, Shield, Bell, CreditCard, ExternalLink, Globe, Layout } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-gray-950 tracking-tighter">System Settings</h1>
                <p className="text-gray-400 font-medium tracking-tight">Configure your storefront, integrations, and administration.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                <div className="xl:col-span-1 space-y-2">
                    {[
                        { icon: <Globe size={18} />, label: 'General' },
                        { icon: <Shield size={18} />, label: 'Security' },
                        { icon: <Bell size={18} />, label: 'Notifications' },
                        { icon: <CreditCard size={18} />, label: 'Billing' },
                        { icon: <Layout size={18} />, label: 'Theme' },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all ${idx === 0 ? 'bg-gray-950 text-white shadow-xl shadow-gray-200' : 'text-gray-400 hover:bg-white hover:text-gray-950'}`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                <div className="xl:col-span-3 space-y-10">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-950 mb-2">Store Profile</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Public information and branding</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store Name</label>
                                <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" defaultValue="BoxFox Packaging" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Public Email</label>
                                <input className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" defaultValue="hello@boxfox.in" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logo URL</label>
                                <div className="flex gap-4">
                                    <input className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-950 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" defaultValue="/BOXFOX-1.png" />
                                    <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center overflow-hidden">
                                        <img src="/BOXFOX-1.png" alt="Logo" className="w-10 h-auto object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-400 italic">Last auto-saved: 5 minutes ago</p>
                            <button className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-100">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-950 mb-2">Integrations</h2>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Connect with your stack</p>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="font-black text-gray-950">WooCommerce Sync</p>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase">Connected</p>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-950 transition-colors"><ExternalLink size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
