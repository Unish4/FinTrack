import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-600 mt-4">Page not found</p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg
                   hover:bg-indigo-700 transition-colors text-sm"
      >
        Go home
      </Link>
    </div>
  );
}

export default NotFound;
