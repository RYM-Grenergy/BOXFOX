import { Phone, Mail, Instagram, Facebook, Youtube, Twitter, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-950 relative overflow-hidden border-t border-gray-100">
      {/* Matrix / Technical Background Pattern (Subtler) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-[1700px] mx-auto px-6 lg:px-16 pt-6 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 items-start">

          {/* Brand Identity - Minimal */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <img src="/BOXFOX-1.png" alt="BoxFox Logo" className="h-8 w-auto object-contain" />
            </Link>
            <h2 className="text-2xl font-black leading-[1.1] tracking-tighter uppercase text-gray-900">
              Premium <span className="text-emerald-600">Packaging Solutions</span>
            </h2>
            <p className="text-gray-500 text-sm font-semibold max-w-xs">
              India’s trusted partner for beautiful boxes and custom packaging designs.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: Instagram, href: "#", color: "hover:text-pink-600 hover:bg-pink-50" },
                { Icon: Facebook, href: "#", color: "hover:text-blue-600 hover:bg-blue-50" },
                { Icon: Twitter, href: "#", color: "hover:text-sky-500 hover:bg-sky-50" },
                { Icon: Youtube, href: "#", color: "hover:text-red-600 hover:bg-red-50" }
              ].map(({ Icon, href, color }, i) => (
                <a
                  key={i}
                  href={href}
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-transparent ${color}`}
                >
                  <Icon size={18} strokeWidth={2.5} />
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
                  <Link href="#" className="text-[12px] font-black text-gray-950 hover:text-emerald-600 transition-all uppercase tracking-wider">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-emerald-600 tracking-[0.3em] uppercase">Support</h4>
            <ul className="space-y-3">
              {[
                { name: "Shipping Policy", href: "/shipping" },
                { name: "Domestic Shipping", href: "/domestic-shipping" },
                { name: "International Shipping", href: "/international-shipping" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[12px] font-black text-gray-950 hover:text-emerald-600 transition-all uppercase tracking-wider">{item.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/partnership" className="text-[12px] font-black text-emerald-600 hover:text-gray-950 transition-all uppercase tracking-wider">Be with BoxFox</Link>
              </li>
            </ul>
          </div>

          {/* Contact - Refined */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-emerald-600 tracking-[0.3em] uppercase">Connect</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Support</p>
                <a href="mailto:office.ggn@iopl.co" className="block text-[11px] font-black text-gray-950 hover:text-emerald-600 truncate">office.ggn@iopl.co</a>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Phone</p>
                <a href="tel:+919953302917" className="block text-[11px] font-black text-gray-950 hover:text-emerald-600">+91 99533 02917</a>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Head Office</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">
                  C172, BLOCK C, NARAINA AREA, <br />
                  PHASE 1, NEW DELHI 110028
                </p>
              </div>
              <div className="pt-2">
                <Link href="/contact" className="inline-block px-7 py-3 bg-gray-950 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-lg active:scale-95">
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-gray-950 tracking-[0.2em] uppercase">
            &copy; 2020-23 Indo Omakase Pvt Ltd. All Rights Reserved
          </p>
          <div className="flex gap-8 uppercase tracking-[0.2em] font-black text-[9px] text-gray-950">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms and Conditions", href: "/terms" }
            ].map((item) => (
              <Link key={item.name} href={item.href} className="hover:text-emerald-600 transition-colors uppercase">{item.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
