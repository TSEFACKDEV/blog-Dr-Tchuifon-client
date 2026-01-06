import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaHome } from 'react-icons/fa';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">
        {/* Home Link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors group"
          >
            <FaHome className="text-lg group-hover:scale-110 transition-transform" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mb-2 shadow-lg hover:scale-105 transition-transform">
              <FaBook className="text-white text-xl" />
            </div>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Dr. Tchuifon</h1>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
