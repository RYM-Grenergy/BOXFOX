"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Package, Globe, Users, ArrowRight, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function B2BPage() {
    const [configs, setConfigs] = useState(null);
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [formData, setFormData] = useState({
        companyName: "",
        contactEmail: "",
        phoneNumber: "",
        boxType: "",
        quantity: "",
        timeline: "",
        printing: "",
        finish: "",
        sustainability: "",
        requirements: ""
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/b2b/config');
                const data = await res.json();
                setConfigs(data);
            } catch (err) {
                console.error("Failed to load configs");
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await fetch('/api/b2b/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus("success");
                setFormData({
                    companyName: "", contactEmail: "", phoneNumber: "", boxType: "",
                    quantity: "", timeline: "", printing: "", finish: "",
                    sustainability: "", requirements: ""
                });
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-60 flex flex-col items-center justify-center text-center px-6 text-gray-950">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8"
                    >
                        <CheckCircle2 size={48} />
                    </motion.div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Inquiry Received</h1>
                    <p className="text-gray-500 text-xl max-w-md italic">"Our engineering team is now processing your B2B protocol. Expect a technical brief within 24 hours."</p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-12 px-10 py-4 bg-gray-950 text-white rounded-full font-black uppercase tracking-widest text-xs"
                    >
                        Return to Panel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white selection:bg-emerald-500 selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Hero Section */}
                <section className="px-6 lg:px-12 mb-32">
                    <div className="max-w-[1700px] mx-auto">
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
                            <div className="space-y-8 max-w-4xl">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                    <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.4em]">Enterprise Solutions</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-gray-950"
                                >
                                    B2B & Wholesale<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200">Partnerships.</span>
                                </motion.h1>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-10 border border-gray-100 bg-gray-50/50 backdrop-blur-xl rounded-[3rem] max-w-md shadow-sm"
                            >
                                <p className="text-xl text-gray-500 font-medium leading-relaxed tracking-tight italic text-gray-950">
                                    "Scaling structural packaging for global brands. Direct manufacturing prices for bulk procurement."
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Building2 className="w-8 h-8" />}
                                title="Bulk Procurement"
                                desc="Optimized pricing for high-volume orders starting from 1000+ units."
                            />
                            <FeatureCard
                                icon={<Package className="w-8 h-8" />}
                                title="Custom Design"
                                desc="Structural engineering and CAD support for your specific product requirements."
                            />
                            <FeatureCard
                                icon={<Globe className="w-8 h-8" />}
                                title="Global Logistics"
                                desc="Door-to-door delivery with optimized freight management for enterprises."
                            />
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="px-6 lg:px-12 bg-gray-50 py-32 border-y border-gray-100">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-950">Inquire for Wholesale</h2>
                            <p className="text-gray-500 font-medium text-lg">Send us your requirements and our engineering team will get back to you with a custom quote.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Company Name</label>
                                <input required name="companyName" value={formData.companyName} onChange={handleChange} type="text" className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm" placeholder="Enter Company Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contact Email</label>
                                <input required name="contactEmail" value={formData.contactEmail} onChange={handleChange} type="email" className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm" placeholder="your@email.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                                <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm" placeholder="+91 XXXXX XXXXX" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Structural Config (Box Type)</label>
                                <div className="relative">
                                    <select required name="boxType" value={formData.boxType} onChange={handleChange} className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm appearance-none cursor-pointer">
                                        <option value="">Select Box Type</option>
                                        {configs?.boxTypes?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight className="rotate-90 w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Expected MOQ (Quantity)</label>
                                <input required name="quantity" value={formData.quantity} onChange={handleChange} type="number" className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm" placeholder="e.g. 5000" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Project Timeline</label>
                                <div className="relative">
                                    <select required name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm appearance-none cursor-pointer">
                                        <option value="">Select Timeline</option>
                                        {configs?.timelines?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight className="rotate-90 w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Branding / Logo Printing</label>
                                <div className="relative">
                                    <select required name="printing" value={formData.printing} onChange={handleChange} className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm appearance-none cursor-pointer">
                                        <option value="">Select Printing</option>
                                        {configs?.printingOptions?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight className="rotate-90 w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Box Finish Preference</label>
                                <div className="relative">
                                    <select required name="finish" value={formData.finish} onChange={handleChange} className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm appearance-none cursor-pointer">
                                        <option value="">Select Finish</option>
                                        {configs?.finishOptions?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight className="rotate-90 w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Sustainability Certification</label>
                                <div className="relative">
                                    <select required name="sustainability" value={formData.sustainability} onChange={handleChange} className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 shadow-sm appearance-none cursor-pointer">
                                        <option value="">Select Certification</option>
                                        {configs?.sustainabilityOptions?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronRight className="rotate-90 w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Specific Requirements / CAD Instructions</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 focus:border-emerald-500 outline-none transition-all font-bold text-gray-950 min-h-[150px] shadow-sm" placeholder="Include dimensions (L x W x H), material thickness, and any special structural inserts needed..."></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    disabled={status === "loading"}
                                    type="submit"
                                    className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {status === "loading" ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : (
                                        <>Initialize B2B Protocol <ArrowRight size={20} /></>
                                    )}
                                </button>
                                {status === "error" && (
                                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-4 text-center">Transmission Error: Failed to initialize protocol. Try again.</p>
                                )}
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[3rem] bg-white border border-gray-100 hover:border-emerald-500/30 hover:shadow-2xl transition-all group"
        >
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-950 border border-gray-100 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all mb-8 shadow-sm">
                {icon}
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-gray-950 group-hover:text-emerald-600 transition-colors">{title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
        </motion.div>
    );
}
