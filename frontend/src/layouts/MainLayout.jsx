import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { UserButton } from "@clerk/react";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200 relative overflow-x-hidden">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300">
        {/* Mobile Nav Top Bar */}
        <div className="lg:hidden shrink-0 flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-teal-400 transition-colors focus:ring-2 focus:ring-teal-500/20"
            >
              <Menu size={24} />
            </button>{" "}
            <span className="font-serif text-slate-100 tracking-tight text-lg">
              FinTrack
            </span>
          </div>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox:
                  "w-8 h-8 rounded-xl shadow-sm border border-slate-800",
              },
            }}
          />
        </div>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
