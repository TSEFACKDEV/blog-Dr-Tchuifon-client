import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaBars, FaTimes, FaSignInAlt } from 'react-icons/fa';
import type { RootState } from '../store';
import { UserMenu } from '../components/UserMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/publications', label: 'Publications' },
  { to: '/courses', label: 'Cours' },
  { to: '/supervisions', label: 'Encadrements' },
  { to: '/collaborators', label: 'Collaborateurs' },
  { to: '/contact', label: 'Contact' },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass shadow-lg' 
            : 'bg-white/90 backdrop-blur-md shadow-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-primary-600 to-accent-600 p-2 rounded-xl"
              >
                <FaBook className="text-white text-xl" />
              </motion.div>
              <span className="text-xl font-bold gradient-text">Dr. Tchuifon</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 text-sm font-medium transition-colors group"
                >
                  <span className={`relative z-10 ${
                    isActive(link.to)
                      ? 'text-primary-600'
                      : 'text-gray-700 group-hover:text-primary-600'
                  }`}>
                    {link.label}
                  </span>
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary-100 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
              
              {/* Auth Section */}
              {isAuthenticated && user ? (
                <UserMenu user={user} />
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/auth/login"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all font-medium shadow-lg hover:shadow-xl ml-4"
                  >
                    <FaSignInAlt />
                    <span>Se connecter</span>
                  </Link>
                </motion.div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden py-4 border-t border-gray-200 overflow-hidden"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors ${
                        isActive(link.to)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Auth Section */}
                {isAuthenticated && user ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="border-t border-gray-200 mt-4 pt-4 px-4"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-semibold">
                        {user.profile?.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.profile?.fullName || user.email}
                        </p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 text-sm text-gray-700 hover:text-primary-600"
                    >
                      Mon Profil
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600"
                      >
                        Dashboard Admin
                      </Link>
                    )}
                    {user.role === 'COLLABORATOR' && (
                      <Link
                        to="/collaborator/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm text-gray-700 hover:text-primary-600"
                      >
                        Mon Espace
                      </Link>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block mx-4 mt-4 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all font-medium shadow-lg"
                    >
                      Se connecter
                    </Link>
                  </motion.div>
                )}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Institution */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 gradient-text">ENSPD - Université de Douala</h3>
              <p className="text-gray-300 text-sm mb-3">
                École Nationale Supérieure Polytechnique de Douala
              </p>
              <p className="text-gray-400 text-sm mb-2">
                <strong>Adresse:</strong> PK 17 Douala, Cameroun - Campus ENSPD
              </p>
              <p className="text-gray-400 text-sm mb-2">
                <strong>Tél:</strong> (+237) 697 642 240
              </p>
              <p className="text-gray-400 text-sm mb-2">
                <strong>BP:</strong> 2701 Douala, Cameroun
              </p>
              <motion.a
                whileHover={{ x: 5 }}
                href="https://www.ensp-udo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 text-sm transition-colors inline-block mt-2"
              >
                www.ensp-udo.com →
              </motion.a>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary-400">Navigation</h3>
              <ul className="space-y-2">
                {navLinks.slice(0, 5).map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-white text-sm transition-colors inline-block hover:translate-x-1 transform"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary-400">Contact</h3>
              <p className="text-gray-400 text-sm mb-3">
                <strong>Dr. TCHUIFON Donald Ricoul</strong>
              </p>
              <p className="text-gray-400 text-sm mb-2">
                Enseignant-Chercheur
              </p>
              <p className="text-gray-400 text-sm mb-2">
                Département de Génie des Procédés
              </p>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/contact"
                  className="text-primary-400 hover:text-primary-300 text-sm transition-colors inline-block mt-3"
                >
                  Formulaire de contact →
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Dr. TCHUIFON TCHUIFON Donald Ricoul. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-xs text-center md:text-right">
                Paix - Travail - Patrie 🇨🇲
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
