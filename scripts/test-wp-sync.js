/**
 * STEP-BY-STEP GUIDE TO SYNC WORDPRESS PRODUCTS TO MONGODB
 * 
 * 1. Install dependencies: npm install mongoose node-fetch
 * 2. Configure .env.local with WC_CONSUMER_KEY, WC_CONSUMER_SECRET, and MONGODB_URI
 * 3. Run this script: node scripts/test-wp-sync.js
 */

const mongoose = require('mongoose');

// Note: In a production Next.js environment, we use ES Modules. 
// For this standalone test script, we use CommonJS for simplicity.

const MONGODB_URI = "mongodb://localhost:27017/boxfox";
const WC_CONSUMER_KEY = "ck_e655299530291a6303e91560419bbdc0baad2f6b";
const WC_CONSUMER_SECRET = "cs_4d3ca79c1b2e9043b7d856d1c6c4570c142e9d79";
const WC_BASE_URL = "https://boxfox.in/wp-json/wc/v3";

// Product Schema
const ProductSchema = new mongoose.Schema({
    wpId: { type: Number, unique: true },
    name: String,
    price: String,
    regular_price: String,
    images: Array,
    categories: Array,
    stock_status: String,
    lastSynced: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function syncProducts() {
    console.log("🚀 Starting WordPress to MongoDB sync...");

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // 2. Fetch from WordPress API
        // Using Basic Auth via URL params for simplicity in this test
        const url = `${WC_BASE_URL}/products?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}&per_page=100`;

        console.log("📡 Fetching products from WordPress...");
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const wpProducts = await response.json();
        console.log(`📦 Received ${wpProducts.length} products from WordPress`);

        // 3. Save to MongoDB
        let newCount = 0;
        let upCount = 0;

        for (const wp of wpProducts) {
            const productData = {
                wpId: wp.id,
                name: wp.name,
                price: wp.price,
                regular_price: wp.regular_price,
                images: wp.images.map(img => ({ src: img.src, alt: img.alt })),
                categories: wp.categories.map(cat => ({ name: cat.name })),
                stock_status: wp.stock_status,
                lastSynced: new Date()
            };

            // upsert (update if exists, insert if not) based on wpId
            const result = await Product.findOneAndUpdate(
                { wpId: wp.id },
                productData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            if (result.createdAt === result.updatedAt) {
                newCount++;
            } else {
                upCount++;
            }
        }

        console.log(`✨ Sync Complete!`);
        console.log(`🆕 New products added: ${newCount}`);
        console.log(`🔄 Existing products updated: ${upCount}`);

    } catch (error) {
        console.error("❌ Sync failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

syncProducts();
