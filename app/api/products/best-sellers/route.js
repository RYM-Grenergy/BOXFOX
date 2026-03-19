import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import StoreSettings from "@/models/StoreSettings";

export async function GET() {
    try {
        await dbConnect();

        // 1. Get best seller IDs from StoreSettings
        const settings = await StoreSettings.findOne({ key: 'best_sellers' });

        let products = [];
        if (settings && Array.isArray(settings.value) && settings.value.length > 0) {
            // Find products matching these IDs using their _id
            const bestSellerIds = settings.value.map(item => item._id).filter(Boolean);
            const foundProducts = await Product.find({ _id: { $in: bestSellerIds } }).lean();

            // Map and sort them according to the saved order
            products = bestSellerIds
                .map(id => foundProducts.find(p => p._id.toString() === id.toString()))
                .filter(Boolean); 
        } 
        
        // If no best sellers or search failed, get fallback
        if (products.length === 0) {
            products = await Product.find({ type: { $in: ["simple", "variable"] }, parent_id: 0 }).limit(10).lean();
        }

        // Format similarly to what the frontend expects
        const formattedProducts = products.map((p) => {
            const formattedPrice = p.minPrice
                ? (p.maxPrice ? `₹${p.minPrice} - ₹${p.maxPrice}` : `₹${p.minPrice}`)
                : (p.price ? (String(p.price).startsWith('₹') ? p.price : `₹${p.price}`) : "Price on Request");

            return {
                _id: p._id,
                id: p.wpId,
                name: p.name,
                price: formattedPrice,
                minPrice: p.minPrice,
                maxPrice: p.maxPrice,
                badge: p.badge || (p.isFeatured ? "Featured" : null),
                img: p.images && p.images[0] ? p.images[0] : "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
                images: p.images,
                hasVariants: p.type === "variable",
                outOfStock: p.stock_status === "outofstock",
                dimensions: p.dimensions || { length: 8.5, width: 6.5, height: 2, unit: 'inch' },
                pacdoraId: p.pacdoraId
            };
        });

        // The TopSellingStrip component expects an array of simple products
        return NextResponse.json(formattedProducts);
    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ error: "Failed to fetch top products", details: e.message }, { status: 500 });
    }
}
