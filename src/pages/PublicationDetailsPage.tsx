import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getPublicationBySlug } from '../store/publications/actions';
import { MainLayout } from '../layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import { API_BASE_URL } from '../config/api.config';
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaBook, 
  FaExternalLinkAlt,
  FaFilePdf,
  FaTags,
  FaUsers,
  FaAward
} from 'react-icons/fa';

export const PublicationDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentPublication, loading } = useSelector((state: RootState) => state.publications);

  useEffect(() => {
    if (slug) {
      dispatch(getPublicationBySlug(slug));
    }
  }, [dispatch, slug]);

  if (loading || !currentPublication) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ARTICLE: 'Article de journal',
      CONFERENCE: 'Communication de conférence',
      BOOK: 'Livre',
      CHAPTER: 'Chapitre de livre',
      THESIS: 'Thèse',
      PATENT: 'Brevet',
      REPORT: 'Rapport technique',
      OTHER: 'Autre',
    };
    return labels[type] || 'Publication';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <button
            onClick={() => navigate('/publications')}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Retour aux publications</span>
          </button>

          <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            {/* Header */}
            <header className="p-8 sm:p-10 pb-8 border-b border-gray-200/60">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full shadow-sm border border-blue-100">
                  {getTypeLabel(currentPublication.type)}
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <FaCalendar className="w-4 h-4" />
                  <span className="font-medium">{currentPublication.year}</span>
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight break-words">
                {currentPublication.title}
              </h1>

              <div className="flex items-start gap-3 text-gray-600">
                <FaUsers className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-base leading-relaxed break-words">{currentPublication.authors.join(', ')}</span>
              </div>
            </header>

            {/* Résumé */}
            {currentPublication.abstract && (
              <section className="p-8 sm:p-10 border-b border-gray-200/60">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Résumé</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words text-base sm:text-lg">
                  {currentPublication.abstract}
                </p>
              </section>
            )}

            {/* Détails de publication */}
            <section className="p-8 sm:p-10 border-b border-gray-200/60">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de publication</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {currentPublication.journal && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Journal</dt>
                  <dd className="text-gray-900 font-medium break-words">{currentPublication.journal}</dd>
                </div>
              )}

              {currentPublication.conference && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Conférence</dt>
                  <dd className="text-gray-900 font-medium break-words">{currentPublication.conference}</dd>
                </div>
              )}

              {currentPublication.publisher && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Éditeur</dt>
                  <dd className="text-gray-900 font-medium break-words">{currentPublication.publisher}</dd>
                </div>
              )}

              {(currentPublication.volume || currentPublication.issue || currentPublication.pages) && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Publication</dt>
                  <dd className="text-gray-900 font-medium">
                    {currentPublication.volume && `Vol. ${currentPublication.volume}`}
                    {currentPublication.issue && `, No. ${currentPublication.issue}`}
                    {currentPublication.pages && `, pp. ${currentPublication.pages}`}
                  </dd>
                </div>
              )}

              {currentPublication.doi && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">DOI</dt>
                  <dd>
                    <a 
                      href={`https://doi.org/${currentPublication.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 break-all group"
                    >
                      <span>{currentPublication.doi}</span>
                      <FaExternalLinkAlt className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </dd>
                </div>
              )}

              {currentPublication.isbn && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">ISBN</dt>
                  <dd className="text-gray-900 font-medium font-mono text-sm">{currentPublication.isbn}</dd>
                </div>
              )}

              {currentPublication.issn && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">ISSN</dt>
                  <dd className="text-gray-900 font-medium font-mono text-sm">{currentPublication.issn}</dd>
                </div>
              )}

              {currentPublication.citations > 0 && (
                <div className="flex flex-col">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Citations</dt>
                  <dd className="flex items-center gap-2">
                    <FaAward className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-900 font-bold text-lg">{currentPublication.citations}</span>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Mots-clés */}
          {currentPublication.keywords && currentPublication.keywords.length > 0 && (
            <section className="p-8 sm:p-10 border-b border-gray-200/60">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mots-clés</h2>
              <div className="flex flex-wrap gap-2">
                {currentPublication.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gray-50/80 text-gray-700 rounded-xl text-sm font-medium border border-gray-200/60 hover:border-gray-300 hover:bg-gray-100/80 transition-all duration-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* PDF */}
          {currentPublication.pdfUrl && (
            <section className="p-8 sm:p-10">
              <a
                href={`${API_BASE_URL}${currentPublication.pdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                <FaFilePdf className="w-6 h-6" />
                <span className="font-semibold text-lg">Télécharger le PDF</span>
                <FaExternalLinkAlt className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </section>
          )}
        </article>
      </div>
      </div>
    </MainLayout>
  );
};

export default PublicationDetailsPage;
