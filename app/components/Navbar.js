"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "B2B", href: "/b2b" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-[100] px-4">
        <div className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isScrolled
            ? "max-w-[700px] bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-[2rem] py-2 px-6"
            : "max-w-[1400px] bg-transparent py-4 px-8"
          }`}>
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src="/BOXFOX-1.png"
                alt="BOXFOX Logo"
                className={`transition-all duration-500 ${isScrolled ? "h-6" : "h-8 sm:h-9"}`}
              />
            </Link>

            {/* Centered Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${pathname === link.href ? "text-emerald-500" : "text-gray-400 hover:text-gray-900"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full hover:bg-gray-50 transition-all text-gray-900"
              >
                <Search size={18} />
              </button>

              <Link href="/account" className="p-2.5 rounded-full hover:bg-gray-50 transition-all text-gray-900 hidden sm:block">
                <User size={18} />
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-gray-50 transition-all text-gray-900"
              >
                <ShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-[8px] font-black rounded-full h-3.5 w-3.5 flex items-center justify-center ring-2 ring-white">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-gray-50 transition-all text-gray-900"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Global Search Bar Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
            >
              <div className="bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-[2rem] p-4 shadow-2xl flex items-center gap-4">
                <Search className="text-gray-400 ml-4" size={20} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Design search..."
                  className="bg-transparent w-full text-sm font-bold text-gray-950 outline-none placeholder:text-gray-300 uppercase tracking-widest"
                />
                <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-all">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-gray-950/20 backdrop-blur-sm z-[150] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[280px] h-full bg-white z-[160] lg:hidden p-8 shadow-2xl flex flex-col pt-24"
            >
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-2xl font-black text-gray-950 uppercase tracking-tighter"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer Inherited (Simplified Styles) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-gray-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-950 tracking-tighter uppercase">Your Basket</h2>
                  <p className="text-[10px] font-black tracking-[0.1em] text-emerald-500 uppercase">{cart.length} Designs</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-gray-50 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <Box size={40} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest leading-loose">Basket is empty <br /> Select your packaging</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-6 group items-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                        <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[11px] font-black text-gray-950 uppercase tracking-tight line-clamp-1">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-black text-emerald-600">₹{parseFloat(item.price).toLocaleString("en-IN")}</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-gray-50 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black text-gray-950">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-5 bg-gray-950 text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all"
                  >
                    Confirm Order <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
