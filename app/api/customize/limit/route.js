import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import ImageGeneration from "@/models/ImageGeneration";

export async function POST(req) {
    try {
        await dbConnect();

        // Get IP address
        const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
        const today = new Date().toISOString().split('T')[0];

        // Find or create record for today
        let record = await ImageGeneration.findOne({ ip, date: today });

        if (!record) {
            record = new ImageGeneration({ ip, date: today, count: 0 });
        }

        if (record.count >= 5) {
            return NextResponse.json({
                error: "Daily limit reached",
                message: "You have reached your daily limit of 5 AI design generations. Please try again tomorrow."
            }, { status: 429 });
        }

        // Increment count
        record.count += 1;
        await record.save();

        return NextResponse.json({
            success: true,
            remaining: 5 - record.count
        });
    } catch (error) {
        console.error("Rate limit check error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
