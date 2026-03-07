import "./globals.css";

export const metadata = {
  title: "BoxFox — Design | Print | Packaging",
  description:
    "India's trusted packaging partner. Premium duplex, rigid, corrugated & bakery boxes with custom prints. Free delivery on orders over ₹2000.",
};

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CustomCursor from "./components/CustomCursor";
import SiteLoader from "./components/SiteLoader";

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
        {/* Security Deterrents */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.hostname !== 'localhost') {
                // Disable Right-Click
                document.addEventListener('contextmenu', (e) => e.preventDefault());
                
                // Disable common shortcuts for DevTools
                document.onkeydown = function(e) {
                  if (
                    e.keyCode === 123 || // F12
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
                    (e.ctrlKey && e.keyCode === 85) // Ctrl+U (View Source)
                  ) {
                    return false;
                  }
                };

                // Clear console to hide internals
                setInterval(() => {
                  console.clear();
                  console.log("%c BoxFox Security Active ", "background: #f00; color: #fff; font-size: 20px; font-weight: bold;");
                }, 5000);
              }
            `,
          }}
        />
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
