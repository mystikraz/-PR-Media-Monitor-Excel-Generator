import { NextRequest, NextResponse } from 'next/server';
import { getUploadedFile } from '@/lib/serverStorage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new NextResponse('Filename missing', { status: 400 });
    }

    const file = getUploadedFile(decodeURIComponent(filename));

    if (!file) {
      // Fallback: return an SVG informing that the file is unavailable
      const notFoundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
        <rect width="600" height="300" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="300" y="130" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#dc2626" text-anchor="middle">Image Not Found on Server</text>
        <text x="300" y="165" font-family="Arial, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">The requested press clipping (${filename}) is no longer in temporary storage.</text>
        <text x="300" y="200" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Red Apple PR Media Monitor</text>
      </svg>`;
      return new Response(notFoundSvg, {
        status: 404,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache',
        },
      });
    }

    return new NextResponse(new Uint8Array(file.buffer), {
      status: 200,
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error: any) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
