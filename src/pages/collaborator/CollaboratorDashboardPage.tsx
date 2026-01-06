import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { getAllPublications } from '../../store/publications/actions';
import { MainLayout } from '../../layouts/MainLayout';
import StatsCard from '../../components/StatsCard';
import Spinner from '../../components/ui/Spinner';
import PublicationCard from '../../components/PublicationCard';
import { FaBook, FaEye, FaEdit } from 'react-icons/fa';

/**
 * Dashboard pour les COLLABORATEURS
 * - Vue de leurs propres publications
 * - Modification de leur profil
 * - Statistiques personnelles
 */
export const CollaboratorDashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { publications, loading } = useSelector((state: RootState) => state.publications);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Récupérer les publications du collaborateur
    dispatch(getAllPublications({}));
  }, [dispatch]);

  // Filtrer les publications du collaborateur connecté
  const myPublications = publications.filter(pub => pub.userId === user?.id);
  const totalCitations = myPublications.reduce((sum, pub) => sum + (pub.citations || 0), 0);

  if (loading && publications.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Mon Espace Collaborateur
          </h1>
          <p className="text-gray-600 text-lg">
            Bienvenue {user?.profile?.fullName || user?.email}! Gérez vos publications et votre profil.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="animate-scale-in">
            <StatsCard
              title="Mes Publications"
              value={myPublications.length}
              icon={FaBook}
              color="blue"
              subtitle="Publications totales"
            />
          </div>
          <div className="animate-scale-in animation-delay-100">
            <StatsCard
              title="Citations"
              value={totalCitations}
              icon={FaEye}
              color="green"
              subtitle="Citations totales"
            />
          </div>
          <div className="animate-scale-in animation-delay-200">
            <Link to="/profile">
              <StatsCard
                title="Mon Profil"
                value="Éditer"
                icon={FaEdit}
                color="purple"
                subtitle="Modifier mes informations"
              />
            </Link>
          </div>
        </div>

        {/* Publications List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Publications</h2>
            <span className="text-sm text-gray-500">
              {myPublications.length} publication{myPublications.length > 1 ? 's' : ''}
            </span>
          </div>

          {myPublications.length === 0 ? (
            <div className="text-center py-12">
              <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucune publication pour le moment</p>
              <p className="text-sm text-gray-400">
                Vos publications apparaîtront ici une fois que l'administrateur vous aura ajouté comme co-auteur.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myPublications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} />
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 animate-slide-up animation-delay-300">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <FaBook className="mr-2" />
            À propos de votre espace collaborateur
          </h3>
          <p className="text-blue-800 text-sm mb-2">
            En tant que <strong>collaborateur</strong>, vous pouvez :
          </p>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
            <li>Consulter toutes vos publications co-écrites</li>
            <li>Modifier votre profil personnel (photo, bio, liens académiques)</li>
            <li>Voir vos statistiques de citations</li>
          </ul>
          <p className="text-blue-600 text-xs mt-3">
            💡 Pour ajouter de nouvelles publications, contactez l'administrateur du site.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
