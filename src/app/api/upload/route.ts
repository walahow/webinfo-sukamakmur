import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import crypto from 'crypto';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/avif',
  'image/heic',
  'image/heif',
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

    const allowedExtensions = new Set([
      'jpg',
      'jpeg',
      'png',
      'gif',
      'webp',
      'svg',
      'avif',
      'heic',
      'heif',
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
    ]);

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

    // Ensure environment contains blob token and optional store ID
    const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN;
    const BLOB_STORE_ID = process.env.BLOB_STORE_ID || process.env.VERCEL_BLOB_STORE_ID;

    if (!BLOB_READ_WRITE_TOKEN) {
      console.error('Missing Vercel Blob credentials: BLOB_READ_WRITE_TOKEN');
      return NextResponse.json(
        { error: 'Server configuration error: missing blob credentials' },
        { status: 500 }
      );
    }

    const uploadOptions: {
      access: 'public';
      token: string;
      storeId?: string;
    } = {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    };

    if (BLOB_STORE_ID) {
      uploadOptions.storeId = BLOB_STORE_ID;
    }

    // Upload to Vercel Blob
    const blob = await put(pathname, file, uploadOptions);

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
