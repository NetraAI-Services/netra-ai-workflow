import { getToken, storeToken, isTokenExpired } from '@/lib/api/oauth';

const IG_API_BASE = 'https://graph.instagram.com/v18.0';

// ── Types ──────────────────────────────────────────────────────────────────

export class InstagramApiError extends Error {
  constructor(
    public statusCode: number,
    public igError: Record<string, unknown> | null,
    message: string
  ) {
    super(message);
    this.name = 'InstagramApiError';
  }
}

interface IGContainerStatus {
  status_code: 'EXPIRED' | 'ERROR' | 'FINISHED' | 'IN_PROGRESS' | 'PUBLISHED';
  status?: string;
}

export interface IGPublishingLimit {
  quota_usage: number;
  quota_total: number;
}

export interface IGAccountInsights {
  metrics: Record<string, number[]>;
  dates: string[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function getValidToken(userId: string): Promise<{ accessToken: string; accountId: string }> {
  const tokenData = getToken('instagram', userId);
  if (!tokenData || !tokenData.accountId) {
    throw new InstagramApiError(401, null, 'Instagram not connected. Connect in Settings → Platforms.');
  }

  if (isTokenExpired(tokenData.tokenExpiry)) {
    // Refresh long-lived Instagram token
    const res = await fetch(
      `${IG_API_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${tokenData.accessToken}`
    );
    if (!res.ok) {
      throw new InstagramApiError(401, null, 'Token refresh failed. Please reconnect Instagram in Settings.');
    }
    const data = await res.json();
    storeToken({
      platformId: 'instagram',
      userId,
      accessToken: data.access_token,
      tokenExpiry: Date.now() + data.expires_in * 1000,
      accountId: tokenData.accountId,
      handle: tokenData.handle,
      scope: tokenData.scope,
    });
    return { accessToken: data.access_token, accountId: tokenData.accountId };
  }

  return { accessToken: tokenData.accessToken, accountId: tokenData.accountId };
}

async function igFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    const errObj = (data as Record<string, unknown>).error as Record<string, unknown> | undefined;
    throw new InstagramApiError(
      res.status,
      errObj ?? null,
      (errObj?.message as string) || `Instagram API error (${res.status})`
    );
  }
  return data as T;
}

// ── Publishing ─────────────────────────────────────────────────────────────

export async function checkPublishingLimit(userId: string): Promise<IGPublishingLimit> {
  const { accessToken, accountId } = await getValidToken(userId);
  const data = await igFetch<{ data: { quota_usage: number }[] }>(
    `${IG_API_BASE}/${accountId}/content_publishing_limit?fields=quota_usage&access_token=${accessToken}`
  );
  return {
    quota_usage: data.data?.[0]?.quota_usage ?? 0,
    quota_total: 100,
  };
}

export async function createMediaContainer(
  userId: string,
  imageUrl: string,
  caption: string
): Promise<string> {
  const { accessToken, accountId } = await getValidToken(userId);

  // Check rate limit before creating container
  const limit = await checkPublishingLimit(userId);
  if (limit.quota_usage >= limit.quota_total) {
    throw new InstagramApiError(429, null, 'Publishing rate limit reached (100 posts per 24 hours).');
  }

  const params = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });

  const result = await igFetch<{ id: string }>(
    `${IG_API_BASE}/${accountId}/media`,
    { method: 'POST', body: params }
  );
  return result.id;
}

export async function checkContainerStatus(userId: string, containerId: string): Promise<IGContainerStatus> {
  const { accessToken } = await getValidToken(userId);
  return igFetch<IGContainerStatus>(
    `${IG_API_BASE}/${containerId}?fields=status_code,status&access_token=${accessToken}`
  );
}

export async function publishContainer(userId: string, containerId: string): Promise<string> {
  const { accessToken, accountId } = await getValidToken(userId);
  const params = new URLSearchParams({
    creation_id: containerId,
    access_token: accessToken,
  });
  const result = await igFetch<{ id: string }>(
    `${IG_API_BASE}/${accountId}/media_publish`,
    { method: 'POST', body: params }
  );
  return result.id;
}

/**
 * Full publish orchestrator: create container → poll until ready → publish.
 */
export async function publishImagePost(
  userId: string,
  imageUrl: string,
  caption: string
): Promise<{ mediaId: string }> {
  const containerId = await createMediaContainer(userId, imageUrl, caption);

  // Poll for container readiness (max ~30 seconds)
  let attempts = 0;
  while (attempts < 10) {
    const status = await checkContainerStatus(userId, containerId);
    if (status.status_code === 'FINISHED') break;
    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') {
      throw new InstagramApiError(
        400,
        null,
        `Media container ${status.status_code}: ${status.status || 'unknown error'}`
      );
    }
    await new Promise((r) => setTimeout(r, 3000));
    attempts++;
  }

  const mediaId = await publishContainer(userId, containerId);
  return { mediaId };
}

// ── Analytics ──────────────────────────────────────────────────────────────

export async function getMediaInsights(
  userId: string,
  mediaId: string
): Promise<Record<string, number>> {
  const { accessToken } = await getValidToken(userId);
  const metrics = 'impressions,reach,likes,comments,shares,saved';
  const data = await igFetch<{ data: { name: string; values: { value: number }[] }[] }>(
    `${IG_API_BASE}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
  );
  const result: Record<string, number> = {};
  for (const item of data.data || []) {
    result[item.name] = item.values?.[0]?.value ?? 0;
  }
  return result;
}

export async function getAccountInsights(
  userId: string,
  period: 'day' | 'week' | 'days_28' = 'days_28'
): Promise<IGAccountInsights> {
  const { accessToken, accountId } = await getValidToken(userId);
  const metrics = 'impressions,reach,accounts_engaged,likes,comments,shares';
  const data = await igFetch<{
    data: { name: string; values: { value: number; end_time: string }[] }[];
  }>(
    `${IG_API_BASE}/${accountId}/insights?metric=${metrics}&period=${period}&access_token=${accessToken}`
  );
  const result: Record<string, number[]> = {};
  const dates: string[] = [];
  for (const item of data.data || []) {
    result[item.name] = item.values.map((v) => v.value);
    if (dates.length === 0) {
      dates.push(...item.values.map((v) => v.end_time));
    }
  }
  return { metrics: result, dates };
}
