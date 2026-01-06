import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getAllPublications } from '../store/publications/actions';
import { MainLayout } from '../layouts/MainLayout';
import { FaBook, FaFileAlt, FaSearch, FaFilter, FaExternalLinkAlt } from 'react-icons/fa';
import Spinner from '../components/ui/Spinner';

const publicationTypes = [
  { value: 'all', label: 'Tous les types' },
  { value: 'ARTICLE', label: 'Articles' },
  { value: 'CONFERENCE', label: 'Conférences' },
  { value: 'BOOK_CHAPTER', label: 'Chapitres de livre' },
  { value: 'THESIS', label: 'Thèses' },
  { value: 'PATENT', label: 'Brevets' },
  { value: 'POSTER', label: 'Posters' },
];

export const PublicationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { publications, loading } = useSelector((state: RootState) => state.publications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    dispatch(getAllPublications({}));
  }, [dispatch]);

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.join(', ').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || pub.type === selectedType;
    return matchesSearch && matchesType && pub.isPublished;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FaFileAlt className="text-blue-500" />;
      case 'CONFERENCE':
        return <FaBook className="text-purple-500" />;
      case 'BOOK_CHAPTER':
        return <FaBook className="text-green-500" />;
      case 'THESIS':
        return <FaFileAlt className="text-orange-500" />;
      case 'PATENT':
        return <FaFileAlt className="text-red-500" />;
      case 'POSTER':
        return <FaFileAlt className="text-pink-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return publicationTypes.find(t => t.value === type)?.label || type;
  };

  if (loading && publications.length === 0) {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header avec animation */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              Publications Scientifiques
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez mes contributions à la recherche scientifique dans les domaines de 
              la Chimie-Physique, du Génie des Procédés et des procédés industriels.
            </p>
            <div className="flex justify-center gap-8 mt-8 text-center">
              <div className="animate-scale-in animation-delay-100">
                <div className="text-4xl font-bold text-blue-600">{publications.length}</div>
                <div className="text-gray-600">Publications</div>
              </div>
              <div className="animate-scale-in animation-delay-200">
                <div className="text-4xl font-bold text-purple-600">
                  {publications.reduce((sum, pub) => sum + (pub.citations || 0), 0)}
                </div>
                <div className="text-gray-600">Citations</div>
              </div>
              <div className="animate-scale-in animation-delay-300">
                <div className="text-4xl font-bold text-green-600">
                  {new Set(publications.map(p => p.year)).size}
                </div>
                <div className="text-gray-600">Années</div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slide-up animation-delay-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recherche */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Type filter */}
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  {publicationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Liste des publications */}
          <div className="space-y-6">
            {filteredPublications.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Aucune publication trouvée</p>
                <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              filteredPublications.map((pub, index) => (
                <div
                  key={pub.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-3xl mt-1">
                      {getTypeIcon(pub.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                            {pub.title}
                          </h3>
                          <p className="text-gray-600 mb-2">{pub.authors}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="font-medium">{pub.year}</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                              {getTypeLabel(pub.type)}
                            </span>
                            <span>{pub.journal}</span>
                          </div>
                        </div>

                        {/* Citations */}
                        <div className="text-center flex-shrink-0">
                          <div className="text-2xl font-bold text-purple-600">{pub.citations}</div>
                          <div className="text-xs text-gray-500">citations</div>
                        </div>
                      </div>

                      {/* DOI Link */}
                      <div className="mt-4 flex items-center gap-2">
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          <span className="text-sm">DOI: {pub.doi}</span>
                          <FaExternalLinkAlt className="text-xs" />
                        </a>
                      </div>
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
