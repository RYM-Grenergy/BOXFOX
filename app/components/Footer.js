import { Phone, Mail, Instagram, Facebook, Youtube, Twitter, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-950 relative overflow-hidden border-t border-gray-100">
      {/* Matrix / Technical Background Pattern (Subtler) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-[1700px] mx-auto px-6 lg:px-16 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 items-start">

          {/* Brand Identity - Minimal */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <img src="/BOXFOX-1.png" alt="BoxFox Logo" className="h-8 w-auto object-contain" />
            </Link>
            <h2 className="text-2xl font-black leading-[1.1] tracking-tighter uppercase text-gray-900">
              Engineering <span className="text-emerald-600">Premium Packaging</span>
            </h2>
            <p className="text-gray-500 text-sm font-semibold max-w-xs">
              India’s trusted partner for high-precision design and luxury packaging solutions.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Collection Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-emerald-600 tracking-[0.3em] uppercase">Collection</h4>
            <ul className="space-y-3">
              {["Bakery Luxury", "Rigid Displays", "Eco Corrugated", "Custom Prints"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[12px] font-bold text-gray-400 hover:text-gray-950 transition-all uppercase tracking-wider">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-emerald-600 tracking-[0.3em] uppercase">Protocol</h4>
            <ul className="space-y-3">
              {["Quality Control", "Shipping Policy", "Track Order", "Help Center"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[12px] font-bold text-gray-400 hover:text-gray-950 transition-all uppercase tracking-wider">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Ultra Minimal */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-emerald-600 tracking-[0.3em] uppercase">Connect</h4>
            <div className="space-y-4">
              <a href="mailto:hello@boxfox.in" className="block group">
                <p className="text-[12px] font-black text-gray-950 flex items-center gap-2">
                  hello@boxfox.in
                  <ExternalLink size={12} className="text-gray-200 group-hover:text-emerald-500 transition-colors" />
                </p>
              </a>
              <a href="tel:+919953302917" className="block text-[12px] font-black text-gray-950">
                +91 99533 02917
              </a>
              <button className="px-5 py-2.5 bg-gray-950 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">
                Quote request
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} BOXFOX INDUSTRIES.
          </p>
          <div className="flex gap-8 uppercase tracking-[0.2em] font-black text-[9px] text-gray-300">
            {["Privacy", "Terms", "SLA"].map((item) => (
              <a key={item} href="#" className="hover:text-gray-950 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
