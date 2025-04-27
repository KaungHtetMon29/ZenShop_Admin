// This is a test API route to verify JWT authentication is working
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the Authorization header
  const authHeader = request.headers.get('Authorization');

  // Log the header for debugging
  console.log('Auth header received:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'No Bearer token provided', success: false },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  return NextResponse.json({
    message: 'JWT token received successfully',
    success: true,
    tokenInfo: {
      length: token.length,
      firstChars: token.substring(0, 10) + '...'
    }
  });
}
