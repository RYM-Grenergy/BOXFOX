import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        // Fetch real users
        let users = await User.find().sort({ createdAt: -1 });

        // If no users, create a dummy one for "real data" look
        if (users.length === 0) {
            const dummyUser = await User.create({
                name: 'Harshavardhan',
                email: 'harsha@boxfox.in',
                phone: '+91 99999 99999',
                address: 'Indore, MP, India',
                role: 'admin'
            });
            users = [dummyUser];
        }

        return NextResponse.json(users);
    } catch (e) {
        console.error("Customers API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
