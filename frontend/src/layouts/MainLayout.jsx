import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { UserButton } from "@clerk/react";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300">
        
        {/* Mobile Nav Top Bar */}
        <div className="lg:hidden shrink-0 flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-indigo-500/20"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900 tracking-tight text-lg">FinTrack</span>
          </div>
          
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-xl shadow-sm border border-gray-200",
              },
            }}
          />
        </div>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
        
      </main>
    </div>
  );
};

export default MainLayout;
