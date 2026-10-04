import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/serverStorage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/jpeg';
    const originalName = file.name || 'clipping.jpg';

    const { fileName, size } = saveUploadedFile(originalName, buffer, mimeType);

    // Resolve base host URL
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : `${proto}://${host}`;

    const publicUrl = `${baseUrl}/api/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      fileName,
      originalName,
      url: publicUrl,
      size,
      mimeType,
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
