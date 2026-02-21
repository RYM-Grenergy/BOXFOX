"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ArrowRight,
    ShieldCheck,
    Package,
    CreditCard,
    Truck,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [user, setUser] = useState(null);

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);

    React.useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                    setFormData(prev => ({
                        ...prev,
                        name: data.user.name || '',
                        email: data.user.email || '',
                        phone: data.user.phone || '',
                    }));
                    if (data.user.address) {
                        setSavedAddresses([data.user.address]);
                    }
                }
            })
            .catch(() => { });
    }, []);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectSavedAddress = (addr, idx) => {
        setFormData(prev => ({ ...prev, address: addr }));
        setSelectedAddressIndex(idx);
    };

    const placeOrder = async () => {
        if (!formData.address || !formData.city || !formData.pincode) {
            alert("Please complete shipping details");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?._id || undefined,
                    customer: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    },
                    items: cart.map(item => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9.]/g, ''))
                    })),
                    total: cartTotal,
                    status: 'Pending',
                    shipping: {
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                setOrderId(data.orderId);
                setStep(3);
                clearCart();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <main className="pt-40 pb-24 px-6 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl w-full text-center space-y-12"
                    >
                        <div className="relative inline-block">
                            <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 rotate-12">
                                <CheckCircle2 size={64} strokeWidth={2.5} />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -top-4 -right-4 w-12 h-12 bg-gray-950 text-white rounded-full flex items-center justify-center font-black text-xs"
                            >
                                OK
                            </motion.div>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase leading-none">Order<br />Successful.</h1>
                            <p className="text-xl text-gray-400 font-medium">Logistics ID #{orderId} is now being processed by our production team.</p>
                        </div>

                        <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 text-left space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Transaction ID</span>
                                <span className="text-sm font-black text-gray-950">{orderId}</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notification</p>
                                <p className="text-xs font-bold text-gray-950 leading-relaxed">
                                    An automated structural report and invoice have been dispatched to <span className="text-emerald-500">{formData.email}</span>.
                                </p>
                            </div>
                        </div>

                        <Link href="/" className="inline-flex items-center gap-4 px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-2xl shadow-gray-200">
                            Continue Shopping <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gray-100 pb-16">
                    <div>
                        <h1 className="text-7xl md:text-9xl font-black text-gray-950 tracking-tighter uppercase leading-[0.8]">Confirm<br /><span className="text-emerald-500">Shipping.</span></h1>
                    </div>
                    <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100">
                        <div className="px-6 py-3 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-950">Bank-Grade Security</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-7 space-y-16">
                        {/* Stepper */}
                        <div className="flex items-center gap-4">
                            {[1, 2].map(i => (
                                <React.Fragment key={i}>
                                    <div className={`flex items-center gap-4 group cursor-pointer`} onClick={() => setStep(i)}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${step >= i ? 'bg-gray-950 text-white shadow-xl' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                            {i}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${step >= i ? 'text-gray-950' : 'text-gray-400'}`}>
                                            {i === 1 ? 'Personal' : 'Shipping'}
                                        </span>
                                    </div>
                                    {i === 1 && <div className="h-px w-12 bg-gray-100" />}
                                </React.Fragment>
                            ))}
                        </div>

                        {step === 1 ? (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Recipient Name</label>
                                        <input
                                            name="name" value={formData.name} onChange={handleFormChange}
                                            placeholder="John Doe"
                                            className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-6 font-black text-sm outline-none focus:bg-white focus:border-gray-950 hover:bg-gray-100 transition-all uppercase tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Contact Email</label>
                                        <input
                                            type="email" name="email" value={formData.email} onChange={handleFormChange}
                                            placeholder="support@boxfox.in"
                                            className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-6 font-black text-sm outline-none focus:bg-white focus:border-gray-950 hover:bg-gray-100 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Encrypted Phone</label>
                                        <input
                                            name="phone" value={formData.phone} onChange={handleFormChange}
                                            placeholder="+91 00000 00000"
                                            className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-6 font-black text-sm outline-none focus:bg-white focus:border-gray-950 hover:bg-gray-100 transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.name || !formData.email || !formData.phone}
                                    className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-500 transition-all disabled:opacity-30 shadow-2xl shadow-gray-200"
                                >
                                    Define Shipping address
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">

                                {savedAddresses.length > 0 && (
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Saved Shipping Addresses</p>
                                        <div className="grid grid-cols-1 gap-4">
                                            {savedAddresses.map((addr, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelectSavedAddress(addr, idx)}
                                                    className={`p-6 rounded-[1.5rem] border text-left transition-all ${selectedAddressIndex === idx ? 'bg-gray-950 border-gray-950 text-white shadow-xl translate-x-4' : 'bg-gray-50 border-gray-100 hover:border-gray-300 hover:bg-white'}`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Address Node #{idx + 1}</span>
                                                        {selectedAddressIndex === idx && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                                                    </div>
                                                    <p className="text-sm font-bold line-clamp-1">{addr}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Delivery Address</label>
                                        <textarea
                                            name="address" value={formData.address} onChange={handleFormChange}
                                            placeholder="Unit/Suite, Street, Area..."
                                            rows={2}
                                            className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-6 font-bold text-sm outline-none focus:bg-white focus:border-gray-950 hover:bg-gray-100 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">District</label>
                                            <input
                                                name="city" value={formData.city} onChange={handleFormChange}
                                                className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-6 font-black text-sm outline-none focus:bg-white focus:border-gray-950 hover:bg-gray-100 transition-all uppercase"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic">Zip Code</label>
                                            <input
                                                name="pincode" value={formData.pincode} onChange={handleFormChange}
                                                className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-6 font-black text-sm outline-none focus:bg-white focus:border-gray-950 hover:bg-gray-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-6 bg-gray-100 text-gray-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={isSubmitting || !formData.address || !formData.city}
                                        onClick={placeOrder}
                                        className="flex-[2] py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-gray-950 transition-all shadow-2xl shadow-emerald-500/10 active:scale-95"
                                    >
                                        {isSubmitting ? 'SECUREING...' : 'Authorize Transaction'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 rounded-[3.5rem] p-12 sticky top-32 border border-gray-100 shadow-sm">
                            <h3 className="text-3xl font-black text-gray-950 tracking-tighter uppercase mb-10 pb-10 border-b border-gray-200">Inventory Review.</h3>

                            <div className="space-y-8 mb-12 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-8 items-center group">
                                        <div className="w-20 h-20 bg-white rounded-3xl overflow-hidden shrink-0 border border-gray-100 p-2 group-hover:scale-105 transition-transform duration-500">
                                            <img src={item.img} className="w-full h-full object-contain" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[11px] font-black text-gray-950 uppercase line-clamp-2 tracking-tight group-hover:text-emerald-500 transition-colors">{item.name}</h4>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[9px] font-black uppercase text-gray-400">Node ID: {item.id}</span>
                                                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                                <span className="text-[9px] font-black uppercase text-gray-950">QTY: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-gray-950">₹{(parseFloat(typeof item.price === 'number' ? item.price : item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-5 pt-10 border-t border-gray-200">
                                <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <span>Sub-Total</span>
                                    <span className="text-gray-950">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <span>Eco-Shipment</span>
                                    <span className="text-emerald-500 font-black italic">Free</span>
                                </div>
                                <div className="pt-8 flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-emerald-500 mb-1 tracking-widest">Total Valuation</p>
                                        <h2 className="text-5xl font-black text-gray-950 tracking-tighter leading-none">₹{cartTotal.toLocaleString('en-IN')}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}


