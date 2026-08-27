import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`);
  }

  // Set the cookie on the Vercel domain so the frontend middleware can read it
  const response = NextResponse.redirect(`${origin}/dashboard`);
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // 'lax' is perfect for same-domain redirects
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}