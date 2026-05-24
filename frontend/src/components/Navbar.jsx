import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="border-b border-gray-100/50 sticky top-0 bg-slate-900/80 backdrop-blur-md z-10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center gap-2 group cursor-pointer text-gray-900 hover:text-indigo-600 transition-colors">
            <img
              src="/logo.png"
              alt="FinTrack Logo"
              className="w-5 h-5 object-contain"
            />
            <span className="font-serif text-xl tracking-tight text-white">
              FinTrack
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4 border-l border-gray-200 pl-4 ml-2">
          <Link
            to="/sign-in"
            className="border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800/50 hover:text-white font-semibold text-base transition-all duration-200 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg "
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-base transition-all duration-200  hover:-translate-y-0.5 px-5 py-2.5 rounded-xl shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-300"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
