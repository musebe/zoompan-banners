import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

export const runtime = 'nodejs';

const REDIS_KEY = 'uploads:list';
const MAX_STORED = 100;

export async function POST(req: NextRequest) {
    try {
        const { publicId } = await req.json();
        if (!publicId || typeof publicId !== 'string') {
            console.warn('[uploads API] invalid publicId:', publicId);
            return NextResponse.json(
                { error: 'Missing or invalid publicId' },
                { status: 400 }
            );
        }
        await redis.lPush(REDIS_KEY, publicId);
        await redis.lTrim(REDIS_KEY, 0, MAX_STORED - 1);
        console.info('[uploads API] Stored publicId in Redis:', publicId);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[uploads API] POST failed:', err);
        return NextResponse.json(
            { error: 'Failed to store upload' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const limit = Math.min(Number(url.searchParams.get('limit') ?? 6), 24);
        const offset = Number(url.searchParams.get('offset') ?? 0);
        console.log('[uploads API] GET limit,offset =', limit, offset);

        const items = await redis.lRange(REDIS_KEY, offset, offset + limit - 1);
        console.info(
            `[uploads API] Returning ${items.length} items (offset ${offset})`
        );
        return NextResponse.json({ uploads: items });
    } catch (err) {
        console.error('[uploads API] GET failed:', err);
        return NextResponse.json(
            { error: 'Failed to fetch uploads' },
            { status: 500 }
        );
    }
}
