import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <h1 className="text-6xl font-bold text-teal-400">404</h1>
      <p className="text-slate-400 mt-4">Page not found</p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-teal-500 text-slate-950 font-bold rounded-xl
                   hover:bg-teal-400 transition-all duration-200 shadow-[0_0_30px_-6px_rgba(20,184,166,0.6)] text-sm"
      >
        Go home
      </Link>
    </div>
  );
}

export default NotFound;
