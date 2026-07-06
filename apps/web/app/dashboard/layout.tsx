// import { Sidebar } from '../../components/dashboard/sidebar';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
//       <main className="md:pl-64 p-6 md:p-10">
//         <div className="max-w-7xl mx-auto">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Sidebar } from '../../components/dashboard/sidebar';
import { PanelLeftOpen } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open on desktop

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
        <main className="p-6 md:p-10">
          {/* Floating button to open the sidebar when it's closed */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="mb-6 p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
              aria-label="Open Sidebar"
            >
              <PanelLeftOpen className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}