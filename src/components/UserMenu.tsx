import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaUser, FaChartLine, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import type { AppDispatch } from '../store';
import { logout } from '../store/auth/actions';
import { getImageUrl, getInitials } from '../utils/helpers';

interface UserMenuProps {
  user: {
    email: string;
    role: 'ADMIN' | 'COLLABORATOR' | 'VISITOR';
    profile?: {
      fullName?: string;
      photoUrl?: string;
    };
  };
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/auth/login');
  };

  const photoUrl = getImageUrl(user.profile?.photoUrl);
  const initials = getInitials(user.profile?.fullName || user.email);
  const displayName = user.profile?.fullName || user.email.split('@')[0];

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Photo or Initials */}
        <div className="relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const initialsDiv = e.currentTarget.nextElementSibling as HTMLElement;
                if (initialsDiv) initialsDiv.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ${
              photoUrl ? 'hidden' : 'flex'
            }`}
          >
            {initials}
          </div>
          {/* Role Badge */}
          {user.role === 'ADMIN' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          )}
          {user.role === 'COLLABORATOR' && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
          )}
        </div>

        {/* Name and Icon */}
        <div className="hidden md:flex items-center space-x-1">
          <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
            {displayName}
          </span>
          <FaChevronDown
            className={`text-gray-500 text-xs transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <div className="mt-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  user.role === 'ADMIN'
                    ? 'bg-yellow-100 text-yellow-800'
                    : user.role === 'COLLABORATOR'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {user.role === 'ADMIN'
                  ? '👨‍🏫 Administrateur'
                  : user.role === 'COLLABORATOR'
                  ? '🤝 Collaborateur'
                  : '👤 Visiteur'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile */}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <FaUser className="text-lg" />
              <span>Mon Profil</span>
            </Link>

            {/* Dashboard (Admin only) */}
            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <FaChartLine className="text-lg" />
                <span>Dashboard Admin</span>
              </Link>
            )}

            {/* Collaborator Dashboard */}
            {user.role === 'COLLABORATOR' && (
              <Link
                to="/collaborator/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <FaChartLine className="text-lg" />
                <span>Mon Espace</span>
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
