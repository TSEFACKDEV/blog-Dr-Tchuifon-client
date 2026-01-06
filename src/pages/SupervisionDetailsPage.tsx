import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getSupervisionById } from '../store/supervisions/actions';
import { MainLayout } from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { API_BASE_URL } from '../config/api.config';
import { 
  FaArrowLeft, 
  FaUserGraduate, 
  FaCalendar, 
  FaClock,
  FaBook,
  FaFilePdf,
  FaCheckCircle,
  FaCog,
  FaHourglassHalf
} from 'react-icons/fa';

export const SupervisionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentSupervision, loading } = useSelector((state: RootState) => state.supervisions);

  useEffect(() => {
    if (id) {
      dispatch(getSupervisionById(id));
    }
  }, [dispatch, id]);

  if (loading || !currentSupervision) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      LICENCE: 'Licence',
      MASTER: 'Master',
      DOCTORAT: 'Doctorat',
      POSTDOC: 'Post-doctorat',
    };
    return labels[level] || level;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Terminé',
      SUSPENDED: 'Suspendu',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <FaCog className="animate-spin-slow" />;
      case 'COMPLETED':
        return <FaCheckCircle />;
      case 'SUSPENDED':
        return <FaHourglassHalf />;
      default:
        return null;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Button
          variant="secondary"
          onClick={() => navigate('/supervisions')}
          className="mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Retour aux encadrements
        </Button>

        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentSupervision.status)}`}>
                  {getStatusIcon(currentSupervision.status)}
                  {getStatusLabel(currentSupervision.status)}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {getLevelLabel(currentSupervision.level)}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentSupervision.topic}
              </h1>

              {/* Étudiant */}
              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <FaUserGraduate className="text-blue-500 text-xl" />
                <span className="text-xl font-semibold">{currentSupervision.studentName}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-3">
              <FaCalendar className="text-green-500" />
              <div>
                <span className="text-gray-600 text-sm">Début</span>
                <p className="font-semibold text-gray-900">
                  {formatDate(currentSupervision.startDate)}
                </p>
              </div>
            </div>

            {currentSupervision.endDate && (
              <div className="flex items-center gap-3">
                <FaCalendar className="text-red-500" />
                <div>
                  <span className="text-gray-600 text-sm">Fin</span>
                  <p className="font-semibold text-gray-900">
                    {formatDate(currentSupervision.endDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {currentSupervision.description && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description du projet</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {currentSupervision.description}
            </p>
          </div>
        )}

        {/* Publications associées */}
        {currentSupervision.publications && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaBook className="text-blue-500 text-xl" />
              <h2 className="text-2xl font-bold text-gray-900">Publications associées</h2>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {currentSupervision.publications}
            </div>
          </div>
        )}

        {/* Thèse/Mémoire */}
        {currentSupervision.thesisUrl && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaFilePdf className="text-red-500 text-2xl" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {currentSupervision.level === 'DOCTORAT' ? 'Thèse' : 'Mémoire'}
                  </h3>
                  <p className="text-gray-600 text-sm">Document final disponible</p>
                </div>
              </div>
              <a
                href={`${API_BASE_URL}${currentSupervision.thesisUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary">
                  <FaFilePdf className="mr-2" />
                  Télécharger
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* Durée de l'encadrement */}
        {currentSupervision.endDate && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-6 mt-6">
            <div className="flex items-center gap-3 justify-center">
              <FaClock className="text-blue-500 text-2xl" />
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Durée totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.ceil(
                    (new Date(currentSupervision.endDate).getTime() - 
                     new Date(currentSupervision.startDate).getTime()) / 
                    (1000 * 60 * 60 * 24 * 365)
                  )} année(s)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SupervisionDetailsPage;
