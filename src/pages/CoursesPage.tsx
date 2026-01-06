import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { getAllCourses } from '../store/cours/actions';
import { MainLayout } from '../layouts/MainLayout';
import { FaGraduationCap, FaSearch, FaFilter, FaClock, FaBook, FaAward } from 'react-icons/fa';
import Spinner from '../components/ui/Spinner';

const courseLevels = [
  { value: 'all', label: 'Tous les niveaux' },
  { value: 'LICENCE', label: 'Licence' },
  { value: 'MASTER', label: 'Master' },
  { value: 'INGENIEUR', label: 'Ingénieur' },
  { value: 'DOCTORAT', label: 'Doctorat' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const CoursesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    dispatch(getAllCourses({}));
  }, [dispatch]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel && course.isActive;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'LICENCE':
        return 'from-emerald-500 to-teal-600';
      case 'MASTER':
        return 'from-blue-500 to-indigo-600';
      case 'INGENIEUR':
        return 'from-purple-500 to-pink-600';
      case 'DOCTORAT':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'LICENCE':
        return 'bg-emerald-100 text-emerald-700';
      case 'MASTER':
        return 'bg-blue-100 text-blue-700';
      case 'INGENIEUR':
        return 'bg-purple-100 text-purple-700';
      case 'DOCTORAT':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading && courses.length === 0) {
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
      <div className="min-h-screen gradient-bg py-12">
        <div className="container mx-auto px-4">
          {/* Header avec animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-2xl"
            >
              <FaGraduationCap className="text-4xl text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              Cours & Enseignements
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explorez les différents cours que j'enseigne, couvrant divers domaines de 
              la Chimie-Physique et du Génie des Procédés, de la licence au doctorat.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-8 mt-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="text-5xl font-bold gradient-text"
                >
                  {courses.filter(c => c.isActive).length}
                </motion.div>
                <div className="text-gray-600 mt-2">Cours actifs</div>
              </div>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.6 }}
                  className="text-5xl font-bold gradient-text"
                >
                  {courses.reduce((sum, course) => sum + (course.hours || 0), 0)}
                </motion.div>
                <div className="text-gray-600 mt-2">Heures totales</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 mb-12 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recherche */}
              <div className="relative group">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Niveau filter */}
              <div className="relative group">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none bg-white/50 backdrop-blur-sm"
                >
                  {courseLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Grille de cours */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCourses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500 mb-2">Aucun cours trouvé</p>
                <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
              </motion.div>
            ) : (
              filteredCourses.map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <Link to={`/courses/${course.id}`}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="glass rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all h-full group"
                    >
                      {/* Header avec gradient dynamique */}
                      <div className={`bg-gradient-to-br ${getLevelColor(course.level)} p-6 text-white relative overflow-hidden`}>
                        {/* Animated background pattern */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute inset-0 bg-white rounded-full blur-3xl"
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-mono bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                              {course.code}
                            </span>
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getLevelBadgeColor(course.level)} shadow-lg`}
                            >
                              {course.level}
                            </motion.span>
                          </div>
                          <h3 className="text-2xl font-bold mt-4 group-hover:scale-105 transition-transform">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Infos avec icons */}
                        <div className="space-y-3 mb-6">
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 text-gray-700"
                          >
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <FaClock className="text-emerald-600" />
                            </div>
                            <span className="font-medium">{course.hours || 0} heures</span>
                          </motion.div>
                          {course.credits && (
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 text-gray-700"
                            >
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FaAward className="text-blue-600" />
                              </div>
                              <span className="font-medium">{course.credits} crédits</span>
                            </motion.div>
                          )}
                          {course.semester && (
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 text-gray-700"
                            >
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <FaBook className="text-purple-600" />
                              </div>
                              <span className="font-medium">{course.semester}</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Objectives */}
                        {course.objectives && course.objectives.length > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-3 font-medium">Objectifs pédagogiques:</p>
                            <div className="flex flex-wrap gap-2">
                              {course.objectives.slice(0, 3).map((objective: string, i: number) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                  className="px-3 py-1.5 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 rounded-lg text-xs font-medium hover:from-primary-100 hover:to-accent-100 transition-all"
                                >
                                  {objective}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};
