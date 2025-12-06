import { NextRequest, NextResponse } from 'next/server';

/**
 * Image Proxy Route
 * Fetches external images and proxies them to avoid CORS issues
 * Used for displaying images from external sources
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL parameter' }, { status: 400 });
  }

  try {
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: imageResponse.status }
      );
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const buffer = await imageResponse.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('[Image Proxy Error]', error);
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}
