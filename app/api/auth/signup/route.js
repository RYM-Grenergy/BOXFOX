import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();

        const { name, email, password, phone, businessName } = await req.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ error: 'Please provide all required fields (Name, Email, Password, Phone)' }, { status: 400 });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            businessName
        });

        // Generate token for automatic login
        const token = jwt.sign(
            { id: user._id, role: user.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Don't send password back in response
        const { password: _, ...userWithoutPassword } = user._doc;

        const response = NextResponse.json({
            message: 'User created successfully',
            user: userWithoutPassword
        }, { status: 201 });

        // Set the token in a cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        return response;

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
