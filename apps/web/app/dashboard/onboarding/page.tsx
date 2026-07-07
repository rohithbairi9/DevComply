'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Repo {
  id: number;
  name: string;
  fullName: string;
  owner: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRepos() {
      try {
        // NOTE: In a production app, you would not prompt for a token here.
        // We would have stored it during OAuth. For this prototype, we'll grab it from local storage 
        // or you can hardcode a Personal Access Token here for testing purposes.
        // Let's prompt the user to enter a GitHub PAT in the UI for simplicity.
      } catch (err) {
        setError('Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, [router]);

  const handleConnect = async (repo: Repo) => {
    // Call backend to save repo
    const res = await fetch(`${process.env.BACKEND_URL}/api/repos/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ githubRepoId: repo.id, name: repo.name, fullName: repo.fullName }),
    });

    if (res.ok) {
      alert(`Connected ${repo.name}!`);
      router.push('/dashboard');
    }
  };

  if (loading) return <div className="p-24">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl bg-card p-8 rounded-xl shadow-lg border border-border">
        <h1 className="text-2xl font-bold mb-6">Connect a Repository</h1>
        
        <div className="mb-6 p-4 border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground mb-2">Enter a GitHub Personal Access Token to list your repositories:</p>
          <input 
            type="password" 
            id="github-token-input"
            placeholder="ghp_..."
            className="w-full p-2 rounded bg-background border border-border"
          />
          <button 
                        onClick={async () => {
              const input = document.getElementById('github-token-input') as HTMLInputElement;
              const token = input.value;
              if (!token) return alert('Please enter a token');
              try {
                const res = await fetch(`${process.env.BACKEND_URL}/api/github/repos`, {
                  headers: { 'x-github-token': token },
                  credentials: 'include' // <-- ADDED THIS LINE
                });
                if (res.ok) {
                  setRepos(await res.json());
                  setError('');
                } else {
                  setError('Invalid token or failed to fetch');
                }
              } catch (err) {
                setError('Network error: Failed to connect to backend');
              }
            }}
            className="mt-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium"
          >
            Fetch Repositories
          </button>
        </div>

        {error && <p className="text-destructive mb-4">{error}</p>}

        <div className="space-y-2">
          {repos.map((repo) => (
            <div key={repo.id} className="flex justify-between items-center p-4 border rounded-md hover:bg-muted/20">
              <span className="font-medium">{repo.fullName}</span>
              <button 
                onClick={() => handleConnect(repo)}
                className="rounded-md bg-primary px-4 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}