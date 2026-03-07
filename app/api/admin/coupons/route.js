import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
    try {
        await dbConnect();
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const coupon = await Coupon.create(body);
        return NextResponse.json(coupon);
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, ...updates } = body;
        const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true });
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await Coupon.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
    }
}
