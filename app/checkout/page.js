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

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    },
                    items: cart.map(item => ({
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
                        className="max-w-xl w-full text-center space-y-8"
                    >
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-gray-950 tracking-tighter uppercase">Order Placed!</h1>
                            <p className="text-xl text-gray-400 font-medium">Your selection #{orderId} is being processed in our lab.</p>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-left">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                <span className="text-xs font-black uppercase text-gray-400">Order ID:</span>
                                <span className="text-sm font-black text-gray-950">{orderId}</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
                                A confirmation invoice has been sent to {formData.email}. Our team will contact you shortly for design approval.
                            </p>
                        </div>
                        <a href="/" className="inline-flex items-center gap-3 px-10 py-5 bg-gray-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                            Return to Store <ArrowRight size={18} />
                        </a>
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
                <div className="flex items-center gap-4 mb-16">
                    <a href="/shop" className="p-3 hover:bg-gray-100 rounded-full transition-all">
                        <ChevronLeft size={20} />
                    </a>
                    <h1 className="text-6xl font-black text-gray-950 tracking-tighter uppercase">Checkout.</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Form Section */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Stepper */}
                        <div className="flex items-center gap-8">
                            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-gray-950' : 'text-gray-300'}`}>
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${step >= 1 ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-400'}`}>1</span>
                                <span className="text-xs font-black uppercase tracking-widest">Contact</span>
                            </div>
                            <div className="h-px w-12 bg-gray-100" />
                            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-gray-950' : 'text-gray-300'}`}>
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${step >= 2 ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
                                <span className="text-xs font-black uppercase tracking-widest">Shipping</span>
                            </div>
                        </div>

                        {step === 1 ? (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                                        <input
                                            name="name" value={formData.name} onChange={handleFormChange}
                                            placeholder="Enter your name"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-gray-950/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                                        <input
                                            type="email" name="email" value={formData.email} onChange={handleFormChange}
                                            placeholder="name@company.com"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-gray-950/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                                        <input
                                            name="phone" value={formData.phone} onChange={handleFormChange}
                                            placeholder="+91 00000 00000"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-gray-950/5 transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.name || !formData.email || !formData.phone}
                                    className="w-full py-5 bg-gray-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-gray-200"
                                >
                                    Continue to Shipping
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Shipping Address</label>
                                        <textarea
                                            name="address" value={formData.address} onChange={handleFormChange}
                                            placeholder="Room, Street, Locality..."
                                            rows={2}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-gray-950/5 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">City</label>
                                            <input
                                                name="city" value={formData.city} onChange={handleFormChange}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-gray-950/5 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Pincode</label>
                                            <input
                                                name="pincode" value={formData.pincode} onChange={handleFormChange}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-gray-950/5 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-5 bg-gray-100 text-gray-950 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={isSubmitting || !formData.address || !formData.city}
                                        onClick={placeOrder}
                                        className="flex-[2] py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-100"
                                    >
                                        {isSubmitting ? 'Confirming...' : 'Place Lab Order'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        <div className="pt-10 border-t border-gray-100 grid grid-cols-2 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <ShieldCheck size={20} />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-tight">Secure Payment<br />Verified Lab</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-tight">Encrypted Data<br />Privacy Guaranteed</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 sticky top-32">
                            <h3 className="text-2xl font-black text-gray-950 tracking-tighter uppercase mb-8 pb-8 border-b border-gray-200">Order Summary.</h3>

                            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-6 items-center">
                                        <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shrink-0 border border-gray-200">
                                            <img src={item.img} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xs font-black text-gray-950 uppercase line-clamp-1">{item.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">QTY: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-black text-gray-950">₹{(parseFloat(typeof item.price === 'number' ? item.price : item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200">
                                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-950">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-black">Free</span>
                                </div>
                                <div className="pt-4 flex items-center justify-between">
                                    <span className="text-sm font-black text-gray-950 uppercase tracking-tighter">Total Payable</span>
                                    <span className="text-3xl font-black text-gray-950 tracking-tighter">₹{cartTotal.toLocaleString('en-IN')}</span>
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
