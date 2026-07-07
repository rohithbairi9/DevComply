// import Link from 'next/link';
// import { ShieldCheck } from 'lucide-react';

// export default function LoginPage() {
//   const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email read:org repo`;

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-6 relative">
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
//       <div className="z-10 w-full max-w-md p-8 md:p-10 rounded-2xl border border-border bg-card/40 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6 text-center">
//         <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
//           <ShieldCheck className="w-8 h-8 text-primary" />
//         </div>
        
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to DevComply</h1>
//           <p className="text-sm text-muted-foreground mt-2">Secure your repositories with AI-driven compliance.</p>
//         </div>
        
//         <a 
//           href={githubAuthUrl}
//           className="w-full flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
//         >
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
//           Continue with GitHub
//         </a>
        
//         <p className="text-xs text-muted-foreground">
//           By continuing, you agree to our Terms of Service and Privacy Policy.
//         </p>
//       </div>
//     </main>
//   );
// }

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  // Link directly to the backend OAuth callback!
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email read:org repo&redirect_uri=https://devcomply.onrender.com/api/auth/github/callback`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="z-10 w-full max-w-md p-8 md:p-10 rounded-2xl border border-border bg-card shadow-2xl flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to DevComply</h1>
          <p className="text-sm text-muted-foreground mt-2">Secure your repositories with AI-driven compliance.</p>
        </div>
        
        <a 
          href={githubAuthUrl}
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_10px_30px_-10px_rgba(124,58,237,0.5)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          Continue with GitHub
        </a>
        
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}