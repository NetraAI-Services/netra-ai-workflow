import { NextRequest, NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { prompt, provider, apiKey } = await req.json();

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

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

      // DALL-E 3 only returns 1 image; pad with placeholders for UI consistency
      while (images.length < 4) {
        images.push({ ...images[0], id: generateId(), selected: false });
      }

      return NextResponse.json({ images: images.slice(0, 4) });
    }

    // Gemini 2.0 Flash image generation
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) return NextResponse.json({ error: 'Gemini API key not configured. Add it in Settings → API Keys.' }, { status: 400 });

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Create a professional social media image: ${prompt}` }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] } as Parameters<typeof model.generateContent>[0] extends { generationConfig?: infer G } ? G : never,
    });

    const images = [];
    for (const part of result.response.candidates?.[0]?.content?.parts || []) {
      if ((part as { inlineData?: { mimeType: string; data: string } }).inlineData) {
        const { mimeType, data } = (part as { inlineData: { mimeType: string; data: string } }).inlineData;
        images.push({
          id: generateId(),
          url: `data:${mimeType};base64,${data}`,
          provider: 'gemini',
          prompt,
          selected: false,
        });
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'No images returned. Ensure your Gemini API key has image generation access.' }, { status: 500 });
    }

    // Pad to 4 for UI
    while (images.length < 4) images.push({ ...images[0], id: generateId(), selected: false });

    return NextResponse.json({ images: images.slice(0, 4) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Image generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
