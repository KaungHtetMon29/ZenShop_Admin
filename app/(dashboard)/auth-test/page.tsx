'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchWithAuthJson } from '@/lib/fetchWithAuth';
import { auth } from '@/lib/auth';

export default function AuthTestPage() {
  const [result, setResult] = useState<any>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to test the JWT token
  const testAuthToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuthJson('/api/auth-test');
      setResult(response);
      console.log('Auth test response:', response);
    } catch (err) {
      console.error('Auth test failed:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Get session info on load
  useEffect(() => {
    const getSession = async () => {
      try {
        // @ts-ignore - auth() returns a session object but TypeScript is unsure
        const session = await auth();
        setSessionInfo(session);
        console.log('Session:', session);
      } catch (err) {
        console.error('Failed to get session:', err);
      }
    };

    getSession();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">JWT Authentication Test</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          {sessionInfo ? (
            <div className="bg-slate-100 p-4 rounded overflow-auto max-h-60">
              <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
            </div>
          ) : (
            <p>No session found or loading...</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Test JWT Authentication
          </h2>
          <Button onClick={testAuthToken} disabled={loading} className="mb-4">
            {loading ? 'Testing...' : 'Test JWT Token'}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div>
              <h3 className="font-semibold mb-2">Result:</h3>
              <div className="bg-slate-100 p-4 rounded overflow-auto max-h-60">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
