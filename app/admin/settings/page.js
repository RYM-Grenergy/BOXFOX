"use client";
import React from 'react';
import { Settings, Shield, Bell, CreditCard, ExternalLink, Globe, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = React.useState('General');
    const [announcementEnabled, setAnnouncementEnabled] = React.useState(true);
    const [announcementText, setAnnouncementText] = React.useState('Free Delivery Across India on Orders Above ₹2000');
    const [announcementLoading, setAnnouncementLoading] = React.useState(true);
    const [announcementSaving, setAnnouncementSaving] = React.useState(false);
    const [announcementMessage, setAnnouncementMessage] = React.useState('');

    React.useEffect(() => {
        const loadAnnouncement = async () => {
            setAnnouncementLoading(true);
            setAnnouncementMessage('');
            try {
                const res = await fetch('/api/admin/announcement');
                const data = await res.json();
                if (res.ok && data?.data) {
                    setAnnouncementEnabled(Boolean(data.data.enabled));
                    setAnnouncementText(data.data.text || '');
                }
            } catch {
                setAnnouncementMessage('Failed to load announcement settings.');
            } finally {
                setAnnouncementLoading(false);
            }
        };

        loadAnnouncement();
    }, []);

    const saveAnnouncement = async () => {
        setAnnouncementSaving(true);
        setAnnouncementMessage('');
        try {
            const res = await fetch('/api/admin/announcement', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enabled: announcementEnabled,
                    text: announcementText
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setAnnouncementMessage(data?.error || 'Failed to save announcement settings.');
                return;
            }

            setAnnouncementEnabled(Boolean(data.data?.enabled));
            setAnnouncementText(data.data?.text || '');
            setAnnouncementMessage('Announcement settings saved successfully.');
        } catch {
            setAnnouncementMessage('Failed to save announcement settings.');
        } finally {
            setAnnouncementSaving(false);
        }
    };

    const tabs = [
        { icon: <Globe size={18} />, label: 'General' },
        { icon: <Shield size={18} />, label: 'Security' },
        { icon: <Bell size={18} />, label: 'Notifications' },
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
                                <h2 className="text-xl font-black text-gray-950 mb-2">Announcement Bar</h2>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">Message shown below navbar on storefront</p>
                            </div>

                            {announcementLoading ? (
                                <p className="text-xs font-bold text-gray-400">Loading announcement settings...</p>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <p className="font-black text-gray-950">Enable Announcement Bar</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Toggle visibility on customer-facing pages</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAnnouncementEnabled((prev) => !prev)}
                                            className={`w-14 h-8 rounded-full p-1 transition-all ${announcementEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                            aria-label="Toggle announcement bar"
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${announcementEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Announcement Text</label>
                                        <input
                                            value={announcementText}
                                            onChange={(e) => setAnnouncementText(e.target.value)}
                                            maxLength={180}
                                            className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 font-bold text-gray-950 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                                            placeholder="Enter announcement text"
                                        />
                                        <p className="text-[10px] font-bold text-gray-400 text-right">{announcementText.length}/180</p>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between gap-4">
                                        <p className={`text-xs font-bold ${announcementMessage.includes('success') ? 'text-emerald-500' : 'text-gray-400'}`}>
                                            {announcementMessage || 'Use concise text for best visibility.'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={saveAnnouncement}
                                            disabled={announcementSaving}
                                            className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {announcementSaving ? 'Saving...' : 'Save Announcement'}
                                        </button>
                                    </div>
                                </>
                            )}
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
                                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${item.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
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

