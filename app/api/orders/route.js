import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find().sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const orderData = await req.json();

        // Generate a clean numeric order ID
        const count = await Order.countDocuments();
        const orderId = `ORD-${1001 + count}`;

        const newOrder = await Order.create({
            ...orderData,
            orderId,
            status: 'Pending'
        });

        return NextResponse.json({ success: true, orderId: newOrder.orderId });
    } catch (e) {
        console.error("Order Creation Error:", e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await dbConnect();
        const { id, status } = await req.json();

        // Find by orderId string or MongoDB _id
        const order = await Order.findOneAndUpdate(
            { $or: [{ orderId: id }, { _id: id }] },
            { status },
            { new: true }
        );

        if (order) {
            return NextResponse.json({ success: true, order });
        }
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
