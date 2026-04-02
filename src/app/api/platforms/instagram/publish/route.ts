import { NextRequest, NextResponse } from 'next/server';
import { publishImagePost, InstagramApiError } from '@/lib/api/instagram';

export async function POST(req: NextRequest) {
  try {
    const { userId, imageUrl, caption } = (await req.json()) as {
      userId?: string;
      imageUrl?: string;
      caption?: string;
    };

    if (!userId || !imageUrl || !caption) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, imageUrl, caption' },
        { status: 400 }
      );
    }

    // Resolve relative upload URLs to full public URLs
    let publicImageUrl = imageUrl;
    if (imageUrl.startsWith('/uploads/')) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) {
        return NextResponse.json(
          { success: false, error: 'NEXT_PUBLIC_APP_URL env var is required for publishing. Set it to your public domain or ngrok URL.' },
          { status: 500 }
        );
      }
      publicImageUrl = `${appUrl}${imageUrl}`;
    }

    // If the image is a base64 data URI, upload it first
    if (imageUrl.startsWith('data:')) {
      const uploadRes = await fetch(new URL('/api/upload', req.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: imageUrl }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        return NextResponse.json(
          { success: false, error: `Image upload failed: ${uploadData.error}` },
          { status: 400 }
        );
      }
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) {
        return NextResponse.json(
          { success: false, error: 'NEXT_PUBLIC_APP_URL env var is required for publishing.' },
          { status: 500 }
        );
      }
      publicImageUrl = `${appUrl}${uploadData.url}`;
    }

    const result = await publishImagePost(userId, publicImageUrl, caption);

    return NextResponse.json({ success: true, mediaId: result.mediaId });
  } catch (error) {
    console.error('Instagram publish error:', error);

    if (error instanceof InstagramApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.statusCode },
        { status: error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : 500 }
      );
    }

    const msg = error instanceof Error ? error.message : 'Publishing failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
