import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'boxfox_customizations',
            resource_type: 'auto',
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return NextResponse.json({ error: 'Image upload failed', details: error.message }, { status: 500 });
    }
}
