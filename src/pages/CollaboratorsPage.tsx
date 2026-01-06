import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getAllCollaborators } from '../store/collaborators/actions';
import { MainLayout } from '../layouts/MainLayout';
import { FaUsers, FaSearch, FaGlobe, FaEnvelope, FaUniversity, FaFlag } from 'react-icons/fa';
import Spinner from '../components/ui/Spinner';

export const CollaboratorsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { collaborators, loading } = useSelector((state: RootState) => state.collaborators);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllCollaborators({}));
  }, [dispatch]);

  const filteredCollaborators = collaborators.filter(collab => {
    const matchesSearch = collab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collab.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (collab.country && collab.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (collab.researchArea && collab.researchArea.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const stats = {
    total: collaborators.length,
    countries: new Set(collaborators.map(c => c.country).filter(Boolean)).size,
    publications: collaborators.reduce((sum, c) => sum + (c._count?.publications || 0), 0),
  };

  if (loading && collaborators.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header avec animation */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-full mb-4 animate-bounce-in">
              <FaUsers className="text-4xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              Réseau de Collaborateurs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez mon réseau international de collaborateurs scientifiques et 
              les partenariats académiques qui enrichissent mes travaux de recherche.
            </p>
            <div className="flex justify-center gap-8 mt-8">
              <div className="animate-scale-in animation-delay-100">
                <div className="text-4xl font-bold text-indigo-600">{stats.total}</div>
                <div className="text-gray-600">Collaborateurs</div>
              </div>
              <div className="animate-scale-in animation-delay-200">
                <div className="text-4xl font-bold text-cyan-600">{stats.countries}</div>
                <div className="text-gray-600">Pays</div>
              </div>
              <div className="animate-scale-in animation-delay-300">
                <div className="text-4xl font-bold text-purple-600">{stats.publications}</div>
                <div className="text-gray-600">Publications Communes</div>
              </div>
            </div>
          </div>

          {/* Recherche */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slide-up animation-delay-200">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, institution, pays ou domaine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Info Card - Carte mondiale conceptuelle */}
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl shadow-2xl p-8 mb-8 text-white animate-scale-in animation-delay-300">
            <div className="flex items-center justify-center gap-4 mb-4">
              <FaGlobe className="text-5xl animate-float" />
              <div>
                <h2 className="text-3xl font-bold">Collaboration Internationale</h2>
                <p className="text-indigo-100">Partenariats académiques à travers le monde</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-sm">Europe</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-1">🌏</div>
                <div className="text-sm">Asie</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-1">🌎</div>
                <div className="text-sm">Amériques</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-sm">Afrique</div>
              </div>
            </div>
          </div>

          {/* Grille de collaborateurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollaborators.length === 0 ? (
              <div className="col-span-full text-center py-16 animate-fade-in">
                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Aucun collaborateur trouvé</p>
                <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              filteredCollaborators.map((collab, index) => (
                <div
                  key={collab.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header avec gradient */}
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-1 group-hover:scale-105 transition-transform">
                        {collab.name}
                      </h3>
                      {collab.title && (
                        <p className="text-indigo-100 text-sm mb-2">{collab.title}</p>
                      )}
                      <div className="flex items-center gap-2 text-indigo-100 text-sm">
                        <FaFlag />
                        <span>{collab.country || 'Non spécifié'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Institution */}
                    <div className="flex items-start gap-3 mb-4">
                      <FaUniversity className="text-indigo-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 text-sm font-medium">
                        {collab.institution}
                      </p>
                    </div>

                    {/* Research Area */}
                    {collab.researchArea && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 rounded-full text-sm font-medium">
                          {collab.researchArea}
                        </span>
                      </div>
                    )}

                    {/* Email */}
                    {collab.email && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                        <FaEnvelope className="text-cyan-500" />
                        <a
                          href={`mailto:${collab.email}`}
                          className="hover:text-indigo-600 transition-colors truncate"
                        >
                          {collab.email}
                        </a>
                      </div>
                    )}

                    {/* Publications count */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Publications communes</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {collab._count?.publications || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
