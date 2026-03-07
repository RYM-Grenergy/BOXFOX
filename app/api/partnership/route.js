import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import GeneralInquiry from "@/models/GeneralInquiry";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, location, contactNumber, message } = body;

        if (!name || !email || !contactNumber || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const inquiry = await GeneralInquiry.create({
            type: 'partnership',
            name,
            email,
            location,
            contactNumber,
            message
        });

        return NextResponse.json({ success: true, inquiry }, { status: 201 });
    } catch (error) {
        console.error("Partnership submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
