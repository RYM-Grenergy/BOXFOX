import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q'); // Order ID or Phone

        if (!q) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        // Search by orderId or phone number
        // Clean phone number for better matching (optional, depends on how it's stored)
        const order = await Order.findOne({
            $or: [
                { orderId: q.trim() },
                { 'customer.phone': q.trim() },
                { 'customer.phone': q.trim().replace(/\s+/g, '') } // Try without spaces
            ]
        }).sort({ createdAt: -1 }); // Get the latest if multiple for phone

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Return limited data for tracking
        return NextResponse.json({
            orderId: order.orderId,
            status: order.status,
            customerName: order.customer?.name,
            createdAt: order.createdAt,
            total: order.total,
            items: order.items.map(it => ({ name: it.name, quantity: it.quantity })),
            shipping: order.shipping
        });

    } catch (e) {
        console.error("Track Order API Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
