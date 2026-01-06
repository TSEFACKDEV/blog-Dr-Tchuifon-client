import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppDispatch, RootState } from '../store';
import { getCourseById } from '../store/cours/actions';
import { MainLayout } from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { FaArrowLeft, FaBook, FaClock, FaCalendar, FaGraduationCap, FaListUl, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    if (id) {
      dispatch(getCourseById(id));
    }
  }, [dispatch, id]);

  if (loading || !currentCourse) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const getLevelInfo = (level: string) => {
    const info: Record<string, { label: string; gradient: string }> = {
      LICENCE: { 
        label: 'Licence', 
        gradient: 'from-green-500 via-emerald-600 to-teal-600'
      },
      MASTER: { 
        label: 'Master', 
        gradient: 'from-blue-500 via-blue-600 to-indigo-600'
      },
      INGENIEUR: { 
        label: 'Ingénieur', 
        gradient: 'from-yellow-500 via-orange-600 to-red-600'
      },
      DOCTORAT: { 
        label: 'Doctorat', 
        gradient: 'from-purple-500 via-purple-600 to-pink-600'
      },
    };
    return info[level] || { label: level, gradient: 'from-gray-500 via-gray-600 to-slate-600' };
  };

  const levelInfo = getLevelInfo(currentCourse.level);

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
              onClick={() => navigate('/courses')}
              className="mb-6"
            >
              <FaArrowLeft className="mr-2" />
              Retour aux cours
            </Button>
          </motion.div>

          {/* En-tête avec gradient */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`relative bg-gradient-to-br ${levelInfo.gradient} rounded-3xl p-[2px] shadow-2xl mb-8`}
          >
            <div className="bg-white rounded-3xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Badge niveau et code */}
                  <motion.div 
                    className="flex items-center gap-3 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.gradient} text-white text-sm font-semibold shadow-lg`}
                    >
                      <FaGraduationCap />
                      <span>{levelInfo.label}</span>
                    </motion.div>
                    {currentCourse.code && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 font-mono text-sm rounded-lg">
                        {currentCourse.code}
                      </span>
                    )}
                  </motion.div>
                  
                  {/* Titre avec gradient */}
                  <h1 className={`text-4xl font-bold mb-6 bg-gradient-to-r ${levelInfo.gradient} bg-clip-text text-transparent`}>
                    {currentCourse.title}
                  </h1>

                  {/* Métadonnées en grid */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentCourse.credits && (
                      <motion.div 
                        className="flex items-center gap-3 p-3 rounded-xl bg-blue-50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                          <FaBook />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Crédits</p>
                          <p className="font-bold text-gray-900">{currentCourse.credits}</p>
                        </div>
                      </motion.div>
                    )}
                    {currentCourse.hours && (
                      <motion.div 
                        className="flex items-center gap-3 p-3 rounded-xl bg-green-50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                          <FaClock />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Durée</p>
                          <p className="font-bold text-gray-900">{currentCourse.hours}h</p>
                        </div>
                      </motion.div>
                    )}
                    {currentCourse.semester && (
                      <motion.div 
                        className="flex items-center gap-3 p-3 rounded-xl bg-purple-50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                          <FaCalendar />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Semestre</p>
                          <p className="font-bold text-gray-900">S{currentCourse.semester}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Élément décoratif */}
            <motion.div
              className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${levelInfo.gradient} rounded-full opacity-20 blur-2xl`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Description */}
          {currentCourse.description && (
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
                    <FaBook className="text-xl" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    Description
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {currentCourse.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Objectifs */}
          {currentCourse.objectives && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-[2px] shadow-xl mb-8"
            >
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white shadow-lg"
                  >
                    <FaListUl className="text-xl" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
                    Objectifs du cours
                  </h2>
                </div>
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {currentCourse.objectives}
                </div>
              </div>
            </motion.div>
          )}

          {/* Syllabus */}
          {currentCourse.syllabus && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl p-[2px] shadow-xl mb-8"
            >
              <div className="bg-white rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg"
                  >
                    <FaListUl className="text-xl" />
                  </motion.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    Contenu du cours
                  </h2>
                </div>
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {currentCourse.syllabus}
                </div>
              </div>
            </motion.div>
          )}

          {/* Statut */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`relative ${
              currentCourse.isActive 
                ? 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600' 
                : 'bg-gradient-to-br from-gray-500 via-gray-600 to-slate-600'
            } rounded-3xl p-[2px] shadow-xl`}
          >
            <div className="bg-white rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-full ${
                      currentCourse.isActive
                        ? 'bg-gradient-to-br from-green-500 to-teal-600'
                        : 'bg-gradient-to-br from-gray-500 to-slate-600'
                    } flex items-center justify-center text-white shadow-lg`}
                  >
                    {currentCourse.isActive ? <FaCheckCircle className="text-xl" /> : <FaTimesCircle className="text-xl" />}
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-500">Statut du cours</p>
                    <p className="text-xl font-bold text-gray-900">
                      {currentCourse.isActive ? 'Cours actif' : 'Cours inactif'}
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`px-6 py-3 rounded-full ${
                    currentCourse.isActive
                      ? 'bg-gradient-to-r from-green-500 to-teal-600'
                      : 'bg-gradient-to-r from-gray-500 to-slate-600'
                  } text-white font-semibold shadow-lg`}
                >
                  {currentCourse.isActive ? 'Actif' : 'Inactif'}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </MainLayout>
  );
};

export default CourseDetailsPage;
