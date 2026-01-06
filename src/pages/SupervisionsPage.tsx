import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getAllSupervisions } from '../store/supervisions/actions';
import { MainLayout } from '../layouts/MainLayout';
import { FaUserGraduate, FaSearch, FaFilter, FaCheck, FaClock, FaTimesCircle } from 'react-icons/fa';
import Spinner from '../components/ui/Spinner';

const supervisionLevels = [
  { value: 'all', label: 'Tous les niveaux' },
  { value: 'INGENIEUR', label: 'Ingénieur' },
  { value: 'MASTER_2', label: 'Master 2' },
  { value: 'DOCTORAT', label: 'Doctorat' },
  { value: 'POST_DOC', label: 'Post-Doctorat' },
];

const supervisionStatuses = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'ABANDONED', label: 'Abandonné' },
];

export const SupervisionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { supervisions, loading } = useSelector((state: RootState) => state.supervisions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    dispatch(getAllSupervisions({}));
  }, [dispatch]);

  const filteredSupervisions = supervisions.filter(sup => {
    const matchesSearch = sup.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sup.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || sup.level === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || sup.status === selectedStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <FaClock className="text-yellow-500" />;
      case 'COMPLETED':
        return <FaCheck className="text-green-500" />;
      case 'ABANDONED':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'ABANDONED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INGENIEUR':
        return 'bg-blue-100 text-blue-700';
      case 'MASTER_2':
        return 'bg-purple-100 text-purple-700';
      case 'DOCTORAT':
        return 'bg-pink-100 text-pink-700';
      case 'POST_DOC':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return supervisionStatuses.find(s => s.value === status)?.label || status;
  };

  const stats = {
    total: supervisions.length,
    inProgress: supervisions.filter(s => s.status === 'IN_PROGRESS').length,
    completed: supervisions.filter(s => s.status === 'COMPLETED').length,
  };

  if (loading && supervisions.length === 0) {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header avec animation */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4 animate-bounce-in">
              <FaUserGraduate className="text-4xl text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              Encadrements & Supervisions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les étudiants et chercheurs que j'encadre dans leurs travaux de 
              recherche et projets académiques, du niveau ingénieur au post-doctorat.
            </p>
            <div className="flex justify-center gap-8 mt-8">
              <div className="animate-scale-in animation-delay-100">
                <div className="text-4xl font-bold text-purple-600">{stats.total}</div>
                <div className="text-gray-600">Total</div>
              </div>
              <div className="animate-scale-in animation-delay-200">
                <div className="text-4xl font-bold text-yellow-600">{stats.inProgress}</div>
                <div className="text-gray-600">En cours</div>
              </div>
              <div className="animate-scale-in animation-delay-300">
                <div className="text-4xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-gray-600">Terminés</div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slide-up animation-delay-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par étudiant ou sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Niveau filter */}
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  {supervisionLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              {/* Statut filter */}
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  {supervisionStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Liste des encadrements avec timeline */}
          <div className="space-y-6">
            {filteredSupervisions.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <FaUserGraduate className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Aucun encadrement trouvé</p>
                <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              filteredSupervisions.map((sup, index) => (
                <div
                  key={sup.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-6">
                    {/* Timeline indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl">
                        {getStatusIcon(sup.status)}
                      </div>
                      {index < filteredSupervisions.length - 1 && (
                        <div className="w-1 h-16 bg-gradient-to-b from-purple-300 to-transparent mx-auto mt-2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {sup.studentName}
                          </h3>
                          <p className="text-gray-600 italic">"{sup.topic}"</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(sup.status)}`}>
                            {getStatusLabel(sup.status)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(sup.level)}`}>
                            {sup.level.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold">Début:</span>
                          {new Date(sup.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                        </span>
                        {sup.endDate && (
                          <span className="flex items-center gap-2">
                            <span className="font-semibold">Fin:</span>
                            {new Date(sup.endDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                          </span>
                        )}
                        {sup.publications && sup.publications.length > 0 && (
                          <span className="flex items-center gap-2">
                            <span className="font-semibold">Publications:</span>
                            {sup.publications.length}
                          </span>
                        )}
                      </div>

                      {/* Description if available */}
                      {sup.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {sup.description}
                        </p>
                      )}
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
