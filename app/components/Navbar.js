"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Box } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Collection", href: "#" },
    { label: "Shop", href: "#" },
    { label: "About", href: "#" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-gray-200 py-3"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-32 sm:w-40 h-10 flex items-center">
              <img
                src="/BOXFOX-1.png"
                alt="BOXFOX Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.a>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold transition-all hover:opacity-100 ${isScrolled
                  ? "text-gray-600 hover:text-gray-950"
                  : "text-gray-600 hover:text-gray-950 sm:text-white/70 sm:hover:text-white"
                  }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`hidden md:flex items-center border rounded-full transition-all duration-300 px-4 py-2 ${isScrolled
              ? "bg-gray-100/50 border-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-950/10"
              : "bg-white/10 border-white/20 focus-within:bg-white/20"
              }`}>
              <Search size={16} className={isScrolled ? "text-gray-400" : "text-white/60"} />
              <input
                type="text"
                placeholder="Search packaging..."
                className={`bg-transparent text-sm outline-none ml-2 w-48 transition-colors ${isScrolled ? "text-gray-950 placeholder-gray-400" : "text-white placeholder-white/40"
                  }`}
              />
            </div>

            <div className="flex items-center gap-1">
              <button className={`p-2.5 rounded-full transition-colors ${isScrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-gray-700 sm:text-white"
                }`}>
                <User size={20} />
              </button>

              <button className={`relative p-2.5 rounded-full transition-colors ${isScrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-gray-700 sm:text-white"
                }`}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 bg-gray-950 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2.5 rounded-full transition-colors ${isScrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-gray-700 sm:text-white"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-bold text-gray-950 flex items-center justify-between group"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  <ChevronRight size={18} className="text-gray-300 transition-transform group-hover:translate-x-1" />
                </a>
              ))}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                <button className="flex-1 px-6 py-3 bg-gray-950 text-white rounded-xl font-bold">
                  Sign In
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-950 rounded-xl font-bold">
                  Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const ChevronRight = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

