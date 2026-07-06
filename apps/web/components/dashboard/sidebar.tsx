// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { ShieldCheck, LayoutDashboard, FileSearch, Settings, LogOut } from 'lucide-react';

// const navItems = [
//   { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Scans', href: '/dashboard/scans', icon: FileSearch },
//   { name: 'Settings', href: '/dashboard/settings', icon: Settings },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="w-64 min-h-screen bg-card/40 backdrop-blur-xl border-r border-border flex flex-col fixed inset-y-0 left-0 z-50">
//       <div className="p-6 border-b border-border">
//         <Link href="/dashboard" className="flex items-center gap-2">
//           <ShieldCheck className="w-8 h-8 text-primary" />
//           <span className="text-xl font-bold text-foreground">DevComply</span>
//         </Link>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                 isActive 
//                   ? 'bg-primary/10 text-primary border border-primary/20' 
//                   : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-border">
//         <div className="flex items-center gap-3 px-4 py-2 mb-2">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500" />
//           <div className="flex-1 overflow-hidden">
//             <p className="text-sm font-medium text-foreground truncate">Developer</p>
//             <p className="text-xs text-muted-foreground truncate">Free Plan</p>
//           </div>
//         </div>
//         <form action="/api/auth/logout" method="POST">
//           <button type="submit" className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
//             <LogOut className="w-4 h-4" />
//             Log out
//           </button>
//         </form>
//       </div>
//     </aside>
//   );
// }

// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { ShieldCheck, LayoutDashboard, FileSearch, Settings, LogOut } from 'lucide-react';

// const navItems = [
//   { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Scans', href: '/dashboard/scans', icon: FileSearch },
//   { name: 'Settings', href: '/dashboard/settings', icon: Settings },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col fixed inset-y-0 left-0 z-50">
//       <div className="p-6 border-b border-border">
//         <Link href="/dashboard" className="flex items-center gap-2">
//           <ShieldCheck className="w-8 h-8 text-primary" />
//           <span className="text-xl font-bold text-foreground">DevComply</span>
//         </Link>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                 isActive 
//                   ? 'bg-primary/10 text-primary border border-primary/20' 
//                   : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-border">
//         <div className="flex items-center gap-3 px-4 py-2 mb-2">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500" />
//           <div className="flex-1 overflow-hidden">
//             <p className="text-sm font-medium text-foreground truncate">Developer</p>
//             <p className="text-xs text-muted-foreground truncate">Free Plan</p>
//           </div>
//         </div>
//         <form action="/api/auth/logout" method="POST">
//           <button type="submit" className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors">
//             <LogOut className="w-4 h-4" />
//             Log out
//           </button>
//         </form>
//       </div>
//     </aside>
//   );
// }

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, FileSearch, Settings, LogOut, PanelLeftClose } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Scans', href: '/dashboard/scans', icon: FileSearch },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const pathname = usePathname();

  return (
    <aside 
      className={`w-64 min-h-screen bg-card border-r border-border flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          {isOpen && <span className="text-xl font-bold text-foreground">DevComply</span>}
        </Link>
        
        {/* Toggle Button Inside Sidebar */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close Sidebar"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-foreground truncate">Developer</p>
            <p className="text-xs text-muted-foreground truncate">Free Plan</p>
          </div>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}