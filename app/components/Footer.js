import { Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <img
                src="/BOXFOX-1.png"
                alt="BoxFox Logo"
                className="h-8 w-auto object-contain brightness-0"
              />
              <p className="text-[10px] font-medium text-gray-400 tracking-[0.18em] uppercase mt-2">
                Design | Print | Packaging
              </p>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5 max-w-xs">
              India’s trusted packaging partner. From bakery boxes to corrugated
              shipping—quality that protects your brand.
            </p>
            <div className="flex items-center gap-2.5">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Icon size={15} strokeWidth={1.6} className="text-gray-600" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-950 tracking-widest uppercase mb-4">
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                "Duplex Boxes",
                "Rigid Boxes",
                "Corrugated",
                "Bakery Packaging",
                "Pizza Boxes",
                "Gift Boxes",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[13px] text-gray-500 hover:text-gray-950 transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-950 tracking-widest uppercase mb-4">
              Help
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                "FAQ",
                "Shipping Policy",
                "Return Policy",
                "Track Order",
                "Privacy Policy",
                "Terms & Conditions",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[13px] text-gray-500 hover:text-gray-950 transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-950 tracking-widest uppercase mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-3 mb-6">
              <li className="flex items-center gap-2.5">
                <Phone size={13} strokeWidth={1.6} className="text-gray-400" />
                <a
                  href="tel:+919953302917"
                  className="text-[13px] text-gray-600 hover:text-gray-950"
                >
                  +91 99533 02917
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={13} strokeWidth={1.6} className="text-gray-400" />
                <a
                  href="mailto:hello@boxfox.in"
                  className="text-[13px] text-gray-600 hover:text-gray-950"
                >
                  hello@boxfox.in
                </a>
              </li>
            </ul>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">
              Newsletter
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 text-[13px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 transition-colors"
              />
              <button className="bg-gray-950 hover:bg-gray-800 text-white text-[12px] font-semibold px-3 py-2 rounded-lg transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-gray-400">
            &copy; {new Date().getFullYear()} BoxFox. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-400">
            Payments &middot; Razorpay &middot; UPI &middot; COD
          </p>
        </div>
      </div>
    </footer>
  );
}
