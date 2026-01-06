import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 animate-bounce-in">
          <div className="relative inline-block">
            <h1 className="text-9xl font-black gradient-text animate-pulse">
              404
            </h1>
            <div className="absolute -top-4 -right-4 text-6xl text-yellow-500 animate-float">
              <FaExclamationTriangle />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-8 animate-slide-up animation-delay-200">
          <h2 className="text-4xl font-bold text-gray-900">
            Oups! Page introuvable
          </h2>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            La page que vous recherchez semble avoir pris des vacances. 
            Elle n'existe peut-être plus ou l'URL est incorrecte.
          </p>
        </div>

        {/* Illustration/Animation */}
        <div className="mb-8 animate-scale-in animation-delay-300">
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-8 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-30 animate-pulse animation-delay-200"></div>
            <div className="absolute inset-16 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full opacity-40 animate-pulse animation-delay-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSearch className="text-8xl text-gray-400 animate-float" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
          <Link to="/">
            <Button
              icon={<FaHome />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3"
            >
              Retour à l'accueil
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:scale-105"
          >
            Page précédente
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-xl animate-fade-in animation-delay-500">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Liens utiles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/publications" className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all group">
              <p className="font-semibold text-blue-700 group-hover:scale-105 transition-transform">Publications</p>
            </Link>
            <Link to="/courses" className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all group">
              <p className="font-semibold text-green-700 group-hover:scale-105 transition-transform">Cours</p>
            </Link>
            <Link to="/supervisions" className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all group">
              <p className="font-semibold text-purple-700 group-hover:scale-105 transition-transform">Encadrements</p>
            </Link>
            <Link to="/contact" className="p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all group">
              <p className="font-semibold text-pink-700 group-hover:scale-105 transition-transform">Contact</p>
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-sm text-gray-500 animate-fade-in animation-delay-600">
          <p>💡 Astuce: Vérifiez l'URL ou utilisez la navigation ci-dessus</p>
        </div>
      </div>
    </div>
  );
};
