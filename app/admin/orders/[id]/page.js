"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    ExternalLink,
    Box,
    Printer
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrderDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/orders?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const updateStatus = async (status) => {
        try {
            await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: order._id, status }),
            });
            setOrder({ ...order, status });
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-950"></div>
        </div>
    );

    if (!order) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-black text-gray-950">Order Not Found</h2>
            <button
                onClick={() => router.back()}
                className="mt-4 flex items-center gap-2 px-6 py-2 bg-gray-100 rounded-xl mx-auto"
            >
                <ArrowLeft size={16} /> Go Back
            </button>
        </div>
    );

    const statusSteps = [
        { label: 'Pending', icon: <Clock size={16} />, color: 'text-gray-400' },
        { label: 'Processing', icon: <Package size={16} />, color: 'text-blue-500' },
        { label: 'Shipped', icon: <Truck size={16} />, color: 'text-orange-500' },
        { label: 'Delivered', icon: <CheckCircle2 size={16} />, color: 'text-emerald-500' }
    ];

    const currentStepIdx = statusSteps.findIndex(s => s.label === order.status);

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black text-gray-950 tracking-tighter uppercase">{order.orderId}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-950'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium tracking-tight">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                        <Printer size={18} />
                        Print Order
                    </button>
                    <select
                        value={order.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        className="bg-gray-950 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Status Tracker */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative flex items-center justify-between max-w-4xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 transition-all duration-1000 -z-0"
                        style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
                    ></div>

                    {statusSteps.map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${idx <= currentStepIdx ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border-2 border-gray-100 text-gray-300'
                                }`}>
                                {step.icon}
                            </div>
                            <p className={`mt-4 text-[10px] font-black uppercase tracking-widest ${idx <= currentStepIdx ? 'text-gray-950' : 'text-gray-300'}`}>
                                {step.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Items & Summary */}
                <div className="xl:col-span-2 space-y-10">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-xl font-black text-gray-950 uppercase tracking-tighter flex items-center gap-3">
                                <Box className="text-gray-400" />
                                Order Items
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Product</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Qty</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items.map((item, i) => (
                                        <tr key={i} className="group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                                                        <img src={item.image || "https://boxfox.in/wp-content/uploads/2022/11/01-4.jpg"} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-950">{item.name}</p>
                                                        {item.variant && <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{item.variant}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-black text-gray-950 text-center">{item.quantity}</td>
                                            <td className="px-8 py-6 text-sm font-black text-gray-950 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
                                            <td className="px-8 py-6 text-sm font-black text-gray-950 text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-10 bg-gray-50/50 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{order.total?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                <span>Shipping (Flat Rate)</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                <span>GST (18%)</span>
                                <span>Included</span>
                            </div>
                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-lg font-black text-gray-950 uppercase tracking-tighter">Grand Total</span>
                                <span className="text-2xl font-black text-emerald-500">₹{order.total?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-32 translate-x-32"></div>
                        <h3 className="text-xl font-black tracking-tight mb-8">Internal Lab Notes</h3>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none min-h-[150px]"
                            placeholder="Add notes for production lab..."
                        ></textarea>
                        <button className="mt-6 px-10 py-4 bg-white text-gray-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                            Save Note
                        </button>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-10">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            Customer Profile
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-xl font-black text-gray-400">
                                {order.customer?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-lg font-black text-gray-950 leading-none">{order.customer?.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">B2B Account</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
                                    <Mail size={16} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-sm font-bold text-gray-950 truncate">{order.customer?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-sm font-bold text-gray-950">{order.customer?.phone || '+91 91234 56789'}</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-4 bg-gray-50 text-gray-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                            View Customer History
                            <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            Shipping Detail
                        </h3>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-950">{order.customer?.address || 'No address provided'}</p>
                        </div>
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Truck size={12} /> Shipping Method
                            </p>
                            <p className="text-sm font-black text-blue-900">Standard Freight (3-5 Days)</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-2">
                            <CreditCard size={16} className="text-gray-400" />
                            Payment Method
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Razorpay_logo.webp" className="w-8 h-auto" alt="Razorpay" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-950">Razorpay</p>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase">Paid Successfully</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                                <span>Transaction ID</span>
                                <span className="text-gray-950">pay_O9342KLJQ</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                                <span>Currency</span>
                                <span className="text-gray-950">INR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
