import { getAuthToken } from './auth';

// Custom fetch function that automatically adds the JWT token to headers when available
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get the auth token from the session
  const token = await getAuthToken();

  // Prepare headers, preserving any existing headers
  const headers = new Headers(options.headers || {});

  // Only add Authorization header if we have a token
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log('Including Authorization header with Bearer token');
  } else {
    console.warn('No token available for request to:', url);
  }

  // Return fetch with the updated headers
  return fetch(url, {
    ...options,
    headers
  });
}

// Typed version with JSON parsing
export async function fetchWithAuthJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
    );
  }

  return response.json();
}
