import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import B2BInquiry from "@/models/B2BInquiry";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const inquiry = await B2BInquiry.create({
            companyName: body.companyName,
            contactEmail: body.contactEmail,
            phoneNumber: body.phoneNumber,
            boxType: body.boxType,
            quantity: body.quantity,
            timeline: body.timeline,
            printing: body.printing,
            finish: body.finish,
            sustainability: body.sustainability,
            requirements: body.requirements
        });

        return NextResponse.json({ success: true, inquiry }, { status: 201 });
    } catch (error) {
        console.error("B2B Inquiry Error:", error);
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}
