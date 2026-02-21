"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Settings, Package, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "../components/Navbar";

export default function AccountManagement() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Editable fields
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Not authenticated");
            }

            setUser(data.user);
            setName(data.user.name || "");
            setPhone(data.user.phone || "");
            setAddress(data.user.address || "");
        } catch (err) {
            router.push("/login"); // Redirect to login if unauthenticated
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, address }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Update failed");

            setSuccessMsg("Profile updated successfully!");
            setUser(data.user);
            setIsEditing(false);
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

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

            <main className="max-w-7xl mx-auto px-8 lg:px-16 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-950 mb-2">
                        My Account
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">
                        Manage your lab details & settings
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-2">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-950 text-white rounded-xl font-bold text-sm tracking-wide transition-all"
                            >
                                <UserIcon size={18} />
                                Profile Settings
                            </button>

                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-950 rounded-xl font-bold text-sm tracking-wide transition-all"
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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

                            {errorMsg && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold uppercase tracking-wide rounded-xl border border-red-100">
                                    {errorMsg}
                                </div>
                            )}
                            {successMsg && (
                                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-sm font-bold uppercase tracking-wide rounded-xl border border-emerald-100">
                                    {successMsg}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <UserIcon size={16} />
                                                </div>
                                                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all font-medium text-gray-950" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address (Read-Only)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <Mail size={16} />
                                                </div>
                                                <input type="email" value={user?.email} disabled
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                    <Phone size={16} />
                                                </div>
                                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Add Phone Number"
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all font-medium text-gray-950" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Shipping Address</label>
                                        <div className="relative">
                                            <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-gray-400">
                                                <MapPin size={16} />
                                            </div>
                                            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter full shipping address..." rows={3}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-950 focus:ring-2 focus:ring-gray-950/5 outline-none transition-all font-medium text-gray-950 resize-none" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold bg-white border border-gray-200 hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl font-bold bg-gray-950 text-white hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm disabled:opacity-70 flex items-center gap-2">
                                            {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
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
                                            <p className="text-lg font-bold text-gray-950">{user?.phone || <span className="text-gray-400 italic font-medium">Not provided</span>}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Account Role</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800">
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Shipping Address</h3>
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                            {user?.address ? (
                                                <p className="text-gray-900 font-medium whitespace-pre-wrap">{user.address}</p>
                                            ) : (
                                                <p className="text-gray-400 italic font-medium">No address provided</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
