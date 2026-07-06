import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

  try {
    // Forward the code to the NestJS backend
    const backendResponse = await fetch(`${backendUrl}/api/auth/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!backendResponse.ok) {
      console.error('Backend auth failed:', await backendResponse.text());
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Extract the Set-Cookie header from the backend response
    const setCookies = backendResponse.headers.getSetCookie();

    if (!setCookies || setCookies.length === 0) {
      return NextResponse.redirect(`${origin}/login?error=cookie_missing`);
    }

    // Create the redirect response to the dashboard
    const response = NextResponse.redirect(`${origin}/dashboard`);

    // Manually attach the cookie from the backend to the browser response
    setCookies.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('Callback Error:', error);
    return NextResponse.redirect(`${origin}/login?error=server_error`);
  }
}