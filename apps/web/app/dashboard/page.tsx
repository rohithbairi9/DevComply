import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, GitBranch, AlertTriangle, FileSearch } from 'lucide-react';

interface Scan {
  id: string;
  status: string;
  _count: { findings: number };
}

interface Repo {
  id: string;
  isActive: boolean;
}

export default async function DashboardOverview() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  let scans: Scan[] = [];
  let repos: Repo[] = [];
  
  try {
    const [scansRes, reposRes] = await Promise.all([
      fetch('http://localhost:8080/api/scans', { headers: { Cookie: `token=${token}` }, cache: 'no-store' }),
      fetch('http://localhost:8080/api/repos', { headers: { Cookie: `token=${token}` }, cache: 'no-store' })
    ]);
    
    if (scansRes.ok) scans = await scansRes.json();
    if (reposRes.ok) repos = await reposRes.json();
  } catch (error) {
    console.error('Failed to fetch dashboard data', error);
  }

  const totalScans = scans.length;
  const activeRepos = repos.filter(r => r.isActive).length;
  const totalFindings = scans.reduce((acc, scan) => acc + scan._count.findings, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Scans</h3>
            <FileSearch className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalScans}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Active Repositories</h3>
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{activeRepos}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Vulnerabilities Found</h3>
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-foreground">{totalFindings}</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Ready to audit code?</h2>
          <p className="text-muted-foreground text-sm">Connect a new repository or view your detailed scan history.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/onboarding" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
            Connect Repo
          </Link>
          <Link href="/dashboard/scans" className="bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-muted/80">
            View All Scans
          </Link>
        </div>
      </div>
    </div>
  );
}