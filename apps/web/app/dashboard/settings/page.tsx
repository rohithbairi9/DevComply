import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GitBranch } from 'lucide-react';

interface Repo {
  id: string;
  name: string;
  fullName: string;
  isActive: boolean;
}

export default async function SettingsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  let repos: Repo[] = [];
  try {
    const res = await fetch('http://localhost:8080/api/repos', {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (res.ok) repos = await res.json();
  } catch (error) {
    console.error('Failed to fetch repos', error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Organization Details</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Personal Workspace</p>
            <p className="text-sm text-muted-foreground">This is your default developer organization.</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Connected Repositories</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage which repositories DevComply is monitoring.</p>
        </div>

        <div className="divide-y divide-border">
          {repos.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No repositories connected yet. Click "Connect Repository" on the dashboard to get started.
            </div>
          ) : (
            repos.map((repo) => (
              <div key={repo.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{repo.fullName}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  repo.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {repo.isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}