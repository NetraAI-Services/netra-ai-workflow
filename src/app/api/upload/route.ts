import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64, mimeType, sourceUrl } = body as {
      base64?: string;
      mimeType?: string;
      sourceUrl?: string;
    };

    if (!base64 && !sourceUrl) {
      return NextResponse.json(
        { error: 'Provide either base64 or sourceUrl' },
        { status: 400 }
      );
    }

    ensureUploadsDir();

    const ext = mimeType?.includes('png') ? 'png' : mimeType?.includes('webp') ? 'webp' : 'jpg';
    const filename = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    if (base64) {
      // Strip data URI prefix if present (e.g. "data:image/png;base64,...")
      const raw = base64.includes(',') ? base64.split(',')[1] : base64;
      const buffer = Buffer.from(raw, 'base64');
      fs.writeFileSync(filePath, buffer);
    } else if (sourceUrl) {
      const res = await fetch(sourceUrl);
      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch source image: ${res.status}` },
          { status: 400 }
        );
      }
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    }

    return NextResponse.json({ url: `/uploads/${filename}`, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
