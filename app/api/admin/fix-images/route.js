import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { default as redis } from '@/lib/redis';

async function invalidateProductCache() {
  try {
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis] Invalidated ${keys.length} product cache keys`);
    }
  } catch (err) {
    console.error("[Redis] Cache invalidation failed:", err);
  }
}

export async function GET(req) {
    try {
        await dbConnect();
        
        console.log('🔍 Starting database image URL cleanup...');

        const products = await Product.find({ 
            $or: [
                { images: { $regex: 'f_auto,q_auto' } },
                { img: { $regex: 'f_auto,q_auto' } }
            ]
        });

        console.log(`Found ${products.length} products to fix.`);

        let fixedCount = 0;
        for (const product of products) {
            let updated = false;
            
            if (product.images && Array.isArray(product.images)) {
                const newImages = product.images.map(url => url.replace('/f_auto,q_auto/', '/'));
                if (JSON.stringify(newImages) !== JSON.stringify(product.images)) {
                    product.images = newImages;
                    updated = true;
                }
            }

            if (product.img && product.img.includes('f_auto,q_auto')) {
                product.img = product.img.replace('/f_auto,q_auto/', '/');
                updated = true;
            }

            if (updated) {
                await product.save();
                fixedCount++;
            }
        }

        if (fixedCount > 0) {
            await invalidateProductCache();
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully fixed ${fixedCount} products.`,
            found: products.length
        });

    } catch (error) {
        console.error('Fix Images Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
