# BoxFox Store 📦

BoxFox Store is a premium, state-of-the-art e-commerce platform specializing in highly customizable packaging solutions. Built with **Next.js**, **Three.js**, and **AI-driven tools**, it offers a seamless experience for both retail and B2B customers to design, visualize, and order custom boxes.

---

## 🚀 Key Features

### 🧠 The Neural Suite (NEURAL_V2.5)

The core of BoxFox's innovation, providing advanced AI-driven design capabilities:

- **Ignite_Forge**: The powerful AI generation engine that breathes life into your ideas.
- **Neural_Maps**: Advanced texture mapping technology for 3D surfaces.
- **AI_Texture**: Generate high-fidelity, seamless patterns and textures instantly.
- **Logo_Lab**: AI-assisted logo creation and brand asset generation.
- **Solid_Lab**: Precision control over material solids and base finishes.
- **Neural Multi-Asset Pool**: A dynamic "Active Asset Pool" (up to 3 assets) with **Mix & Match** capabilities for complex designs.

### 🎨 3D Box Customization (The "Lab")

- **Real-time 3D Preview**: Powered by Three.js and `@react-three/fiber`, users can visualize their designs on 3D box models.
- **Face-Specific Design**: Apply textures, colors, and logos to individual box faces (front, back, top, bottom, sides).
- **Brand Text on Box**: Add custom typography directly onto the 3D model with real-time editing.
- **Image_Upload**: Seamless integration for high-resolution user-provided assets.
- **Dynamic Sizing**: Customize dimensions (Length, Width, Height) with real-time price updates.
- **Dieline Generation**: Automatically generate and download dielines for professional manufacturing.

### 🤖 Smart Prompt Builder

A sophisticated AI interface to guide users through the design process:

- **Industry & Style Chips**: Select from curated styles like *Luxury Premium*, *Eco & Sustainable*, *Bold & Playful*, *Minimal & Clean*, *Festive & Celebratory*, *Professional Corporate*, *Rustic Artisan*, *Modern High-End*, *Vintage Classic*, and *Ultra Sleek*.
- **Describe Your Idea**: Natural language input (e.g., *"minimalist white mailer with gold foil logo"*) processed by our neural engine.

### 🏢 B2B & Wholesale

- **Bulk Ordering**: Specialized pricing and workflows for large-volume B2B orders.
- **B2B Inquiry System**: Integrated forms for custom quotes and corporate partnerships.
- **Hierarchical Catalog**: Structured categorization for industrial and retail packaging needs.

### 🛡️ Brand Vault

- Securely store and manage brand assets including logos, color palettes, and typography.
- Quick-access to brand assets during the customization process.

### 📊 Admin Dashboard

- **Comprehensive Analytics**: Track sales, user behavior, and popular products.
- **Product Management**: Robust tools for managing a complex catalog of simple and variable products.
- **Order Fulfillment**: Detailed order tracking and management.
- **Lab Configuration**: Fine-tune pricing formulas, material rates, and production specifications.
- **Coupon & Marketing**: Manage discount codes and promotional campaigns.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 18, Tailwind CSS 4
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Animations**: Framer Motion, GSAP
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with secure cookies
- **File Storage**: Cloudinary (Image management and optimization)
- **Email**: NodeMailer for transactional emails (Invoices, OTPs)
- **Caching**: Upstash Redis
- **Data Processing**: `xlsx`, `csv-parser` for bulk product operations

---

## 📂 Project Structure

### Frontend (`/app`)

- `/admin`: Full-featured administrative dashboard.
- `/customize`: The 3D design lab for custom boxes.
- `/shop`: Product catalog and discovery.
- `/products`: Individual product detail pages.
- `/cart` & `/checkout`: Secure e-commerce flow.
- `/account`: User profile, order history, and Brand Vault.
- `/b2b`: Corporate and wholesale portal.
- `/components`: Reusable UI components (Navbar, Footer, Modals, etc.).
- `/context`: Global state management (Auth, Cart, Toast).

### Backend (`/app/api`)

- `/api/auth`: Authentication endpoints (Login, Signup, OTP).
- `/api/products`: Product CRUD and catalog management.
- `/api/orders`: Order processing and tracking.
- `/api/customize`: AI generation and design saving.
- `/api/lab`: Lab-specific configuration and pricing logic.
- `/api/admin`: Protected administrative endpoints.
- `/api/upload`: Cloudinary integration for image uploads.

### Logic & Models

- `/lib`: Core business logic, including:
  - `boxfoxPricing.js`: Complex pricing engine for custom dimensions.
  - `dieline-generator.js`: SVG/PDF dieline creation logic.
  - `mail.js`: Email templating and dispatching.
- `/models`: Mongoose schemas for MongoDB (User, Order, Product, SavedDesign, etc.).

---

## ⚙️ Development & Setup

### Prerequisites

- Node.js (Latest LTS)
- MongoDB Database
- Cloudinary Account
- Redis (Upstash recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file based on the provided configuration (see `.env.example`).
4. Run the development server:
   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built application.
- `npm run lint`: Runs ESLint for code quality checks.

---

## 📝 Recent Enhancements & New Features

- **Advanced Pricing Engine**: Implemented a sophisticated formula-based pricing system that accounts for material GSM, wastage, and finish types.
- **Admin Product File Uploads**: Streamlined bulk product management via Excel/CSV imports.
- **Minimum Customize Order Limits**: Integrated business logic to enforce MOQs on custom designs.
- **Brand Vault Integration**: Unified storage for user design assets across the platform.
- **Enhanced 3D Controls**: Added spatial panning and precision rotation for better design accuracy.

---

© 2026 BOXFOX. All rights reserved.
