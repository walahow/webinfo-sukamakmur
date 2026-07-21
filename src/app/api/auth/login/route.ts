import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Simple hardcoded credentials for admin authentication
    // In production, this should check against a database with hashed passwords
    const ADMIN_EMAIL = 'admin@sukamakmur.desa.id';
    const ADMIN_PASSWORD = 'password123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json(
        { success: true, message: 'Login berhasil' },
        { status: 200 }
      );

      // Set authentication cookie (valid for 24 hours)
      response.cookies.set({
        name: 'adminAuth',
        value: 'true',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Logout action
  const response = NextResponse.json(
    { success: true, message: 'Logout berhasil' },
    { status: 200 }
  );

  response.cookies.set({
    name: 'adminAuth',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Delete the cookie
  });

  return response;
}
