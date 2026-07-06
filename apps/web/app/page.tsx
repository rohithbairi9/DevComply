// import Link from 'next/link';
// import { ShieldCheck, GitBranch, BrainCircuit } from 'lucide-react';

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden">
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
//       <div className="z-10 container flex flex-col items-center gap-8 text-center max-w-4xl">
//         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm">
//           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//           <span className="text-xs font-medium text-muted-foreground">Powered by Multi-Agent AI</span>
//         </div>
        
//         <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
//           Ship Secure Code.
//           <br />
//           Automate Compliance.
//         </h1>
        
//         <p className="max-w-2xl text-base md:text-xl text-muted-foreground">
//           DevComply integrates directly into your GitHub workflow to scan PRs for security vulnerabilities and regulatory compliance violations in real-time.
//         </p>
        
//         <div className="flex flex-col sm:flex-row gap-4 mt-4">
//           <Link href="/login" className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]">
//             Get Started Free
//           </Link>
//           <Link href="/login" className="rounded-lg border border-border bg-card/50 backdrop-blur-sm px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-card/80">
//             Live Demo
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
//           <div className="p-6 rounded-xl border border-border bg-card/30 backdrop-blur-sm">
//             <GitBranch className="w-8 h-8 text-primary mb-4" />
//             <h3 className="font-semibold mb-2">Seamless Git Integration</h3>
//             <p className="text-sm text-muted-foreground">Automatically scans every Pull Request without leaving GitHub.</p>
//           </div>
//           <div className="p-6 rounded-xl border border-border bg-card/30 backdrop-blur-sm">
//             <BrainCircuit className="w-8 h-8 text-primary mb-4" />
//             <h3 className="font-semibold mb-2">AI Auto-Remediation</h3>
//             <p className="text-sm text-muted-foreground">Don't just find vulnerabilities. Let AI write the secure fix for you.</p>
//           </div>
//           <div className="p-6 rounded-xl border border-border bg-card/30 backdrop-blur-sm">
//             <ShieldCheck className="w-8 h-8 text-primary mb-4" />
//             <h3 className="font-semibold mb-2">Enterprise Ready</h3>
//             <p className="text-sm text-muted-foreground">Built for scale with Redis queues, RBAC, and SOC2 context.</p>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

import Link from 'next/link';
import { ShieldCheck, GitBranch, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 relative overflow-hidden">
      {/* Light mode grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="z-10 container flex flex-col items-center gap-8 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card backdrop-blur-sm shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-muted-foreground">Powered by Multi-Agent AI</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600">
          Ship Secure Code.
          <br />
          Automate Compliance.
        </h1>
        
        <p className="max-w-2xl text-base md:text-xl text-muted-foreground">
          DevComply integrates directly into your GitHub workflow to scan PRs for security vulnerabilities and regulatory compliance violations in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/login" className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_10px_30px_-10px_rgba(124,58,237,0.5)]">
            Get Started Free
          </Link>
          <Link href="/login" className="rounded-lg border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted/50">
            Live Demo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <GitBranch className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Seamless Git Integration</h3>
            <p className="text-sm text-muted-foreground">Automatically scans every Pull Request without leaving GitHub.</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">AI Auto-Remediation</h3>
            <p className="text-sm text-muted-foreground">Don't just find vulnerabilities. Let AI write the secure fix for you.</p>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Enterprise Ready</h3>
            <p className="text-sm text-muted-foreground">Built for scale with Redis queues, RBAC, and SOC2 context.</p>
          </div>
        </div>
      </div>
    </main>
  );
}