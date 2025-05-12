// src/app/api/upload-signature/route.ts
import { NextResponse } from 'next/server';
import { getUploadSignature } from '@/lib/cloudinary-cache';

export const runtime = 'nodejs';

export async function GET() {
    // choose the right env var
    const folder =
        process.env.CLOUDINARY_FOLDER ??
        process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ??
        '';
    console.log('[upload-signature] using folder =', folder);

    try {
        const params = {
            folder,
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };
        console.log('[upload-signature] params =', params);

        const data = await getUploadSignature(params);
        const { signature, timestamp } = JSON.parse(data) as {
            signature: string;
            timestamp: number;
        };
        console.log(
            '[upload-signature] signature, timestamp =',
            signature,
            timestamp
        );

        return NextResponse.json({ signature, timestamp, ...params });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : 'Could not generate signature';
        console.error('[upload-signature] ERROR', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
