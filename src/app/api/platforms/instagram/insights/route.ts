import { NextRequest, NextResponse } from 'next/server';
import {
  getAccountInsights,
  getMediaInsights,
  InstagramApiError,
} from '@/lib/api/instagram';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'account';
    const mediaId = searchParams.get('mediaId');
    const period = (searchParams.get('period') || 'days_28') as 'day' | 'week' | 'days_28';

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    if (type === 'media') {
      if (!mediaId) {
        return NextResponse.json({ error: 'Missing mediaId parameter for media insights' }, { status: 400 });
      }
      const metrics = await getMediaInsights(userId, mediaId);
      return NextResponse.json(metrics);
    }

    // Default: account-level insights
    const insights = await getAccountInsights(userId, period);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Instagram insights error:', error);

    if (error instanceof InstagramApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : 500 }
      );
    }

    const msg = error instanceof Error ? error.message : 'Failed to fetch insights';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
