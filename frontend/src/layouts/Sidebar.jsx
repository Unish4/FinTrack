// src/layouts/Sidebar.jsx
import { NavLink, useNavigate } from "react-router";
import { useClerk, useUser } from "@clerk/react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  LogOut,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
];

function Sidebar() {
  const { signOut } = useClerk();
  const { user } = useUser(); // this is the Clerk user (for display)
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Wallet className="text-indigo-600" size={24} />
          <span className="text-lg font-semibold text-gray-900">FinTrack</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"} // 'end' means only match exactly '/' not '/anything'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
               font-medium transition-colors duration-150
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-700"
                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.imageUrl || "/DefaultImage.webp"}
            alt={user?.fullName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm
                     text-gray-600 hover:text-red-600 hover:bg-red-50
                     rounded-lg transition-colors duration-150"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
