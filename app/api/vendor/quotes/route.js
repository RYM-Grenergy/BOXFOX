import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Quotation from '@/models/Quotation';

function getVendorId(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development_purposes');
        return decoded?.id || null;
    } catch { return null; }
}

async function verifyVendor(req) {
    const vendorId = getVendorId(req);
    if (!vendorId) return null;
    const user = await User.findById(vendorId);
    if (!user || user.role !== 'vendor' || user.vendorStatus !== 'approved') return null;
    return user;
}

export async function GET(req) {
    try {
        await dbConnect();
        const vendor = await verifyVendor(req);
        if (!vendor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const quotes = await Quotation.find({ assignedVendor: vendor._id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, quotes });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
    }
}
