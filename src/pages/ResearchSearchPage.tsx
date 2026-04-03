import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { MainLayout } from '../layouts/MainLayout';
import { getAllPublications } from '../store/publications/actions';
import { getAllCourses } from '../store/cours/actions';
import { getAllSupervisions } from '../store/supervisions/actions';
import { getAllCollaborators } from '../store/collaborators/actions';
import PublicationCard from '../components/PublicationCard';
import { CourseCard } from '../components/CourseCard';
import { CollaboratorCard } from '../components/CollaboratorCard';
import Spinner from '../components/ui/Spinner';
import { FaSearch } from 'react-icons/fa';

const tabs = [
  { value: 'supervisions', label: 'Encadrements' },
  { value: 'publications', label: 'Publications' },
  { value: 'collaborators', label: 'Collaborations' },
];

export const ResearchSearchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { supervisions, loading: supervisionsLoading } = useSelector((state: RootState) => state.supervisions);
  const { publications, loading: publicationsLoading } = useSelector((state: RootState) => state.publications);
  const { courses, loading: coursesLoading } = useSelector((state: RootState) => state.courses);
  const { collaborators, loading: collaboratorsLoading } = useSelector((state: RootState) => state.collaborators);

  const [activeTab, setActiveTab] = useState<'supervisions' | 'publications' | 'collaborators'>('supervisions');
  const [query, setQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    dispatch(getAllSupervisions({ limit: 100 }));
    dispatch(getAllPublications({ limit: 100 }));
    dispatch(getAllCourses({ limit: 100 }));
    dispatch(getAllCollaborators({ limit: 100 }));
  }, [dispatch]);

  const isLoading = supervisionsLoading || publicationsLoading || coursesLoading || collaboratorsLoading;

  const filteredSupervisions = useMemo(() => {
    const keyword = query.toLowerCase();
    return supervisions.filter((item) => {
      const matchesQuery =
        item.studentName?.toLowerCase().includes(keyword) ||
        item.topic?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword);
      const matchesLevel = filterLevel === 'all' || item.level === filterLevel;
      return matchesQuery && matchesLevel;
    });
  }, [supervisions, query, filterLevel]);

  const filteredPublications = useMemo(() => {
    const keyword = query.toLowerCase();
    return publications.filter((item) => {
      const matchesQuery =
        item.title?.toLowerCase().includes(keyword) ||
        item.abstract?.toLowerCase().includes(keyword) ||
        item.authors.join(', ').toLowerCase().includes(keyword);
      return matchesQuery;
    });
  }, [publications, query]);

  const filteredCollaborators = useMemo(() => {
    const keyword = query.toLowerCase();
    return collaborators.filter((item) => {
      const matchesQuery =
        item.name?.toLowerCase().includes(keyword) ||
        item.institution?.toLowerCase().includes(keyword) ||
        item.researchArea?.toLowerCase().includes(keyword);
      return matchesQuery;
    });
  }, [collaborators, query]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2">Recherche scientifique</h1>
            <p className="text-gray-600">Recherchez vos encadrements, publications et collaborateurs au même endroit.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par mot-clé..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {activeTab === 'supervisions' && (
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="max-w-xs px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="all">Tous niveaux</option>
                  <option value="INGENIEUR">Ingénieur</option>
                  <option value="MASTER_2">Master 2</option>
                  <option value="DOCTORAT">Doctorat</option>
                  <option value="POST_DOC">Post-doc</option>
                </select>
              )}
            </div>
          </div>

          <div className="mb-6 flex gap-2 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                  activeTab === tab.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeTab === 'supervisions' &&
                (filteredSupervisions.length > 0
                  ? filteredSupervisions.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl shadow p-5">
                        <h3 className="text-xl font-bold mb-2">{item.studentName || 'Étudiant(e)'}</h3>
                        <p className="text-gray-600 italic mb-1">{item.level}</p>
                        <p className="text-gray-700 mb-2">{item.topic}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))
                  : <div className="col-span-full text-center p-12 text-gray-500">Aucun encadrement trouvé</div>)
              }

              {activeTab === 'publications' &&
                (filteredPublications.length > 0
                  ? filteredPublications.map((item) => (
                      <PublicationCard key={item.id} publication={item} />
                    ))
                  : <div className="col-span-full text-center p-12 text-gray-500">Aucune publication trouvée</div>)
              }

              {activeTab === 'collaborators' &&
                (filteredCollaborators.length > 0
                  ? filteredCollaborators.map((item) => (
                      <CollaboratorCard key={item.id} collaborator={item} />
                    ))
                  : <div className="col-span-full text-center p-12 text-gray-500">Aucun collaborateur trouvé</div>)
              }
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
