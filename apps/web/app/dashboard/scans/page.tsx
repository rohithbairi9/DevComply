import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Scan {
  id: string;
  prNumber: number;
  status: string;
  createdAt: string;
  repository: { name: string };
  _count: { findings: number };
}

export default async function ScansPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  let scans: Scan[] = [];
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/scans`, {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (res.ok) scans = await res.json();
  } catch (error) {
    console.error('Failed to fetch scans', error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">All Scans</h1>
      
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Repository</th>
              <th className="text-left p-4 font-medium text-muted-foreground">PR #</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Findings</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Scanned</th>
            </tr>
          </thead>
          <tbody>
            {scans.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-muted-foreground">
                  No scans yet.
                </td>
              </tr>
            ) : (
              scans.map((scan) => (
                <tr key={scan.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium text-foreground">
                    <Link href={`/dashboard/scans/${scan.id}`} className="hover:underline">
                      {scan.repository.name}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <Link href={`/dashboard/scans/${scan.id}`}>#{scan.prNumber}</Link>
                  </td>
                  <td className="p-4">
                    <Link href={`/dashboard/scans/${scan.id}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scan.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 
                        scan.status === 'ANALYZING' ? 'bg-blue-500/10 text-blue-500' : 
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {scan.status}
                      </span>
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <Link href={`/dashboard/scans/${scan.id}`}>
                      {scan._count.findings}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}