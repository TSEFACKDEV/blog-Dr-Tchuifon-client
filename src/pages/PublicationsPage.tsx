import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getAllPublications } from '../store/publications/actions';
import { MainLayout } from '../layouts/MainLayout';
import { FaFileAlt, FaSearch, FaFilter } from 'react-icons/fa';
import Spinner from '../components/ui/Spinner';
import PublicationCard from '../components/PublicationCard';

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Publications Scientifiques
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Contributions à la recherche scientifique en Chimie-Physique, Génie des Procédés et procédés industriels.
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">{publications.length}</div>
                <div className="text-sm text-gray-600">Publications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {publications.reduce((sum, pub) => sum + (pub.citations || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Citations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(publications.map(p => p.year)).size}
                </div>
                <div className="text-sm text-gray-600">Années</div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Aucune publication trouvée</p>
                <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              filteredPublications.map((pub) => (
                <PublicationCard key={pub.id} publication={pub} />
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
