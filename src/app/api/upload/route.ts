// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export const runtime = 'nodejs';

// configure Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Transform a Blob into a Node.js Readable stream
function blobToStream(blob: Blob): Readable {
    const reader = blob.stream().getReader();
    return new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) this.push(null);
            else this.push(Buffer.from(value));
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get('file') as Blob | null;
        if (!file) {
            console.warn('[api/upload] No file in formData');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const folder = process.env.CLOUDINARY_FOLDER ?? '';
        console.log('[api/upload] uploading to folder =', folder);

        const publicId = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    use_filename: true,
                    unique_filename: false,
                },
                (error, result) => {
                    if (error) {
                        console.error('[api/upload] Cloudinary error', error);
                        return reject(error);
                    }
                    resolve(result!.public_id);
                }
            );
            blobToStream(file).pipe(uploadStream);
        });

        console.info('[api/upload] uploaded publicId =', publicId);
        return NextResponse.json({ publicId });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        console.error('[api/upload] ERROR', message);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
