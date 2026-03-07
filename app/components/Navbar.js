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
  Box,
  Heart,
  Minus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Customize", href: "/customize", isSpecial: true },
    { label: "B2B", href: "/b2b" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 sm:top-6 left-0 right-0 z-[100] px-0 sm:px-4 w-full">
        <div className={`mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
          ? "max-w-[1200px] bg-white/95 backdrop-blur-3xl border-b sm:border border-white/60 shadow-xl rounded-none sm:rounded-full py-3 px-4 sm:px-10"
          : "max-w-[1600px] bg-white sm:bg-transparent border-b border-gray-100 sm:border-none py-4 sm:py-6 px-4 sm:px-12"
          }`}>
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src="/BOXFOX-1.png"
                alt="BOXFOX Logo"
                className={`transition-all duration-500 ${isScrolled ? "h-5 sm:h-6" : "h-6 sm:h-9"}`}
              />
            </Link>

            {/* Centered Desktop Links */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 xl:px-4 py-2.5 text-[11px] xl:text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 group active:scale-95 rounded-xl ${pathname === link.href
                    ? "text-emerald-600"
                    : link.isSpecial
                      ? "text-emerald-500 font-black h-fit"
                      : "text-gray-500 hover:text-emerald-600"
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-emerald-600">{link.label}</span>
                    {link.isSpecial && (
                      <span className="text-[6px] xl:text-[7px] font-black text-emerald-600/60 -mt-1 tracking-[0.1em]"></span>
                    )}
                  </div>

                  {/* Hover Glow Background */}
                  <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-xl transition-all duration-300 -z-0" />

                  {/* Active/Current Page Glow */}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.2)] rounded-xl -z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-50 hover:shadow-lg active:scale-90 active:shadow-inner transition-all text-gray-900 duration-300"
              >
                <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              <div className="relative group hidden sm:block">
                <Link
                  href={user ? "/account" : `/login?redirect=${encodeURIComponent(pathname)}`}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-500 ${user
                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100"
                    : "bg-gray-950 text-white hover:bg-emerald-600 shadow-xl shadow-gray-200"
                    }`}
                >
                  <User size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {user ? "Account" : "Login"}
                  </span>
                </Link>

                {user && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[200]">
                    <Link href="/account" className="block px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-emerald-600 transition-colors">
                      My Dashboard
                    </Link>
                    <Link href="/account?tab=wishlist" className="block px-6 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-emerald-600 transition-colors">
                      My Wishlist
                    </Link>
                    <div className="h-px bg-gray-50 mx-6 my-1" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-6 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Logout_Session
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-full hover:bg-gray-50 hover:shadow-lg active:scale-90 active:shadow-inner transition-all text-gray-900 duration-300"
              >
                <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                {cart.length > 0 && (
                  <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-emerald-500 text-white text-[7px] sm:text-[8px] font-black rounded-full h-3 sm:h-3.5 w-3 sm:w-3.5 flex items-center justify-center ring-2 ring-white">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-full hover:bg-gray-50 hover:shadow-lg active:scale-90 active:shadow-inner transition-all text-gray-900 duration-300"
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
              className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
            >
              <div className="bg-white/80 backdrop-blur-2xl border border-gray-100 rounded-3xl sm:rounded-[2rem] p-3 sm:p-4 shadow-2xl flex items-center gap-3 sm:gap-4">
                <Search className="text-gray-400 ml-2 sm:ml-4" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Design search..."
                  className="bg-transparent w-full text-[11px] sm:text-sm font-bold text-gray-950 outline-none placeholder:text-gray-300 uppercase tracking-widest"
                />
                <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-all">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>


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
              className="fixed top-0 right-0 w-[280px] sm:w-[320px] h-full bg-white z-[160] lg:hidden p-8 sm:p-12 shadow-2xl flex flex-col justify-between pt-24 sm:pt-32"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-50 transition-colors"
                aria-label="Close Menu"
              >
                <X size={24} className="text-gray-950" />
              </button>
              <div className="flex flex-col gap-6 sm:gap-8">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter flex items-center justify-between group ${pathname === link.href || link.isSpecial ? "text-emerald-500" : "text-gray-950"}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex flex-col">
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight size={24} className={`transition-transform group-hover:translate-x-1 ${pathname === link.href ? "opacity-100" : "opacity-0"}`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6 pt-12 border-t border-gray-100">
                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-extrabold text-sm border border-emerald-100">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-950">{user.name}</span>
                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em]">{user.role}_Profile</span>
                      </div>
                    </div>

                    <Link
                      href="/account?tab=wishlist"
                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-all group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Heart size={16} className="group-hover:scale-110 transition-transform" /> My Wishlist
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-all group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User size={16} className="group-hover:scale-110 transition-transform" /> Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-all w-full group"
                    >
                      <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Logout_Session
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    className="flex items-center justify-center gap-4 py-5 bg-gray-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 mt-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={16} /> Login
                  </Link>
                )}

                <div className="p-6 bg-gray-50 rounded-3xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Support_Line</p>
                  <a href="mailto:office.ggn@iopl.co" className="text-xs font-black text-gray-950 block hover:text-emerald-600 transition-colors">office.ggn@iopl.co</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                        <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">QTY: {item.quantity}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(100, item.quantity - 100))}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-950"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-[10px] font-black text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 100)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-950"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase">Remove</button>
                        </div>
                        <p className="text-xs font-black text-emerald-600 mt-2">₹{(parseFloat(item.price) * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-gray-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black text-gray-950">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="grid gap-3">
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-4 bg-gray-50 text-gray-950 rounded-2xl flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                    >
                      Review Shopping Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-5 bg-gray-950 text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-100"
                    >
                      Confirm Order <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
