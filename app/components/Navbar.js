"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Box,
  Trash2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, cartTotal } =
    useCart();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
  ];

  const shouldBeSolid = isScrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${shouldBeSolid
          ? "bg-white/70 backdrop-blur-2xl border-b border-gray-100 py-4 shadow-sm"
          : "bg-transparent py-8"
          }`}
      >
        <div className="max-w-[1700px] mx-auto px-8 lg:px-16">
          <div className="flex items-center justify-between gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <img
                src="/BOXFOX-1.png"
                alt="BOXFOX Logo"
                className="h-8 sm:h-10 w-auto object-contain transition-all"
              />
            </Link>

            {/* Nav Links - Centered */}
            <nav className="hidden lg:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-black uppercase tracking-[0.3em] transition-all hover:opacity-100 ${shouldBeSolid
                    ? "text-gray-500 hover:text-gray-950"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-6">
              {/* Premium Pill Search */}
              <div
                className={`hidden md:flex items-center rounded-full transition-all duration-500 px-6 py-2.5 w-72 border ${shouldBeSolid
                  ? "bg-gray-50 border-gray-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-gray-950/5"
                  : "bg-black/30 border-white/40 focus-within:bg-black/40"
                  }`}
              >
                <Search
                  size={16}
                  className={shouldBeSolid ? "text-gray-400" : "text-white"}
                />
                <input
                  type="text"
                  placeholder="Search packaging..."
                  className={`bg-transparent text-xs font-bold outline-none ml-3 w-full transition-colors tracking-tight ${shouldBeSolid
                    ? "text-gray-900 placeholder-gray-400"
                    : "text-white font-bold placeholder-white/90"
                    }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className={`p-3 rounded-full transition-all ${shouldBeSolid
                    ? "hover:bg-gray-100 text-gray-900"
                    : "hover:bg-white/20 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                    }`}
                >
                  <User size={20} />
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className={`relative p-3 rounded-full transition-all drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] ${shouldBeSolid
                    ? "hover:bg-gray-100 text-gray-900"
                    : "hover:bg-white/20 text-white"
                    }`}
                >
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-current ring-offset-2 ring-offset-transparent">
                      {cart.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`lg:hidden p-3 rounded-full transition-all drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] ${shouldBeSolid
                    ? "hover:bg-gray-100 text-gray-900"
                    : "hover:bg-white/20 text-white"
                    }`}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="lg:hidden bg-white border-b border-gray-100 overflow-hidden origin-top"
            >
              <div className="px-8 py-12 flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-2xl font-black text-gray-950 flex items-center justify-between group uppercase tracking-tighter"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                    <ChevronRight
                      size={24}
                      className="text-gray-200 transition-transform group-hover:translate-x-2"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
            >
              <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-950 tracking-tighter uppercase">
                    Your Cart
                  </h2>
                  <p className="text-[11px] font-black tracking-[0.2em] text-emerald-500 uppercase">
                    {cart.length} Items Selected
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-4 hover:bg-gray-50 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                      <ShoppingCart size={48} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter">
                        Empty Cart
                      </h3>
                      <p className="text-gray-400 font-medium text-sm max-w-[200px] mx-auto">
                        Your design selections will appear here.
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="px-10 py-5 bg-gray-950 text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-200"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-8 group">
                      <div className="w-28 h-28 bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 shrink-0">
                        <img
                          src={item.img}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <h4 className="text-sm font-black text-gray-950 leading-tight line-clamp-2 uppercase tracking-tight">
                            {item.name}
                          </h4>
                          <p className="text-[11px] font-extrabold text-gray-400 uppercase mt-2 tracking-widest">
                            PCS: {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-gray-950 tracking-tighter">
                            ₹
                            {parseFloat(
                              typeof item.price === "number"
                                ? item.price
                                : item.price.replace(/[^0-9.]/g, ""),
                            ).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-10 border-t border-gray-100 space-y-8 bg-gray-50/50 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                      Estimated Total
                    </span>
                    <span className="text-4xl font-black text-gray-950 tracking-[calc(-0.05em)]">
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-6 bg-gray-950 text-white rounded-[2rem] flex items-center justify-center gap-4 font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gray-200"
                  >
                    Proceed to Secure Checkout <ArrowRight size={20} />
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
