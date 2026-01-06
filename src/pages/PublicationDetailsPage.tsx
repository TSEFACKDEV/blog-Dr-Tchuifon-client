import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppDispatch, RootState } from '../store';
import { getPublicationBySlug } from '../store/publications/actions';
import { MainLayout } from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { API_BASE_URL } from '../config/api.config';
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaBook, 
  FaFileAlt, 
  FaQuoteLeft,
  FaExternalLinkAlt,
  FaFilePdf,
  FaTags,
  FaUsers,
  FaUniversity,
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

  const getTypeInfo = (type: string) => {
    const info: Record<string, { label: string; gradient: string }> = {
      ARTICLE: { 
        label: 'Article de journal', 
        gradient: 'from-blue-500 via-blue-600 to-indigo-600'
      },
      CONFERENCE: { 
        label: 'Communication de conférence', 
        gradient: 'from-purple-500 via-purple-600 to-pink-600'
      },
      BOOK: { 
        label: 'Livre', 
        gradient: 'from-green-500 via-emerald-600 to-teal-600'
      },
      CHAPTER: { 
        label: 'Chapitre de livre', 
        gradient: 'from-teal-500 via-cyan-600 to-blue-600'
      },
      THESIS: { 
        label: 'Thèse', 
        gradient: 'from-red-500 via-rose-600 to-pink-600'
      },
      PATENT: { 
        label: 'Brevet', 
        gradient: 'from-orange-500 via-amber-600 to-yellow-600'
      },
      REPORT: { 
        label: 'Rapport technique', 
        gradient: 'from-yellow-500 via-orange-600 to-red-600'
      },
      OTHER: { 
        label: 'Autre', 
        gradient: 'from-gray-500 via-gray-600 to-slate-600'
      },
    };
    return info[type] || info.OTHER;
  };

  const typeInfo = getTypeInfo(currentPublication.type);

  return (
    <MainLayout>
      <AnimatePresence>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Bouton retour */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="secondary"
              onClick={() => navigate('/publications')}
              className="mb-6"
            >
              <FaArrowLeft className="mr-2" />
              Retour aux publications
            </Button>
          </motion.div>

          {/* En-tête avec gradient */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`relative bg-gradient-to-br ${typeInfo.gradient} rounded-3xl p-[2px] shadow-2xl mb-8`}
          >
            <div className="bg-white rounded-3xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Badge type animé */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${typeInfo.gradient} text-white text-sm font-semibold shadow-lg mb-4`}
                  >
                    <FaFileAlt />
                    <span>{typeInfo.label}</span>
                  </motion.div>
                  
                  {/* Titre avec gradient */}
                  <h1 className={`text-4xl font-bold mb-6 bg-gradient-to-r ${typeInfo.gradient} bg-clip-text text-transparent`}>
                    {currentPublication.title}
                  </h1>
                  
                  {/* Auteurs */}
                  <motion.div 
                    className="flex items-start gap-3 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaUsers className="mt-1 text-blue-500 text-xl flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-700 text-lg">Auteurs: </span>
                      <span className="text-gray-600">{currentPublication.authors.join(', ')}</span>
                    </div>
                  </motion.div>

                  {/* Année avec badge circulaire */}
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaCalendar className="text-orange-500 text-xl" />
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${typeInfo.gradient} text-white font-bold shadow-md`}>
                      {currentPublication.year}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Élément décoratif */}
            <motion.div
              className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${typeInfo.gradient} rounded-full opacity-20 blur-2xl`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Résumé */}
          {currentPublication.abstract && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-[2px] shadow-xl mb-8"
            >
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg"
                  >
                    <FaQuoteLeft className="text-xl" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    Résumé
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {currentPublication.abstract}
                </p>
              </div>
            </motion.div>
          )}

          {/* Détails de publication */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl p-[2px] shadow-xl mb-8"
          >
            <div className="bg-white rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg"
                >
                  <FaBook className="text-xl" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Détails de publication
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPublication.journal && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaUniversity className="text-blue-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Journal</span>
                      <span className="text-gray-600">{currentPublication.journal}</span>
                    </div>
                  </motion.div>
                )}

                {currentPublication.conference && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaUniversity className="text-purple-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Conférence</span>
                      <span className="text-gray-600">{currentPublication.conference}</span>
                    </div>
                  </motion.div>
                )}

                {currentPublication.publisher && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaBook className="text-green-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Éditeur</span>
                      <span className="text-gray-600">{currentPublication.publisher}</span>
                    </div>
                  </motion.div>
                )}

                {(currentPublication.volume || currentPublication.issue || currentPublication.pages) && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaFileAlt className="text-gray-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Publication</span>
                      <div className="text-gray-600">
                        {currentPublication.volume && <span>Vol. {currentPublication.volume}</span>}
                        {currentPublication.issue && <span>, No. {currentPublication.issue}</span>}
                        {currentPublication.pages && <span>, pp. {currentPublication.pages}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentPublication.doi && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaExternalLinkAlt className="text-blue-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">DOI</span>
                      <a 
                        href={`https://doi.org/${currentPublication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        {currentPublication.doi}
                      </a>
                    </div>
                  </motion.div>
                )}

                {currentPublication.isbn && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 hover:bg-teal-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaBook className="text-teal-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">ISBN</span>
                      <span className="text-gray-600">{currentPublication.isbn}</span>
                    </div>
                  </motion.div>
                )}

                {currentPublication.issn && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaBook className="text-cyan-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">ISSN</span>
                      <span className="text-gray-600">{currentPublication.issn}</span>
                    </div>
                  </motion.div>
                )}

                {currentPublication.citations > 0 && (
                  <motion.div 
                    className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaAward className="text-orange-500 text-2xl mt-1" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-1">Citations</span>
                      <span className="text-gray-600 font-bold text-xl">{currentPublication.citations}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Mots-clés */}
          {currentPublication.keywords && currentPublication.keywords.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-[2px] shadow-xl mb-8"
            >
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white shadow-lg"
                  >
                    <FaTags className="text-xl" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
                    Mots-clés
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentPublication.keywords.map((keyword, index) => (
                    <motion.span 
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full text-sm font-semibold shadow-md"
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PDF */}
          {currentPublication.pdfUrl && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 rounded-3xl p-[2px] shadow-xl"
            >
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-lg"
                    >
                      <FaFilePdf className="text-3xl" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Document PDF disponible</h3>
                      <p className="text-gray-600">Téléchargez la version complète</p>
                    </div>
                  </div>
                  <a
                    href={`${API_BASE_URL}${currentPublication.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="primary" className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg">
                        <FaFilePdf className="mr-2" />
                        Télécharger le PDF
                      </Button>
                    </motion.div>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </MainLayout>
  );
};

export default PublicationDetailsPage;
