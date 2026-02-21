import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        console.log(`🔍 Fetching product with ID: ${id}`);
        let product = null;

        // Try to find by wpId (number) if it's a valid integer
        const wpIdNum = parseInt(id);
        if (!isNaN(wpIdNum)) {
            product = await Product.findOne({ wpId: wpIdNum });
            if (product) console.log(`✅ Found product by wpId: ${wpIdNum}`);
        }

        // If not found by wpId, try by MongoDB _id
        if (!product && mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
            if (product) console.log(`✅ Found product by MongoDB _id: ${id}`);
        }

        if (!product) {
            console.warn(`❌ Product not found for ID: ${id}`);
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Transform for frontend
        const result = {
            id: product.wpId,
            name: product.name,
            price: product.minPrice
                ? (product.maxPrice ? `₹${product.minPrice} - ₹${product.maxPrice}` : `₹${product.minPrice}`)
                : (product.price ? (product.price.toString().startsWith('₹') ? product.price : `₹${product.price}`) : "Price on Request"),
            badge: product.badge,
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            description: product.description,
            short_description: product.short_description,
            img: product.images[0] || "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
            images: product.images,
            category: product.categories[product.categories.length - 1] || "Packaging",
            stock_status: product.stock_status,
            type: product.type,
            weight: product.weight,
            dimensions: product.dimensions,
            attributes: product.attributes,
            brand: product.brand || 'BoxFox',
            minOrderQuantity: product.minOrderQuantity || 100,
            minPrice: product.minPrice,
            maxPrice: product.maxPrice,
            tags: product.tags || [],
            specifications: product.specifications || [],
            meta: product.meta
        };

        return NextResponse.json(result);
    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
