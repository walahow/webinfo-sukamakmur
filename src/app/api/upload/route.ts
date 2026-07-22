import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import crypto from 'crypto';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const type = file.type || '';
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']);

    if (!allowedMimeTypes.has(type) && !allowedExtensions.has(extension)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Gunakan PDF, DOCX, XLSX, atau gambar.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    const ext = extension || 'bin';
    const filename = `${timestamp}-${random}.${ext}`;
    const pathname = `uploads/${filename}`;

    // Ensure environment contains blob token
    const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN;

    if (!BLOB_READ_WRITE_TOKEN) {
      console.error('Missing Vercel Blob credentials: BLOB_READ_WRITE_TOKEN');
      return NextResponse.json(
        { error: 'Server configuration error: missing blob credentials' },
        { status: 500 }
      );
    }

    // Upload to Vercel Blob using provided token
    const blob = await put(pathname, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename,
      size: file.size,
      type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
