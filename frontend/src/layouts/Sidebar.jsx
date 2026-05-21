import { NavLink } from "react-router";
import { UserButton, useUser } from "@clerk/react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  Wallet,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
];

function Sidebar({ isOpen, onClose }) {
  const { user } = useUser();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="shrink-0 p-6 flex flex-col justify-center border-b border-gray-50 h-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-sm">
                <Wallet className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                FinTrack
              </span>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>{" "}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 hide-scrollbar">
          <div className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => {
                // Auto close on mobile when clicking a link
                if (window.innerWidth < 1024) onClose();
              }}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
                  )}

                  <div
                    className={`transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="shrink-0 p-4 border-t border-gray-50 bg-gray-50/50 m-4 rounded-2xl border">
          <div className="flex items-center gap-3">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 shadow-sm ring-2 ring-white",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 font-medium truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
