import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ShieldAlert, FileCode } from 'lucide-react';
import { CodeEditor } from '../../../../components/dashboard/code-editor';

interface Finding {
  id: string;
  vulnerabilityType: string;
  severity: string;
  explanation: string;
  suggestedFix: string;
  lineNumber: number;
  status: string;
}

interface ScanDetails {
  id: string;
  prNumber: number;
  status: string;
  repository: { name: string };
  findings: Finding[];
}

export default async function ScanDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  let scan: ScanDetails | null = null;
  try {
    const res = await fetch(`http://localhost:8080/api/scans/${params.id}`, {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (res.ok) scan = await res.json();
  } catch (error) {
    console.error('Failed to fetch scan details', error);
  }

  if (!scan) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">Scan not found.</p>
        <Link href="/dashboard" className="mt-4 text-primary hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Scans
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          {scan.repository.name} - PR #{scan.prNumber}
        </h1>
        <p className="text-muted-foreground mt-1">Status: {scan.status}</p>
      </div>

      {scan.findings.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center">
          <FileCode className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold text-foreground">No Vulnerabilities Found</h2>
          <p className="text-muted-foreground mt-2">The AI analyzer determined this PR is safe.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {scan.findings.map((finding) => (
            <div key={finding.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className={`w-6 h-6 ${
                    finding.severity === 'CRITICAL' || finding.severity === 'HIGH' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <h2 className="text-xl font-semibold text-foreground">{finding.vulnerabilityType.replace(/_/g, ' ')}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    finding.severity === 'CRITICAL' || finding.severity === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {finding.severity}
                  </span>
                </div>
                <p className="text-muted-foreground">{finding.explanation}</p>
              </div>

              <div>
                <div className="p-4 bg-muted/30 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    AI Suggested Fix (Line {finding.lineNumber})
                  </h3>
                </div>
<div className="h-[300px]">
  <CodeEditor 
    value={finding.suggestedFix} 
    language="javascript" 
  />
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}