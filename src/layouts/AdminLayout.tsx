import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FaHome,
  FaUser,
  FaBook,
  FaGraduationCap,
  FaUsers,
  FaUserFriends,
  FaEnvelope,
  FaUsersCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import type { AppDispatch } from '../store';
import { logout } from '../store/auth/actions';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: FaHome, exact: true },
  { to: '/admin/profile', label: 'Profil', icon: FaUser },
  { to: '/admin/publications', label: 'Publications', icon: FaBook },
  { to: '/admin/courses', label: 'Cours', icon: FaGraduationCap },
  { to: '/admin/supervisions', label: 'Encadrements', icon: FaUsers },
  { to: '/admin/collaborators', label: 'Collaborateurs', icon: FaUserFriends },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope },
  { to: '/admin/users', label: 'Utilisateurs', icon: FaUsersCog },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <Link to="/" className="flex items-center space-x-2">
              <FaBook className="text-blue-500 text-xl" />
              <span className="text-lg font-bold">Admin Panel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-800"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.to, link.exact)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 mr-4"
          >
            <FaBars size={20} />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-900">
            {sidebarLinks.find((link) => isActive(link.to, link.exact))?.label || 'Administration'}
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}
    </div>
  );
};
