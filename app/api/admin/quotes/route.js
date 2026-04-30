import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Quotation from '@/models/Quotation';

function getAdminId(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development_purposes');
        return decoded?.id || null;
    } catch { return null; }
}

async function verifyAdmin(req) {
    const adminId = getAdminId(req);
    if (!adminId) return null;
    const user = await User.findById(adminId);
    if (!user || user.role !== 'admin') return null;
    return user;
}

export async function GET(req) {
    try {
        await dbConnect();
        if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const quotes = await Quotation.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, quotes });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await dbConnect();
        if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { quoteId, amount, status, assignedVendor, vendorAmount } = await req.json();
        const quote = await Quotation.findById(quoteId);

        if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });

        if (amount !== undefined) quote.totalAmount = amount;
        if (status !== undefined) quote.status = status;
        if (assignedVendor !== undefined) quote.assignedVendor = assignedVendor;
        if (vendorAmount !== undefined) quote.vendorAmount = vendorAmount;

        await quote.save();
        return NextResponse.json({ success: true, quote });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
    }
}
