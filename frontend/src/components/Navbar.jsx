import { Wallet } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="border-b border-gray-100/50 sticky top-0 bg-white/80 backdrop-blur-md z-10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center gap-2 group cursor-pointer text-gray-900 hover:text-indigo-600 transition-colors">
            <div className="bg-indigo-50 p-2 rounded-xl transition-colors">
              <Wallet size={20} className="text-indigo-600" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              FinTrack
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4 border-l border-gray-200 pl-4 ml-2">
          <Link
            to="/sign-in"
            className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 font-semibold"
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className="text-sm bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 font-semibold"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
