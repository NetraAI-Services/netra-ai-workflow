import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { CHAR_LIMITS } from '@/lib/constants';
import type { PlatformId } from '@/types/content';

export async function POST(req: NextRequest) {
  try {
    const { topic, tone, platforms, apiKey } = await req.json();

    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) return NextResponse.json({ error: 'Gemini API key not configured. Add it in Settings → API Keys.' }, { status: 400 });

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const captions = [];

    for (const platform of (platforms as PlatformId[])) {
      const limit = CHAR_LIMITS[platform];
      const prompt = `Write a social media caption for ${platform} about: "${topic}"
Tone: ${tone}
Platform: ${platform} (max ${limit} characters)
Include 3-5 relevant hashtags at the end.
Return ONLY the caption text with hashtags. No extra commentary.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Split hashtags from body
      const hashtagMatch = text.match(/(#\w+\s*)+$/);
      const hashtags = hashtagMatch ? hashtagMatch[0].trim().split(/\s+/) : [];
      const body = hashtagMatch ? text.slice(0, hashtagMatch.index).trim() : text;

      captions.push({
        id: generateId(),
        platform,
        text: body,
        hashtags,
        charCount: text.length,
      });
    }

    return NextResponse.json({ captions });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
