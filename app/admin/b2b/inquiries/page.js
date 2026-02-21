"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, Phone, Building2, Calendar, ClipboardList,
    Trash2, CheckCircle2, Clock, Inbox, ArrowLeft, Loader2,
    ChevronDown, ExternalLink, Filter
} from "lucide-react";
import Link from "next/link";

export default function B2BInquiriesAdmin() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const res = await fetch('/api/admin/b2b/inquiries');
            const data = await res.json();
            setInquiries(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load inquiries");
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch('/api/admin/b2b/inquiries', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) fetchInquiries();
        } catch (err) {
            console.error("Status update error", err);
        }
    };

    const deleteInquiry = async (id) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            const res = await fetch(`/api/admin/b2b/inquiries?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchInquiries();
                setSelectedInquiry(null);
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-950">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gray-950 rounded-lg flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Admin Panel</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-100" />
                        <h1 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            B2B <span className="text-gray-400">Inquiry Results</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/b2b" className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 hover:bg-white transition-all">
                            Configure Form Options
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List View */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Active Pipeline</h2>
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full">{inquiries.length} TOTAL</span>
                    </div>

                    {loading ? (
                        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                            {inquiries.map((inquiry) => (
                                <motion.div
                                    key={inquiry._id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-6 rounded-3xl border transition-all cursor-pointer group ${selectedInquiry?._id === inquiry._id
                                            ? 'bg-white border-emerald-500 shadow-xl ring-4 ring-emerald-500/5'
                                            : 'bg-white/50 border-gray-100 hover:border-emerald-500/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            <Building2 size={20} />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${inquiry.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                inquiry.status === 'reviewed' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {inquiry.status}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-gray-950 uppercase tracking-tight truncate mb-1">{inquiry.companyName}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 truncate">{inquiry.contactEmail}</p>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                                        <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                                        <span className="text-emerald-600">REQ: {inquiry.boxType}</span>
                                    </div>
                                </motion.div>
                            ))}
                            {inquiries.length === 0 && (
                                <div className="text-center py-20 text-gray-400 uppercase text-xs font-bold italic tracking-widest">
                                    No incoming transmissions.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        {selectedInquiry ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[700px] flex flex-col"
                            >
                                {/* Detail Header */}
                                <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-gray-950 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black">
                                            {selectedInquiry.companyName.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-950">{selectedInquiry.companyName}</h2>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <Clock size={12} /> Received {new Date(selectedInquiry.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateStatus(selectedInquiry._id, 'reviewed')}
                                            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all"
                                        >
                                            Mark Reviewed
                                        </button>
                                        <button
                                            onClick={() => updateStatus(selectedInquiry._id, 'completed')}
                                            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            Approve Protocol
                                        </button>
                                        <button
                                            onClick={() => deleteInquiry(selectedInquiry._id)}
                                            className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="p-12 overflow-y-auto flex-1 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {/* Contact Section */}
                                        <div className="space-y-10">
                                            <div>
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Transmission ID & Contact
                                                </h4>
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-950"><Mail size={20} /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Protocol</p>
                                                            <p className="font-bold text-gray-950 text-lg">{selectedInquiry.contactEmail}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-950"><Phone size={20} /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Voice/Comms</p>
                                                            <p className="font-bold text-gray-950 text-lg">{selectedInquiry.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Structural Configuration
                                                </h4>
                                                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Box Type</p>
                                                        <p className="font-black text-gray-950 uppercase tracking-tight">{selectedInquiry.boxType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">MOQ Target</p>
                                                        <p className="font-black text-gray-950 uppercase tracking-tight">{selectedInquiry.quantity} Units</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Timeline</p>
                                                        <p className="font-black text-gray-950 uppercase tracking-tight">{selectedInquiry.timeline}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Sustainability</p>
                                                        <p className="font-black text-emerald-600 uppercase tracking-tight">{selectedInquiry.sustainability}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Specs Section */}
                                        <div className="space-y-10">
                                            <div>
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Finish & Aesthetics
                                                </h4>
                                                <div className="space-y-6 bg-gray-950 p-8 rounded-[2rem] text-white">
                                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Printing Protocol</p>
                                                        <p className="font-black uppercase tracking-tight">{selectedInquiry.printing}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Substrate Finish</p>
                                                        <p className="font-black uppercase tracking-tight">{selectedInquiry.finish}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Engineering Brief
                                                </h4>
                                                <div className="bg-white border border-gray-100 p-8 rounded-[2rem] min-h-[160px]">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Functional Requirements</p>
                                                    <p className="text-gray-600 font-medium leading-relaxed italic">
                                                        {selectedInquiry.requirements || "No specific engineering requirements provided."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-20 min-h-[700px]">
                                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-gray-200 mb-8 border border-gray-100 shadow-sm">
                                    <Inbox size={40} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-300">Select Transmission</h2>
                                <p className="text-gray-400 font-medium max-w-xs mt-4">Select an inquiry from the workspace sidebar to view technical specifications and CAD brief.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
