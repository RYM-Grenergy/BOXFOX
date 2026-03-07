"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, Phone, Building2,
    Trash2, CheckCircle2, Clock, Inbox, Loader2,
    ClipboardList, ExternalLink
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
        <div className="p-6 md:p-10 space-y-10">
            {/* Header / Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            B2B <span className="text-gray-400">Inquiry Results</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1 italic">Enterprise Lead Control Hub</p>
                    </div>
                </div>

                <Link href="/admin/b2b" className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-950 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all">
                    Configure Form Options
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* List View */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between mb-2 px-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Active Pipeline</h2>
                        <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full">{inquiries.length} TOTAL</span>
                    </div>

                    {loading ? (
                        <div className="p-20 flex justify-center bg-white rounded-[2rem] border border-gray-100"><Loader2 className="animate-spin text-emerald-500" /></div>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
                            {inquiries.map((inquiry) => (
                                <motion.div
                                    key={inquiry._id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    layoutId={inquiry._id}
                                    className={`p-6 rounded-[2rem] border transition-all cursor-pointer group ${selectedInquiry?._id === inquiry._id
                                        ? 'bg-white border-emerald-500 shadow-xl ring-4 ring-emerald-500/5'
                                        : 'bg-white/70 border-gray-100 hover:border-emerald-500/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                            <Building2 size={20} />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${inquiry.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                            query?.status === 'reviewed' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                            {inquiry.status}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-gray-950 uppercase tracking-tight truncate mb-1">{inquiry.companyName}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 truncate">{inquiry.contactEmail}</p>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                                        <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                                        <span className="text-emerald-600 font-black">REQ: {inquiry.boxType}</span>
                                    </div>
                                </motion.div>
                            ))}
                            {inquiries.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-gray-400 uppercase text-[10px] font-black italic tracking-widest">
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
                                key={selectedInquiry._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col"
                            >
                                {/* Detail Header */}
                                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-gray-950 rounded-[1.2rem] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-gray-950/20">
                                            {selectedInquiry.companyName.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-950">{selectedInquiry.companyName}</h2>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    <Clock size={10} /> Received {new Date(selectedInquiry.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateStatus(selectedInquiry._id, 'reviewed')}
                                            className="px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                        >
                                            In Review
                                        </button>
                                        <button
                                            onClick={() => updateStatus(selectedInquiry._id, 'completed')}
                                            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            Complete
                                        </button>
                                        <div className="w-px h-8 bg-gray-200 mx-2" />
                                        <button
                                            onClick={() => deleteInquiry(selectedInquiry._id)}
                                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="p-8 md:p-10 overflow-y-auto flex-1 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Contact Section */}
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Commercial Protocol
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-950 border border-gray-100"><Mail size={18} /></div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Corporate Email</p>
                                                            <p className="font-bold text-gray-950 text-sm break-all">{selectedInquiry.contactEmail}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-950 border border-gray-100"><Phone size={18} /></div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact Line</p>
                                                            <p className="font-bold text-gray-950 text-sm">{selectedInquiry.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Structural Spec
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                                    <div className="p-1">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Type</p>
                                                        <p className="font-black text-gray-950 uppercase tracking-tight text-xs">{selectedInquiry.boxType}</p>
                                                    </div>
                                                    <div className="p-1">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Volume</p>
                                                        <p className="font-black text-gray-950 uppercase tracking-tight text-xs">{selectedInquiry.quantity} pcs</p>
                                                    </div>
                                                    <div className="p-1">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Window</p>
                                                        <p className="font-black text-gray-950 uppercase tracking-tight text-xs">{selectedInquiry.timeline}</p>
                                                    </div>
                                                    <div className="p-1">
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Global Status</p>
                                                        <p className="font-black text-emerald-600 uppercase tracking-tight text-xs">{selectedInquiry.sustainability}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Specs Section */}
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Aesthetic Brief
                                                </h4>
                                                <div className="space-y-4 bg-gray-950 p-7 rounded-[2rem] text-white shadow-xl shadow-gray-950/10">
                                                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Printing</p>
                                                        <p className="text-[10px] font-black uppercase tracking-tight">{selectedInquiry.printing}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Finish</p>
                                                        <p className="text-[10px] font-black uppercase tracking-tight">{selectedInquiry.finish}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-3">
                                                    <div className="w-6 h-px bg-emerald-200" /> Additional Requirements
                                                </h4>
                                                <div className="bg-white border border-gray-100 p-6 rounded-[2rem] min-h-[160px] shadow-sm italic leading-relaxed text-gray-600 text-sm">
                                                    {selectedInquiry.requirements || "No specific technical instructions provided."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-20 min-h-[600px] shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-200 mb-6 border border-gray-100">
                                    <Inbox size={32} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-400">Select Protocol</h2>
                                <p className="text-gray-400 text-xs font-medium max-w-[200px] mt-2 uppercase tracking-widest leading-loose">Choose a transmission from the workspace sidebar to view technical CAD brief.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
