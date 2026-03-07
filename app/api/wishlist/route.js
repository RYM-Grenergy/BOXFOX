import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';

async function getUserIdFromRequest(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'fallback_secret_for_development_purposes'
        );
        return decoded.id;
    } catch (err) {
        return null;
    }
}

export async function GET(req) {
    try {
        await dbConnect();
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId).populate({ path: 'wishlist', strictPopulate: false });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error('Wishlist GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!user.wishlist) user.wishlist = [];
        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
            await user.save();
            return NextResponse.json({ message: 'Removed from wishlist', action: 'removed' }, { status: 200 });
        } else {
            user.wishlist.push(productId);
            await user.save();
            return NextResponse.json({ message: 'Added to wishlist', action: 'added' }, { status: 200 });
        }
    } catch (error) {
        console.error('Wishlist POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
