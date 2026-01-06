import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getCollaboratorById } from '../store/collaborators/actions';
import { MainLayout } from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { API_BASE_URL } from '../config/api.config';
import { 
  FaArrowLeft, 
  FaUniversity, 
  FaEnvelope, 
  FaGlobe,
  FaMapMarkerAlt,
  FaGraduationCap
} from 'react-icons/fa';
import { SiGooglescholar, SiOrcid } from 'react-icons/si';

export const CollaboratorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCollaborator, loading } = useSelector((state: RootState) => state.collaborators);

  useEffect(() => {
    if (id) {
      dispatch(getCollaboratorById(id));
    }
  }, [dispatch, id]);

  if (loading || !currentCollaborator) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Button
          variant="secondary"
          onClick={() => navigate('/collaborators')}
          className="mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Retour aux collaborateurs
        </Button>

        {/* En-tête avec photo */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo */}
            {currentCollaborator.photoUrl ? (
              <img
                src={`${API_BASE_URL}${currentCollaborator.photoUrl}`}
                alt={currentCollaborator.name}
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl font-bold">
                  {currentCollaborator.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Informations principales */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCollaborator.name}
              </h1>
              {currentCollaborator.title && (
                <p className="text-xl text-gray-600 mb-4">{currentCollaborator.title}</p>
              )}
              
              {/* Institution */}
              <div className="flex items-start gap-2 text-gray-700 mb-2">
                <FaUniversity className="text-blue-500 mt-1" />
                <div>
                  <span className="font-semibold">{currentCollaborator.institution}</span>
                  {currentCollaborator.department && (
                    <span className="text-gray-600"> • {currentCollaborator.department}</span>
                  )}
                </div>
              </div>

              {/* Pays */}
              {currentCollaborator.country && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{currentCollaborator.country}</span>
                </div>
              )}

              {/* Liens académiques */}
              <div className="flex flex-wrap gap-3 mt-4">
                {currentCollaborator.email && (
                  <a
                    href={`mailto:${currentCollaborator.email}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaEnvelope />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                )}

                {currentCollaborator.website && (
                  <a
                    href={currentCollaborator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaGlobe />
                    <span className="text-sm font-medium">Site web</span>
                  </a>
                )}

                {currentCollaborator.googleScholar && (
                  <a
                    href={currentCollaborator.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <SiGooglescholar />
                    <span className="text-sm font-medium">Google Scholar</span>
                  </a>
                )}

                {currentCollaborator.orcid && (
                  <a
                    href={`https://orcid.org/${currentCollaborator.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <SiOrcid />
                    <span className="text-sm font-medium">ORCID</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Domaine de recherche */}
        {currentCollaborator.researchArea && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaGraduationCap className="text-blue-500 text-xl" />
              <h2 className="text-2xl font-bold text-gray-900">Domaine de recherche</h2>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {currentCollaborator.researchArea}
            </p>
          </div>
        )}

        {/* Statistiques de collaboration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {currentCollaborator._count?.publications || 0}
            </div>
            <div className="text-gray-700 font-medium">Publications</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              0
            </div>
            <div className="text-gray-700 font-medium">Cours</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              0
            </div>
            <div className="text-gray-700 font-medium">Encadrements</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CollaboratorDetailsPage;
