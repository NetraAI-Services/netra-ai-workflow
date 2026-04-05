import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'public', 'generated');

async function ensureDir() {
  await mkdir(GENERATED_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, provider, apiKey } = await req.json();

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    // ── DALL-E provider ──
    if (provider === 'dalle') {
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (!key) return NextResponse.json({ error: 'OpenAI API key not configured. Add it in Settings → API Keys.' }, { status: 400 });

      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: key });

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `${prompt}. High quality, professional social media image.`,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      });

      const images = (response.data || []).map((img) => ({
        id: generateId(),
        url: img.url!,
        provider: 'dalle',
        prompt,
        selected: false,
      }));

      while (images.length < 4) {
        images.push({ ...images[0], id: generateId(), selected: false });
      }

      return NextResponse.json({ images: images.slice(0, 4) });
    }

    // ── Gemini provider ──
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) return NextResponse.json({ error: 'Gemini API key not configured. Add it in Settings → API Keys.' }, { status: 400 });

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Create a professional social media image: ${prompt}` }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] } as Parameters<typeof model.generateContent>[0] extends { generationConfig?: infer G } ? G : never,
    });

    await ensureDir();

    const images = [];
    for (const part of result.response.candidates?.[0]?.content?.parts || []) {
      const inline = (part as { inlineData?: { mimeType: string; data: string } }).inlineData;
      if (inline) {
        const { data } = inline;
        const imageId = generateId();
        const filename = `${imageId}.png`;
        const filepath = path.join(GENERATED_DIR, filename);

        await writeFile(filepath, Buffer.from(data, 'base64'));

        images.push({
          id: imageId,
          url: `/generated/${filename}`,
          provider: 'gemini',
          prompt,
          selected: false,
        });
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'No images returned. Ensure your Gemini API key has image generation access.' }, { status: 500 });
    }

    while (images.length < 4) images.push({ ...images[0], id: generateId(), selected: false });

    return NextResponse.json({ images: images.slice(0, 4) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Image generation failed';

    // Free Tier daily limit (429 / 500 requests per day)
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json(
        { error: 'Daily Nano Banana limit reached! Try again tomorrow.' },
        { status: 429 },
      );
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
