import "./globals.css";

export const metadata = {
  title: "BoxFox — Design | Print | Packaging",
  description:
    "India's trusted packaging partner. Premium duplex, rigid, corrugated & bakery boxes with custom prints. Free delivery on orders over ₹2000.",
};

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import CustomCursor from "./components/CustomCursor";
import SiteLoader from "./components/SiteLoader";
import ClientLayout from "./components/ClientLayout";
import WhatsAppButton from "./components/WhatsAppButton";
import AIChatBot from "./components/AIChatBot";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Space+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <SiteLoader />
        <CustomCursor />
        {/* Modern, User-Friendly Storefront */}
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
              <AIChatBot />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
