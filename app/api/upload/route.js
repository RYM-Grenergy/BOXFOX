import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import UserImage from '@/models/UserImage';
import { cleanupTemporaryImages } from '@/lib/image-finalizer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        await dbConnect();
        const { image, name, type = 'other' } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Get token from cookies to identify user
        const token = req.cookies.get('token')?.value;
        let userId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development_purposes');
                userId = decoded.id;
            } catch (err) {
                console.error('Token verification failed in upload:', err);
            }
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'boxfox_customizations',
            resource_type: 'auto',
        });

        const fileFormat = result.format || (result.url.endsWith('.pdf') ? 'pdf' : 'unknown');
        const finalType = fileFormat === 'pdf' ? 'document' : type;

        // Save to database if user is logged in
        if (userId) {
            await UserImage.create({
                userId,
                url: result.secure_url,
                publicId: result.public_id,
                name: name || `Uploaded ${fileFormat.toUpperCase()}`,
                format: fileFormat,
                isTemporary: true,
                type: finalType
            });
        }

        // 4. Lazy Cleanup (Cleanup old temporary images)
        // We don't await this to avoid slowing down the upload response
        cleanupTemporaryImages().catch(err => console.error('Background Cleanup Error:', err));

        return NextResponse.json({ 
            url: result.secure_url, 
            publicId: result.public_id,
            format: fileFormat,
            isTemporary: true 
        });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return NextResponse.json({ error: 'Image upload failed', details: error.message }, { status: 500 });
    }
}

