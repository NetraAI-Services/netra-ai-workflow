import { NextRequest, NextResponse } from 'next/server';
import { validateState, storeToken } from '@/lib/api/oauth';

const PLATFORM_CONFIGS: Record<string, any> = {
  instagram: {
    tokenUrl: 'https://graph.instagram.com/v18.0/oauth/access_token',
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  },
  tiktok: {
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    clientId: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
  },
  twitter: {
    tokenUrl: 'https://oauth2.twitter.com/2/oauth/token',
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  },
  youtube: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
  },
};

async function exchangeCodeForToken(
  platformId: string,
  code: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: number;
  scope?: string;
  handle?: string;
  accountId?: string;
}> {
  const config = PLATFORM_CONFIGS[platformId];
  if (!config) {
    throw new Error(`Unknown platform: ${platformId}`);
  }

  const tokenParams = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const tokenRes = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString(),
  });

  if (!tokenRes.ok) {
    const error = await tokenRes.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const tokenData = await tokenRes.json();

  // Extract relevant fields based on platform
  let accessToken = tokenData.access_token;
  let refreshToken = tokenData.refresh_token;
  let expiresIn = tokenData.expires_in || 3600;
  let scope = tokenData.scope;

  // Platform-specific parsing
  if (platformId === 'instagram') {
    // Instagram returns user_id in the token response
    return {
      accessToken,
      refreshToken,
      tokenExpiry: Date.now() + expiresIn * 1000,
      scope: 'instagram_business_basic,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights',
      accountId: tokenData.user_id?.toString(),
    };
  } else if (platformId === 'tiktok') {
    return {
      accessToken,
      refreshToken,
      tokenExpiry: Date.now() + (tokenData.expires_in || 7200) * 1000,
      scope: tokenData.scope,
      accountId: tokenData.open_id,
    };
  } else if (platformId === 'twitter') {
    return {
      accessToken,
      refreshToken,
      tokenExpiry: Date.now() + 7200 * 1000, // Twitter tokens last 2 hours
      scope,
    };
  } else if (platformId === 'youtube') {
    return {
      accessToken,
      refreshToken,
      tokenExpiry: Date.now() + (tokenData.expires_in || 3600) * 1000,
      scope,
    };
  }

  return {
    accessToken,
    refreshToken,
    tokenExpiry: Date.now() + expiresIn * 1000,
    scope,
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: platformId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle user denial of permissions
    if (error) {
      const errorDescription = searchParams.get('error_description') || 'User denied permissions';
      return NextResponse.redirect(
        new URL(`/settings/platforms?error=${encodeURIComponent(errorDescription)}`, req.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/settings/platforms?error=Missing code or state', req.url));
    }

    // Validate CSRF state
    const stateData = validateState(state);
    if (!stateData) {
      return NextResponse.redirect(new URL('/settings/platforms?error=Invalid or expired state', req.url));
    }

    const { userId } = stateData;
    const redirectUri =
      process.env[`${platformId.toUpperCase()}_REDIRECT_URI`] ||
      `http://localhost:3000/api/platforms/${platformId}/callback`;

    // Exchange code for token
    const tokenData = await exchangeCodeForToken(platformId, code, redirectUri);

    // Store token in database
    storeToken({
      platformId,
      userId,
      ...tokenData,
    });

    // Redirect back to settings with success message
    return NextResponse.redirect(
      new URL(`/settings/platforms?connected=${platformId}&success=true`, req.url)
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.redirect(new URL(`/settings/platforms?error=${encodeURIComponent(errorMsg)}`, req.url));
  }
}
