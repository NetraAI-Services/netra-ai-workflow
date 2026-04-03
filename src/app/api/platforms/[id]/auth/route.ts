import { NextRequest, NextResponse } from 'next/server';
import { generateState } from '@/lib/api/oauth';

const PLATFORM_CONFIGS: Record<string, any> = {
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    scope: 'instagram_business_basic,instagram_business_content_publish,instagram_business_manage_insights,instagram_business_manage_comments',
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/api/platforms/instagram/callback',
  },
  tiktok: {
    authUrl: 'https://www.tiktok.com/oauth/authorize',
    clientId: process.env.TIKTOK_CLIENT_KEY,
    scope: 'user.info.basic,video.list,video.create,analytics.report.download',
    redirectUri: process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/platforms/tiktok/callback',
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    clientId: process.env.TWITTER_CLIENT_ID,
    scope: 'tweet.read tweet.write users.read follows.read mute.read mute.write like.read like.write',
    redirectUri: process.env.TWITTER_REDIRECT_URI || 'http://localhost:3000/api/platforms/twitter/callback',
  },
  youtube: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: process.env.YOUTUBE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.analytics.readonly',
    redirectUri: process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/platforms/youtube/callback',
  },
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: platformId } = await params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const config = PLATFORM_CONFIGS[platformId];
    if (!config) {
      return NextResponse.json({ error: 'Unknown platform' }, { status: 400 });
    }

    if (!config.clientId) {
      return NextResponse.json(
        { error: `Missing ${platformId.toUpperCase()}_CLIENT_ID environment variable` },
        { status: 500 }
      );
    }

    // Generate CSRF state
    const state = generateState(platformId, userId);

    // Build authorization URL
    const params_obj = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      state: state,
    });

    // Platform-specific parameters
    if (platformId === 'twitter') {
      params_obj.set('code_challenge', crypto.getRandomValues(new Uint8Array(32)).toString());
      params_obj.set('code_challenge_method', 'S256');
    }

    const authUrl = `${config.authUrl}?${params_obj.toString()}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('OAuth auth endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
