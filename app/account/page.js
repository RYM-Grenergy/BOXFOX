"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Settings, Package, MapPin, Phone, Mail, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AccountManagement() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("profile"); // profile, orders, security
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pwdData, setPwdData] = useState({ current: "", new: "", confirm: "" });

    // Missing state from previous version
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (res.ok && data.user) {
                    setUser(data.user);
                    setName(data.user.name || "");
                    setPhone(data.user.phone || "");
                    setAddress(data.user.address || "");

                    // Fetch orders
                    const ordersRes = await fetch("/api/orders/user");
                    if (ordersRes.ok) {
                        const ordersData = await ordersRes.json();
                        setOrders(ordersData.orders || []);
                    }
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Auth error:", err);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/auth/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, address }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setUser(data.user);
            setSuccessMsg("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        if (pwdData.new !== pwdData.confirm) {
            setErrorMsg("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: pwdData.current, newPassword: pwdData.new }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessMsg("Password updated successfully!");
            setPwdData({ current: "", new: "", confirm: "" });
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    const renderOrderDetail = (order) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
            <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="bg-white rounded-[3rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl border border-gray-100">
                <div className="p-10 space-y-8 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Order Review</p>
                            <h2 className="text-3xl font-black text-gray-950 uppercase tracking-tighter">#{order.orderId}</h2>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-950'}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Inventory Detail</p>
                        <div className="space-y-4">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <h4 className="text-sm font-black text-gray-950 uppercase">{item.name}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black text-gray-950">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                                <h3 className="text-4xl font-black text-gray-950 tracking-tighter">₹{order.total.toLocaleString('en-IN')}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-8 py-4 bg-gray-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (isLoading && !user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-950"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 text-gray-950">
            <Navbar />
            <AnimatePresence>
                {selectedOrder && renderOrderDetail(selectedOrder)}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-8 lg:px-16 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-950 mb-2">
                        My Account
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                        Manage your profile & settings
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${activeTab === 'profile' ? 'bg-gray-950 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <UserIcon size={18} />
                                Profile Settings
                            </button>

                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${activeTab === 'orders' ? 'bg-gray-950 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Package size={18} />
                                Order History
                            </button>

                            <button
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${activeTab === 'security' ? 'bg-gray-950 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Lock size={18} />
                                Security
                            </button>

                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-sm tracking-wide transition-all"
                                >
                                    <Settings size={18} />
                                    Admin Dashboard
                                </button>
                            )}

                            <div className="h-px bg-gray-100 my-2" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm tracking-wide transition-all"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100"
                                >

                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-gray-950">
                                            Profile Information
                                        </h2>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-5 py-2 rounded-full border border-gray-200 text-sm font-bold tracking-wider hover:bg-gray-50 transition-colors uppercase"
                                            >
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {(errorMsg || successMsg) && (
                                        <div className={`mb-6 p-4 text-sm font-bold uppercase tracking-wide rounded-xl border ${errorMsg ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            {errorMsg || successMsg}
                                        </div>
                                    )}

                                    {isEditing ? (
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-950 outline-none transition-all font-medium text-gray-950" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email (Read-Only)</label>
                                                    <input type="email" value={user?.email} disabled
                                                        className="w-full px-6 py-4 rounded-xl bg-gray-100 border border-transparent text-gray-500 font-medium cursor-not-allowed" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Add Phone Number"
                                                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-950 outline-none transition-all font-medium text-gray-950" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Default Shipping Address</label>
                                                <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Full shipping address..." rows={3}
                                                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-950 outline-none transition-all font-medium text-gray-950 resize-none" />
                                            </div>

                                            <div className="flex items-center gap-4 pt-4">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold bg-white border border-gray-200 hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm">
                                                    Cancel
                                                </button>
                                                <button type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl font-bold bg-gray-950 text-white hover:bg-emerald-500 transition-all uppercase tracking-widest text-sm disabled:opacity-70">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</h3>
                                                    <p className="text-lg font-bold text-gray-950">{user?.name}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</h3>
                                                    <p className="text-lg font-bold text-gray-950">{user?.email}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</h3>
                                                    <p className="text-lg font-bold text-gray-950">{user?.phone || <span className="text-gray-400 italic">Not provided</span>}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Account Role</h3>
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-950 shadow-sm">
                                                        {user?.role}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Shipping Address</h3>
                                                <div className="bg-gray-50 rounded-[1.5rem] p-6 border border-gray-100 italic text-gray-600 font-medium">
                                                    {user?.address || "No address provided yet."}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100"
                                >
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-gray-950 mb-8">
                                        Security Settings
                                    </h2>

                                    {(errorMsg || successMsg) && (
                                        <div className={`mb-6 p-4 text-sm font-bold uppercase tracking-wide rounded-xl border ${errorMsg ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            {errorMsg || successMsg}
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                                            <input
                                                type="password" required value={pwdData.current}
                                                onChange={e => setPwdData({ ...pwdData, current: e.target.value })}
                                                className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-950 outline-none transition-all font-medium text-gray-950"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                            <input
                                                type="password" required value={pwdData.new}
                                                onChange={e => setPwdData({ ...pwdData, new: e.target.value })}
                                                className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-950 outline-none transition-all font-medium text-gray-950"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                                            <input
                                                type="password" required value={pwdData.confirm}
                                                onChange={e => setPwdData({ ...pwdData, confirm: e.target.value })}
                                                className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-950 outline-none transition-all font-medium text-gray-950"
                                            />
                                        </div>
                                        <button type="submit" className="w-full py-4 rounded-xl font-bold bg-gray-950 text-white hover:bg-emerald-500 transition-all uppercase tracking-widest text-sm shadow-xl shadow-gray-200">
                                            Update Password
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100 min-h-[400px]"
                                >
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-gray-950 mb-8">
                                        Order History
                                    </h2>

                                    {orders.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                                <Package size={32} />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No orders found.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map(order => (
                                                <div
                                                    key={order._id}
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:shadow-gray-100 hover:scale-[1.01] transition-all cursor-pointer group"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Shipping ID</p>
                                                            <h4 className="text-sm font-black text-gray-950 uppercase group-hover:text-emerald-500 transition-colors">#{order.orderId}</h4>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Dispatched</p>
                                                            <p className="text-xs font-bold text-gray-950">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <p className="text-lg font-black text-gray-950 tracking-tighter">₹{order.total.toLocaleString('en-IN')}</p>
                                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-gray-100 text-gray-950'}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
